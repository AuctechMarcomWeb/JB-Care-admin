/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Modal, Button, Spin } from 'antd'
import toast from 'react-hot-toast'
import { fileUpload, getRequest, postRequest, putRequest } from '../../Helpers'

const SupervisorModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  // 🔹 States
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const [sites, setSites] = useState([])
  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [uploadingIndex, setUploadingIndex] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    siteId: '',
    projectId: '',
    unitId: '',
    isActive: true,
    verificationDocuments: [{ type: '', number: '', fileUrl: '' }],
  })

  // 🔹 Fetch Sites
  useEffect(() => {
    getRequest('sites?isPagination=false')
      .then((res) => setSites(res?.data?.data?.sites || []))
      .catch((err) => console.error('Error fetching sites:', err))
  }, [])

  // 🔹 Fetch Projects when site changes
  useEffect(() => {
    if (formData.siteId) {
      getRequest(`projects?isPagination=false&siteId=${formData.siteId}`)
        .then((res) => setProjects(res?.data?.data?.projects || []))
        .catch((err) => console.error('Error fetching projects:', err))
    } else {
      setProjects([])
      setFormData((prev) => ({ ...prev, projectId: '', unitId: '' }))
    }
  }, [formData.siteId])

  // 🔹 Fetch Units when project changes
  useEffect(() => {
    if (formData.projectId) {
      getRequest(
        `units?isPagination=false&siteId=${formData.siteId}&projectId=${formData.projectId}`,
      )
        .then((res) => setUnits(res?.data?.data?.units || []))
        .catch((err) => console.error('Error fetching units:', err))
    } else {
      setUnits([])
      setFormData((prev) => ({ ...prev, unitId: '' }))
    }
  }, [formData.projectId])

  // 🔹 Pre-fill form for Edit
  useEffect(() => {
    if (modalData) {
      setFormData({
        name: modalData?.name || '',
        email: modalData?.email || '',
        phone: modalData?.phone || '',
        siteId: modalData?.siteId?._id || modalData?.siteId || '',
        projectId:
          modalData?.projects?.[0]?._id ||
          modalData?.projects?.[0] ||
          modalData?.projectId?._id ||
          modalData?.projectId ||
          '',
        unitId: modalData?.unitId?._id || modalData?.unitId || '',
        isActive: modalData?.isActive ?? true,
        verificationDocuments:
          modalData?.verificationDocuments?.length > 0
            ? modalData?.verificationDocuments
            : [{ type: '', number: '', fileUrl: '' }],
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        siteId: '',
        projectId: '',
        unitId: '',
        isActive: true,
        verificationDocuments: [{ type: '', number: '', fileUrl: '' }],
      })
    }
  }, [modalData])

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '')
      if (digits.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: digits }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: newValue }))
    }

    // Remove error when user types/selects
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // 🔹 Handle Document Upload
  const handleFileUpload = async (index, image) => {
    if (!image) return
    setUploadingIndex(index) // start loading spinner for this doc
    try {
      const res = await fileUpload({ url: 'upload', cred: { image } })
      const uploadedUrl = res?.data?.imageUrl
      if (uploadedUrl) {
        const updatedDocs = [...formData.verificationDocuments]
        updatedDocs[index].fileUrl = uploadedUrl
        setFormData((prev) => ({ ...prev, verificationDocuments: updatedDocs }))

        //  remove error once uploaded
        setErrors((prev) => ({ ...prev, [`docFile${index}`]: '' }))
        toast.success(res?.data?.message || 'Document uploaded successfully')
      } else {
        toast.error(res?.data?.error || 'Upload failed')
      }
    } catch {
      toast.error(res?.data?.error || 'Upload failed')
    } finally {
      setUploadingIndex(null) // stop loading spinner
    }
  }

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = {}
    const { name, phone, email, siteId, projectId, unitId, verificationDocuments } = formData

    if (!name) newErrors.name = 'Name is required'
    if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Enter valid 10-digit phone'
    if (!email) newErrors.email = 'Email is required'
    if (!siteId) newErrors.siteId = 'Select Site'
    if (!projectId) newErrors.projectId = 'Select Project'
    if (!unitId) newErrors.unitId = 'Select Unit'

    verificationDocuments.forEach((doc, i) => {
      if (!doc.type) newErrors[`docType${i}`] = 'Type required'
      if (!doc.number) newErrors[`docNumber${i}`] = 'Number required'
      if (!doc.fileUrl) newErrors[`docFile${i}`] = 'File required'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 Add / Update Supervisor
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    const payload = { ...formData }

    const apiCall = modalData
      ? putRequest({ url: `supervisors/${modalData._id}`, cred: payload })
      : postRequest({ url: 'supervisors', cred: payload })

    apiCall
      .then((res) => {
        toast.success(res?.data?.message || (modalData ? 'Supervisor updated' : 'Supervisor added'))
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => {
        console.error(err?.response?.data?.error || err)
        toast.error(err?.response?.data?.error || 'Something went wrong')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 🔹 Handle Cancel
  const handleCancel = () => {
    setModalData(null)
    setIsModalOpen(false)
    setErrors({})
  }

  // 🔹 Manage Document List
  const handleDocChange = (index, field, value) => {
    const updated = [...formData.verificationDocuments]
    updated[index][field] = value
    setFormData((prev) => ({ ...prev, verificationDocuments: updated }))

    // ✅ Clear related error instantly
    setErrors((prev) => ({
      ...prev,
      [`doc${field.charAt(0).toUpperCase() + field.slice(1)}${index}`]: '',
    }))
  }

  const addDoc = () =>
    setFormData((prev) => ({
      ...prev,
      verificationDocuments: [...prev.verificationDocuments, { type: '', number: '', fileUrl: '' }],
    }))

  const removeDoc = (index) => {
    const updated = formData.verificationDocuments.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, verificationDocuments: updated }))
  }

  return (
    <Modal
      title={modalData ? 'Edit Supervisor' : 'Add Supervisor'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      width={800}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Spin spinning={loading}>
          {/* 🔹 Name & Email */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Email<span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>

          {/* 🔹 Phone & Site */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Phone<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                placeholder="Enter Mobile No."
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Site<span className="text-danger">*</span>
              </label>
              <select
                name="siteId"
                value={formData.siteId}
                onChange={handleChange}
                className={`form-select ${errors.siteId ? 'is-invalid' : ''}`}
              >
                <option value="">Select Site</option>
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.siteName}
                  </option>
                ))}
              </select>
              {errors.siteId && <div className="invalid-feedback">{errors.siteId}</div>}
            </div>
          </div>

          {/* 🔹 Project & Unit */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Project<span className="text-danger">*</span>
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className={`form-select ${errors.projectId ? 'is-invalid' : ''}`}
                disabled={!formData.siteId}
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.projectName}
                  </option>
                ))}
              </select>
              {errors.projectId && <div className="invalid-feedback">{errors.projectId}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Unit<span className="text-danger">*</span>
              </label>
              <select
                name="unitId"
                value={formData.unitId}
                onChange={handleChange}
                className={`form-select ${errors.unitId ? 'is-invalid' : ''}`}
                disabled={!formData.projectId}
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.unitNumber}
                  </option>
                ))}
              </select>
              {errors.unitId && <div className="invalid-feedback">{errors.unitId}</div>}
            </div>
          </div>

          {/* 🔹 Verification Documents */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-bold">
                Verification Documents<span className="text-danger">*</span>
              </label>
              <Button type="dashed" size="small" onClick={addDoc}>
                + Add More
              </Button>
            </div>

            <div className="row">
              {formData.verificationDocuments.map((doc, i) => (
                <div key={i} className="col-12 mb-3">
                  <div className="border rounded p-3 h-100">
                    <div className="row g-3 align-items-end">
                      {/* Document Type */}
                      <div className="col-md-6">
                        <label className="form-label">
                          Document Type<span className="text-danger">*</span>
                        </label>
                        <select
                          value={doc.type}
                          onChange={(e) => handleDocChange(i, 'type', e.target.value)}
                          className={`form-control ${errors[`docType${i}`] ? 'is-invalid' : ''}`}
                        >
                          <option value="">Select Type</option>
                          <option value="Aadhar">Aadhar</option>
                          <option value="PAN">PAN</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors[`docType${i}`] && (
                          <div className="invalid-feedback">{errors[`docType${i}`]}</div>
                        )}
                      </div>

                      {/* Document Number */}
                      <div className="col-md-6">
                        <label className="form-label">
                          Document Number<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          value={doc.number}
                          placeholder="Enter Document Number"
                          onChange={(e) => handleDocChange(i, 'number', e.target.value)}
                          className={`form-control ${errors[`docNumber${i}`] ? 'is-invalid' : ''}`}
                        />
                        {errors[`docNumber${i}`] && (
                          <div className="invalid-feedback">{errors[`docNumber${i}`]}</div>
                        )}
                      </div>

                      {/* File Upload */}
                      <div className="col-12">
                        <label className="form-label">
                          Upload File<span className="text-danger">*</span>
                        </label>
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ flex: doc.fileUrl ? '0 0 70%' : '1 1 100%' }}>
                            <input
                              type="file"
                              onChange={(e) => handleFileUpload(i, e.target.files[0])}
                              className={`form-control ${errors[`docFile${i}`] ? 'is-invalid' : ''}`}
                              disabled={uploadingIndex === i} // disable while uploading
                            />
                            {errors[`docFile${i}`] && (
                              <div className="invalid-feedback">{errors[`docFile${i}`]}</div>
                            )}
                          </div>

                          {/* ✅ Preview / Loader */}
                          <div
                            className="border rounded p-1 bg-light d-flex justify-content-center align-items-center"
                            style={{ width: '80px', height: '80px' }}
                          >
                            {uploadingIndex === i ? (
                              // 🌀 Show loader while uploading
                              <div
                                className="spinner-border text-primary"
                                role="status"
                                style={{ width: '30px', height: '30px' }}
                              >
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : doc.fileUrl ? (
                              doc.fileUrl.endsWith('.pdf') ? (
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-decoration-none"
                                >
                                  📄 PDF
                                </a>
                              ) : (
                                <img
                                  src={doc.fileUrl}
                                  alt="doc"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                  }}
                                />
                              )
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      {formData.verificationDocuments.length > 1 && (
                        <div className="col-12 text-end mt-2">
                          <Button danger size="small" onClick={() => removeDoc(i)}>
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 Active Checkbox */}
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input me-2"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label className="form-check-label fw-bold">Active</label>
          </div>

          {/* 🔹 Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {modalData
                ? loading
                  ? 'Updating...'
                  : 'Update Supervisor'
                : loading
                  ? 'Saving...'
                  : 'Save Supervisor'}
            </button>
          </div>
        </Spin>
      </form>
    </Modal>
  )
}

export default SupervisorModal
