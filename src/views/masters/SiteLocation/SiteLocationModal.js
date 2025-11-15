/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fileUpload, postRequest, putRequest } from '../../../Helpers'

const SiteLocationModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [formData, setFormData] = useState(
    modalData
      ? {
          ...modalData,
        }
      : {
          siteName: '',
          siteAddress: '',
          status: true,
        },
  )
  console.log('form Data', formData)

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // 🔹 Close modal
  const handleCancel = () => {
    setFormData({ siteName: '', siteAddress: '', status: true })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // 🔹 Validate form
  const validateForm = () => {
    const newErrors = {}
    if (!formData?.siteName.trim()) newErrors.siteName = 'Site Name is required'
    if (!formData?.siteAddress.trim()) newErrors.siteAddress = 'Site Address is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 🔹 Submit handlers
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    putRequest({
      url: `sites/${modalData?._id}`,
      cred: { ...formData },
    })
      .then((res) => {
        toast.success(res?.data?.message || ' Site Location updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    postRequest({ url: `sites`, cred: { ...formData } })
      .then((res) => {
        toast.success(res?.data?.message || 'Site Location added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
  }

  return (
    <Modal
      title={modalData ? `Edit Site Location` : `Add Site Location`}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Site Name<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.siteName ? 'is-invalid' : ''}`}
            name="siteName"
            value={formData?.siteName}
            onChange={handleChange}
          />
          {errors?.siteName && <div className="invalid-feedback">{errors?.siteName}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Site Address<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.siteAddress ? 'is-invalid' : ''}`}
            name="siteAddress"
            value={formData?.siteAddress}
            onChange={handleChange}
          />
          {errors?.siteAddress && <div className="invalid-feedback">{errors?.siteAddress}</div>}
        </div>

        {/* Active Status */}
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

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn bg-[#e5af2d] text-black hover:bg-[#e5af2d]">
            {modalData
              ? loading
                ? 'Updating...'
                : 'Update Site Loaction'
              : loading
                ? 'Saving...'
                : 'Save Site Loaction'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default SiteLocationModal
