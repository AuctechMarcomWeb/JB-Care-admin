/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fileUpload, postRequest, putRequest } from '../../../Helpers'

const UnitTypeModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState(
    modalData
      ? {
          ...modalData,
        }
      : {
          title: '',
          status: true,
        },
  )
  console.log('form Data', formData)
  // Close modal
  const handleCancel = () => {
    setFormData({ title: '', status: true })
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

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}
    if (!formData?.title.trim()) newErrors.title = 'Title is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit new UnitType
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    postRequest({
      url: 'unit-types',
      cred: formData,
    })
      .then((res) => {
        toast.success(res?.data?.message || 'UnitType added successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
  }

  // Update existing UnitType
  const handleEdit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    putRequest({
      url: `unit-types/${modalData?._id}`,
      cred: formData, //
    })
      .then((res) => {
        toast.success(res?.data?.message || 'UnitType updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      })
  }

  return (
    <Modal
      title={modalData ? 'Edit UnitType' : 'Add UnitType'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Title<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors?.title ? 'is-invalid' : ''}`}
            name="title"
            value={formData?.title}
            onChange={handleChange}
          />
          {errors?.title && <div className="invalid-feedback">{errors?.title}</div>}
        </div>

        {/* Active Checkbox */}
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
            Status
          </label>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn bg-[#e5af2d] text-black hover:bg-[#e5af2d]"
            disabled={loading}
          >
            {modalData
              ? loading
                ? 'Updating...'
                : 'Update Unit Type'
              : loading
                ? 'Uploading...'
                : 'Save Unit Type'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default UnitTypeModal
