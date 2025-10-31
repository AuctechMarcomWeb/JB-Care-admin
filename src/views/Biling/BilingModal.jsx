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

  // Fetch all sites
  useEffect(() => {
    getRequest('sites?isPagination=false')
      .then((res) => setSites(res?.data?.data?.sites || []))
      .catch(() => toast.error('Failed to load sites'))
  }, [])

  // Fetch units when site selected
  useEffect(() => {
    if (formData?.siteId) {
      getRequest(`units?isPagination=false&siteId=${formData?.siteId}`)
        .then((res) => setUnits(res?.data?.data?.units || []))
        .catch(() => toast.error('Failed to load units'))
    } else {
      setUnits([])
      setFormData((prev) => ({ ...prev, unitId: '', landlordId: '' }))
      setLandlords([])
    }
  }, [formData?.siteId])

  // Fetch landlords when unit selected
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

  //  Load modal data in edit mode
  useEffect(() => {
    if (modalData) {
      setFormData({
        siteId: modalData?.siteId?._id || '',
        unitId: modalData?.unitId?._id || '',
        landlordId: modalData?.landlordId?._id || '',
        billingCycle: modalData?.billingCycle || '',
        status: modalData?.status || '',
      })
    } else {
      resetForm()
    }
  }, [modalData])

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

  //  Validate (only status required in edit mode)
  const validateForm = () => {
    const newErrors = {}
    if (!modalData) {
      if (!formData?.siteId) newErrors.siteId = 'Site is required'
      if (!formData?.unitId) newErrors.unitId = 'Unit is required'
      if (!formData?.landlordId) newErrors.landlordId = 'Landlord is required'
      if (!formData?.billingCycle) newErrors.billingCycle = 'Billing cycle is required'
    } else {
      if (!formData?.status) newErrors.status = 'Status is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  //  Submit - Add new billing
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
      .catch((error) => toast.error(error?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  //  Submit - Edit (only status update)
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    const payload = {
      status: formData?.status,
    }

    putRequest({ url: `maintenance-bill/${modalData?._id}`, cred: payload })
      .then((res) => {
        toast.success(res?.data?.message || 'Billing status updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => toast.error(error?.response?.data?.message || 'Something went wrong'))
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={modalData ? 'Update Billing Status' : 'Add Billing Record'}
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
              <label className="form-label fw-bold">Site</label>
              <Select
                value={formData?.siteId || undefined}
                options={sites?.map((s) => ({ value: s._id, label: s.siteName }))}
                className="w-100"
                disabled={!!modalData}
                placeholder="-- Select Site --"
              />
            </div>

            {/* 🔹 Unit */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Unit</label>
              <Select
                value={formData?.unitId || undefined}
                options={units?.map((u) => ({ value: u._id, label: u.unitNumber }))}
                className="w-100"
                disabled={!!modalData || !formData.siteId}
                placeholder="-- Select Unit --"
              />
            </div>

            {/* 🔹 Landlord */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Landlord</label>
              <Select
                value={formData?.landlordId || undefined}
                options={landlords?.map((l) => ({ value: l._id, label: l.name }))}
                className="w-100"
                disabled={!!modalData || !formData.unitId}
                placeholder="-- Select Landlord --"
              />
            </div>

            {/* 🔹 Billing Cycle */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Billing Cycle</label>
              <select
                name="billingCycle"
                value={formData?.billingCycle}
                onChange={handleChange}
                className="form-select"
                disabled={!!modalData}
              >
                <option value="">-- Select Billing Cycle --</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>

            {/* 🔹 Status (only in edit mode) */}
            {modalData && (
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">
                  Status<span className="text-danger">*</span>
                </label>
                <select
                  name="status"
                  value={formData?.status}
                  onChange={handleChange}
                  className={`form-select ${errors?.status ? 'is-invalid' : ''}`}
                >
                  <option value="">-- Select Status --</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
                {errors?.status && <div className="invalid-feedback">{errors.status}</div>}
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
