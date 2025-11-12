/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import ExportButton from '../../ExportButton'
import { deleteRequest, getRequest } from '../../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin } from 'antd'
import SiteLocationModal from './SiteLocationModal'
import moment from 'moment'

const SiteLocation = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
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
  const [statusCheckbox, setStatusCheckbox] = useState(null) // user-selected checkbox state
  const [appliedStatus, setAppliedStatus] = useState(null) // applied filter after Apply button
  const formatDate = (dateString) => (dateString ? moment(dateString).format('DD-MM-YYYY') : 'N/A')

  // Fetch data
  useEffect(() => {
    setLoading(true)
    getRequest(
      `sites?search=${searchTerm}&page=${page}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}`,
    )
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.sites || [])
        setTotal(responseData?.totalSites || 0)
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => setLoading(false))
  }, [searchTerm, page, limit, fromDate, toDate, updateStatus])

  // Delete handler
  const confirmDelete = () => {
    deleteRequest(`sites/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message)
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((error) => console.log('error', error))
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
      <div className="border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Site-Location</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Site-Location</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton data={data} fileName="Site Location.xlsx" sheetName="Site Location" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-3 sm:px-4 py-2 hover:bg-green-700 flex items-center justify-center  text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Site-Location
          </button>
        </div>
      </div>
      <div className=" py-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative">
            <label className="sr-only">Search</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-[360px] border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
            />
          </div>

          {/* Status Checkbox */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={statusCheckbox === true}
                onChange={(e) => setStatusCheckbox(e.target.checked ? true : false)}
                className="w-4 h-4"
              />
              Active
            </label>
          </div>

          {/* Apply & Clear Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAppliedStatus(statusCheckbox)
                setFromDate(tempFromDate)
                setToDate(tempToDate)
                setPage(1)
                setUpdateStatus((prev) => !prev)
              }}
              className="bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 rounded-md text-sm font-medium"
            >
              Apply
            </button>

            {(fromDate || toDate || appliedStatus !== null) && (
              <button
                onClick={() => {
                  setTempFromDate('')
                  setTempToDate('')
                  setFromDate('')
                  setToDate('')
                  setAppliedStatus(null)
                  setStatusCheckbox(null)
                  setPage(1)
                  setUpdateStatus((prev) => !prev)
                }}
                className="bg-red-600 text-white px-3 py-2 hover:bg-red-700 rounded-md text-sm font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="" /> {/* Table Section */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">
              Loading Site Locations...
            </div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Empty description="No records found" />
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-max border border-gray-200 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-1 py-1 text-sm font-semibold text-gray-700 border border-gray-200">
                    Sr. No.
                  </th>
                  <th className="px-1 py-1 text-sm font-semibold text-gray-700 border border-gray-200">
                    Name
                  </th>
                  <th className="px-1 py-1 text-sm font-semibold text-gray-700 border border-gray-200">
                    Address
                  </th>
                  <th className="px-1 py-1 text-sm font-semibold text-gray-700 border border-gray-200">
                    Status
                  </th>
                  <th className="px-1 py-1 text-sm font-semibold text-gray-700 border border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {data
                  ?.filter((item) => {
                    if (appliedStatus === null) return true
                    return item.status === appliedStatus
                  })
                  .filter((item) => {
                    if (!searchTerm) return true
                    const term = searchTerm.toLowerCase()
                    return (
                      (item.siteName || '').toLowerCase().includes(term) ||
                      (item.siteAddress || '').toLowerCase().includes(term)
                    )
                  })
                  .map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition whitespace-nowrap">
                      <td className="px-2 py-2 text-sm text-gray-700 border border-gray-200 align-middle">
                        {(page - 1) * limit + (index + 1)}
                      </td>
                      <td className="px-2 py-2 text-gray-700 border border-gray-200 align-middle">
                        {item?.siteName || '-'}
                      </td>
                      <td className="px-2 py-2 text-gray-600 border border-gray-200 align-middle  truncate max-w-[250px] text-center">
                        {item?.siteAddress || '-'}
                      </td>
                      <td className="px-2 py-2 border border-gray-200 align-middle">
                        {item?.status ? (
                          <span className="px-2 py-2 text-xs bg-green-100 text-green-800 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-2 text-xs bg-red-100 text-red-800 rounded-full">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-2 border border-gray-200 align-middle">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item)
                              setIsModalOpen(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(item)
                              setShowDeleteModal(true)
                            }}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Pagination */}
      {!loading && data?.length > 0 && (
        <div className="px-2 py-2 border-t border-gray-200">
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
            />
          </div>
        </div>
      )}
      {/* Modal */}
      {isModalOpen && (
        <SiteLocationModal
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

export default SiteLocation
