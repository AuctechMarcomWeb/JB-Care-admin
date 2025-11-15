/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import ExportButton from '../../ExportButton'
import { deleteRequest, getRequest } from '../../../Helpers'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin } from 'antd'
import MaintenceChargesModal from './MaintenceChargesModal'
import moment from 'moment'
import BillingFixRate from './BillingFixrate'

const MaintenceCharges = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [loading, setLoading] = useState(false)

  // 🔹 Temp filters (before Apply)
  const [tempSelectedSite, setTempSelectedSite] = useState('')
  const [tempSelectedUnit, setTempSelectedUnit] = useState('')

  // 🔹 Applied filters (after Apply)
  const [selectedSite, setSelectedSite] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')

  // 🔹 Dropdown data
  const [sites, setSites] = useState([])
  const [units, setUnits] = useState([])

  // 🔹 Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const formatDate = (dateString) => (dateString ? moment(dateString).format('DD-MM-YYYY') : 'N/A')

  // 🔹 Fetch Sites
  useEffect(() => {
    getRequest('sites?isPagination=false').then((res) => setSites(res?.data?.data?.sites || []))
  }, [])

  // 🔹 Fetch Units based on selected Site (for dropdown)
  useEffect(() => {
    if (tempSelectedSite) {
      getRequest(`units?isPagination=false&siteId=${tempSelectedSite}`).then((res) =>
        setUnits(res?.data?.data?.units || []),
      )
    } else {
      getRequest('units?isPagination=false').then((res) => setUnits(res?.data?.data?.units || []))
    }
  }, [tempSelectedSite])

  // 🔹 Fetch Data with Filters
  useEffect(() => {
    setLoading(true)
    const queryParams = new URLSearchParams({
      search: searchTerm || '',
      page,
      limit,
      order: 'desc',
    })

    if (selectedSite) queryParams.append('siteId', selectedSite)
    if (selectedUnit) queryParams.append('unitId', selectedUnit)

    getRequest(`maintain-charges?${queryParams.toString()}`)
      .then((res) => {
        const responseData = res?.data?.data
        setData(responseData?.data || [])
        setTotal(responseData?.total || 0)
      })
      .catch((err) => console.error('Error fetching maintenance charges:', err))
      .finally(() => setLoading(false))
  }, [searchTerm, page, limit, selectedSite, selectedUnit, updateStatus])

  // 🔹 Delete Handler
  const confirmDelete = () => {
    deleteRequest(`maintain-charges/${selectedItem?._id}`)
      .then((res) => {
        toast.success(res?.data?.message)
        setSelectedItem(null)
        setUpdateStatus((prev) => !prev)
        setShowDeleteModal(false)
      })
      .catch((err) => console.error('Delete failed:', err))
  }

  return (
    <div className="bg-white">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{' '}
              <strong>{selectedItem?.siteId?.siteName || 'this record'}</strong>?
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
      <div className="border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3 px-2 py-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Maintenance Charges</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage maintenance charge details</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ExportButton
            data={data}
            fileName="Maintenance Charges.xlsx"
            sheetName="Maintenance Charges"
          />
          <button
            onClick={() => {
              setIsModalOpen(true)
              setSelectedItem(null)
            }}
            className="bg-[#f8ca57] text-black px-3 sm:px-4 py-2 hover:bg-[#f9cb59
 ] flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Charges
          </button>
        </div>
      </div>

      {/* 🔹 Filters Section */}
      <div className="py-3 border-b border-gray-200 px-2">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          {/* Site Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Site</label>
            <select
              value={tempSelectedSite}
              onChange={(e) => {
                setTempSelectedSite(e.target.value)
                setTempSelectedUnit('') // reset unit when site changes
              }}
              className="w-full border border-gray-300 rounded-md  py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Sites</option>
              {sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.siteName}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              value={tempSelectedUnit}
              onChange={(e) => setTempSelectedUnit(e.target.value)}
              className="w-full border border-gray-300 rounded-md  py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Units</option>
              {units.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.unitNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or rate type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10  py-2 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
            <button
              onClick={() => {
                setSelectedSite(tempSelectedSite)
                setSelectedUnit(tempSelectedUnit)
                setPage(1)
                setUpdateStatus((prev) => !prev)
              }}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 hover:bg-blue-700 rounded-md text-sm sm:text-base"
            >
              Apply
            </button>

            {(selectedSite || selectedUnit || searchTerm) && (
              <button
                onClick={() => {
                  setTempSelectedSite('')
                  setTempSelectedUnit('')
                  setSelectedSite('')
                  setSelectedUnit('')
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
      <hr className="" />
      <BillingFixRate setUpdateStatus={setUpdateStatus} />
      <hr className="" />

      {/* ✅ Table Section */}
      <div className="overflow-x-auto table-watermark">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">
              Loading Maintenance Charges...
            </div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex justify-center items-center py-20 table-watermark">
            <Empty description="No records found" />
          </div>
        ) : (
          <table className="w-full min-w-max border border-gray-200 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                  Sr.NO.
                </th>
                <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                  Site
                </th>
                <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                  Unit
                </th>
                <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                  Rate Type
                </th>
                <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                  Rate (₹)
                </th>
                <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                  GST (%)
                </th>
                <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                  Status
                </th>
                <th className="px-2 py-2 text-sm font-semibold text-gray-700 border border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white table-watermark">
              {data.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50 transition whitespace-nowrap">
                  <td className="px-2 py-2 border border-gray-200">
                    {(page - 1) * limit + (index + 1)}
                  </td>
                  <td className="px-2 py-2 border border-gray-200">
                    {item?.siteId?.siteName || '-'}
                  </td>
                  <td className="px-2 py-2 border border-gray-200">
                    {item?.unitId?.unitNumber || '-'}
                  </td>
                  <td className="px-2 py-2 border border-gray-200 capitalize">
                    {item?.rateType || '-'}
                  </td>
                  <td className="px-2 py-2 border border-gray-200">₹{item?.rateValue || 0}</td>
                  <td className="px-2 py-2 border border-gray-200">{item?.gstPercent || 0}%</td>
                  <td className="px-2 py-2 border border-gray-200">
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
                  <td className="px-2 py-2 border border-gray-200">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setIsModalOpen(true)
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              onChange={(p) => setPage(p)}
              pageSizeOptions={['5', '10', '15', '20', '30', '50', '100']}
              onShowSizeChange={(curr, size) => {
                setLimit(size)
                setPage(1)
              }}
              showSizeChanger
            />
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <MaintenceChargesModal
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

export default MaintenceCharges
