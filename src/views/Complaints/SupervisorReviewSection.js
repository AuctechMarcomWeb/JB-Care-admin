/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react'

const SupervisorReviewSection = ({
  formData,
  setFormData,
  errors,
  setErrors,
  uploadingSupervisorImages,
  setUploadingSupervisorImages,
  fileUpload,
}) => {
  const supervisorImageInputRef = useRef(null)

  // 🔹 Handle comment change
  const handleSupervisorDetailsChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      supervisorDetails: {
        ...prev.supervisorDetails,
        [name]: value,
      },
    }))

    // ✅ Clear related error dynamically
    setErrors((prev) => {
      if (prev.supervisorDetails?.[name]) {
        const updated = { ...prev }
        updated.supervisorDetails = { ...prev.supervisorDetails }
        delete updated.supervisorDetails[name]
        if (Object.keys(updated.supervisorDetails).length === 0) delete updated.supervisorDetails
        return updated
      }
      return prev
    })
  }

  // 🔹 Handle Supervisor image uploads
  const handleSupervisorImageUpload = (e) => {
    const images = Array.from(e.target.files)
    if (!images.length) return

    // ✅ Clear previous errors if any
    if (errors.supervisorDetails?.images) {
      setErrors((prev) => ({
        ...prev,
        supervisorDetails: { ...prev.supervisorDetails, images: null },
      }))
    }

    images.forEach((image) => {
      const tempId = URL.createObjectURL(image)
      setUploadingSupervisorImages((prev) => [...prev, tempId])

      fileUpload({
        url: `upload`,
        cred: { image },
      })
        .then((res) => {
          const uploadedUrl = res?.data?.imageUrl
          if (!uploadedUrl) return

          setFormData((prev) => ({
            ...prev,
            supervisorDetails: {
              ...prev.supervisorDetails,
              images: [...(prev.supervisorDetails?.images || []), uploadedUrl],
            },
          }))
        })
        .catch((error) => console.error('Supervisor image upload failed:', error))
        .finally(() => setUploadingSupervisorImages((prev) => prev.filter((id) => id !== tempId)))
    })

    // ✅ Reset input so same file can be reselected later
    if (supervisorImageInputRef.current) supervisorImageInputRef.current.value = ''
  }

  return (
    <div className="row">
      {/* Supervisor Comments */}
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Comments <span className="text-danger"></span>
        </label>
        <input
          type="text"
          name="comments"
          value={formData?.supervisorDetails?.comments || ''}
          onChange={handleSupervisorDetailsChange}
          required
          className={`form-control ${errors.supervisorDetails?.comments ? 'is-invalid' : ''}`}
          placeholder="Enter supervisor comments"
        />
        {errors.supervisorDetails?.comments && (
          <div className="invalid-feedback">{errors.supervisorDetails.comments}</div>
        )}
      </div>

      {/* Supervisor Images */}
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Images <span className="text-danger"></span>
        </label>

        <input
          type="file"
          multiple
          ref={supervisorImageInputRef}
          onChange={handleSupervisorImageUpload}
          className={`form-control ${errors.supervisorDetails?.images ? 'is-invalid' : ''}`}
          required
        />
        {errors.supervisorDetails?.images && (
          <div className="invalid-feedback">{errors?.supervisorDetails?.images}</div>
        )}

        {(formData?.supervisorDetails?.images?.length > 0 ||
          uploadingSupervisorImages.length > 0) && (
          <div className="col-md-12 mt-2">
            <div className="d-flex flex-wrap gap-2">
              {/* Uploaded Images */}
              {formData?.supervisorDetails?.images?.map((item, index) => (
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
                        supervisorDetails: {
                          ...prev.supervisorDetails,
                          images: prev.supervisorDetails.images.filter((_, i) => i !== index),
                        },
                      }))
                      if (supervisorImageInputRef.current)
                        supervisorImageInputRef.current.value = ''
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

              {/* Loading Spinners */}
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
  )
}

export default SupervisorReviewSection
