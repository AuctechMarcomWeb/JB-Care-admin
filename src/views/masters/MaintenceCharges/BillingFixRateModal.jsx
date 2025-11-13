/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Modal, Spin } from 'antd'
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
      rateType: 'fixed',
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
        refresh() // refresh table
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch(() => toast.error(err?.response?.data?.message || 'Failed to save'))
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={selectedRate ? 'Edit Fixed Billing Rate' : 'Add Fixed Billing Rate'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
      zIndex={2000}
    >
      <Spin spinning={loading}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            {/* 🔹 Rate Value */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Rate Value *</label>
              <input
                type="number"
                className={`form-control ${errors.rateValue ? 'is-invalid' : ''}`}
                placeholder="Enter rate value"
                value={formData.rateValue}
                onChange={(e) => setFormData({ ...formData, rateValue: e.target.value })}
              />
              {errors.rateValue && <div className="text-danger small">{errors.rateValue}</div>}
            </div>

            {/* 🔹 GST Percent */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">GST Percent (%) *</label>
              <input
                type="number"
                className={`form-control ${errors.gstPercent ? 'is-invalid' : ''}`}
                placeholder="Enter GST percent"
                value={formData.gstPercent}
                onChange={(e) => setFormData({ ...formData, gstPercent: e.target.value })}
              />
              {errors.gstPercent && <div className="text-danger small">{errors.gstPercent}</div>}
            </div>

            {/* 🔹 Description */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* 🔹 Overwrite Existing */}
            <div className="col-md-12 mb-3 d-flex align-items-center gap-2">
              <input
                type="checkbox"
                checked={formData.overwriteExisting}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overwriteExisting: e.target.checked,
                  })
                }
              />
              <label className="fw-semibold text-secondary">Overwrite Existing</label>
            </div>
          </div>

          {/* 🔹 Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : selectedRate ? 'Update Rate' : 'Save Rate'}
            </button>
          </div>
        </form>
      </Spin>
    </Modal>
  )
}

export default BillingFixRateModal
