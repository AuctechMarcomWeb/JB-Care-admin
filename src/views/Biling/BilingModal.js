/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal, Select, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getRequest, postRequest, putRequest } from '../../Helpers'
import { useBillingContext } from '../../context/bilingContext'

const BilingModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
  landlordId, // optional: for BillingDetails page
}) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [sites, setSites] = useState([])
  const [units, setUnits] = useState([])
  const [landlords, setLandlords] = useState([])
  const { setSelectedBill } = useBillingContext()
  const [formData, setFormData] = useState({
    siteId: '',
    unitId: '',
    landlordId: '',
    fromDate: '',
    toDate: '',
    electricityAmount: '',
    maintenanceAmount: '',
    gstAmount: '',
    totalAmount: '',
    billingAmount: '',
    status: '',
    paymentId: '',
    paidAt: '',
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

  // 🔹 Prefill for Edit Mode or New
  useEffect(() => {
    if (modalData) {
      setFormData({
        siteId: modalData?.siteId?._id || modalData?.siteId || '',
        unitId: modalData?.unitId?._id || modalData?.unitId || '',
        landlordId: modalData?.landlordId?._id || modalData?.landlordId || '',
        fromDate: modalData?.fromDate?.split('T')[0] || '',
        toDate: modalData?.toDate?.split('T')[0] || '',
        electricityAmount: modalData?.electricityAmount || '',
        maintenanceAmount: modalData?.maintenanceAmount || '',
        gstAmount: modalData?.gstAmount || '',
        totalAmount: modalData?.totalAmount || '',
        billingAmount: modalData?.billingAmount || '',
        status: modalData?.status || '',
        paymentId: modalData?.paymentId || '',
        paidAt: modalData?.paidAt ? modalData?.paidAt.split('T')[0] : '',
      })
    } else {
      resetForm()
      if (landlordId) {
        setFormData((prev) => ({ ...prev, landlordId }))
      }
    }
  }, [modalData, landlordId])

  const resetForm = () => {
    setFormData({
      siteId: '',
      unitId: '',
      landlordId: '',
      fromDate: '',
      toDate: '',
      electricityAmount: '',
      maintenanceAmount: '',
      gstAmount: '',
      totalAmount: '',
      billingAmount: '',
      status: '',
      paymentId: '',
      paidAt: '',
    })
    setErrors({})
  }

  const handleCancel = () => {
    resetForm()
    setModalData(null)
    setIsModalOpen(false)
  }

  // 🔹 Real-time validation
  const validateField = (name, value) => {
    let error = ''
    const requiredFields = [
      'siteId',
      'unitId',
      'landlordId',
      'fromDate',
      'toDate',
      'electricityAmount',
      'maintenanceAmount',
      'gstAmount',
      'totalAmount',
      'billingAmount',
      'status',
    ]
    if (requiredFields.includes(name) && !value) {
      error = `${name.replace(/([A-Z])/g, ' $1')} is required`
    }
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  // 🔹 Validate all required fields before submit
  const validateForm = () => {
    const newErrors = {}
    const requiredFields = [
      'siteId',
      'unitId',
      'landlordId',
      'fromDate',
      'toDate',
      'electricityAmount',
      'maintenanceAmount',
      'gstAmount',
      'totalAmount',
      'billingAmount',
      'status',
    ]
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required`
    })
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

    postRequest({ url: 'billing', cred: payload })
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
      isActive: formData.isActive === 'on' && 'true',
    }

    putRequest({ url: `billing/${modalData._id}`, cred: payload })
      .then((res) => {
        toast.success(res?.data?.message || 'Landlord updated successfully')
        const updatedData = res?.data?.data || {}
        console.log('updatedData', res)

        setSelectedBill((prev) => ({
          ...prev,
          billingTillToday: updatedData.billingTillToday ?? prev.billingTillToday,
          previousUnpaidBill: updatedData.previousUnpaidBill ?? prev.previousUnpaidBill,
        }))
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  // 🔹 Auto-calculate totalAmount and billingAmount
  useEffect(() => {
    const electricity = parseFloat(formData.electricityAmount) || 0
    const maintenance = parseFloat(formData.maintenanceAmount) || 0
    const gst = parseFloat(formData.gstAmount) || 0

    const total = electricity + maintenance + gst
    setFormData((prev) => ({
      ...prev,
      totalAmount: total.toFixed(2),
      billingAmount: total.toFixed(2),
    }))
  }, [formData.electricityAmount, formData.maintenanceAmount, formData.gstAmount])

  return (
    <Modal
      title={modalData ? 'Edit Billing Record' : 'Add Billing Record'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      width={700}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        <div className="row">
          {/* 🔹 Site */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Site *</label>
            <Select
              value={formData.siteId || undefined}
              options={sites.map((s) => ({ value: s._id, label: s.siteName }))}
              className="w-100"
              placeholder="Select Site"
              disabled={!!modalData}
              onChange={(value) => handleSelectChange('siteId', value)}
              size="large"
            />
            {errors.siteId && <div className="text-danger small">{errors.siteId}</div>}
          </div>

          {/* 🔹 Unit */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Unit *</label>
            <Select
              value={formData.unitId || undefined}
              options={units.map((u) => ({ value: u._id, label: u.unitNumber }))}
              className="w-100"
              placeholder="Select Unit"
              disabled={!!modalData}
              onChange={(value) => handleSelectChange('unitId', value)}
              size="large"
            />
            {errors.unitId && <div className="text-danger small">{errors.unitId}</div>}
          </div>

          {/* 🔹 Landlord */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Landlord *</label>
            <Select
              value={formData.landlordId || undefined}
              options={landlords.map((l) => ({ value: l._id, label: l.name }))}
              className="w-100"
              placeholder="Select Landlord"
              disabled={!!modalData || !!landlordId}
              onChange={(value) => handleSelectChange('landlordId', value)}
              size="large"
            />
            {errors.landlordId && <div className="text-danger small">{errors.landlordId}</div>}
          </div>

          {/* 🔹 Dates */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">From Date *</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`}
            />
            {errors.fromDate && <div className="text-danger small">{errors.fromDate}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">To Date *</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className={`form-control ${errors.toDate ? 'is-invalid' : ''}`}
            />
            {errors.toDate && <div className="text-danger small">{errors.toDate}</div>}
          </div>

          {/* 🔹 Amount Fields */}
          {[
            { key: 'electricityAmount', label: 'Electricity Amount' },
            { key: 'maintenanceAmount', label: 'Maintenance Amount' },
            { key: 'gstAmount', label: 'GST Amount' },
            { key: 'totalAmount', label: 'Total Amount', readOnly: true },
            { key: 'billingAmount', label: 'Billing Amount', readOnly: true },
          ].map(({ key, label, readOnly }) => (
            <div key={key} className="col-md-6 mb-3">
              <label className="form-label fw-bold">{label} *</label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className={`form-control ${errors[key] ? 'is-invalid' : ''}`}
                placeholder={`Enter ${label}`}
                readOnly={readOnly}
              />
              {errors[key] && <div className="text-danger small">{errors[key]}</div>}
            </div>
          ))}

          {/* 🔹 Status */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`form-select ${errors.status ? 'is-invalid' : ''}`}
            >
              <option value="">Select</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            {errors.status && <div className="text-danger small">{errors.status}</div>}
          </div>

          {/* 🔹 Payment Details */}
          {formData.status === 'Paid' && (
            <>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Payment ID</label>
                <input
                  type="text"
                  name="paymentId"
                  value={formData.paymentId}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Payment ID"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Payment Date</label>
                <input
                  type="date"
                  name="paidAt"
                  value={formData.paidAt}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </>
          )}
        </div>

        {/* 🔹 Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : modalData ? 'Update Bill' : 'Save Bill'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default BilingModal
