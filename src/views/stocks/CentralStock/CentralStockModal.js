/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import toast from 'react-hot-toast'
import { postRequest, putRequest } from '../../../Helpers'

const CentralStockModal = ({
  isModalOpen,
  setIsModalOpen,
  modalData,
  setModalData,
  setUpdateStatus,
}) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    productName: '',
    productDetails: '',
    quantity: '',
    category: '',
    minStockLevel: '',
  })

  useEffect(() => {
    if (modalData) {
      setFormData({
        productName: modalData.productName || '',
        productDetails: modalData.productDetails || '',
        quantity: modalData.quantity != null ? String(modalData.quantity) : '',
        category: modalData.category || '',
        minStockLevel: modalData.minStockLevel != null ? String(modalData.minStockLevel) : '',
      })
    } else {
      setFormData({
        productName: '',
        productDetails: '',
        quantity: '',
        category: '',
        minStockLevel: '',
      })
    }
  }, [modalData])

  const handleCancel = () => {
    setFormData({
      productName: '',
      productDetails: '',
      quantity: '',
      category: '',
      minStockLevel: '',
    })
    setErrors({})
    setModalData(null)
    setIsModalOpen(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.productName?.trim()) newErrors.productName = 'Product name is required'
    if (!formData.productDetails?.trim()) newErrors.productDetails = 'Product Details is required'

    if (formData.quantity === '') newErrors.quantity = 'Quantity is required'
    else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0)
      newErrors.quantity = 'Quantity must be a non-negative number'
    if (
      formData.minStockLevel !== '' &&
      (isNaN(Number(formData.minStockLevel)) || Number(formData.minStockLevel) < 0)
    )
      newErrors.minStockLevel = 'Min stock must be a non-negative number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    const payload = {
      productName: formData.productName,
      productDetails: formData.productDetails,
      quantity: Number(formData.quantity),
      category: formData.category,
      minStockLevel: formData.minStockLevel === '' ? null : Number(formData.minStockLevel),
    }

    // Create
    if (!modalData) {
      postRequest({
        url: 'central-stocks',
        cred: payload,
      })
        .then((res) => {
          toast.success(res?.data?.message || 'Product added successfully')
          setUpdateStatus((prev) => !prev)
          handleCancel()
        })
        .catch((err) => {
          console.error('Create error:', err)
          toast.error(err?.response?.data?.message || 'Failed to add product')
        })
        .finally(() => setLoading(false))
      return
    }

    // Update
    putRequest({
      url: `central-stocks/${modalData._id || modalData.id}`,
      cred: payload,
    })
      .then((res) => {
        toast.success(res?.data?.message || 'Product updated successfully')
        setUpdateStatus((prev) => !prev)
        handleCancel()
      })
      .catch((err) => {
        console.error('Update error:', err)
        toast.error(err?.response?.data?.message || 'Failed to update product')
      })
      .finally(() => setLoading(false))
  }

  return (
    <Modal
      title={modalData ? 'Edit Product' : 'Add Product'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label fw-bold">
            Product Name<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
            name="productName"
            value={formData.productName}
            onChange={handleChange}
          />
          {errors.productName && <div className="invalid-feedback">{errors.productName}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Product Details</label>
          <textarea
            className="form-control"
            name="productDetails"
            rows="3"
            value={formData.productDetails}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="form-label fw-bold">
              Quantity<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              min="0"
              className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
          </div>

          <div>
            <label className="form-label fw-bold">Min Stock Level</label>
            <input
              type="number"
              min="0"
              className={`form-control ${errors.minStockLevel ? 'is-invalid' : ''}`}
              name="minStockLevel"
              value={formData.minStockLevel}
              onChange={handleChange}
            />
            {errors.minStockLevel && <div className="invalid-feedback">{errors.minStockLevel}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Electronics"
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {modalData
              ? loading
                ? 'Updating...'
                : 'Update Product'
              : loading
                ? 'Saving...'
                : 'Save Product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CentralStockModal
