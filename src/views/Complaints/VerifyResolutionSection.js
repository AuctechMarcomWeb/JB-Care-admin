/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'

const VerifyResolutionSection = ({
  formData,
  setFormData,
  errors,
  setErrors,
  fileUpload,
  imagesInputRefs,
  uploadingClosedImages,
  setUploadingClosedImages,
}) => {
  // 🔹 Handle comment change
  const handleCommentChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      verifyResolution: {
        ...prev.verifyResolution,
        comment: value,
      },
    }))

    // ✅ Clear nested error if present
    setErrors((prev) => {
      if (prev.verifyResolution?.comment) {
        const updated = { ...prev }
        delete updated.verifyResolution.comment
        if (Object.keys(updated.verifyResolution).length === 0) delete updated.verifyResolution
        return updated
      }
      return prev
    })
  }

  // 🔹 Handle closed image upload
  const handleClosedImageUpload = (e) => {
    const imageFiles = Array.from(e.target.files)

    if (errors.verifyResolution?.closedImages)
      setErrors((prev) => ({
        ...prev,
        verifyResolution: { ...prev.verifyResolution, closedImages: null },
      }))

    imageFiles.forEach((image) => {
      const tempId = URL.createObjectURL(image)
      setUploadingClosedImages((prev) => [...prev, tempId])

      fileUpload({
        url: `upload`,
        cred: { image },
      })
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            verifyResolution: {
              ...prev.verifyResolution,
              closedImages: [...(prev.verifyResolution?.closedImages || []), res.data?.imageUrl],
            },
          }))
        })
        .catch((error) => console.error('Closed image upload failed:', error))
        .finally(() => setUploadingClosedImages((prev) => prev.filter((id) => id !== tempId)))
    })
  }

  return (
    <div className="row">
      {/* 🔹 Comment & Images in One Row */}
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Comment <span className="text-danger">*</span>
        </label>
        <textarea
          name="comment"
          rows="2"
          value={formData.verifyResolution?.comment || ''}
          onChange={handleCommentChange}
          required
          className={`form-control ${errors.verifyResolution?.comment ? 'is-invalid' : ''}`}
          placeholder="Enter comment (e.g. Work verified and complaint closed)"
        />
        {errors.verifyResolution?.comment && (
          <div className="invalid-feedback">{errors.verifyResolution.comment}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Closed Images <span className="text-danger">*</span>
        </label>
        <div className="d-flex align-items-start gap-3 flex-wrap">
          {/* File Input */}
          <div style={{ flex: '0 0 auto' }}>
            <input
              type="file"
              className={`form-control ${
                errors.verifyResolution?.closedImages ? 'is-invalid' : ''
              }`}
              onChange={handleClosedImageUpload}
              multiple
              required={!(formData.verifyResolution?.closedImages?.length > 0)}
              ref={(el) => (imagesInputRefs.current[3] = el)} // index 3 for closed images
              style={{ width: '250px' }}
            />
            {errors.verifyResolution?.closedImages && (
              <div className="invalid-feedback">{errors.verifyResolution.closedImages}</div>
            )}
          </div>

          {/* Image Previews */}
          {(formData.verifyResolution?.closedImages?.length > 0 ||
            uploadingClosedImages.length > 0) && (
            <div className="d-flex flex-wrap gap-2">
              {/* ✅ Uploaded Images */}
              {formData.verifyResolution?.closedImages?.map((item, index) => (
                <div
                  key={`closed-${index}`}
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
                    alt={`closed-${index}`}
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
                        verifyResolution: {
                          ...prev.verifyResolution,
                          closedImages: prev.verifyResolution.closedImages.filter(
                            (_, i) => i !== index,
                          ),
                        },
                      }))
                      if (imagesInputRefs.current[3]) imagesInputRefs.current[3].value = ''
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

              {/* 🔄 Loading Spinners */}
              {uploadingClosedImages.map((img, index) => (
                <div
                  key={`closed-loading-${index}`}
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

      {/* 🔹 Customer Confirmed Checkbox */}
      {/* <div className="col-md-12 mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="customerConfirmed"
          checked={formData.verifyResolution?.customerConfirmed || false}
          required
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              verifyResolution: {
                ...prev.verifyResolution,
                customerConfirmed: e.target.checked,
              },
            }))
          }
        />
        <label className="form-check-label fw-bold" htmlFor="customerConfirmed">
          Customer Confirmed
        </label>
      </div> */}
    </div>
  )
}

export default VerifyResolutionSection
