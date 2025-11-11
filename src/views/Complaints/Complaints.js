/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import ExportButton from '../ExportButton'
import { deleteRequest, getRequest } from '../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin, Tooltip } from 'antd'
import axios from 'axios'
import ComplaintsModal from './ComplaintsModal'
import { faL } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters
  const [tempFromDate, setTempFromDate] = useState('')
  const [tempToDate, setTempToDate] = useState('')

  // NEW FILTER STATES
  const [sites, setSites] = useState([])
  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [selectedSite, setSelectedSite] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('DD-MM-YYYY') : 'N/A'
  }

  // Fetch dropdown data for filters
  useEffect(() => {
    getRequest('sites?isPagination=false').then((res) => setSites(res?.data?.data?.sites || []))
    getRequest('projects?isPagination=false').then((res) =>
      setProjects(res?.data?.data?.projects || []),
    )
    // getRequest('units?isPagination=false').then((res) => setUnits(res?.data?.data?.units || []))
  }, [])

  // Fetch Property Type with Pagination + Search
  useEffect(() => {
    setLoading(true)

    // Build query params dynamically
    let query = `complaints?search=${searchTerm}&page=${page}&limit=${limit}`
    if (fromDate) query += `&fromDate=${fromDate}`
    if (toDate) query += `&toDate=${toDate}`
    if (selectedSite) query += `&siteId=${selectedSite}`
    if (selectedProject) query += `&projectId=${selectedProject}`

    getRequest(query)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.complaints || [])
        setTotal(responseData?.totalComplaints || 0)
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error)
      })
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm, fromDate, toDate, selectedSite, selectedProject, updateStatus])

  // ✅ Delete handler
  const confirmDelete = () => {
    deleteRequest(`Complaints/${selectedItem?._id}`)
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
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Complaints</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Complaints</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton data={data} fileName="Complaints.xlsx" sheetName="Complaints" />
          <button
            onClick={() => {
              setIsModalOpen(true)
            }}
            className="bg-green-600 text-white px-3 sm:px-4 py-2 hover:bg-green-700 flex items-center justify-center rounded-md text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Complaints
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
          {/* Site Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Site</label>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sites</option>
              {sites.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.siteName}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          {/* <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div> */}

          {/* Date Filters */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={tempFromDate}
              onChange={(e) => setTempFromDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={tempToDate}
              onChange={(e) => setTempToDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Search */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
            <button
              onClick={() => {
                setFromDate(tempFromDate)
                setToDate(tempToDate)
                setPage(1)
                setUpdateStatus((prev) => !prev)
              }}
              className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 rounded-md text-sm sm:text-base"
            >
              Apply
            </button>

            {(fromDate ||
              toDate ||
              searchTerm ||
              selectedSite ||
              selectedProject ||
              selectedUnit) && (
              <button
                onClick={() => {
                  setTempFromDate('')
                  setTempToDate('')
                  setFromDate('')
                  setToDate('')
                  setSearchTerm('')
                  setSelectedSite('')
                  setSelectedProject('')
                  setSelectedUnit('')
                  setPage(1)
                  setUpdateStatus((prev) => !prev)
                }}
                className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 rounded-md text-sm sm:text-base"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          // Loader when fetching data
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading Complaints...</div>
          </div>
        ) : !data || data.length === 0 ? (
          // Empty state when no data found
          <div className="flex justify-center items-center py-20">
            <Empty description="No records found" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-max border border-gray-200 text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200">
                      Sr. No.
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200">
                      Date
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200">
                      Title
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200">
                      Description
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200">
                      Image
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200">
                      Status
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {data?.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition whitespace-nowrap">
                      {/* Sr. No. */}
                      <td className="px-6 py-4 text-sm text-gray-700 border border-gray-200 align-middle">
                        {(page - 1) * limit + (index + 1)}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-600 border border-gray-200 align-middle">
                        {formatDate(item?.createdAt || '-')}
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4 text-gray-700 border border-gray-200 align-middle">
                        {item?.complaintTitle || '-'}
                      </td>

                      {/* Description with ellipsis & tooltip */}
                      <td className="px-6 py-4 text-gray-600 border border-gray-200 align-middle max-w-[200px] text-left">
                        <Tooltip title={item?.complaintDescription || '-'} placement="topLeft">
                          <span className="inline-block w-full truncate cursor-pointer">
                            {item?.complaintDescription?.split(' ')?.slice(0, 5)?.join(' ') || '-'}
                            {item?.complaintDescription?.split(' ')?.length > 5 ? '…' : ''}
                          </span>
                        </Tooltip>
                      </td>

                      {/* Image */}
                      <td className="px-6 py-4 border border-gray-200 align-middle">
                        {item?.images ? (
                          <img
                            src={item?.images}
                            alt="Complaint"
                            className="w-10 h-10 rounded-full object-cover mx-auto"
                          />
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 border border-gray-200 align-middle">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item?.status === 'Closed'
                              ? 'bg-red-100 text-red-700'
                              : item?.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : item?.status === 'Under Review'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {item?.status || '-'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4  border border-gray-200 align-middle">
                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setIsModalOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Optional Delete Button */}
                        {/* <button
              onClick={() => {
                setSelectedItem(item);
                setShowDeleteModal(true);
              }}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {/* Pagination (only show if there’s data) */}
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
              onChange={(newPage) => setPage(newPage)}
              pageSizeOptions={['5', '10', '15', '20', '30', '50', '100', '500']}
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

      {isModalOpen && (
        <ComplaintsModal
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

export default Complaints
