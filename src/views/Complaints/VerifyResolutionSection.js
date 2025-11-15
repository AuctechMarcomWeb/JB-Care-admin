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
  // 🔹 Handle remarks/comment change
  const handleRemarksChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      closureDetails: {
        ...prev.closureDetails,
        remarks: value,
      },
    }))

    // ✅ Clear nested error if present
    setErrors((prev) => {
      if (prev.closureDetails?.remarks) {
        const updated = { ...prev }
        delete updated.closureDetails.remarks
        if (Object.keys(updated.closureDetails).length === 0) delete updated.closureDetails
        return updated
      }
      return prev
    })
  }

  // 🔹 Handle image upload
  const handleClosedImageUpload = (e) => {
    const imageFiles = Array.from(e.target.files)

    if (errors.closureDetails?.images)
      setErrors((prev) => ({
        ...prev,
        closureDetails: { ...prev.closureDetails, images: null },
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
            closureDetails: {
              ...prev.closureDetails,
              images: [...(prev.closureDetails?.images || []), res.data?.imageUrl],
            },
          }))
        })
        .catch((error) => console.error('Closed image upload failed:', error))
        .finally(() => setUploadingClosedImages((prev) => prev.filter((id) => id !== tempId)))
    })
  }

  return (
    <div className="row">
      {/* 🔹 Remarks */}
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Remarks <span className="text-danger">*</span>
        </label>
        <textarea
          name="remarks"
          rows="2"
          value={formData.closureDetails?.remarks || ''}
          onChange={handleRemarksChange}
          required
          className={`form-control ${errors.closureDetails?.remarks ? 'is-invalid' : ''}`}
          placeholder="Enter remarks (e.g. Work verified and complaint closed)"
        />
        {errors.closureDetails?.remarks && (
          <div className="invalid-feedback">{errors.closureDetails.remarks}</div>
        )}
      </div>

      {/* 🔹 Images */}
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Proof Images <span className="text-danger">*</span>
        </label>
        <div className="d-flex align-items-start gap-3 flex-wrap">
          {/* File Input */}
          <div style={{ flex: '0 0 auto' }}>
            <input
              type="file"
              className={`form-control ${errors.closureDetails?.images ? 'is-invalid' : ''}`}
              onChange={handleClosedImageUpload}
              multiple
              // required={!(formData.closureDetails?.images?.length > 0)}
              ref={(el) => (imagesInputRefs.current[3] = el)}
              style={{ width: '250px' }}
            />
            {errors.closureDetails?.images && (
              <div className="invalid-feedback">{errors.closureDetails.images}</div>
            )}
          </div>

          {/* Image Previews */}
          {(formData.closureDetails?.images?.length > 0 || uploadingClosedImages.length > 0) && (
            <div className="d-flex flex-wrap gap-2">
              {/* ✅ Uploaded Images */}
              {formData.closureDetails?.images?.map((item, index) => (
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
                        closureDetails: {
                          ...prev.closureDetails,
                          images: prev.closureDetails.images.filter((_, i) => i !== index),
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
    </div>
  )
}

export default VerifyResolutionSection
