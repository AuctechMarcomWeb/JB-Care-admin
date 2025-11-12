/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getRequest, postRequest, putRequest } from '../../../Helpers'

const UnitModal = ({ setUpdateStatus, setModalData, modalData, isModalOpen, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [site, setSite] = useState([])
  // const [project, setProject] = useState([])
  const [unitType, setunitType] = useState([])

  const [formData, setFormData] = useState({
    unitNumber: '',
    block: '',
    floor: '',
    areaSqFt: '',
    siteId: '',
    // projectId: '',
    unitTypeId: '',
    status: true,
  })
  console.log('formData', formData)

  useEffect(() => {
    getRequest(`sites?isPagination=false`)
      .then((res) => {
        setSite(res?.data?.data?.sites || [])
      })
      .catch((error) => {
        console.log('Error fetching sites:', error)
      })

    getRequest(`unit-types?isPagination=false`)
      .then((res) => {
        setunitType(res?.data?.data?.unitTypes || [])
      })
      .catch((error) => {
        console.log('Error fetching unit types:', error)
      })
  }, [])

  // useEffect(() => {
  //   if (formData?.siteId) {
  //     getRequest(`projects?isPagination=false&siteId=${formData.siteId}`)
  //       .then((res) => {
  //         setProject(res?.data?.data?.projects || [])
  //       })
  //       .catch((error) => {
  //         console.log('Error fetching projects:', error)
  //       })
  //   } else {
  //     setProject([])
  //     setFormData((prev) => ({ ...prev, projectId: '' }))
  //   }
  // }, [formData?.siteId])

  //  Pre-fill form if editing

  useEffect(() => {
    if (modalData) {
      setFormData({
        unitNumber: modalData?.unitNumber || '',
        block: modalData?.block || '',
        floor: modalData?.floor || '',
        areaSqFt: modalData?.areaSqFt || '',
        siteId: modalData?.siteId?._id || '',
        // projectId: modalData?.projectId?._id || '',
        unitTypeId: modalData?.unitTypeId?._id || '',
        status: modalData?.status ?? true,
      })
    } else {
      setFormData({
        unitNumber: '',
        block: '',
        floor: '',
        areaSqFt: '',
        siteId: '',
        // projectId: '',
        unitTypeId: '',
        status: true,
      })
    }
  }, [modalData])

  const handleCancel = () => {
    setFormData({
      unitNumber: '',
      block: '',
      floor: '',
      areaSqFt: '',
      siteId: '',
      // projectId: '',
      unitTypeId: '',
      status: true,
    })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // 🔹 Clear field-specific error when user starts typing or toggling
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // Validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData?.unitNumber) newErrors.unitNumber = 'Unit Number is required'
    if (!formData?.block) newErrors.block = 'Block is required'
    // if (!formData?.floor) newErrors.floor = 'Floor is required'
    if (!formData?.areaSqFt) newErrors.areaSqFt = 'Area is required'
    if (!formData?.siteId) newErrors.siteId = 'Site is required'
    // if (!formData?.projectId) newErrors.projectId = 'Project is required'
    if (!formData?.unitTypeId) newErrors.unitTypeId = 'Unit Type is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  //  Add new unit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    postRequest({
      url: 'units',
      cred: formData,
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Unit added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  // Update existing unit
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    putRequest({
      url: `units/${modalData?._id}`,
      cred: formData,
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Unit updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  const siteOption = site?.map((item) => (
    <option key={item?._id} value={item?._id}>
      {item?.siteName}
    </option>
  ))

  // const projectOption = project?.map((item) => (
  //   <option key={item?._id} value={item?._id}>
  //     {item?.projectName}
  //   </option>
  // ))

  const unitTypeOption = unitType?.map((item) => (
    <option key={item?._id} value={item?._id}>
      {item?.title}
    </option>
  ))

  return (
    <Modal
      title={modalData ? 'Edit Unit' : 'Add Unit'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        <div className="row">
          {/* Site Dropdown */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Select Site<span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors?.siteId ? 'is-invalid' : ''}`}
              name="siteId"
              value={formData?.siteId}
              onChange={handleChange}
            >
              <option value="">Select Site</option>
              {siteOption}
            </select>
            {errors?.siteId && <div className="invalid-feedback">{errors?.siteId}</div>}
          </div>

          {/* Project Dropdown  */}
          {/* <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Select Project<span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors.projectId ? 'is-invalid' : ''}`}
              name="projectId"
              value={formData?.projectId}
              onChange={handleChange}
              disabled={!formData?.siteId}
            >
              <option value="">Select Project</option>
              {projectOption}
            </select>
            {errors?.projectId && <div className="invalid-feedback">{errors?.projectId}</div>}
          </div> */}

          {/* Unit Type */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Select Unit Type<span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${errors?.unitTypeId ? 'is-invalid' : ''}`}
              name="unitTypeId"
              value={formData?.unitTypeId}
              onChange={handleChange}
            >
              <option value="">Select Unit Type</option>
              {unitTypeOption}
            </select>
            {errors?.unitTypeId && <div className="invalid-feedback">{errors?.unitTypeId}</div>}
          </div>

          {/* Unit Details */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Unit Number<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.unitNumber ? 'is-invalid' : ''}`}
              name="unitNumber"
              value={formData?.unitNumber}
              onChange={handleChange}
            />
            {errors?.unitNumber && <div className="invalid-feedback">{errors?.unitNumber}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Block<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.block ? 'is-invalid' : ''}`}
              name="block"
              value={formData?.block}
              onChange={handleChange}
            />
            {errors?.block && <div className="invalid-feedback">{errors?.block}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Floor<span className="text-danger"></span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.floor ? 'is-invalid' : ''}`}
              name="floor"
              value={formData?.floor}
              onChange={handleChange}
            />
            {errors?.floor && <div className="invalid-feedback">{errors?.floor}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Area (SqFt)<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.areaSqFt ? 'is-invalid' : ''}`}
              name="areaSqFt"
              value={formData?.areaSqFt}
              onChange={handleChange}
            />
            {errors?.areaSqFt && <div className="invalid-feedback">{errors?.areaSqFt}</div>}
          </div>

          {/* Status */}
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
                : 'Update Unit'
              : loading
                ? 'Saving...'
                : 'Save Unit'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default UnitModal
