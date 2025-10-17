/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getRequest, postRequest, putRequest } from '../../../Helpers'

const ProjectModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [sites, setSites] = useState([])

  const [formData, setFormData] = useState({
    projectName: '',
    siteId: '',
    projectAddress: '',
    status: true,
  })

  // 🔹 Fetch sites for dropdown
  useEffect(() => {
    getRequest('sites?isPagination=false')
      .then((res) => {
        const responseData = res?.data?.data
        setSites(responseData?.sites || [])
      })
      .catch((error) => {
        console.error('Error fetching sites:', error)
      })
  }, [])

  // 🔹 Prefill in edit mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        projectName: modalData?.projectName || '',
        siteId: modalData?.siteId?._id || '',
        projectAddress: modalData.projectAddress || '',
        status: modalData.status ?? true,
      })
    } else {
      setFormData({ projectName: '', siteId: '', projectAddress: '', status: true })
    }
  }, [modalData])

  // 🔹 Close modal
  const handleCancel = () => {
    setFormData({ projectName: '', siteId: '', projectAddress: '', status: true })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  // 🔹 Input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // 🔹 Validate form
  const validateForm = () => {
    const newErrors = {}
    if (!formData?.projectName.trim()) newErrors.projectName = 'Project name is required'
    if (!formData?.siteId) newErrors.siteId = 'Please select a site'
    if (!formData?.projectAddress.trim()) newErrors.projectAddress = 'Project address is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 Add Project
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    postRequest({
      url: 'projects',
      cred: formData,
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Project created successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  // 🔹 Edit Project
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    putRequest({
      url: `projects/${modalData?._id}`,
      cred: formData,
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Project updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={modalData ? 'Edit Project' : 'Add Project'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        {/* Project Name */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Project Name<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors?.projectName ? 'is-invalid' : ''}`}
            name="projectName"
            value={formData?.projectName}
            onChange={handleChange}
          />
          {errors?.projectName && <div className="invalid-feedback">{errors?.projectName}</div>}
        </div>

        {/* Site Dropdown */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Select Site<span className="text-danger">*</span>
          </label>
          <select
            name="siteId"
            className={`form-select ${errors?.siteId ? 'is-invalid' : ''}`}
            value={formData?.siteId}
            onChange={handleChange}
          >
            <option value="">-- Select Site --</option>
            {sites.map((site) => (
              <option key={site._id} value={site._id}>
                {site?.siteName}
              </option>
            ))}
          </select>
          {errors?.siteId && <div className="invalid-feedback">{errors?.siteId}</div>}
        </div>

        {/* Project Address */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Project Address<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors?.projectAddress ? 'is-invalid' : ''}`}
            name="projectAddress"
            value={formData?.projectAddress}
            onChange={handleChange}
          />
          {errors?.projectAddress && (
            <div className="invalid-feedback">{errors?.projectAddress}</div>
          )}
        </div>

        {/* Active Checkbox */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="status"
            checked={formData?.status}
            onChange={handleChange}
            id="status"
          />
          <label className="form-check-label" htmlFor="status">
            Active
          </label>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {modalData
              ? loading
                ? 'Updating...'
                : 'Update Project'
              : loading
                ? 'Saving...'
                : 'Save Project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ProjectModal
