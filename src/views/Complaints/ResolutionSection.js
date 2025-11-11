/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'

const ResolutionSection = ({
  formData,
  setFormData,
  errors,
  setErrors,
  fileUpload,
  imagesInputRefs,
  uploadingResolvedImages,
  setUploadingResolvedImages,
}) => {
  // 🔹 Handle Remarks Change
  const handleRemarksChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      resolution: {
        ...prev.resolution,
        remarks: value,
      },
    }))

    // ✅ Clear remarks error if fixed
    setErrors((prev) => {
      if (prev.resolution?.remarks) {
        const updated = { ...prev }
        delete updated.resolution.remarks
        if (Object.keys(updated.resolution).length === 0) delete updated.resolution
        return updated
      }
      return prev
    })
  }

  // 🔹 Handle Image Upload
  const handleResolvedImageUpload = (e) => {
    const imageFiles = Array.from(e.target.files)

    if (errors.resolution?.images)
      setErrors((prev) => ({
        ...prev,
        resolution: { ...prev.resolution, images: null },
      }))

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
            resolution: {
              ...prev.resolution,
              images: [...(prev.resolution?.images || []), res.data?.imageUrl],
            },
          }))
        })
        .catch((error) => console.error('Resolved image upload failed:', error))
        .finally(() => setUploadingResolvedImages((prev) => prev.filter((id) => id !== tempId)))
    })
  }

  return (
    <div className="row">
      {/* 🔹 Remarks Input */}
      <div className="col-md-12 mb-3">
        <label className="form-label fw-bold">
          Remarks <span className="text-danger">*</span>
        </label>
        <textarea
          name="remarks"
          rows="2"
          value={formData.resolution?.remarks || ''}
          onChange={handleRemarksChange}
          required
          className={`form-control ${errors.resolution?.remarks ? 'is-invalid' : ''}`}
          placeholder="Enter remarks (e.g. Leak fixed and area cleaned)"
        />
        {errors.resolution?.remarks && (
          <div className="invalid-feedback">{errors.resolution.remarks}</div>
        )}
      </div>

      {/* 🔹 Resolved Images */}
      <div className="col-md-12 mb-3">
        <label className="form-label fw-bold">
          Resolution Images <span className="text-danger">*</span>
        </label>

        <div className="d-flex align-items-start gap-3 flex-wrap">
          {/* File Input */}
          <div style={{ flex: '0 0 auto' }}>
            <input
              type="file"
              className={`form-control ${errors.resolution?.images ? 'is-invalid' : ''}`}
              onChange={handleResolvedImageUpload}
              multiple
              required={!(formData.resolution?.images?.length > 0)}
              ref={(el) => (imagesInputRefs.current[1] = el)}
              style={{ width: '250px' }}
            />
            {errors.resolution?.images && (
              <div className="invalid-feedback">{errors.resolution.images}</div>
            )}
          </div>

          {/* Image Previews */}
          {(formData.resolution?.images?.length > 0 || uploadingResolvedImages.length > 0) && (
            <div className="d-flex flex-wrap gap-2">
              {/* ✅ Uploaded Images */}
              {formData.resolution?.images?.map((item, index) => (
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
                        resolution: {
                          ...prev.resolution,
                          images: prev.resolution.images.filter((_, i) => i !== index),
                        },
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

              {/* 🔄 Loading Spinners */}
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
    </div>
  )
}

export default ResolutionSection
