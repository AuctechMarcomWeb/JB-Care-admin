/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fileUpload, postRequest, putRequest, getRequest } from '../../Helpers'

const ComplaintsModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [sites, setSites] = useState([])
  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
    siteId: '',
    projectId: '',
    unitId: '',
    userId: '68f08ead4ec6868878de3b38',
    complaintTitle: '',
    complaintDescription: '',
    images: [],
  })

  // 🔹 Prefill in Edit Mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        siteId: modalData?.siteId?._id || '',
        projectId: modalData?.projectId?._id || '',
        unitId: modalData?.unitId?._id || '',
        userId: modalData?.userId?._id || '',
        complaintTitle: modalData?.complaintTitle || '',
        complaintDescription: modalData?.complaintDescription || '',
        images: modalData?.images || [],
      })
    } else {
      setFormData({
        siteId: '',
        projectId: '',
        unitId: '',
        userId: '',
        complaintTitle: '',
        complaintDescription: '',
        images: [],
      })
    }
  }, [modalData])

  // 🔹 Fetch all Sites
  useEffect(() => {
    getRequest('sites?isPagination=false')
      .then((res) => {
        setSites(res?.data?.data?.sites || [])
      })
      .catch((err) => console.error('Error fetching sites:', err))
  }, [])

  // 🔹 Fetch Projects based on selected Site
  useEffect(() => {
    if (!formData.siteId) {
      setProjects([])
      setUnits([])
      return
    }
    getRequest(`projects?isPagination=false&siteId=${formData.siteId}`)
      .then((res) => {
        setProjects(res?.data?.data?.projects || [])
      })
      .catch((err) => console.error('Error fetching projects:', err))
  }, [formData.siteId])

  // 🔹 Fetch Units based on selected Project
  useEffect(() => {
    if (!formData.projectId) {
      setUnits([])
      return
    }
    getRequest(`units?isPagination=false&projectId=${formData.projectId}`)
      .then((res) => {
        setUnits(res?.data?.data?.units || [])
      })
      .catch((err) => console.error('Error fetching units:', err))
  }, [formData.projectId])

  // 🔹 Fetch Users
  useEffect(() => {
    getRequest('users')
      .then((res) => {
        setUsers(res?.data?.data?.users || [])
      })
      .catch((err) => console.error('Error fetching users:', err))
  }, [])

  // 🔹 Cancel Modal
  const handleCancel = () => {
    setFormData({
      siteId: '',
      projectId: '',
      unitId: '',
      userId: '',
      complaintTitle: '',
      complaintDescription: '',
      images: [],
    })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  // 🔹 Input Change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // 🔹 Image Upload
  const handleImageUpload = (e) => {
    const image = e.target.files[0]
    if (!image) return
    setLoading(true)

    fileUpload({ url: 'upload', cred: { image } })
      .then((res) => {
        const uploadedUrl = res?.data?.imageUrl
        if (uploadedUrl) {
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), uploadedUrl],
          }))
          toast.success('Image uploaded successfully')
        } else {
          toast.error('Image URL not received')
        }
      })
      .catch(() => toast.error('Image upload failed'))
      .finally(() => setLoading(false))
  }

  // 🔹 Remove Image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // 🔹 Validate Form
  const validateForm = () => {
    const newErrors = {}
    if (!formData.siteId) newErrors.siteId = 'Site is required'
    if (!formData.projectId) newErrors.projectId = 'Project is required'
    if (!formData.unitId) newErrors.unitId = 'Unit is required'
    if (!formData.userId) newErrors.userId = 'User is required'
    if (!formData.complaintTitle.trim()) newErrors.complaintTitle = 'Complaint title is required'
    if (!formData.complaintDescription.trim())
      newErrors.complaintDescription = 'Description is required'
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 Submit Add/Edit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    const apiCall = modalData
      ? putRequest({ url: `complaints/${modalData?._id}/review`, cred: formData })
      : postRequest({ url: 'complaints', cred: formData })

    apiCall
      .then((res) => {
        toast.success(res?.data?.message || 'Complaint saved successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={modalData ? 'Edit Complaint' : 'Add Complaint'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      width={700}
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* 🔹 Row 1 — Site & Project */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Site <span className="text-danger">*</span>
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

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Project <span className="text-danger">*</span>
            </label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className={`form-select ${errors.projectId ? 'is-invalid' : ''}`}
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
        </div>

        {/* 🔹 Row 2 — Unit & User */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Unit <span className="text-danger">*</span>
            </label>
            <select
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              className={`form-select ${errors.unitId ? 'is-invalid' : ''}`}
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

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              User <span className="text-danger">*</span>
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={`form-select ${errors.userId ? 'is-invalid' : ''}`}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.userId && <div className="invalid-feedback">{errors.userId}</div>}
          </div>
        </div>

        {/* 🔹 Row 3 — Complaint Title & Description */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Complaint Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="complaintTitle"
              value={formData.complaintTitle}
              onChange={handleChange}
              className={`form-control ${errors.complaintTitle ? 'is-invalid' : ''}`}
            />
            {errors.complaintTitle && (
              <div className="invalid-feedback">{errors.complaintTitle}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              name="complaintDescription"
              rows="2"
              value={formData.complaintDescription}
              onChange={handleChange}
              className={`form-control ${errors.complaintDescription ? 'is-invalid' : ''}`}
            />
            {errors.complaintDescription && (
              <div className="invalid-feedback">{errors.complaintDescription}</div>
            )}
          </div>
        </div>

        {/* 🔹 Row 4 — Images */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Images <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            className={`form-control ${errors.images ? 'is-invalid' : ''}`}
            disabled={loading}
            onChange={handleImageUpload}
          />
          {errors.images && <div className="invalid-feedback">{errors.images}</div>}

          {/* Preview */}
          <div className="mt-2 d-flex flex-wrap gap-2">
            {formData.images?.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img
                  src={img}
                  alt={`Uploaded ${i}`}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
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
                : 'Update Complaint'
              : loading
                ? 'Saving...'
                : 'Save Complaint'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ComplaintsModal
