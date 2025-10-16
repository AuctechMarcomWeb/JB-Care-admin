/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import toast from 'react-hot-toast'
import { fileUpload, getRequest, postRequest, putRequest } from '../../../Helpers'

const RentalModal = ({ setUpdateStatus, setModalData, modalData, isModalOpen, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [landlords, setLandlords] = useState([])

  const [sites, setSites] = useState([])
  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [selectedLandlord, setSelectedLandlord] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    profilePic: '',
    siteId: '',
    projectId: '',
    unitId: '',
    landlordId: '',
    addedBy: 'landlord',
    billTo: 'tenant',
  })

  // ✅ Fetch landlord list only once
  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const res = await getRequest('landlords?isPagination=false')
        console.log('landlords', res)
        setLandlords(res?.data?.data?.data || [])
      } catch (err) {
        console.error('Error fetching landlords:', err)
      }
    }
    fetchLandlords()
  }, [])

  // ✅ Prefill data in Edit Mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        name: modalData?.name || '',
        phone: modalData?.phone || '',
        email: modalData?.email || '',
        address: modalData?.address || '',
        profilePic: modalData?.profilePic || '',
        siteId: modalData?.siteId?._id || '',
        projectId: modalData?.projectId?._id || '',
        unitId: modalData?.unitId?._id || '',
        landlordId: modalData?.landlordId?._id || '',
        addedBy: modalData?.addedBy || 'landlord',
        billTo: modalData?.billTo || '',
      })

      // Auto-select landlord for showing site/project/unit
      const landlord = landlords.find((l) => l._id === modalData?.landlordId?._id)
      if (landlord) setSelectedLandlord(landlord)
    }
  }, [modalData, landlords])

  //  Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'phone') {
      const onlyNums = value.replace(/\D/g, '')
      if (onlyNums.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: onlyNums }))
      }
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'landlordId') {
      const landlord = landlords.find((l) => l._id === value)
      setSelectedLandlord(landlord || null)

      if (landlord) {
        // Auto-fill related fields
        setFormData((prev) => ({
          ...prev,
          landlordId: value,
          siteId: landlord?.siteId?._id || '',
          projectId: landlord?.projectId?._id || '',
          unitId: landlord?.unitIds[0]?._id || '',
        }))
      } else {
        setSites([])
        setProjects([])
        setUnits([])
      }
    }
  }

  const handleImageUpload = (e) => {
    const image = e.target.files[0]
    if (!image) return
    setLoading(true)
    fileUpload({ url: 'upload', cred: { image } })
      .then((res) => {
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
  // ✅ Validation
  const validateForm = () => {
    const newErrors = {}

    // Name
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long'
    }

    // Email
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    // Phone
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits'
    }

    // Address
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required'
    } else if (formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters long'
    }

    // Landlord
    if (!formData.landlordId) {
      newErrors.landlordId = 'Select a landlord'
    }

    // Site / Project / Unit (auto-filled from landlord)
    if (!formData.siteId) {
      newErrors.siteId = 'Site is required (auto-filled from landlord)'
    }
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required (auto-filled from landlord)'
    }
    if (!formData.unitId) {
      newErrors.unitId = 'Unit is required (auto-filled from landlord)'
    }

    // Profile Image
    if (!formData.profilePic) {
      newErrors.profilePic = 'Profile image is required'
    }

    // Bill To (radio)
    if (!formData.billTo) {
      newErrors.billTo = 'Select who the bill is payable to'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  //  Handle submit (Add)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const res = await postRequest({ url: 'tenants', cred: formData })
      toast.success(res?.data?.message || 'Rental added successfully')
      setUpdateStatus((prev) => !prev)
      handleCancel()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  //  Handle edit (Update)
  const handleEdit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const res = await putRequest({ url: `tenants/${modalData._id}`, cred: formData })
      toast.success(res?.data?.message || 'Rental updated successfully')
      setUpdateStatus((prev) => !prev)
      handleCancel()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Handle cancel
  const handleCancel = () => {
    setModalData(null)
    setIsModalOpen(false)
    setErrors({})
    setFormData({
      landlordId: '',
      siteId: '',
      projectId: '',
      unitId: '',
    })
    setSelectedLandlord(null)
    setSites([])
    setProjects([])
    setUnits([])
  }

  return (
    <Modal
      title={modalData ? 'Edit Rental' : 'Add Rental'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        {/* Name & Email */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        {/* Phone & Address */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              required
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              required
            />
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
        </div>

        {/* Landlord & Site */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Landlord</label>
            <select
              name="landlordId"
              value={formData.landlordId}
              onChange={handleChange}
              className={`form-select ${errors.landlordId ? 'is-invalid' : ''}`}
              required
            >
              <option value="">Select Landlord</option>
              {landlords.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.name}
                </option>
              ))}
            </select>
            {errors.landlordId && <div className="invalid-feedback">{errors.landlordId}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Site</label>
            <input
              type="text"
              className="form-control"
              value={selectedLandlord?.siteId?.siteName || ''}
              disabled={!formData.landlordId} // ✅ Disable when no landlord is selected
              required
              readOnly
            />
          </div>
        </div>

        {/* Project & Unit */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Project</label>
            <input
              type="text"
              className="form-control"
              value={selectedLandlord?.projectId?.projectName || ''}
              disabled={!formData.landlordId} // ✅ Disable when no landlord is selected
              required
              readOnly
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Unit</label>
            <input
              type="text"
              className="form-control"
              value={selectedLandlord?.unitIds[0]?.unitNumber || ''}
              disabled={!formData.landlordId} // ✅ Disable when no landlord is selected
              required
              readOnly
            />
          </div>
        </div>

        {/* Profile Pic */}
        <div className="row">
          <div className="col-md-12 mb-3">
            <label className="form-label fw-bold">Profile Image</label>
            <input
              type="file"
              className={`form-control ${errors.profilePic ? 'is-invalid' : ''}`}
              onChange={handleImageUpload}
              required
              disabled={loading}
            />
            {errors.profilePic && <div className="invalid-feedback">{errors.profilePic}</div>}
            {formData.profilePic && (
              <div className="mt-2 position-relative d-inline-block">
                <img
                  src={formData.profilePic}
                  alt="Preview"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '6px',
                    objectFit: 'cover',
                  }}
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
        {/* Bill To (Payable Person) */}
        <div className="row">
          <div className="col-md-12 mb-3">
            <label className="form-label fw-bold">Select Payable Person</label>
            <div className="d-flex align-items-center gap-4 mt-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="billTo"
                  id="billToTenant"
                  value="tenant"
                  checked={formData.billTo === 'tenant'}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="billToTenant">
                  Tenant
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="billTo"
                  id="billToLandlord"
                  value="landlord"
                  checked={formData.billTo === 'landlord'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="billToLandlord">
                  Landlord
                </label>
              </div>
            </div>
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
                : 'Update Rental'
              : loading
                ? 'Saving...'
                : 'Save Rental'}{' '}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default RentalModal
