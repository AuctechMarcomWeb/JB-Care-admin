import React, { useEffect, useState } from 'react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { getRequest, postRequest, patchRequest } from '../Helpers'
import toast from 'react-hot-toast'

const AppointmentModal = ({ modal, setModal, modalData, setModalData, setUpdateStatus }) => {


    const [formData,setFormData] = useState({
        
    })


    const handleInputChange =(e)=>{
        console.log("dgfdg");
        
    }
    const handleGenderChange  =(e)=>{
        console.log("dgfdg");
        
    }


  const [activeTab, setActiveTab] = useState('doctor')
  const [availability, setAvailability] = useState([
    { date: '', slots: [{ startTime: '', endTime: '' }] },
  ])

  const handleAddDate = () => {
    setAvailability([...availability, { date: '', slots: [{ startTime: '', endTime: '' }] }])
  }

  const handleRemoveDate = (index) => {
    const updated = [...availability]
    updated.splice(index, 1)
    setAvailability(updated)
  }

  const handleDateChange = (index, value) => {
    const updated = [...availability]
    updated[index].date = value
    setAvailability(updated)
  }

  const handleAddSlot = (dateIndex) => {
    const updated = [...availability]
    updated[dateIndex].slots.push({ startTime: '', endTime: '' })
    setAvailability(updated)
  }

  const handleRemoveSlot = (dateIndex, slotIndex) => {
    const updated = [...availability]
    updated[dateIndex].slots.splice(slotIndex, 1)
    setAvailability(updated)
  }

  const handleSlotChange = (dateIndex, slotIndex, field, value) => {
    const updated = [...availability]
    updated[dateIndex].slots[slotIndex][field] = value
    setAvailability(updated)
  }

  const handleSave = () => {
    console.log('Doctor availability:', availability)
    toast.success('Availability saved in console!')
  }

  return (
    <CModal
      alignment="center"
      scrollable
      visible={modal}
      onClose={() => {
        setModalData('')
        setModal(false)
      }}
      size="xl"
    >
      <CModalHeader>
        <CModalTitle>Appointment</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'doctor' ? 'active' : ''}`}
              onClick={() => setActiveTab('doctor')}
            >
              Appointment Details
            </button>
          </li>
          
        </ul>

        <div className="tab-content p-3 border border-top-0 bg-white">
          {activeTab === 'doctor' && (
            <div>
             <form  className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">Doctor Name</label>
                  <input type="text" name="doctor" value={formData.doctor} onChange={handleInputChange} className="form-control" placeholder="Enter full name" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Patient Name</label>
                  <input type="text" name="patient" value={formData.patient} onChange={handleInputChange} className="form-control" placeholder="Enter patient name" />
                </div>
               
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input type="Date" name="date" value={formData.date} onChange={handleInputChange} className="form-control"  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Service Type</label>
                  <select className="form-select" name="serviceType" value={formData.serviceType} onChange={handleInputChange}>
                    <option disabled value="">Select</option>
                    <option>In-clinic</option>
                    <option>Video Consultation</option>
                    
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Fee</label>
                  <input type="number" name="fee" value={formData.fee} onChange={handleInputChange} className="form-control" />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="serviceType" value={formData.serviceType} onChange={handleInputChange}>
                    <option disabled value="">Select</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                    <option>Rescheduled</option>
                    
                  </select>
                </div>
               
                
                
                <div className="col-md-6">
                  <label className="form-label">Appointment Id</label>
                  <input type="text" name="allergies" value={formData.allergies} onChange={handleInputChange} className="form-control"  />

                </div>

                <div className="col-md-6">
                  <label className="form-label">Slots </label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="form-control"  />

                </div>

                {/* <div className="col-md-6">
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="form-control"  />

                </div> */}

                

                <div className="col-md-6">
                  <label className="form-label">Payment Status</label>
                  <select className="form-select" name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange}>
                    <option disabled value="">Select</option>
                    <option>Pending</option>
                    <option>Complete</option>
                    <option>Refund</option>
                    
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Payment Details</label>
                  <input type="text" name="paymentDetails" value={formData.paymentDetails} onChange={handleInputChange} className="form-control" />
                </div>
              </form>
            </div>
          )}

          
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setModal(false)}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={() => toast.success('Saved!')}>
          Book Appointment
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AppointmentModal
