/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'

const RepushedDetailsSection = ({ formData, setFormData, errors, setErrors }) => {
  // 🔹 Handle input changes (count, reason)
  const handleRepushedChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      repushedDetails: {
        ...prev.repushedDetails,
        [name]: value,
      },
    }))

    // ✅ Clear specific error dynamically
    setErrors((prev) => {
      if (prev.repushedDetails && prev.repushedDetails[name]) {
        const updated = { ...prev }
        updated.repushedDetails = { ...prev.repushedDetails }
        delete updated.repushedDetails[name]
        if (Object.keys(updated.repushedDetails).length === 0) delete updated.repushedDetails
        return updated
      }
      return prev
    })
  }

  return (
    <div className="row">
      {/* 🔹 Count Field */}
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Repush Count <span className="text-danger">*</span>
        </label>
        <input
          type="number"
          name="count"
          min="1"
          value={formData.repushedDetails?.count || ''}
          onChange={handleRepushedChange}
          className={`form-control ${errors.repushedDetails?.count ? 'is-invalid' : ''}`}
          placeholder="Enter number of times repushed"
          required
        />
        {errors.repushedDetails?.count && (
          <div className="invalid-feedback">{errors.repushedDetails.count}</div>
        )}
      </div>

      {/* 🔹 Reason Field */}
      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Reason <span className="text-danger">*</span>
        </label>
        <textarea
          name="reason"
          rows="2"
          value={formData.repushedDetails?.reason || ''}
          onChange={handleRepushedChange}
          className={`form-control ${errors.repushedDetails?.reason ? 'is-invalid' : ''}`}
          placeholder="Enter reason for repushing (e.g. Still leaking near kitchen sink)"
          required
        />
        {errors.repushedDetails?.reason && (
          <div className="invalid-feedback">{errors.repushedDetails.reason}</div>
        )}
      </div>
    </div>
  )
}

export default RepushedDetailsSection
