import React, { useState, useMemo,useEffect } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Save,
} from 'lucide-react'
import ExportButton from '../ExportButton'
import { getRequest } from '../../Helpers'

const Unit = () => {
  const [stockData] = useState([
    { id: 1, UnitName: 'Urban Nest' },
    { id: 2, UnitName: 'Skyline Residences' },
    { id: 3, UnitName: 'Metro Grove' },
    { id: 4, UnitName: 'The Urbania' },
    { id: 5, UnitName: 'Cityscape Towers' },
    { id: 6, UnitName: 'BlueEdge' },
    { id: 7, UnitName: 'Green Meadows' },
    { id: 8, UnitName: 'Whispering Pines' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [stock, setStock] = useState(stockData)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({ UnitName: '' })

  useEffect(() => {
    getRequest()
      .then((res) => {
        setData(res?.data?.data)
        console.log('Data:', res?.data?.data)
      })
      .catch((error) => {
        console.log('Error:', error)
      })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => setFormData({ UnitName: '' })
  const handleAddProduct = () => {
    setShowAddModal(true)
    resetForm()
  }

  const submitAdd = () => {
    if (formData.UnitName) {
      const newProduct = { id: Date.now(), UnitName: formData.UnitName }
      setStock((prev) => [...prev, newProduct])
      setShowAddModal(false)
      resetForm()
    }
  }

  const handleEditProduct = (item) => {
    setSelectedItem(item)
    setFormData({ UnitName: item.UnitName })
    setShowEditModal(true)
  }

  const submitEdit = () => {
    if (formData?.UnitName) {
      setStock((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, UnitName: formData.UnitName } : item,
        ),
      )
      setShowEditModal(false)
      setSelectedItem(null)
      resetForm()
    }
  }

  const handleDeleteProduct = (item) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedItem) setStock((prev) => prev.filter((item) => item.id !== selectedItem.id))
    setShowDeleteModal(false)
    setSelectedItem(null)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedItem(null)
    resetForm()
  }

  const filteredAndSortedData = useMemo(() => {
    let filtered = stock.filter((item) =>
      item.UnitName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return filtered
  }, [stock, searchTerm, sortConfig])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div className="bg-white">
      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-md w-full max-h-[90vh] overflow-y-auto rounded shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Package className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {showAddModal ? 'Add New Unit' : 'Edit Unit'}
                </h3>
              </div>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Name *</label>
                <input
                  type="text"
                  name="UnitName"
                  value={formData?.UnitName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Unit name"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded border"
              >
                Cancel
              </button>
              <button
                onClick={showAddModal ? submitAdd : submitEdit}
                className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center rounded"
              >
                <Save className="w-4 h-4 mr-2" />
                {showAddModal ? 'Add Unit' : 'Update Unit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-md w-full rounded shadow-lg">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {selectedItem && (
                <>
                  Are you sure you want to delete <strong>{selectedItem.UnitName}</strong>? This
                  action cannot be undone.
                </>
              )}
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded border"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
              Unit Master
            </h2>
            <p className="text-gray-600 mt-1 text-center sm:text-left">Manage Unit Master</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <ExportButton data={stock} fileName="StockInData.xlsx" sheetName="Unit" />
            <button
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors flex items-center justify-center w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                <div className="flex items-center">Unit Name</div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{item?.UnitName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(item)}
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                    >
                      <Edit className="w-4 h-4 mx-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item)}
                      className="text-red-600 hover:text-red-800 transition-colors flex items-center"
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

      {/* Pagination */}
      <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="border border-gray-300 px-2 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
            </div>
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to{' '}
              {Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} of{' '}
              {filteredAndSortedData.length} results
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center rounded"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            <div className="flex flex-wrap justify-center gap-1">
              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                const pageNumber =
                  currentPage <= 3
                    ? index + 1
                    : currentPage >= totalPages - 2
                      ? totalPages - 4 + index
                      : currentPage - 2 + index

                if (pageNumber < 1 || pageNumber > totalPages) return null

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center rounded"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unit
