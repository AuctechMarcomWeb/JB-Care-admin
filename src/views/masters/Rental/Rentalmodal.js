/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Modal, Select, Spin } from 'antd'
import toast from 'react-hot-toast'
import { fileUpload, getRequest, postRequest, putRequest } from '../../../Helpers'

const RentalModal = ({ setUpdateStatus, setModalData, modalData, isModalOpen, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [landlords, setLandlords] = useState([])
  const [sites, setSites] = useState([])
  // const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const imageInputRefs = React.useRef([])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    profilePic: '',
    siteId: '',
    // projectId: '',
    unitId: '',
    landlordId: '',
    billTo: 'tenant',
    addedBy: 'landlord',
    isActive: true,
  })

  // // 🔹 Fetch all sites when modal opens
  // useEffect(() => {
  //   if (isModalOpen) {
  //     getRequest('sites?isPagination=false')
  //       .then((res) => setSites(res?.data?.data?.sites || []))
  //       .catch((err) => console.error('Error fetching sites:', err))
  //   }
  // }, [isModalOpen])

  // // // 🔹 Fetch projects based on selected site
  // // useEffect(() => {
  // //   if (!formData.siteId) {
  // //     setProjects([])
  // //     setUnits([])
  // //     setFormData((prev) => ({ ...prev, projectId: '', unitId: '', landlordId: '' }))
  // //     return
  // //   }
  // //   getRequest(`projects?isPagination=false&siteId=${formData.siteId}`)
  // //     .then((res) => setProjects(res?.data?.data?.projects || []))
  // //     .catch((err) => console.error('Error fetching projects:', err))
  // // }, [formData.siteId])

  // // 🔹 Fetch units based on selected project
  // useEffect(() => {
  //   if (!formData.siteId) {
  //     setUnits([])
  //     setFormData((prev) => ({ ...prev, unitId: '', landlordId: '' }))
  //     return
  //   }
  //   getRequest(`units?isPagination=false&siteId=${formData.siteId}`)
  //     .then((res) => setUnits(res?.data?.data?.units || []))
  //     .catch((err) => console.error('Error fetching units:', err))
  // }, [formData.siteId])

  // // 🔹 Fetch landlords based on selected unit
  // useEffect(() => {
  //   if (!formData.unitId) {
  //     setLandlords([])
  //     setFormData((prev) => ({ ...prev, landlordId: '' }))
  //     return
  //   }
  //   getRequest(`landlords?isPagination=false&unitId=${formData.unitId}`)
  //     .then((res) => setLandlords(res?.data?.data?.data || []))
  //     .catch((err) => console.error('Error fetching landlords:', err))
  // }, [formData.unitId])

  // 🔹 Fetch all sites when modal opens
  useEffect(() => {
    if (isModalOpen) {
      getRequest('sites?isPagination=false')
        .then((res) => setSites(res?.data?.data?.sites || []))
        .catch((err) => console.error('Error fetching sites:', err))
    }
  }, [isModalOpen])

  // 🔹 Fetch units based on selected site
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

  // 🔹 Fetch landlords based on selected unit
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

  // 🔹 Prefill for edit mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        name: modalData?.name || '',
        phone: modalData?.phone || '',
        email: modalData?.email || '',
        address: modalData?.address || '',
        profilePic: modalData?.profilePic || '',
        siteId: modalData?.siteId?._id || '',
        // projectId: modalData?.projectId?._id || '',
        unitId: modalData?.unitId?._id || '',
        landlordId: modalData?.landlordId?._id || '',
        billTo: modalData?.billTo || 'tenant',
        isActive: modalData?.isActive ?? true,
      })
    }
  }, [modalData])

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('name and value', name, value)

    // Phone field restriction
    if (name === 'phone') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 10)
      setFormData((prev) => ({ ...prev, phone: onlyNums }))
      if (errors.phone && /^\d{10}$/.test(onlyNums)) {
        setErrors((prev) => ({ ...prev, phone: '' }))
      }
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // 🔹 Form Validation
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
    // if (!formData.projectId) newErrors.projectId = 'Select project'
    if (!formData.unitId) newErrors.unitId = 'Select unit'
    if (!formData.landlordId) newErrors.landlordId = 'Select landlord'
    if (!formData.profilePic) newErrors.profilePic = 'Profile image is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [imageLoading, setImageLoading] = useState(false)

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
    if (imageInputRefs.current[0]) {
      imageInputRefs.current[0].value = ''
    }
  }

  // 🔹 Submit Form
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    postRequest({
      url: 'tenants',
      cred: { ...formData, isActive: formData.isActive === 'on' && true },
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Tenant added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => {
        console.error('Error while adding tenant:', err)
        toast.error(err?.response?.data?.error || err?.message || 'Something went wrong')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 🔹 Edit Existing Tenant
  const handleEdit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const res = await putRequest({
        url: `tenants/${modalData._id}`,
        cred: { ...formData, isActive: formData.isActive === 'on' && true },
      })
      toast.success(res?.data?.message || 'Tenant updated successfully')
      setUpdateStatus((prev) => !prev)
      handleCancel()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Reset Modal
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
      // projectId: '',
      unitId: '',
      landlordId: '',
      billTo: 'tenant',
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
          {/* 🔹 Row 1: Site & Project */}
          <div className="row">
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
                  setFormData((p) => ({
                    ...p,
                    siteId: value,
                    projectId: '',
                    unitId: '',
                    landlordId: '',
                  }))
                  if (value) setErrors((prev) => ({ ...prev, siteId: '' })) // ✅ clear error
                }}
                options={sites.map((s) => ({ value: s._id, label: s.siteName }))}
                className={errors.siteId ? 'is-invalid w-100' : 'w-100'}
              />
              {errors.siteId && <div className="text-danger small">{errors.siteId}</div>}
            </div>

            {/* <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Project<span className="text-danger">*</span>
              </label>
              <Select
                showSearch
                allowClear
                placeholder="--Select Project--"
                value={formData.projectId || undefined}
                onChange={(value) => {
                  setFormData((p) => ({ ...p, projectId: value, unitId: '', landlordId: '' }))
                  if (value) setErrors((prev) => ({ ...prev, projectId: '' })) // ✅ clear error
                }}
                disabled={!formData.siteId}
                options={projects.map((p) => ({ value: p._id, label: p.projectName }))}
                className={errors.projectId ? 'is-invalid w-100' : 'w-100'}
              />
              {errors.projectId && <div className="text-danger small">{errors.projectId}</div>}
            </div> */}

            {/* 🔹 Row 2: Unit & Landlord */}

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Unit<span className="text-danger">*</span>
              </label>
              <Select
                showSearch
                allowClear
                placeholder="--Select Unit--"
                value={formData.unitId || undefined}
                onChange={(value) => {
                  setFormData((p) => ({ ...p, unitId: value, landlordId: '' }))
                  if (value) setErrors((prev) => ({ ...prev, unitId: '' })) // ✅ clear error
                }}
                disabled={!formData.siteId}
                options={units.map((u) => ({ value: u._id, label: u.unitNumber }))}
                className={errors.unitId ? 'is-invalid w-100' : 'w-100'}
              />
              {errors.unitId && <div className="text-danger small">{errors.unitId}</div>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Landlord<span className="text-danger">*</span>
              </label>
              <Select
                showSearch
                allowClear
                placeholder="--Select Landlord--"
                value={formData.landlordId || undefined}
                onChange={(value) => {
                  setFormData((p) => ({ ...p, landlordId: value }))
                  if (value) setErrors((prev) => ({ ...prev, landlordId: '' })) // ✅ clear error
                }}
                disabled={!formData.unitId}
                options={landlords.map((l) => ({ value: l._id, label: l.name }))}
                className={errors.landlordId ? 'is-invalid w-100' : 'w-100'}
              />
              {errors.landlordId && <div className="text-danger small">{errors.landlordId}</div>}
            </div>

            {/* 🔹 Row 3: Name & Email */}

            <div className="col-md-6 mb-3">
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

            <div className="col-md-6 mb-3">
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

            {/* 🔹 Row 4: Phone & Address */}

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Phone<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => {
                  if (!/^\d{10}$/.test(formData.phone))
                    setErrors((prev) => ({ ...prev, phone: 'Phone must be exactly 10 digits' }))
                }}
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="col-md-6 mb-3">
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

            {/* 🔹 Row 5: Profile Pic & Bill To */}

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Profile Image<span className="text-danger">*</span>
              </label>

              <input
                type="file"
                className={`form-control ${errors.profilePic ? 'is-invalid' : ''}`}
                onChange={handleImageUpload}
                disabled={imageLoading} // disable only during upload
                ref={(el) => (imageInputRefs.current[0] = el)}
              />
              {errors.profilePic && <div className="invalid-feedback">{errors.profilePic}</div>}

              {/* 🔹 Preview with loader */}
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

                  {/* 🔹 Loader overlay */}
                  {imageLoading && (
                    <div
                      className="position-absolute top-50 start-50 translate-middle"
                      style={{
                        background: 'rgba(255,255,255,0.6)',
                        width: 60,
                        height: 60,
                        borderRadius: 6,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div className="spinner-border text-primary spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                  {/* 🔹 Remove button */}
                  {!imageLoading && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      style={{ lineHeight: '10px', padding: '2px 6px' }}
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3 ">
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

            <div className="col-md-6 mb-3 ">
              <label className="form-label fw-bold">&nbsp;</label>
              <div className="d-flex align-items-center gap-4 mt-2"></div>
              <div className="form-check">
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
          <div className="d-flex justify-content-end gap-2">
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
