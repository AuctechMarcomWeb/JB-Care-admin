/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'

const MaterialDemandSection = ({
  formData,
  setFormData,
  errors,
  setErrors,
  fileUpload,
  imagesInputRefs,
  uploadingMaterialImages,
  setUploadingMaterialImages,
}) => {
  // 🔹 Handle text/number/textarea changes
  const handleMaterialDemandChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      materialDemand: {
        ...prev.materialDemand,
        [name]: value,
      },
    }))

    // ✅ Clear nested error dynamically
    setErrors((prev) => {
      if (prev.materialDemand && prev.materialDemand[name]) {
        const updated = { ...prev }
        updated.materialDemand = { ...prev.materialDemand }
        delete updated.materialDemand[name]
        if (Object.keys(updated.materialDemand).length === 0) delete updated.materialDemand
        return updated
      }
      return prev
    })
  }

  // 🔹 Handle Image Upload
  const handleMaterialImageUpload = (e) => {
    const images = Array.from(e.target.files)

    if (errors.materialDemand?.images)
      setErrors((prev) => ({
        ...prev,
        materialDemand: { ...prev.materialDemand, images: null },
      }))

    images.forEach((image) => {
      const tempId = URL.createObjectURL(image)
      setUploadingMaterialImages((prev) => [...prev, tempId])

      fileUpload({
        url: `upload`,
        cred: { image },
      })
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            materialDemand: {
              ...prev.materialDemand,
              images: [...(prev.materialDemand?.images || []), res.data?.imageUrl],
            },
          }))
        })
        .catch((error) => console.error('Material image upload failed:', error))
        .finally(() => setUploadingMaterialImages((prev) => prev.filter((id) => id !== tempId)))
    })
  }

  return (
    <div className="row">
      {/* 🔹 Row 1: Material Name + Quantity */}
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
          className={`form-control ${errors.materialDemand?.materialName ? 'is-invalid' : ''}`}
          placeholder="Enter material name (e.g. PVC Pipe 2-inch)"
        />
        {errors.materialDemand?.materialName && (
          <div className="invalid-feedback">{errors.materialDemand.materialName}</div>
        )}
      </div>

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

      {/* 🔹 Row 2: Reason + Material Images */}
      <div className="col-md-6 mb-3">
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
          placeholder="Enter reason (e.g. Damaged due to leakage)"
        />
        {errors.materialDemand?.reason && (
          <div className="invalid-feedback">{errors.materialDemand.reason}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Material Images
          {/* <span className="text-danger">*</span> */}
        </label>
        <input
          type="file"
          multiple
          onChange={handleMaterialImageUpload}
          className={`form-control ${errors.materialDemand?.images ? 'is-invalid' : ''}`}
          ref={(el) => (imagesInputRefs.current[2] = el)} // index 2 -> unique from supervisor
        />
        {errors.materialDemand?.images && (
          <div className="invalid-feedback">{errors.materialDemand.images}</div>
        )}

        {(formData.materialDemand?.images?.length > 0 || uploadingMaterialImages.length > 0) && (
          <div className="col-md-12 mt-2">
            <div className="d-flex flex-wrap gap-2">
              {/* ✅ Uploaded Material Images */}
              {formData.materialDemand?.images?.map((item, index) => (
                <div
                  key={`mat-uploaded-${index}`}
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
                    alt={`material-${index}`}
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
                        materialDemand: {
                          ...prev.materialDemand,
                          images: prev.materialDemand.images.filter((_, i) => i !== index),
                        },
                      }))
                      if (imagesInputRefs.current[2]) imagesInputRefs.current[2].value = ''
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
              {uploadingMaterialImages.map((img, index) => (
                <div
                  key={`mat-loading-${index}`}
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

export default MaterialDemandSection
