/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal, Select, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getRequest, postRequest, putRequest } from '../../Helpers'

const BilingModal = ({ setUpdateStatus, setModalData, modalData, isModalOpen, setIsModalOpen }) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [sites, setSites] = useState([])
  const [units, setUnits] = useState([])
  const [landlords, setLandlords] = useState([])

  const [formData, setFormData] = useState({
    siteId: '',
    unitId: '',
    landlordId: '',
    billingCycle: '',
    status: '',
  })

  // 🔹 Fetch sites
  useEffect(() => {
    if (isModalOpen) {
      getRequest('sites?isPagination=false')
        .then((res) => setSites(res?.data?.data?.sites || []))
        .catch(() => toast.error('Failed to load sites'))
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
      .catch(() => toast.error('Failed to load units'))
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
      .catch(() => toast.error('Failed to load landlords'))
  }, [formData.unitId])

  // 🔹 Prefill for Edit Mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        siteId: modalData?.siteId || '',
        unitId: modalData?.unitId || '',
        landlordId: modalData?.landlordId || '',
        billingCycle: modalData?.billingCycle || 'monthly',
        status: modalData?.status || 'Paid',
      })
    } else {
      resetForm()
    }
  }, [modalData])
  console.log('sites', sites)

  console.log('dfsfgdfdf', modalData?.billingCycle)

  // 🔹 Reset form
  const resetForm = () => {
    setFormData({
      siteId: '',
      unitId: '',
      landlordId: '',
      billingCycle: '',
      status: '',
    })
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    setModalData(null)
    setIsModalOpen(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = {}
    if (!modalData) {
      if (!formData.siteId) newErrors.siteId = 'Site is required'
      if (!formData.unitId) newErrors.unitId = 'Unit is required'
      if (!formData.landlordId) newErrors.landlordId = 'Landlord is required'
      if (!formData.billingCycle) newErrors.billingCycle = 'Billing cycle is required'
    } else {
      if (!formData.status) newErrors.status = 'Status is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 Submit (Add New)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    postRequest({ url: 'maintenance-bill/generate', cred: formData })
      .then((res) => {
        toast.success(res?.data?.message || 'Billing record added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  // 🔹 Edit (Update Status Only)
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    putRequest({
      url: `maintenance-bill/${modalData?._id}`,
      cred: { status: formData.status },
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Status updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={modalData ? 'Edit Billing Status' : 'Add Billing Record'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      width={700}
    >
      <Spin spinning={loading}>
        <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
          <div className="row">
            {/* 🔹 Site */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Site<span className="text-danger">*</span>
              </label>
              <Select
                value={formData.siteId || undefined}
                options={sites.map((s) => ({ value: s._id, label: s.siteName }))}
                className={`w-100 ${errors.siteId ? 'is-invalid' : ''}`}
                placeholder="Select Site"
                onChange={(value) => {
                  setFormData((p) => ({
                    ...p,
                    siteId: value,
                    unitId: '',
                    landlordId: '',
                  }))
                  if (value) setErrors((prev) => ({ ...prev, siteId: '' }))
                }}
              />
              {errors.siteId && <div className="text-danger small">{errors.siteId}</div>}
            </div>

            {/* 🔹 Unit */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Unit<span className="text-danger">*</span>
              </label>
              <Select
                value={formData.unitId || undefined}
                options={units.map((u) => ({ value: u._id, label: u.unitNumber }))}
                className={`w-100 ${errors.unitId ? 'is-invalid' : ''}`}
                disabled={!formData.siteId}
                placeholder="-- Select Unit --"
                onChange={(value) => {
                  setFormData((p) => ({
                    ...p,
                    unitId: value,
                    landlordId: '',
                  }))
                  if (value) setErrors((prev) => ({ ...prev, unitId: '' }))
                }}
              />
              {errors.unitId && <div className="text-danger small">{errors.unitId}</div>}
            </div>

            {/* 🔹 Landlord */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Landlord<span className="text-danger">*</span>
              </label>
              <Select
                value={formData.landlordId || undefined}
                options={landlords.map((l) => ({ value: l._id, label: l.name }))}
                className={`w-100 ${errors.landlordId ? 'is-invalid' : ''}`}
                disabled={!formData.unitId}
                placeholder="-- Select Landlord --"
                onChange={(value) => {
                  setFormData((p) => ({ ...p, landlordId: value }))
                  if (value) setErrors((prev) => ({ ...prev, landlordId: '' }))
                }}
              />
              {errors.landlordId && <div className="text-danger small">{errors.landlordId}</div>}
            </div>

            {/* 🔹 Billing Cycle */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Billing Cycle<span className="text-danger">*</span>
              </label>
              <select
                name="billingCycle"
                value={formData?.billingCycle}
                onChange={handleChange}
                className={`form-select ${errors.billingCycle ? 'is-invalid' : ''}`}
              >
                <option value="">Select Billing Cycle</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
              {errors.billingCycle && <div className="invalid-feedback">{errors.billingCycle}</div>}
            </div>

            {/* 🔹 Status (Edit Mode Only) */}
            {modalData && (
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">
                  Status<span className="text-danger">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
              </div>
            )}
          </div>

          {/* 🔹 Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {modalData
                ? loading
                  ? 'Updating...'
                  : 'Update Status'
                : loading
                  ? 'Saving...'
                  : 'Save Billing'}
            </button>
          </div>
        </form>
      </Spin>
    </Modal>
  )
}

export default BilingModal
