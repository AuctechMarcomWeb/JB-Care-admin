/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getRequest, deleteRequest } from '../../../Helpers'
import toast from 'react-hot-toast'
import BillingFixRateModal from '../MaintenceCharges/BillingFixRateModal'

const BillingFixRate = ({ setUpdateStatus }) => {
  const [rates, setRates] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRate, setSelectedRate] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchRates = () => {
    setLoading(true)
    getRequest(`maintain-charges/get-min-fix-charges`)
      .then((res) => {
        console.log('resfixed===', res)

        setRates(res?.data?.data || [])
      })
      .catch(() => toast.error('Failed to load rates'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRates()
  }, [])

  const handleDelete = (rateId) => {
    if (window.confirm('Are you sure you want to delete this rate?')) {
      deleteRequest(`maintain-charges/${selectedRate._id}`)
        .then((res) => {
          toast.success(res?.data?.message || 'Deleted successfully')
          fetchRates()
          setUpdateStatus((prev) => !prev)
        })
        .catch(() => toast.error('Failed to delete'))
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md mb-4 p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Fixed Billing Rates</h3>
        <button
          onClick={() => {
            setSelectedRate(null)
            setIsModalOpen(true)
          }}
          className="bg-[#f8ca57] text-black px-3 sm:px-4 py-2 hover:bg-[#f9cb59
 ] flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus size={16} /> Add Rate
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2 text-left">Rate Type</th>
              <th className="border px-2 py-2 text-left">Rate Value</th>
              <th className="border px-2 py-2 text-left">GST (%)</th>
              <th className="border px-2 py-2 text-left">Description</th>
              <th className="border px-2 py-2 text-left">Overwrite Existing</th>
              <th className="border px-2 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {rates.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No rates found
                </td>
              </tr>
            ) : (
              rates.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-2">{r.rateType}</td>
                  <td className="border px-2 py-2">{r.rateValue}</td>
                  <td className="border px-2 py-2">{r.gstPercent}%</td>
                  <td className="border px-2 py-2">{r.description}</td>
                  <td className="border px-2 py-2">{r.overwriteExisting ? 'Yes' : 'No'}</td>
                  <td className="border px-2 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedRate(r)
                          setIsModalOpen(true)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <BillingFixRateModal
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          selectedRate={selectedRate}
          refresh={fetchRates}
          setUpdateStatus={setUpdateStatus}
        />
      )}
    </div>
  )
}

export default BillingFixRate
