/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle, IndianRupee } from 'lucide-react'
import ExportButton from '../ExportButton'
import { deleteRequest, getRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin } from 'antd'
import BilingModal from './BilingModal'
import moment from 'moment'

const Biling = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  console.log('data', data)

  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tempFromDate, setTempFromDate] = useState('')
  const [tempToDate, setTempToDate] = useState('')
  const [bill, setBill] = useState([])
  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('DD-MM-YYYY') : 'N/A'
  }
  useEffect(() => {
    getRequest(`billing/billingSummary`)
      .then((res) => {
        const responseData = res?.data
        console.log('dfdf', responseData?.data)

        setBill(responseData?.data || [])
        setTotal(res?.data?.data?.total || 0)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }, [])

  // ✅ Fetch Data with Loader
  useEffect(() => {
    setLoading(true)
    getRequest(
      `maintenance-bill?search=${searchTerm}&page=${page}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}`,
    )
      .then((res) => {
        const responseData = res?.data?.data
        console.log('dfdf', res)

        setData(responseData?.data || [])
        setTotal(res?.data?.data?.total || 0)
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => setLoading(false)) // ✅ stop loader
  }, [searchTerm, page, limit, fromDate, toDate, updateStatus])

  // ✅ Delete handler
  const confirmDelete = () => {
    deleteRequest(`maintain-charges/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message)
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  return (
    <div className="bg-white">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedItem?.siteName}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Biling</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Biling</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton data={data} fileName="Biling.xlsx" sheetName="Biling" />
          <button
            onClick={() => {
              setIsModalOpen(true)
            }}
            className="bg-green-600 text-white px-3 sm:px-4 py-2 hover:bg-green-700 flex items-center justify-center rounded-md text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Biling
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Site */}
          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={tempFromDate}
              onChange={(e) => setTempFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={tempToDate}
              onChange={(e) => setTempToDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Search Input */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
            <button
              onClick={() => {
                setFromDate(tempFromDate)
                setToDate(tempToDate)
                setPage(1)
                setUpdateStatus((prev) => !prev)
              }}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 hover:bg-blue-700 rounded-md text-sm sm:text-base"
            >
              Apply
            </button>
            {(fromDate || toDate || searchTerm) && (
              <button
                onClick={() => {
                  setTempFromDate('')
                  setTempToDate('')
                  setFromDate('')
                  setToDate('')
                  setSearchTerm('')
                  setPage(1)
                  setUpdateStatus((prev) => !prev)
                }}
                className="bg-red-600 text-white px-3 sm:px-4 py-2 hover:bg-red-700 rounded-md text-sm sm:text-base"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Table Section with Loader & Empty State */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading Biling...</div>
          </div>
        ) : !bill || bill.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Empty description="No records found" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-max border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left border border-gray-200">Sr. No.</th>
                    <th className="px-6 py-3 text-left border border-gray-200">Landlord</th>
                    <th className="px-6 py-3 text-left border border-gray-200">
                      Maintenance Amount
                    </th>
                    <th className="px-6 py-3 text-left border border-gray-200">Current Billing</th>
                    <th className="px-6 py-3 text-left border border-gray-200">GST Amount</th>
                    <th className="px-6 py-3 text-left border border-gray-200">Total Amount</th>
                    <th className="px-6 py-3 text-left border border-gray-200">
                      Billing Till Today
                    </th>
                    <th className="px-6 py-3 text-left border border-gray-200">Previous Unpaid</th>
                    <th className="px-6 py-3 text-left border border-gray-200">From Date</th>
                    <th className="px-6 py-3 text-left border border-gray-200"> To Date </th>

                    <th className="px-6 py-3 text-left border border-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {bill?.map((item, index) => (
                    <tr key={item.landlordId} className="whitespace-nowrap">
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-200">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 border border-gray-200">{item.landlordName}</td>
                      <td className="px-6 py-4 text-center border border-gray-200">
                        {item.totalMaintenance}
                      </td>
                      <td className="px-6 py-4 text-center border border-gray-200">
                        {item.totalBillingAmount}
                      </td>
                      <td className="px-6 py-4 text-center border border-gray-200">
                        {item.totalGST}
                      </td>
                      <td className="px-6 py-4 text-center border border-gray-200">
                        {item.totalBillingAmount}
                      </td>
                      <td className="px-6 py-4 text-center border border-gray-200">
                        {item.billingTillToday}
                      </td>
                      <td className="px-6 py-4 text-center border border-gray-200">
                        {item.previousUnpaidBill}
                      </td>
                      <td className="px-6 py-4 text-center border border-gray-200">
                        {new Date(item.fromDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center border border-gray-200">
                        {new Date(item.toDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center border border-gray-200">
                        {item.unpaidCount === 0 ? (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            Paid
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                            Unpaid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ✅ Pagination (only show if data exists) */}
      {!loading && data?.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              pageSizeOptions={['5', '10', '15', '20', '30', '50', '100', '500']}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={true}
              onShowSizeChange={(current, size) => {
                setLimit(size)
                setPage(1)
              }}
              // showQuickJumper
            />
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <BilingModal
          setUpdateStatus={setUpdateStatus}
          setModalData={setSelectedItem}
          modalData={selectedItem}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  )
}

export default Biling
