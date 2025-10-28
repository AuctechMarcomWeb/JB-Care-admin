/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import toast from 'react-hot-toast'
import { fileUpload, getRequest, postRequest, putRequest } from '../../Helpers'

const ComplaintsModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    userId: '',
    siteId: '',
    projectId: '',
    unitId: '',
    complaintTitle: '',
    complaintDescription: '',
    images: [],
  })

  // Fetch Users Once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getRequest(`users?isPagination=false`)
        setUsers(res?.data?.data?.data || [])
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }
    fetchUsers()
  }, [])

  // Prefill Edit Mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        userId: modalData?.userId?._id || '',
        siteId: modalData?.siteId?._id || '',
        projectId: modalData?.projectId?._id || '',
        unitId: modalData?.unitId?._id || '',
        complaintTitle: modalData?.complaintTitle || '',
        complaintDescription: modalData?.complaintDescription || '',
        images: modalData?.images || [],
      })

      const user = users.find((u) => u._id === modalData?.userId?._id)
      if (user) setSelectedUser(user)
    }
  }, [modalData, users])

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))

    // Auto-fill user related info
    if (name === 'userId') {
      const user = users.find((u) => u._id === value)
      setSelectedUser(user || null)

      if (user) {
        setFormData((prev) => ({
          ...prev,
          userId: value,
          siteId: user?.siteId?._id || '',
          projectId: user?.projectId?._id || '',
          unitId: user?.unitId?._id || '',
        }))
      }
    }
  }

  // ✅ Handle Image Upload
  const handleImageUpload = async (e) => {
    const image = e.target.files[0]
    if (!image) return
    setLoading(true)

    try {
      const res = await fileUpload({ url: 'upload', cred: { image } })
      const uploadedUrl = res?.data?.imageUrl
      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), uploadedUrl],
        }))
        toast.success('Image uploaded successfully')
      } else toast.error('Image upload failed')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.userId) newErrors.userId = 'User is required'
    if (!formData.siteId) newErrors.siteId = 'Site is required (auto-filled)'
    if (!formData.projectId) newErrors.projectId = 'Project is required (auto-filled)'
    if (!formData.unitId) newErrors.unitId = 'Unit is required (auto-filled)'

    if (!formData.complaintTitle.trim()) newErrors.complaintTitle = 'Complaint title is required'
    if (!formData.complaintDescription.trim())
      newErrors.complaintDescription = 'Description is required'

    if (!formData.images || formData.images.length === 0)
      newErrors.images = 'At least one image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ Submit New Complaint
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await postRequest({ url: 'complaints', cred: formData })
      toast.success(res?.data?.message || 'Complaint added successfully')
      setUpdateStatus((p) => !p)
      handleCancel()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Update Complaint
  const handleEdit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await putRequest({
        url: `complaints/${modalData._id}`,
        cred: formData,
      })
      toast.success(res?.data?.message || 'Complaint updated successfully')
      setUpdateStatus((p) => !p)
      handleCancel()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Cancel / Reset
  const handleCancel = () => {
    setModalData(null)
    setIsModalOpen(false)
    setErrors({})
    setSelectedUser(null)
    setFormData({
      userId: '',
      siteId: '',
      projectId: '',
      unitId: '',
      complaintTitle: '',
      complaintDescription: '',
      images: [],
    })
  }

  return (
    <Modal
      title={modalData ? 'Edit Complaint (Under Development )' : 'Add Complaint'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      width={700}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        {/* 🔹 User Selection */}
        <div className="row">
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

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Site <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={selectedUser?.siteId?.siteName || ''}
              disabled={!formData.userId}
              readOnly
            />
            {errors.siteId && <div className="invalid-feedback">{errors.siteId}</div>}
          </div>
        </div>

        {/* 🔹 Auto-Filled Site, Project, Unit */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Project <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={selectedUser?.projectId?.projectName || ''}
              disabled={!formData.userId}
              readOnly
            />
            {errors.projectId && <div className="invalid-feedback">{errors.projectId}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Unit <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={selectedUser?.unitId?.unitNumber || ''}
              disabled={!formData.userId}
              readOnly
            />
            {errors.unitId && <div className="invalid-feedback">{errors.unitId}</div>}
          </div>
        </div>

        <div className="row">
          {/* 🔹 Complaint Title */}
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

        {/* 🔹 Image Upload */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Images <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className={`form-control ${errors.images ? 'is-invalid' : ''}`}
              onChange={handleImageUpload}
              disabled={loading}
            />
            {errors.images && <div className="invalid-feedback">{errors.images}</div>}
          </div>

          <div className="col-md-6 mb-3 d-flex align-items-center">
            <div className="mt-2 d-flex flex-wrap gap-2">
              {formData.images.map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img
                    src={img}
                    alt={`Uploaded ${i}`}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '6px',
                      objectFit: 'cover',
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
