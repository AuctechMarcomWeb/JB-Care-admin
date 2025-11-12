/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Search, Plus, AlertTriangle, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteRequest, getRequest } from '../../../Helpers'
import { Empty, Pagination, Spin } from 'antd'
import ExportButton from '../../ExportButton'
import UnitModal from '../Unit/UnitModal'
import moment from 'moment'

const Unit = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  // 🔹 Filters
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [tempFromDate, setTempFromDate] = useState('')
  const [tempToDate, setTempToDate] = useState('')

  // 🔹 Site filters
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('')
  const [tempSelectedSite, setTempSelectedSite] = useState('')

  // 🔹 Status filter
  const [statusCheckbox, setStatusCheckbox] = useState(null) // user selection
  const [appliedStatus, setAppliedStatus] = useState(null) // applied filter

  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('DD-MM-YYYY') : 'N/A'
  }

  // 🔹 Fetch sites
  useEffect(() => {
    getRequest('sites?isPagination=false')
      .then((res) => {
        const responseData = res?.data?.data
        setSites(responseData?.sites || [])
      })
      .catch((error) => console.error('Error fetching sites:', error))
  }, [])

  // 🔹 Fetch Units (with filters)
  useEffect(() => {
    setLoading(true)

    const params = new URLSearchParams({
      search: searchTerm || '',
      page,
      limit,
    })

    if (fromDate) params.append('fromDate', fromDate)
    if (toDate) params.append('toDate', toDate)
    if (selectedSite) params.append('siteId', selectedSite)
    if (appliedStatus !== null) params.append('status', appliedStatus)

    getRequest(`units?${params.toString()}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.units || [])
        setTotal(responseData?.totalUnits || 0)
      })
      .catch((error) => console.error('Error fetching units:', error))
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm, fromDate, toDate, selectedSite, appliedStatus, updateStatus])

  // 🔹 Delete handler
  const confirmDelete = () => {
    deleteRequest(`units/${selectedItem?._id}`)
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
              Are you sure you want to delete <strong>{selectedItem?.name}</strong>?
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Unit</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Unit</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton data={data} fileName="Unit.xlsx" sheetName="Unit" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-3 sm:px-4 py-2 hover:bg-green-700 flex items-center justify-center text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Unit
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="py-2 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
          {/* 🔹 Site Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Site</label>
            <select
              value={tempSelectedSite}
              onChange={(e) => setTempSelectedSite(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sites</option>
              {sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.siteName}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Search */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
              />
            </div>
          </div>

          {/* 🔹 Status Checkbox — centered with input box */}
          <div className="flex items-center h-full">
            <label className="flex items-center gap-2 text-sm font-medium translate-y-[8px]">
              <input
                type="checkbox"
                checked={statusCheckbox === true}
                onChange={(e) => setStatusCheckbox(e.target.checked ? true : null)}
                className="w-4 h-4"
              />
              Active
            </label>
          </div>

          {/* 🔹 Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setAppliedStatus(statusCheckbox)
                setFromDate(tempFromDate)
                setToDate(tempToDate)
                setSelectedSite(tempSelectedSite)
                setPage(1)
                setUpdateStatus((prev) => !prev)
              }}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 hover:bg-blue-700 rounded-md text-sm sm:text-base"
            >
              Apply
            </button>

            {(fromDate || toDate || searchTerm || selectedSite || appliedStatus !== null) && (
              <button
                onClick={() => {
                  setTempFromDate('')
                  setTempToDate('')
                  setFromDate('')
                  setToDate('')
                  setAppliedStatus(null)
                  setStatusCheckbox(null)
                  setSearchTerm('')
                  setTempSelectedSite('')
                  setSelectedSite('')
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

      <hr className="" />

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading Unit...</div>
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
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Sr. No.
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Site Name
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Unit Type
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Unit
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Block
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Area (Sqft)
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Status
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {data?.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition whitespace-nowrap">
                    <td className="px-2 py-2 text-sm text-gray-700 border border-gray-200 align-middle">
                      {(page - 1) * limit + (index + 1)}
                    </td>
                    <td className="px-2 py-2 text-gray-700 border border-gray-200 align-middle">
                      {item?.siteId?.siteName || '-'}
                    </td>
                    <td className="px-2 py-2 text-gray-700 border border-gray-200 align-middle">
                      {item?.unitTypeId?.title || '-'}
                    </td>
                    <td className="px-2 py-2 text-gray-700 border border-gray-200 align-middle">
                      {item?.unitNumber || '-'}
                    </td>
                    <td className="px-2 py-2 text-gray-700 border border-gray-200 align-middle">
                      {item?.block || '-'}
                    </td>
                    <td className="px-2 py-2 text-gray-700 border border-gray-200 align-middle">
                      {item?.areaSqFt || '-'}
                    </td>
                    <td className="px-2 py-2 border border-gray-200 align-middle">
                      {item?.status ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 border border-gray-200 align-middle">
                      <div className="flex justify-center gap-3">
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
              showSizeChanger
              onShowSizeChange={(current, size) => {
                setLimit(size)
                setPage(1)
              }}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <UnitModal
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

export default Unit
