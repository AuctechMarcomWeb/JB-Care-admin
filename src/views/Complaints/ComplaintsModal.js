/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import toast from 'react-hot-toast'
import { fileUpload, getRequest, patchRequest, postRequest, putRequest } from '../../Helpers'
import SupervisorReviewSection from './SupervisorReviewSection'
import MaterialDemandSection from './MaterialDemandSection'
import ResolutionSection from './ResolutionSection'
import VerifyResolutionSection from './VerifyResolutionSection'
import RepushedDetailsSection from './RepushedDetails'

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
  const [uploadingMaterialImages, setUploadingMaterialImages] = useState([])
  const [uploadingClosedImages, setUploadingClosedImages] = useState([])

  const [errors, setErrors] = useState({})
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const imagesInputRefs = React.useRef([])
  const [formData, setFormData] = useState({
    userId: '',
    siteId: '',
    // projectId: '',
    unitId: '',
    complaintTitle: '',
    complaintDescription: '',
    images: [],
    action: '',
    supervisorDetails: {
      comments: '',
      images: [],
    },
    materialDemand: {
      materialName: '',
      quantity: '',
      reason: '',
      images: [],
    },
    // resolvedImages: [],
    resolution: {
      resolvedBy: '671fc84a3c29f9a5f1b23456',
      remarks: 'Leak fixed and area cleaned',
      images: ['https://example.com/resolution.jpg'],
    },
    repushedDetails: {
      count: '',
      reason: '',
    },
    comment: '',
    closedImages: [],
    status: '',

    addedBy: 'Admin',
    userRole: 'Admin',
  })
  console.log('formData', formData)

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
      // 🧩 Step 1: Find latest entry from statusHistory matching current status
      const latestStatusEntry = [...(modalData.statusHistory || [])]
        .reverse()
        .find((entry) => entry.status === modalData.status)

      // 🧩 Step 2: Prepare default form data
      const defaultSupervisorDetails = { supervisorId: '', comments: '', images: [] }
      const defaultMaterialDemand = { materialName: '', quantity: '', reason: '', images: [] }
      const defaultResolution = { resolvedBy: '671fc84a3c29f9a5f1b23456', remarks: '', images: [] }
      const defaultrepushedDetails = { count: '', reason: '' }

      // 🧩 Step 3: Extract details from matched history entry
      const supervisorDetails = latestStatusEntry?.supervisorDetails || defaultSupervisorDetails
      const materialDemand = latestStatusEntry?.materialDemand || defaultMaterialDemand
      const resolution = latestStatusEntry?.resolution || defaultResolution
      const repushedDetails = latestStatusEntry?.repushedDetails || defaultrepushedDetails

      const comment = latestStatusEntry?.comment || ''
      const closedImages = latestStatusEntry?.closedImages || []
      const closedBy = latestStatusEntry?.closedBy || ''
      console.log('CGDFg', latestStatusEntry?.comment)

      // 🧩 Step 4: Determine which action corresponds to current status
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
        case 'Repushed':
          actionFromStatus = 'repush'
          break
        default:
          actionFromStatus = ''
      }

      // 🧩 Step 5: Update the formData with everything prefilled
      setFormData({
        userId: modalData?.userId?._id || '',
        siteId: modalData?.siteId?._id || '',
        // projectId: modalData?.projectId?._id || '',
        unitId: modalData?.unitId?._id || '',
        complaintTitle: modalData?.complaintTitle || '',
        complaintDescription: modalData?.complaintDescription || '',
        images: modalData?.images || [],
        action: actionFromStatus,
        supervisorDetails,
        materialDemand,
        resolution,
        comment,
        closedImages,
        repushedDetails,
        // closedBy: '671fc84a3c29f9a5f1b99999',
        userRole: 'Admin',
      })

      // 🧩 Step 6: Also preselect the related user (optional)
      const user = users.find((u) => u._id === modalData?.userId?._id)
      if (user) setSelectedUser(user)
    }
  }, [modalData, users])

  // // ✅ Auto-prefill action-specific sections before update
  // useEffect(() => {
  //   if (!modalData || !formData.action) return

  //   switch (formData.action) {
  //     case 'review':
  //       if (modalData.supervisorDetails) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           supervisorDetails: modalData.supervisorDetails,
  //         }))
  //       }
  //       break

  //     case 'raiseMaterialDemand':
  //       if (modalData.materialDemand) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           materialDemand: modalData.materialDemand,
  //         }))
  //       }
  //       break

  //     case 'resolve':
  //       if (modalData.resolution) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           resolution: modalData.resolution,
  //         }))
  //       }
  //       break

  //     case 'verifyResolution':
  //       setFormData((prev) => ({
  //         ...prev,
  //         comment: modalData.comment || '',
  //         closedImages: modalData.closedImages || [],
  //       }))
  //       break

  //     default:
  //       break
  //   }
  // }, [modalData, formData.action])
  // console.log('modalData.supervisorDetails', modalData?.supervisorDetails?.comment)

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

  // Validation
  const validateForm = () => {
    const newErrors = {}

    // ---- Common fields ----
    if (!formData.userId) newErrors.userId = 'User is required'
    if (!formData.siteId) newErrors.siteId = 'Site is required (auto-filled)'
    // if (!formData.projectId) newErrors.projectId = 'Project is required (auto-filled)'
    if (!formData.unitId) newErrors.unitId = 'Unit is required (auto-filled)'

    if (!formData.complaintTitle.trim()) newErrors.complaintTitle = 'Complaint title is required'
    if (!formData.complaintDescription.trim())
      newErrors.complaintDescription = 'Description is required'

    if (!formData.images || formData.images.length === 0)
      newErrors.images = 'At least one image is required'

    // ---- Extra validation for edit mode ----
    if (modalData) {
      switch (formData.action) {
        case 'review':
          newErrors.supervisorDetails = {}
          if (!formData.supervisorDetails?.comments?.trim())
            newErrors.supervisorDetails.comments = 'comments  is required'
          if (!formData.supervisorDetails?.images?.trim())
            newErrors.supervisorDetails.images = 'Images is required'
          // Clean up empty nested object if no error
          if (Object.keys(newErrors.supervisorDetails).length === 0)
            delete newErrors.supervisorDetails
          break

        case 'raiseMaterialDemand':
          newErrors.materialDemand = {}
          if (!formData.materialDemand?.materialName?.trim())
            newErrors.materialDemand.materialName = 'Material name is required'
          if (!formData.materialDemand?.quantity)
            newErrors.materialDemand.quantity = 'Quantity is required'
          if (!formData.materialDemand?.reason?.trim())
            newErrors.materialDemand.reason = 'Reason is required'
          if (!formData.materialDemand?.images?.trim())
            newErrors.materialDemand.images = 'Images is required'
          // Clean up empty nested object if no error
          if (Object.keys(newErrors.materialDemand).length === 0) delete newErrors.materialDemand
          break

        case 'resolve':
          if (!formData.resolvedImages?.length)
            newErrors.resolvedImages = 'Resolved images are required'
          break

        case 'verifyResolution':
          if (!formData.customerConfirmed)
            newErrors.customerConfirmed = 'Customer confirmation is required'
          break

        default:
          if (!formData.action) newErrors.action = 'Action is required'
          break
      }
    }

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
    console.log('button hits')
    // if (!validateForm()) return
    setLoading(true)
    try {
      console.log('button hits 2')

      const res = await patchRequest({
        url: `complaints/${modalData._id}`,
        cred: { ...formData },
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
      title={modalData ? 'Edit Complaint' : 'Add Complaint'}
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
          {/* <div className="col-md-6 mb-3">
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
          </div> */}

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
        </div>

        <div className="row">
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
        </div>

        <div className="row">
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
                required
              >
                <option value="">Select Action</option>
                <option value="review">Review</option>
                <option value="raiseMaterialDemand">Raise Material Demand</option>
                <option value="resolve">Resolve</option>
                <option value="verifyResolution">Verify Resolution</option>
                <option value="repush">Repush</option>
              </select>
              {errors.action && <div className="invalid-feedback">{errors.action}</div>}
            </div>
          )}
        </div>

        {/* 🔹 Show only when Action = "review" */}
        {formData.action === 'review' && (
          <SupervisorReviewSection
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            uploadingSupervisorImages={uploadingSupervisorImages}
            setUploadingSupervisorImages={setUploadingSupervisorImages}
            fileUpload={fileUpload}
          />
        )}

        {/* 🔹 Show only when Action = "raiseMaterialDemand" */}
        {formData.action === 'raiseMaterialDemand' && (
          <MaterialDemandSection
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            fileUpload={fileUpload}
            imagesInputRefs={imagesInputRefs}
            uploadingMaterialImages={uploadingMaterialImages}
            setUploadingMaterialImages={setUploadingMaterialImages}
          />
        )}

        {/* Conditionally Show When Action = "resolve" */}
        {formData.action === 'resolve' && (
          <ResolutionSection
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            fileUpload={fileUpload}
            imagesInputRefs={imagesInputRefs}
            uploadingResolvedImages={uploadingResolvedImages}
            setUploadingResolvedImages={setUploadingResolvedImages}
          />
        )}

        {/* ✅ Conditionally show Customer Confirmed checkbox */}
        {formData.action === 'verifyResolution' && (
          <VerifyResolutionSection
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            fileUpload={fileUpload}
            imagesInputRefs={imagesInputRefs}
            uploadingClosedImages={uploadingClosedImages}
            setUploadingClosedImages={setUploadingClosedImages}
          />
        )}

        {formData.action === 'repush' && (
          <RepushedDetailsSection
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
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
