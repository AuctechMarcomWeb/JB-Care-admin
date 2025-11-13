/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal, Select, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getRequest, postRequest, putRequest } from '../../../Helpers'
import { IndianRupee } from 'lucide-react'

const MaintenceChargesModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [sites, setSites] = useState([])
  const [units, setUnits] = useState([])

  const [formData, setFormData] = useState({
    siteId: '',
    unitId: '',
    rateType: 'per_sqft',
    rateValue: '',
    gstPercent: 18,
    effectiveFrom: '',
    isActive: true,
  })

  // 🟢 Fetch all sites
  useEffect(() => {
    getRequest('sites?isPagination=false')
      .then((res) => setSites(res?.data?.data?.sites || []))
      .catch(() => toast.error('Failed to load sites'))
  }, [])

  // 🟢 Fetch units based on selected site
  useEffect(() => {
    if (formData?.siteId) {
      getRequest(`units?isPagination=false&siteId=${formData?.siteId}`)
        .then((res) => setUnits(res?.data?.data?.units || []))
        .catch(() => toast.error('Failed to load units'))
    } else {
      setUnits([])
      setFormData((prev) => ({ ...prev, unitId: '' }))
    }
  }, [formData?.siteId])

  // 🟢 Load modal data for edit mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        siteId: modalData?.siteId?._id || '',
        unitId: modalData?.unitId?._id || '',
        rateType: modalData?.rateType || 'per_sqft',
        rateValue: modalData?.rateValue || '',
        gstPercent: modalData?.gstPercent ?? 18,
        effectiveFrom: modalData?.effectiveFrom || '',
        isActive: modalData?.isActive ?? true,
      })
    } else {
      resetForm()
    }
  }, [modalData])
  // 🟢 Reset form
  const resetForm = () => {
    setFormData({
      siteId: '',
      unitId: '',
      rateType: 'per_sqft',
      rateValue: '',
      gstPercent: 18,
      effectiveFrom: '',
      isActive: true,
    })
    setErrors({})
  }

  // 🟢 Close modal
  const handleCancel = () => {
    resetForm()
    setModalData(null)
    setIsModalOpen(false)
  }

  // 🟢 Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // 🟢 Validate form
  const validateForm = () => {
    const newErrors = {}
    if (!formData?.siteId) newErrors.siteId = 'Site is required'
    if (!formData?.unitId) newErrors.unitId = 'Unit is required'
    if (!formData?.rateValue) newErrors.rateValue = 'Rate value is required'
    if (!formData?.effectiveFrom) newErrors.effectiveFrom = 'Effective date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🟢 Add
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    postRequest({ url: 'maintain-charges', cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Maintenance charge added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 🟢 Edit
  const handleEdit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    putRequest({ url: `maintain-charges/${modalData?._id}`, cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Maintenance charge updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal
      title={modalData ? 'Edit Maintenance Charges' : 'Add Maintenance Charges'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        <div className="row">
          {/* 🔹 Site Dropdown */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Site<span className="text-danger">*</span>
            </label>
            <Select
              showSearch
              allowClear
              size="large"
              placeholder="-- Select Site --"
              value={formData?.siteId || undefined}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, siteId: value }))
                if (errors?.siteId) setErrors((prev) => ({ ...prev, siteId: '' }))
              }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={sites?.map((s) => ({
                value: s?._id,
                label: s?.siteName,
              }))}
              className={`w-100 ${errors?.siteId ? 'is-invalid' : ''}`}
            />
            {errors?.siteId && <div className="invalid-feedback d-block">{errors.siteId}</div>}
          </div>

          {/* 🔹 Unit Dropdown */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Unit<span className="text-danger">*</span>
            </label>
            <Select
              showSearch
              allowClear
              placeholder="-- Select Unit --"
              value={formData?.unitId || undefined}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, unitId: value }))
                if (errors?.unitId) setErrors((prev) => ({ ...prev, unitId: '' }))
              }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={units?.map((u) => ({
                value: u?._id,
                label: u?.unitNumber,
              }))}
              className={`w-100 ${errors?.unitId ? 'is-invalid' : ''}`}
              disabled={!formData?.siteId}
              size="large"
            />
            {errors?.unitId && <div className="invalid-feedback d-block">{errors.unitId}</div>}
          </div>

          {/* 🔹 Rate Type */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Rate Type<span className="text-danger">*</span>
            </label>
            <select
              name="rateType"
              value={formData?.rateType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Type</option>
              <option value="per_sqft">Per Sqft</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          {/* 🔹 Rate Value */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Rate(
              <IndianRupee className="w-4 h-4 inline" />)<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="rateValue"
              min="0"
              value={formData?.rateValue === 0 ? '' : formData?.rateValue}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || Number(value) >= 0) {
                  setFormData((prev) => ({
                    ...prev,
                    rateValue: value === '' ? '' : Number(value),
                  }))
                  if (errors?.rateValue) setErrors((prev) => ({ ...prev, rateValue: '' }))
                }
              }}
              className={`form-control ${errors?.rateValue ? 'is-invalid' : ''}`}
            />
            {errors?.rateValue && <div className="invalid-feedback">{errors.rateValue}</div>}
          </div>

          {/* 🔹 GST Percent */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">GST Percent</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="gstPercent"
                value={formData?.gstPercent !== '' ? `${formData?.gstPercent}` : ''}
                onChange={(e) => {
                  let value = e.target.value.replace('%', '')
                  if (/^\d*\.?\d*$/.test(value)) {
                    const num = Number(value)
                    if (num >= 0 && num <= 100) {
                      setFormData((prev) => ({ ...prev, gstPercent: num }))
                    } else if (value === '') {
                      setFormData((prev) => ({ ...prev, gstPercent: '' }))
                    }
                  }
                }}
                className="form-control"
                style={{ paddingRight: '25px' }}
                placeholder="Enter GST (e.g., 18)"
              />
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#555',
                }}
              >
                %
              </span>
            </div>
          </div>

          {/* 🔹 Effective From */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Date<span className="text-danger">*</span>
            </label>
            <input
              type="date"
              name="effectiveFrom"
              value={formData?.effectiveFrom?.slice(0, 10) || ''}
              onChange={handleChange}
              className={`form-control ${errors?.date ? 'is-invalid' : ''}`}
            />
            {errors?.effectiveFrom && (
              <div className="invalid-feedback">{errors.effectiveFrom}</div>
            )}
          </div>

          {/* 🔹 Active Checkbox */}
          <div className="col-md-6 mb-3 d-flex align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                checked={formData?.isActive}
                onChange={handleChange}
                id="isActive"
              />
              <label className="form-check-label" htmlFor="isActive">
                Active
              </label>
            </div>
          </div>
        </div>

        {/* 🔹 Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn bg-amber-200 text-black" disabled={loading}>
            {modalData
              ? loading
                ? 'Updating...'
                : 'Update Maintenance Charges'
              : loading
                ? 'Saving...'
                : 'Save Maintenance Charges'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default MaintenceChargesModal
