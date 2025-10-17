/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fileUpload, getRequest, postRequest, putRequest } from '../../../Helpers'

const LandLordModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [site, setSite] = useState([])
  const [project, setProject] = useState([])
  const [units, setUnits] = useState([])
  console.log('units==', units)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePic: '',
    siteId: '',
    projectId: '',
    unitId: '',
  })

  // Fetch all sites initially
  useEffect(() => {
    getRequest('sites?isPagination=false')
      .then((res) => setSite(res?.data?.data?.sites || []))
      .catch((err) => console.error('Error fetching sites:', err))
  }, [])

  // Fetch projects when site changes
  useEffect(() => {
    if (formData?.siteId) {
      getRequest(`projects?isPagination=false&siteId=${formData?.siteId}`)
        .then((res) => setProject(res?.data?.data?.projects || []))
        .catch((err) => console.error('Error fetching projects:', err))
    } else {
      setProject([])
      setFormData((prev) => ({ ...prev, projectId: '', unitId: '' }))
    }
  }, [formData?.siteId])

  // Fetch units when project changes
  useEffect(() => {
    if (formData?.siteId && formData?.projectId) {
      getRequest(
        `units?isPagination=false&siteId=${formData?.siteId}&projectId=${formData?.projectId}`,
      )
        .then((res) => setUnits(res?.data?.data?.units || []))

        .catch((err) => console.error('Error fetching units:', err))
    } else {
      setUnits([])
      setFormData((prev) => ({ ...prev, unitId: '' }))
    }
  }, [formData?.projectId, formData?.siteId])
  console.log('number', units.unitNumber)

  useEffect(() => {
    if (modalData) {
      setFormData({
        name: modalData?.name || '',
        email: modalData?.email || '',
        phone: modalData?.phone || '',
        address: modalData?.address || '',
        profilePic: modalData?.profilePic || '',
        siteId: modalData?.siteId?._id || '',
        projectId: modalData?.projectId?._id || '',
        unitId:
          Array.isArray(modalData?.unitIds) && modalData.unitIds.length > 0
            ? modalData.unitIds[0]?._id || modalData.unitIds[0]
            : '',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        profilePic: '',
        siteId: '',
        projectId: '',
        unitId: '',
      })
    }
  }, [modalData])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target

    // Phone number validation
    if (name === 'phone') {
      const onlyNums = value.replace(/\D/g, '')
      if (onlyNums.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: onlyNums }))
      }
      // Remove phone error while typing
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: '' }))
      }
      return
    }

    // Update form data for all other fields
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error message as soon as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const image = e.target.files[0]
    if (!image) return
    setLoading(true)
    fileUpload({ url: 'upload', cred: { image } })
      .then((res) => {
        console.log('fdgdfdf', res)

        const uploadedUrl = res?.data?.imageUrl
        if (uploadedUrl) {
          setFormData((prev) => ({ ...prev, profilePic: uploadedUrl }))
          toast.success('Profile image uploaded successfully')
        } else toast.error('Image upload failed')
      })
      .catch(() => toast.error('Image upload failed'))
      .finally(() => setLoading(false))
  }

  const handleRemoveImage = () => setFormData((prev) => ({ ...prev, profilePic: '' }))

  // Validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData?.name) newErrors.name = 'Name is required'
    if (!formData?.email) newErrors.email = 'Email is required'
    if (!formData?.phone) newErrors.phone = 'Phone number is required'
    if (!formData?.address) newErrors.address = 'Address is required'
    if (!formData?.siteId) newErrors.siteId = 'Select a site'
    if (!formData?.projectId) newErrors.projectId = 'Select a project'
    if (!formData?.unitId) newErrors.unitId = 'Select a unit'
    if (!formData?.profilePic) newErrors.profilePic = 'Profile image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // For Add
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    const payload = {
      ...formData,
      unitIds: [formData?.unitId],
    }

    postRequest({ url: 'landlords', cred: payload })
      .then((res) => {
        toast.success(res?.data?.message || 'Landlord added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  // For Edit
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    const payload = {
      ...formData,
      unitIds: [formData.unitId],
    }

    putRequest({ url: `landlords/${modalData._id}`, cred: payload })
      .then((res) => {
        toast.success(res?.data?.message || 'Landlord updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  const handleCancel = () => {
    setModalData(null)
    setIsModalOpen(false)
    setErrors({})
  }

  return (
    <Modal
      title={modalData ? 'Edit Landlord' : 'Add Landlord'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        {/* Name & Email */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData?.name}
              onChange={handleChange}
              className={`form-control ${errors?.name ? 'is-invalid' : ''}`}
            />
            {errors?.name && <div className="invalid-feedback">{errors?.name}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Email<span className="text-danger">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData?.email}
              onChange={handleChange}
              className={`form-control ${errors?.email ? 'is-invalid' : ''}`}
            />
            {errors?.email && <div className="invalid-feedback">{errors?.email}</div>}
          </div>
        </div>

        {/* Phone & Address */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Phone<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData?.phone}
              onChange={handleChange}
              maxLength={10}
              className={`form-control ${errors?.phone ? 'is-invalid' : ''}`}
            />
            {errors?.phone && <div className="invalid-feedback">{errors?.phone}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Address<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData?.address}
              onChange={handleChange}
              className={`form-control ${errors?.address ? 'is-invalid' : ''}`}
            />
            {errors?.address && <div className="invalid-feedback">{errors?.address}</div>}
          </div>
        </div>

        {/* Site & Project */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Site<span className="text-danger">*</span>
            </label>
            <select
              name="siteId"
              value={formData?.siteId}
              onChange={handleChange}
              className={`form-select ${errors?.siteId ? 'is-invalid' : ''}`}
            >
              <option value="">Select Site</option>
              {site.map((s) => (
                <option key={s._id} value={s._id}>
                  {s?.siteName}
                </option>
              ))}
            </select>
            {errors?.siteId && <div className="invalid-feedback">{errors?.siteId}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Project<span className="text-danger">*</span>
            </label>
            <select
              name="projectId"
              value={formData?.projectId}
              onChange={handleChange}
              className={`form-select ${errors?.projectId ? 'is-invalid' : ''}`}
            >
              <option value="">Select Project</option>
              {project.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.projectName}
                </option>
              ))}
            </select>
            {errors?.projectId && <div className="invalid-feedback">{errors?.projectId}</div>}
          </div>
        </div>

        {/* Unit & Profile Image */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Unit<span className="text-danger">*</span>
            </label>
            <select
              name="unitId"
              value={formData?.unitId}
              onChange={handleChange}
              className={`form-select ${errors.unitId ? 'is-invalid' : ''}`}
            >
              <option value="">Select Unit</option>
              {units.map((u) => (
                <option key={u._id} value={u._id}>
                  {u?.unitNumber}
                </option>
              ))}
            </select>
            {errors?.unitId && <div className="invalid-feedback">{errors?.unitId}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Profile Image<span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className={`form-control ${errors?.profilePic ? 'is-invalid' : ''}`}
              onChange={handleImageUpload}
              disabled={loading}
            />
            {errors?.profilePic && <div className="invalid-feedback">{errors?.profilePic}</div>}
            {formData?.profilePic && (
              <div className="mt-2 position-relative d-inline-block">
                <img
                  src={formData?.profilePic}
                  alt="Preview"
                  style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
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
            )}
          </div>
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
                : 'Update Landlord'
              : loading
                ? 'Saving...'
                : 'Save Landlord'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default LandLordModal
