/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import ExportButton from '../../ExportButton'
import { deleteRequest, getRequest } from '../../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin } from 'antd'
import { faL } from '@fortawesome/free-solid-svg-icons'
import LandLordModal from './LandLordModal'
import moment from 'moment'
import LandlordFilter from './LandlordFilter'

const LandLord = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
  console.log('units', units)

  const [selectedSite, setSelectedSite] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('DD-MM-YYYY') : 'N/A'
  }
  // Fetch dropdown data for filters
  useEffect(() => {
    getRequest('sites?isPagination=false').then((res) => setSites(res?.data?.data?.sites || []))
    getRequest('projects?isPagination=false').then((res) =>
      setProjects(res?.data?.data?.projects || []),
    )
    getRequest('units?isPagination=false').then((res) => setUnits(res?.data?.data?.units || []))
  }, [])

  // Fetch landlord list?
  useEffect(() => {
    setLoading(true)
    const query = [
      `search=${searchTerm}`,
      `page=${page}`,
      `limit=${limit}`,
      fromDate && `fromDate=${fromDate}`,
      toDate && `toDate=${toDate}`,
      selectedSite && `siteId=${selectedSite}`,
      selectedProject && `projectId=${selectedProject}`,
      selectedUnit && `unitId=${selectedUnit}`,
      isActive !== null && `isActive=${isActive}`,
    ]
      .filter(Boolean)
      .join('&')

    getRequest(`landlords?${query}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.data || [])
        setTotal(responseData?.total || 0)
      })
      .catch((error) => console.error('Error fetching landlords:', error))
      .finally(() => setLoading(false))
  }, [
    page,
    limit,
    searchTerm,
    fromDate,
    toDate,
    isActive,
    selectedSite,
    selectedProject,
    selectedUnit,
    updateStatus,
  ])

  const confirmDelete = () => {
    deleteRequest(`landlords/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message)
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((error) => console.error('Delete error:', error))
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Landlord</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Landlords</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton data={data} fileName="Landlord.xlsx" sheetName="Landlord" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 flex items-center rounded-md text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Landlord
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
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

          <div className="flex flex-col">
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
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Units</option>
              {units.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.unitNumber}
                </option>
              ))}
            </select>
          </div>

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

          <div className="flex items-center gap-2 h-[42px] mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 select-none">Active</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:col-span-8 justify-center mt-4">
            <button
              onClick={() => {
                setFromDate(tempFromDate)
                setToDate(tempToDate)
                setPage(1)
                setUpdateStatus((prev) => !prev)
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-sm"
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
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 text-sm"
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
            <div className="mt-4 text-blue-500 font-medium text-center">Loading LandLord...</div>
          </div>
        ) : !data || data.length === 0 ? (
          // Empty state when no data found
          <div className="flex justify-center items-center py-20">
            <Empty description="No records found" />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Sr. No.
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Site</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Units</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Landlord
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    {/* Sr. No. */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {(page - 1) * limit + (index + 1)}
                    </td>

                    {/* Site */}
                    <td className="px-6 py-4 text-gray-600">{item?.siteId?.siteName || '-'}</td>

                    {/* Project */}
                    <td className="px-6 py-4 text-gray-600">
                      {item?.projectId?.projectName || '-'}
                    </td>

                    {/* Units */}
                    <td className="px-6 py-4 text-gray-600">
                      {item?.unitIds?.length > 0
                        ? item.unitIds.map((u) => u.unitNumber).join(', ')
                        : '-'}
                    </td>

                    {/* Landlord (Name, Phone, Email, Address) */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{item?.name || '-'}</div>
                      <div className="text-gray-600 text-sm">{item?.phone || '-'}</div>
                      <div className="text-gray-600 text-sm truncate max-w-[180px]">
                        {item?.email || '-'}
                      </div>
                      <div className="text-gray-500 text-xs truncate max-w-[180px]">
                        {item?.address || '-'}
                      </div>
                    </td>

                    {/* Profile */}
                    <td className="px-6 py-4">
                      <img
                        src={item?.profilePic || '/default-avatar.png'}
                        alt={item?.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(item?.createdAt || '-')}
                    </td>

                    {/* Active Status */}
                    <td className="px-6 py-4">
                      {item?.isActive ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 flex gap-3">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              pageSizeOptions={['5', '10', '15', '20', '30', '50', '100', '500']}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={true}
              onShowSizeChange={(current, size) => {
                setLimit(size)
                setPage(1)
              }}
              showQuickJumper
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <LandLordModal
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

export default LandLord
