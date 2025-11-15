/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import ExportButton from '../../ExportButton'
import { deleteRequest, getRequest } from '../../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin } from 'antd'
import LandLordModal from './LandLordModal'
import moment from 'moment'

const LandLord = () => {
  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isActive, setIsActive] = useState(null)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters temporary states
  const [tempFromDate, setTempFromDate] = useState('')
  const [tempToDate, setTempToDate] = useState('')
  const [tempSelectedSite, setTempSelectedSite] = useState('')
  const [tempSelectedUnit, setTempSelectedUnit] = useState('')
  const [tempIsActive, setTempIsActive] = useState(null)

  // Filters applied
  const [selectedSite, setSelectedSite] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')

  // Dropdown data
  const [sites, setSites] = useState([])
  const [units, setUnits] = useState([])

  // Format date
  const formatDate = (dateString) => (dateString ? moment(dateString).format('DD-MM-YYYY') : 'N/A')
  // 🔹 Fetch Sites
  useEffect(() => {
    getRequest('sites?isPagination=false').then((res) => setSites(res?.data?.data?.sites || []))
  }, [])
  // Fetch units when Site changes
  useEffect(() => {
    if (tempSelectedSite) {
      getRequest(`units?isPagination=false&siteId=${tempSelectedSite}`).then((res) =>
        setUnits(res?.data?.data?.units || []),
      )
    } else {
      getRequest('units?isPagination=false').then((res) => setUnits(res?.data?.data?.units || []))
    }
  }, [tempSelectedSite])

  // Fetch landlord list
  useEffect(() => {
    const fetchLandlords = async () => {
      setLoading(true)
      try {
        const query = [
          `search=${searchTerm}`,
          `page=${page}`,
          `limit=${limit}`,
          fromDate && `fromDate=${fromDate}`,
          toDate && `toDate=${toDate}`,
          selectedSite && `siteId=${selectedSite}`,
          selectedUnit && `unitId=${selectedUnit}`,
          isActive !== null && `isActive=${isActive}`,
        ]
          .filter(Boolean)
          .join('&')

        const res = await getRequest(`landlords?${query}`)
        const responseData = res?.data?.data
        setData(responseData?.data || [])
        setTotal(responseData?.total || 0)
      } catch (err) {
        console.error('Error fetching landlords:', err)
        toast.error('Failed to fetch landlords')
      } finally {
        setLoading(false)
      }
    }

    fetchLandlords()
  }, [
    page,
    limit,
    searchTerm,
    fromDate,
    toDate,
    selectedSite,
    selectedUnit,
    isActive,
    updateStatus,
  ])

  // Delete landlord
  const confirmDelete = () => {
    deleteRequest(`landlords/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message)
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((err) => console.error('Delete error:', err))
  }

  return (
    <div className="bg-white">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4 rounded-md">
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
                className="px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Landlord</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage Landlords</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton data={data} fileName="Landlord.xlsx" sheetName="Landlord" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-200 text-black px-2 py-2 hover:bg-amber-200 flex items-center text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Landlord
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="py-3 border-b border-gray-200 bg-white px-1">
        <div className="flex flex-wrap items-end gap-3">
          {/* Site */}
          <div className="flex flex-col min-w-[120px] flex-1 sm:flex-none">
            <label className="text-sm font-medium text-gray-700 mb-1">Site</label>
            <select
              value={tempSelectedSite}
              onChange={(e) => setTempSelectedSite(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Sites</option>
              {sites.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.siteName}
                </option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div className="flex flex-col min-w-[110px] flex-1 sm:flex-none">
            <label className="text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              value={tempSelectedUnit}
              onChange={(e) => setTempSelectedUnit(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Units</option>
              {units.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.unitNumber}
                </option>
              ))}
            </select>
          </div>

          {/* From */}
          <div className="flex flex-col min-w-[130px] flex-1 sm:flex-none">
            <label className="text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={tempFromDate}
              onChange={(e) => setTempFromDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* To */}
          <div className="flex flex-col min-w-[130px] flex-1 sm:flex-none">
            <label className="text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={tempToDate}
              onChange={(e) => setTempToDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col min-w-[100px] flex-1 sm:flex-none">
            <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={tempIsActive === true ? 'active' : tempIsActive === false ? 'inactive' : ''}
              onChange={(e) => {
                const val = e.target.value
                if (val === 'active') setTempIsActive(true)
                else if (val === 'inactive') setTempIsActive(false)
                else setTempIsActive(null)
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>{' '}
            </select>
          </div>

          {/* Search */}
          <div className="flex flex-col flex-1 min-w-[180px] md:min-w-[220px] max-w-[260px]">
            <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 text-sm w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Apply & Clear */}
          <div className="flex items-center gap-2 mt-4 w-full sm:w-auto">
            <button
              onClick={() => {
                setFromDate(tempFromDate)
                setToDate(tempToDate)
                setSelectedSite(tempSelectedSite)
                setSelectedUnit(tempSelectedUnit)
                setIsActive(tempIsActive)
                setPage(1)
                setUpdateStatus((prev) => !prev)
              }}
              className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 text-sm w-full sm:w-auto"
            >
              Apply
            </button>
            {(fromDate || toDate || selectedSite || selectedUnit || isActive !== null) && (
              <button
                onClick={() => {
                  setTempFromDate('')
                  setTempToDate('')
                  setFromDate('')
                  setToDate('')
                  setTempSelectedSite('')
                  setSelectedSite('')
                  setTempSelectedUnit('')
                  setSelectedUnit('')
                  setTempIsActive(null)
                  setIsActive(null)
                  setPage(1)
                  setUpdateStatus((prev) => !prev)
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm w-full sm:w-auto"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      <hr />

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading LandLord...</div>
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
                    Site
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Units
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200 text-left w-[240px]">
                    Landlord
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Profile
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Wallet Balance
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Active
                  </th>
                  <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {data.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition whitespace-nowrap">
                    <td className="px-1 py-1 text-sm text-gray-700 border border-gray-200 align-middle">
                      {(page - 1) * limit + (index + 1)}
                    </td>
                    <td className="px-1 py-1 text-gray-600 border border-gray-200 align-middle">
                      {item?.siteId?.siteName || '-'}
                    </td>
                    <td className="px-1 py-1 text-gray-600 border border-gray-200 align-middle">
                      {item?.unitIds?.length > 0
                        ? item.unitIds.map((u) => u.unitNumber).join(', ')
                        : '-'}
                    </td>
                    <td className="px-1 py-1 border border-gray-200 text-left align-middle w-[240px] max-w-[240px]">
                      <div className="font-semibold text-gray-800 truncate">
                        {item?.name || '-'}
                      </div>
                      <div className="text-gray-600 text-sm truncate">{item?.phone || '-'}</div>
                      <div className="text-gray-600 text-sm truncate">{item?.email || '-'}</div>
                      <div className="text-gray-500 text-xs truncate">{item?.address || '-'}</div>
                    </td>
                    <td className="px-1 py-1 border border-gray-200 align-middle">
                      <div className="flex justify-center">
                        <img
                          src={item?.profilePic || '/default-avatar.png'}
                          alt={item?.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                      </div>
                    </td>
                    <td className="px-1 py-1 text-gray-600 border border-gray-200 align-middle">
                      {item?.walletBalance || '-'}
                    </td>
                    <td className="px-1 py-1 border border-gray-200 align-middle">
                      {item?.isActive ? (
                        <span className="px-1 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-1 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-1 py-1 border border-gray-200 align-middle">
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
              pageSizeOptions={['5', '10', '15', '20', '30', '50', '100']}
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
