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
  const [errors, setErrors] = useState({})
  const [sites, setSites] = useState([])
  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])

  const emptyForm = {
    name: '',
    phone: '',
    email: '',
    verificationDocuments: [{ type: '', number: '', fileUrl: '' }],
    siteId: '',
    projectId: '',
    unitId: '',
    isActive: true,
  }

  const [formData, setFormData] = useState(modalData || emptyForm)

  // 🔹 Fetch Sites
  useEffect(() => {
    getRequest('sites?isPagination=false')
      .then((res) => setSites(res?.data?.data?.sites || []))
      .catch((err) => console.error('Site fetch error:', err))
  }, [])

  // 🔹 Fetch Projects based on site
  useEffect(() => {
    if (!formData.siteId) {
      setProjects([])
      setUnits([])
      setFormData((prev) => ({ ...prev, projectId: '', unitId: '' }))
      return
    }

    getRequest(`projects?isPagination=false&siteId=${formData.siteId}`)
      .then((res) => setProjects(res?.data?.data?.projects || []))
      .catch((err) => console.error('Project fetch error:', err))
  }, [formData.siteId])

  // 🔹 Fetch Units based on project
  useEffect(() => {
    if (!formData.siteId || !formData.projectId) {
      setUnits([])
      setFormData((prev) => ({ ...prev, unitId: '' }))
      return
    }

    getRequest(`units?isPagination=false&siteId=${formData.siteId}&projectId=${formData.projectId}`)
      .then((res) => setUnits(res?.data?.data?.units || []))
      .catch((err) => console.error('Unit fetch error:', err))
  }, [formData.siteId, formData.projectId])

  // 🔹 Handlers
  const handleCancel = () => {
    setFormData(emptyForm)
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '')
      if (digits.length <= 10) setFormData((prev) => ({ ...prev, phone: digits }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleFileUpload = async (index, file) => {
    if (!file) return
    setLoading(true)

    try {
      const res = await fileUpload({ url: 'upload', cred: { image: file } })
      const uploadedUrl = res?.data?.imageUrl

      if (uploadedUrl) {
        const updatedDocs = [...formData.verificationDocuments]
        updatedDocs[index].fileUrl = uploadedUrl
        setFormData((prev) => ({ ...prev, verificationDocuments: updatedDocs }))
        toast.success('File uploaded successfully')
      } else toast.error('File upload failed')
    } catch {
      toast.error('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = {}
    const { name, phone, email, siteId, projectId, unitId, verificationDocuments } = formData

    if (!name.trim()) newErrors.name = 'Name is required'
    if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Enter valid 10-digit phone'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter valid email'
    if (!siteId) newErrors.siteId = 'Select Site'
    if (!projectId) newErrors.projectId = 'Select Project'
    if (!unitId) newErrors.unitId = 'Select Unit'

    verificationDocuments.forEach((doc, i) => {
      if (!doc.type) newErrors[`docType${i}`] = 'Required'
      if (!doc.number) newErrors[`docNumber${i}`] = 'Required'
      if (!doc.fileUrl) newErrors[`docFile${i}`] = 'Upload required'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 Add/Edit Supervisor
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
      const payload = { ...formData }
      const res = modalData
        ? await putRequest({ url: `supervisors/${modalData._id}`, cred: payload })
        : await postRequest({ url: 'supervisors', cred: payload })

      toast.success(res?.data?.message || (modalData ? 'Supervisor updated' : 'Supervisor added'))
      setUpdateStatus((prev) => !prev)
      handleCancel()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 JSX
  return (
    <Modal
      title={modalData ? 'Edit Supervisor' : 'Add Supervisor'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Spin spinning={loading}>
          {/* 🔸 Basic Info */}
          <div className="row">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
          </div>

          <div className="row">
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
            <SelectField
              label="Site"
              name="siteId"
              value={formData.siteId}
              options={sites}
              optionLabel="siteName"
              optionValue="_id"
              onChange={handleChange}
              error={errors.siteId}
              required
            />
          </div>

          <div className="row">
            <SelectField
              label="Project"
              name="projectId"
              value={formData.projectId}
              options={projects}
              optionLabel="projectName"
              optionValue="_id"
              onChange={handleChange}
              error={errors.projectId}
              required
              disabled={!formData.siteId}
            />
            <SelectField
              label="Unit"
              name="unitId"
              value={formData.unitId}
              options={units}
              optionLabel="unitNumber"
              optionValue="_id"
              onChange={handleChange}
              error={errors.unitId}
              required
              disabled={!formData.projectId}
            />
          </div>

          {/* 🔸 Verification Docs */}
          <VerificationDocuments
            docs={formData.verificationDocuments}
            setFormData={setFormData}
            handleFileUpload={handleFileUpload}
            errors={errors}
            loading={loading}
          />

          {/* 🔸 Active Status */}
          <div className="form-check mt-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="form-check-input me-2"
            />
            <label className="form-check-label fw-bold">Active</label>
          </div>

          {/* 🔸 Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {modalData ? 'Update Supervisor' : 'Save Supervisor'}
            </Button>
          </div>
        </Spin>
      </form>
    </Modal>
  )
}

export default SupervisorModal

// ✅ Reusable InputField
const InputField = ({ label, name, value, onChange, error, required }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label fw-bold">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className={`form-control ${error ? 'is-invalid' : ''}`}
    />
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
)

// ✅ Reusable SelectField
const SelectField = ({
  label,
  name,
  value,
  options,
  optionLabel,
  optionValue,
  onChange,
  error,
  required,
  disabled,
}) => (
  <div className="col-md-6 mb-3">
    <label className="form-label fw-bold">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`form-select ${error ? 'is-invalid' : ''}`}
    >
      <option value="">Select {label}</option>
      {options?.map((opt) => (
        <option key={opt[optionValue]} value={opt[optionValue]}>
          {opt[optionLabel]}
        </option>
      ))}
    </select>
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
)

// ✅ VerificationDocuments
const VerificationDocuments = ({ docs, setFormData, handleFileUpload, errors, loading }) => {
  const handleChange = (index, field, value) => {
    const updated = [...docs]
    updated[index][field] = value
    setFormData((prev) => ({ ...prev, verificationDocuments: updated }))
  }

  const addDoc = () => {
    const updated = [...docs, { type: '', number: '', fileUrl: '' }]
    setFormData((prev) => ({ ...prev, verificationDocuments: updated }))
  }

  const removeDoc = (index) => {
    const updated = docs.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, verificationDocuments: updated }))
  }

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label fw-bold mb-0">
          Verification Documents <span className="text-danger">*</span>
        </label>
        <Button type="dashed" onClick={addDoc} size="small">
          + Add More
        </Button>
      </div>

      {docs.map((doc, i) => (
        <div key={i} className="row align-items-end mb-2 p-2 rounded border">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Document Type"
              value={doc.type}
              onChange={(e) => handleChange(i, 'type', e.target.value)}
              className={`form-control ${errors[`docType${i}`] ? 'is-invalid' : ''}`}
            />
            {errors[`docType${i}`] && (
              <div className="invalid-feedback">{errors[`docType${i}`]}</div>
            )}
          </div>

          <div className="col-md-3">
            <input
              type="text"
              placeholder="Document Number"
              value={doc.number}
              onChange={(e) => handleChange(i, 'number', e.target.value)}
              className={`form-control ${errors[`docNumber${i}`] ? 'is-invalid' : ''}`}
            />
            {errors[`docNumber${i}`] && (
              <div className="invalid-feedback">{errors[`docNumber${i}`]}</div>
            )}
          </div>

          <div className="col-md-4">
            <input
              type="file"
              accept="image/*,.pdf"
              disabled={loading}
              onChange={(e) => handleFileUpload(i, e.target.files[0])}
              className={`form-control ${errors[`docFile${i}`] ? 'is-invalid' : ''}`}
            />
            {doc.fileUrl && (
              <div className="mt-2">
                {doc.fileUrl.endsWith('.pdf') ? (
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                    View PDF
                  </a>
                ) : (
                  <img
                    src={doc.fileUrl}
                    alt={doc.type}
                    style={{ width: 50, height: 50, borderRadius: 5, objectFit: 'cover' }}
                  />
                )}
              </div>
            )}
            {errors[`docFile${i}`] && (
              <div className="invalid-feedback">{errors[`docFile${i}`]}</div>
            )}
          </div>

          <div className="col-md-2 text-center">
            {docs.length > 1 && (
              <Button danger onClick={() => removeDoc(i)}>
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
