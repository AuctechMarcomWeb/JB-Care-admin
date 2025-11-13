/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react'
import { Modal, Select, Spin } from 'antd'
import toast from 'react-hot-toast'
import { fileUpload, getRequest, postRequest, putRequest } from '../../../Helpers'

const RentalModal = ({ setUpdateStatus, setModalData, modalData, isModalOpen, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [landlords, setLandlords] = useState([])
  const [sites, setSites] = useState([])
  const [units, setUnits] = useState([])
  const imageInputRef = useRef(null)
  const [imageLoading, setImageLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    profilePic: '',
    siteId: '',
    unitId: '',
    landlordId: '',
    billTo: 'tenant',
    isActive: false,
  })

  // 🔹 Fetch sites when modal opens
  useEffect(() => {
    if (isModalOpen) {
      getRequest('sites?isPagination=false')
        .then((res) => setSites(res?.data?.data?.sites || []))
        .catch((err) => console.error('Error fetching sites:', err))
    }
  }, [isModalOpen])

  // 🔹 Fetch units when site changes
  useEffect(() => {
    if (!formData.siteId) {
      setUnits([])
      setLandlords([])
      setFormData((prev) => ({ ...prev, unitId: '', landlordId: '' }))
      return
    }
    getRequest(`units?isPagination=false&siteId=${formData.siteId}`)
      .then((res) => setUnits(res?.data?.data?.units || []))
      .catch((err) => console.error('Error fetching units:', err))
  }, [formData.siteId])

  // 🔹 Fetch landlords when unit changes
  useEffect(() => {
    if (!formData.unitId) {
      setLandlords([])
      setFormData((prev) => ({ ...prev, landlordId: '' }))
      return
    }
    getRequest(`landlords?isPagination=false&unitId=${formData.unitId}`)
      .then((res) => setLandlords(res?.data?.data?.data || []))
      .catch((err) => console.error('Error fetching landlords:', err))
  }, [formData.unitId])

  // 🔹 Prefill form for edit
  useEffect(() => {
    if (modalData) {
      setFormData({
        name: modalData?.name || '',
        phone: modalData?.phone || '',
        email: modalData?.email || '',
        address: modalData?.address || '',
        profilePic: modalData?.profilePic || '',
        siteId: modalData?.siteId?._id || '',
        unitId: modalData?.unitId?._id || '',
        landlordId: modalData?.landlordId?._id || '',
        billTo: modalData?.billTo || 'tenant',
        isActive: modalData?.isActive ?? false,
      })
    } else {
      setFormData((prev) => ({ ...prev, isActive: false, billTo: 'tenant' }))
    }
  }, [modalData])

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === 'phone') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 10)
      setFormData((prev) => ({ ...prev, phone: onlyNums }))
      if (errors.phone && /^\d{10}$/.test(onlyNums)) setErrors((prev) => ({ ...prev, phone: '' }))
      return
    }

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // 🔹 Handle image upload
  const handleImageUpload = (e) => {
    const image = e.target.files[0]
    if (!image) return

    setErrors((prev) => ({ ...prev, profilePic: '' }))
    setImageLoading(true)
    fileUpload({ url: 'upload', cred: { image } })
      .then((res) => {
        const uploadedUrl = res?.data?.imageUrl
        if (uploadedUrl) {
          setFormData((prev) => ({ ...prev, profilePic: uploadedUrl }))
          toast.success('Image uploaded successfully')
        } else toast.error('Upload failed')
      })
      .catch(() => toast.error('Image upload failed'))
      .finally(() => setImageLoading(false))
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profilePic: '' }))
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  // 🔹 Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name?.trim()) newErrors.name = 'Name is required'
    if (!formData.email?.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Enter a valid 10-digit phone number'
    if (!formData.address?.trim()) newErrors.address = 'Address is required'
    if (!formData.siteId) newErrors.siteId = 'Select site'
    if (!formData.unitId) newErrors.unitId = 'Select unit'
    if (!formData.landlordId) newErrors.landlordId = 'Select landlord'
    if (!formData.profilePic) newErrors.profilePic = 'Profile image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 Submit new tenant
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    postRequest({ url: 'tenants', cred: { ...formData } })
      .then((res) => {
        toast.success(res?.data?.message || 'Tenant added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  // 🔹 Edit existing tenant
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    putRequest({ url: `tenants/${modalData._id}`, cred: { ...formData } })
      .then((res) => {
        toast.success(res?.data?.message || 'Tenant updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  // 🔹 Reset modal
  const handleCancel = () => {
    setModalData(null)
    setIsModalOpen(false)
    setErrors({})
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      profilePic: '',
      siteId: '',
      unitId: '',
      landlordId: '',
      billTo: 'tenant',
      isActive: false,
    })
  }

  return (
    <Modal
      title={modalData ? 'Edit Tenant' : 'Add Tenant'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      width={900}
    >
      <Spin spinning={loading}>
        <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
          <div className="row">
            {/* Row 1: Site & Unit */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Site<span className="text-danger">*</span>
              </label>
              <Select
                showSearch
                allowClear
                placeholder="--Select Site--"
                value={formData.siteId || undefined}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, siteId: value, unitId: '', landlordId: '' }))
                  if (value) setErrors((prev) => ({ ...prev, siteId: '' }))
                }}
                options={sites.map((s) => ({ value: s._id, label: s.siteName }))}
              />
              {errors.siteId && <div className="text-danger small">{errors.siteId}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Unit<span className="text-danger">*</span>
              </label>
              <Select
                showSearch
                allowClear
                placeholder="--Select Unit--"
                value={formData.unitId || undefined}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, unitId: value, landlordId: '' }))
                  if (value) setErrors((prev) => ({ ...prev, unitId: '' }))
                }}
                disabled={!formData.siteId}
                options={units.map((u) => ({ value: u._id, label: u.unitNumber }))}
              />
              {errors.unitId && <div className="text-danger small">{errors.unitId}</div>}
            </div>

            {/* Row 2: Landlord & Name */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Landlord<span className="text-danger">*</span>
              </label>
              <Select
                showSearch
                allowClear
                placeholder="--Select Landlord--"
                value={formData.landlordId || undefined}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, landlordId: value }))
                  if (value) setErrors((prev) => ({ ...prev, landlordId: '' }))
                }}
                disabled={!formData.unitId}
                options={landlords.map((l) => ({ value: l._id, label: l.name }))}
              />
              {errors.landlordId && <div className="text-danger small">{errors.landlordId}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Row 3: Email & Phone */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Email<span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Phone<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            {/* Row 4: Address & Profile Pic */}
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Address<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              />
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Profile Image<span className="text-danger">*</span>
              </label>
              <input
                type="file"
                ref={imageInputRef}
                className={`form-control ${errors.profilePic ? 'is-invalid' : ''}`}
                onChange={handleImageUpload}
                disabled={imageLoading}
              />
              {errors.profilePic && <div className="invalid-feedback">{errors.profilePic}</div>}
              {formData.profilePic && (
                <div className="mt-2 position-relative d-inline-block">
                  <img
                    src={formData.profilePic}
                    alt="Preview"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 6,
                      objectFit: 'cover',
                      opacity: imageLoading ? 0.5 : 1,
                    }}
                  />
                  {!imageLoading && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Row 5: BillTo & Active */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Select Payable Person</label>
              <div className="d-flex align-items-center gap-4 mt-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="billTo"
                    value="tenant"
                    checked={formData.billTo === 'tenant'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Tenant</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="billTo"
                    value="landlord"
                    checked={formData.billTo === 'landlord'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Landlord</label>
                </div>
              </div>
            </div>

            <div className="col-md-6 d-flex align-items-center">
              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-bold">Active</label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {modalData
                ? loading
                  ? 'Updating...'
                  : 'Update Tenant'
                : loading
                  ? 'Saving...'
                  : 'Save Tenant'}
            </button>
          </div>
        </form>
      </Spin>
    </Modal>
  )
}

export default RentalModal
