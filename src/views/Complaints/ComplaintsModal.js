/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import toast from 'react-hot-toast'
import { fileUpload, getRequest, patchRequest, postRequest, putRequest } from '../../Helpers'

const ComplaintsModal = ({
  setUpdateStatus,
  setModalData,
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState([])
  const [uploadingSupervisorImages, setUploadingSupervisorImages] = useState([])
  const [uploadingResolvedImages, setUploadingResolvedImages] = useState([])
  const [errors, setErrors] = useState({})
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const imagesInputRefs = React.useRef([])
  const [formData, setFormData] = useState({
    userId: '',
    siteId: '',
    projectId: '',
    unitId: '',
    complaintTitle: '',
    complaintDescription: '',
    images: [],
    action: '',
    supervisorComments: '',
    supervisorImages: [],
    userId: '68fb36a54ece3467047be8e5',
    materialDemand: {
      materialName: '',
      quantity: '',
      reason: '',
    },
    resolvedImages: [],
    customerConfirmed: true,
    status: '',
  })

  // Fetch Users Once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getRequest(`users?isPagination=false`)
        setUsers(res?.data?.data?.data || [])
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }
    fetchUsers()
  }, [])

  // Prefill Edit Mode
  useEffect(() => {
    if (modalData) {
      let actionFromStatus = ''

      switch (modalData.status) {
        case 'Under Review':
          actionFromStatus = 'review'
          break
        case 'Material Demand Raised':
          actionFromStatus = 'raiseMaterialDemand'
          break
        case 'Resolved':
          actionFromStatus = 'resolve'
          break
        case 'Closed':
          actionFromStatus = 'verifyResolution'
          break
        default:
          actionFromStatus = ''
      }
      setFormData({
        userId: modalData?.userId?._id || '',
        siteId: modalData?.siteId?._id || '',
        projectId: modalData?.projectId?._id || '',
        unitId: modalData?.unitId?._id || '',
        complaintTitle: modalData?.complaintTitle || '',
        complaintDescription: modalData?.complaintDescription || '',
        images: modalData?.images || [],
        action: actionFromStatus || '',
        supervisorComments: modalData?.supervisorComments || '',
        supervisorImages: modalData?.supervisorImages || [],
        materialDemand: modalData?.materialDemand || {
          materialName: '',
          quantity: '',
          reason: '',
        },
        resolvedImages: modalData?.resolvedImages || [],
        customerConfirmed: modalData?.customerConfirmed || true,
      })

      console.log('foormdata on edit mode', formData)

      const user = users.find((u) => u._id === modalData?.userId?._id)
      if (user) setSelectedUser(user)
    }
  }, [modalData, users])

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))

    // Auto-fill user related info
    if (name === 'userId') {
      const user = users.find((u) => u._id === value)
      setSelectedUser(user || null)

      if (user) {
        setFormData((prev) => ({
          ...prev,
          userId: value,
          siteId: user?.siteId?._id || '',
          projectId: user?.projectId?._id || '',
          unitId: user?.unitId?._id || '',
        }))
      }
    }
  }
  //MaterialDemandChange
  const handleMaterialDemandChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      materialDemand: {
        ...prev.materialDemand,
        [name]: value,
      },
    }))
    if (errors[`materialDemand.${name}`]) {
      setErrors((prev) => ({ ...prev, [`materialDemand.${name}`]: '' }))
    }
  }
  // ✅ Handle Resolved Image Upload
  const handleResolvedImageUpload = (e) => {
    const imageFiles = Array.from(e.target.files)

    if (errors.resolvedImages) setErrors((prev) => ({ ...prev, resolvedImages: null }))

    imageFiles.forEach((image) => {
      const tempId = URL.createObjectURL(image)
      setUploadingResolvedImages((prev) => [...prev, tempId])

      fileUpload({
        url: `upload`,
        cred: { image },
      })
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            resolvedImages: [...(prev.resolvedImages || []), res.data?.imageUrl],
          }))
        })
        .catch((error) => {
          console.error('Resolved image upload failed:', error)
        })
        .finally(() => {
          setUploadingResolvedImages((prev) => prev.filter((id) => id !== tempId))
        })
    })
  }

  //supervisor image upload
  const handleSupervisorImageUpload = (e) => {
    const images = Array.from(e.target.files)

    // 🔹 Clear previous error if any
    if (errors.supervisorImages) setErrors((prev) => ({ ...prev, supervisorImages: null }))

    images.forEach((image) => {
      const tempId = URL.createObjectURL(image)
      // Add temporary preview (loading placeholder)
      setUploadingSupervisorImages((prev) => [...prev, tempId])

      fileUpload({
        url: `upload`,
        cred: { image },
      })
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            supervisorImages: [...(prev.supervisorImages || []), res.data?.imageUrl],
          }))
        })
        .catch((error) => {
          console.error('Supervisor image upload failed:', error)
        })
        .finally(() => {
          // remove tempId once upload done
          setUploadingSupervisorImages((prev) => prev.filter((id) => id !== tempId))
        })
    })
  }

  // ✅ Handle Image Upload
  const handleImageUpload = (e) => {
    const image = Array.from(e.target.files)
    // 🔹 Clear image error if any

    if (errors.images) setErrors((prev) => ({ ...prev, images: null }))

    image.forEach((image) => {
      const tempId = URL.createObjectURL(image)
      setUploadingImages((prev) => [...prev, tempId])
      fileUpload({
        url: `upload`,
        cred: { image },
      })
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), res.data?.imageUrl],
          }))
        })
        .catch((error) => {
          console.error('Image upload failed:', error)
        })
        .finally(() => {
          // remove from uploading array once done
          setUploadingImages((prev) => prev.filter((id) => id !== tempId))
        })
    })
  }

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.userId) newErrors.userId = 'User is required'
    if (!formData.siteId) newErrors.siteId = 'Site is required (auto-filled)'
    if (!formData.projectId) newErrors.projectId = 'Project is required (auto-filled)'
    if (!formData.unitId) newErrors.unitId = 'Unit is required (auto-filled)'

    if (!formData.complaintTitle.trim()) newErrors.complaintTitle = 'Complaint title is required'
    if (!formData.complaintDescription.trim())
      newErrors.complaintDescription = 'Description is required'

    if (!formData.images || formData.images.length === 0)
      newErrors.images = 'At least one image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ Submit New Complaint
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await postRequest({ url: 'complaints', cred: formData })
      console.log('Added', res?.data?.message)

      toast.success(res?.data?.message || 'Complaint added successfully')
      setUpdateStatus((p) => !p)
      handleCancel()
    } catch (err) {
      console.log('error', err)

      toast.error(err?.res?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Update Complaint
  const handleEdit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await patchRequest({
        url: `complaints/${modalData._id}`,
        cred: formData,
      })
      console.log('dd', res?.data?.message)

      toast.success(res?.data?.message || 'Complaint updated successfully')
      setUpdateStatus((p) => !p)
      handleCancel()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Cancel / Reset
  const handleCancel = () => {
    setModalData(null)
    setIsModalOpen(false)
    setErrors({})
    setSelectedUser(null)
    setFormData({
      userId: '',
      siteId: '',
      projectId: '',
      unitId: '',
      complaintTitle: '',
      complaintDescription: '',
      images: [],
    })
  }

  return (
    <Modal
      title={modalData ? 'Edit Complaint (Under Development )' : 'Add Complaint'}
      open={isModalOpen}
      footer={null}
      onCancel={handleCancel}
      width={700}
    >
      <form onSubmit={modalData ? handleEdit : handleSubmit} noValidate>
        {/* 🔹 User Selection */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              User <span className="text-danger">*</span>
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={`form-select ${errors.userId ? 'is-invalid' : ''}`}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.userId && <div className="invalid-feedback">{errors.userId}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Site <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={selectedUser?.siteId?.siteName || ''}
              disabled={!formData.userId}
              readOnly
            />
            {errors.siteId && <div className="invalid-feedback">{errors.siteId}</div>}
          </div>
        </div>

        {/* 🔹 Auto-Filled Site, Project, Unit */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Project <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={selectedUser?.projectId?.projectName || ''}
              disabled={!formData.userId}
              readOnly
            />
            {errors.projectId && <div className="invalid-feedback">{errors.projectId}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Unit <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={selectedUser?.unitId?.unitNumber || ''}
              disabled={!formData.userId}
              readOnly
            />
            {errors.unitId && <div className="invalid-feedback">{errors.unitId}</div>}
          </div>
        </div>

        <div className="row">
          {/* 🔹 Complaint Title */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Complaint Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="complaintTitle"
              value={formData.complaintTitle}
              onChange={handleChange}
              className={`form-control ${errors.complaintTitle ? 'is-invalid' : ''}`}
            />
            {errors.complaintTitle && (
              <div className="invalid-feedback">{errors.complaintTitle}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              name="complaintDescription"
              rows="2"
              value={formData.complaintDescription}
              onChange={handleChange}
              className={`form-control ${errors.complaintDescription ? 'is-invalid' : ''}`}
            />
            {errors.complaintDescription && (
              <div className="invalid-feedback">{errors.complaintDescription}</div>
            )}
          </div>
        </div>

        <div className="row">
          {/* Image Upload */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Images <span className="text-danger">*</span>
            </label>

            <input
              type="file"
              className={`form-control ${errors.images ? 'is-invalid' : ''}`}
              onChange={handleImageUpload}
              multiple
              required={!(formData.images && formData.images.length > 0)}
              ref={(el) => (imagesInputRefs.current[0] = el)}
            />

            {errors.images && <div className="invalid-feedback">{errors.images}</div>}

            {(formData?.images?.length > 0 || uploadingImages.length > 0) && (
              <div className="col-md-12 mt-2">
                <div className="d-flex flex-wrap gap-2">
                  {formData.images?.map((item, index) => (
                    <div
                      key={`uploaded-${index}`}
                      style={{
                        position: 'relative',
                        width: '70px',
                        height: '70px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={item}
                        alt={`images-${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }))
                          if (imagesInputRefs.current[0]) imagesInputRefs.current[0].value = ''
                        }}
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {uploadingImages.map((img, index) => (
                    <div
                      key={`loading-${index}`}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '6px',
                        backgroundColor: '#f3f3f3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #ddd',
                      }}
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{ width: '25px', height: '25px' }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Select (Only in Edit Mode) */}
          {modalData && (
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Action <span className="text-danger">*</span>
              </label>
              <select
                name="action"
                value={formData.action || ''}
                onChange={handleChange}
                className={`form-select ${errors.action ? 'is-invalid' : ''}`}
              >
                <option value="">Select Action</option>
                <option value="review">Review</option>
                <option value="raiseMaterialDemand">Raise Material Demand</option>
                <option value="resolve">Resolve</option>
                <option value="verifyResolution">Verify Resolution</option>
              </select>
              {errors.action && <div className="invalid-feedback">{errors.action}</div>}
            </div>
          )}
        </div>

        {/* 🔹 Show only when Action = "review" */}
        {formData.action === 'review' && (
          <div className="row">
            {/* Supervisor Comments */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Supervisor Comments <span className="text-danger">*</span>
              </label>
              <textarea
                name="supervisorComments"
                rows="2"
                value={formData.supervisorComments || ''}
                onChange={handleChange}
                className={`form-control ${errors.supervisorComments ? 'is-invalid' : ''}`}
                placeholder="Enter comments here..."
              />
              {errors.supervisorComments && (
                <div className="invalid-feedback">{errors.supervisorComments}</div>
              )}
            </div>

            {/* Supervisor Images */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Supervisor Images <span className="text-danger">*</span>
              </label>

              <input
                type="file"
                multiple
                onChange={handleSupervisorImageUpload}
                className={`form-control ${errors.supervisorImages ? 'is-invalid' : ''}`}
                ref={(el) => (imagesInputRefs.current[1] = el)}
              />

              {errors.supervisorImages && (
                <div className="invalid-feedback">{errors.supervisorImages}</div>
              )}

              {(formData?.supervisorImages?.length > 0 || uploadingSupervisorImages.length > 0) && (
                <div className="col-md-12 mt-2">
                  <div className="d-flex flex-wrap gap-2">
                    {/* Uploaded Supervisor Images */}
                    {formData.supervisorImages?.map((item, index) => (
                      <div
                        key={`sup-uploaded-${index}`}
                        style={{
                          position: 'relative',
                          width: '70px',
                          height: '70px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={item}
                          alt={`supervisor-${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              supervisorImages: prev.supervisorImages.filter((_, i) => i !== index),
                            }))
                            if (imagesInputRefs.current[1]) imagesInputRefs.current[1].value = ''
                          }}
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Uploading Supervisor Images (Spinners) */}
                    {uploadingSupervisorImages.map((img, index) => (
                      <div
                        key={`sup-loading-${index}`}
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '6px',
                          backgroundColor: '#f3f3f3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #ddd',
                        }}
                      >
                        <div
                          className="spinner-border text-primary"
                          role="status"
                          style={{ width: '25px', height: '25px' }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {formData.action === 'raiseMaterialDemand' && (
          <div className="row">
            {/* 🔹 Material Name */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Material Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="materialName"
                value={formData.materialDemand?.materialName || ''}
                onChange={handleMaterialDemandChange}
                required
                className={`form-control ${
                  errors.materialDemand?.materialName ? 'is-invalid' : ''
                }`}
                placeholder="Enter material name (e.g. Pipe)"
              />
              {errors.materialDemand?.materialName && (
                <div className="invalid-feedback">{errors.materialDemand.materialName}</div>
              )}
            </div>

            {/* 🔹 Quantity */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Quantity <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.materialDemand?.quantity || ''}
                onChange={handleMaterialDemandChange}
                required
                className={`form-control ${errors.materialDemand?.quantity ? 'is-invalid' : ''}`}
                placeholder="Enter quantity"
                min="1"
              />
              {errors.materialDemand?.quantity && (
                <div className="invalid-feedback">{errors.materialDemand.quantity}</div>
              )}
            </div>

            {/* 🔹 Reason (Full width) */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-bold">
                Reason <span className="text-danger">*</span>
              </label>
              <textarea
                name="reason"
                rows="2"
                value={formData.materialDemand?.reason || ''}
                onChange={handleMaterialDemandChange}
                required
                className={`form-control ${errors.materialDemand?.reason ? 'is-invalid' : ''}`}
                placeholder="Enter reason (e.g. Damaged during maintenance)"
              />
              {errors.materialDemand?.reason && (
                <div className="invalid-feedback">{errors.materialDemand.reason}</div>
              )}
            </div>
          </div>
        )}

        {/* Conditionally Show When Action = "resolve" */}
        {formData.action === 'resolve' && (
          <div className="col-md-12 mb-3">
            <label className="form-label fw-bold">
              Resolved Images <span className="text-danger">*</span>
            </label>

            <div className="d-flex align-items-start gap-3 flex-wrap">
              {/* File Input */}
              <div style={{ flex: '0 0 auto' }}>
                <input
                  type="file"
                  className={`form-control ${errors.resolvedImages ? 'is-invalid' : ''}`}
                  onChange={handleResolvedImageUpload}
                  multiple
                  required={!(formData.resolvedImages && formData.resolvedImages.length > 0)}
                  ref={(el) => (imagesInputRefs.current[1] = el)}
                  style={{ width: '250px' }}
                />
                {errors.resolvedImages && (
                  <div className="invalid-feedback">{errors.resolvedImages}</div>
                )}
              </div>

              {/* Image Previews (right beside input) */}
              {(formData?.resolvedImages?.length > 0 || uploadingResolvedImages.length > 0) && (
                <div className="d-flex flex-wrap gap-2">
                  {formData.resolvedImages?.map((item, index) => (
                    <div
                      key={`resolved-${index}`}
                      style={{
                        position: 'relative',
                        width: '70px',
                        height: '70px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={item}
                        alt={`resolved-${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            resolvedImages: prev.resolvedImages.filter((_, i) => i !== index),
                          }))
                          if (imagesInputRefs.current[1]) imagesInputRefs.current[1].value = ''
                        }}
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {uploadingResolvedImages.map((img, index) => (
                    <div
                      key={`resolved-loading-${index}`}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '6px',
                        backgroundColor: '#f3f3f3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #ddd',
                      }}
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{ width: '25px', height: '25px' }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ Conditionally show Customer Confirmed checkbox */}
        {formData.action === 'verifyResolution' && (
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="customerConfirmed"
              checked={formData.customerConfirmed || true}
              required
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerConfirmed: e.target.checked,
                }))
              }
            />
            <label className="form-check-label" htmlFor="customerConfirmed">
              Customer Confirmed
            </label>
          </div>
        )}

        {/* 🔹 Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {modalData
              ? loading
                ? 'Updating...'
                : 'Update Complaint'
              : loading
                ? 'Saving...'
                : 'Save Complaint'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ComplaintsModal
