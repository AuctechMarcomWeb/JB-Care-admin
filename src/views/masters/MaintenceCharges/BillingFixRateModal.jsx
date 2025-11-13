/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Modal, Spin, Switch } from 'antd'
import toast from 'react-hot-toast'
import { postRequest, putRequest } from '../../../Helpers'

const BillingFixRateModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedRate,
  refresh,
  setUpdateStatus,
}) => {
  const [formData, setFormData] = useState({
    rateType: 'fixed',
    rateValue: '',
    gstPercent: '',
    description: '',
    overwriteExisting: false,
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // 🔹 Prefill form if editing
  useEffect(() => {
    if (selectedRate) {
      setFormData({
        rateType: selectedRate?.rateType || 'fixed',
        rateValue: selectedRate?.rateValue || '',
        gstPercent: selectedRate?.gstPercent || '',
        description: selectedRate?.description || '',
        overwriteExisting: selectedRate?.overwriteExisting || false,
      })
    } else {
      resetForm()
    }
  }, [selectedRate, isModalOpen])

  const resetForm = () => {
    setFormData({
      rateType: '',
      rateValue: '',
      gstPercent: '',
      description: '',
      overwriteExisting: false,
    })
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    setIsModalOpen(false)
  }

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 🔹 Validate before submitting
  const validateForm = () => {
    const newErrors = {}
    if (!formData.rateValue) newErrors.rateValue = 'Rate value is required'
    if (!formData.gstPercent) newErrors.gstPercent = 'GST percent is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 Submit form (add/edit)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    const apiCall = selectedRate
      ? putRequest({ url: `maintain-charges/${selectedRate._id}`, cred: formData })
      : postRequest({ url: `maintain-charges/min-fix-charges`, cred: formData })

    apiCall
      .then((res) => {
        toast.success(res?.data?.message || 'Rate saved successfully')
        refresh()
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Failed to save'))
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={selectedRate ? 'Edit Billing Rate' : 'Add Billing Rate'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
      zIndex={2000}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          {/* 🔹 Rate Type (Dynamic Capitalization) */}
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
              {['fixed', 'per_sqft'].map((type) => (
                <option key={type} value={type}>
                  {type
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Rate Value */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Rate Value <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.rateValue ? 'is-invalid' : ''}`}
              placeholder="Enter rate value"
              name="rateValue"
              value={formData.rateValue}
              onChange={handleChange}
            />
            {errors.rateValue && <div className="text-danger small">{errors.rateValue}</div>}
          </div>

          {/* 🔹 GST Percent */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              GST Percent (%) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.gstPercent ? 'is-invalid' : ''}`}
              placeholder="Enter GST percent"
              name="gstPercent"
              value={formData.gstPercent}
              onChange={handleChange}
            />
            {errors.gstPercent && <div className="text-danger small">{errors.gstPercent}</div>}
          </div>

          {/* 🔹 Description */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea
              className="form-control"
              rows={1}
              placeholder="Enter description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* 🔹 Last Row (Two Columns, Toggle inline before text) */}
          <div className="row">
            <div className="col-md-6 mb-3 d-flex align-items-center">
              <Switch
                checked={formData.overwriteExisting}
                onChange={(checked) => setFormData({ ...formData, overwriteExisting: checked })}
              />
              <label className="fw-semibold text-secondary ms-2 mb-0">Overwrite Existing</label>
            </div>
            <div className="col-md-6 mb-3"></div>
          </div>
        </div>

        {/* 🔹 Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn bg-amber-200 text-black" disabled={loading}>
            {loading ? 'Saving...' : selectedRate ? 'Update Rate' : 'Save Rate'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default BillingFixRateModal
