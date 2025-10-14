import React, { useState, useMemo } from 'react'
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

const UnitType = () => {
  const [stockData] = useState([
    {
      id: 1,
      UnitType: 'Villa',
      projectName: 'Project A',
      projectId: 'P001',
      landlordName: 'John Doe',
      landlordId: 'L001',
    },
    {
      id: 2,
      UnitType: 'Plot',
      projectName: 'Project B',
      projectId: 'P002',
      landlordName: 'Jane Smith',
      landlordId: 'L002',
    },
    {
      id: 3,
      UnitType: 'Apartment',
      projectName: 'Project C',
      projectId: 'P003',
      landlordName: 'Mike Johnson',
      landlordId: 'L003',
    },
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
  const [formData, setFormData] = useState({
    UnitType: '',
    projectName: '',
    projectId: '',
    landlordName: '',
    landlordId: '',
  })

  useEffect(() => {
    getRequest()
      .then((res) => {
        setData(res?.data?.data)
      })
      .catch((error) => {
        console.log('error hai bhaiii', error)
      })
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () =>
    setFormData({ UnitType: '', projectName: '', projectId: '', landlordName: '', landlordId: '' })
  const handleAddProduct = () => {
    setShowAddModal(true)
    resetForm()
  }

  const submitAdd = () => {
    if (
      formData.UnitType &&
      formData.projectName &&
      formData.projectId &&
      formData.landlordName &&
      formData.landlordId
    ) {
      const newProduct = { id: Date.now(), ...formData }
      setStock((prev) => [...prev, newProduct])
      setShowAddModal(false)
      resetForm()
    }
  }

  const handleEditProduct = (item) => {
    setSelectedItem(item)
    setFormData({
      UnitType: item.UnitType,
      projectName: item.projectName,
      projectId: item.projectId,
      landlordName: item.landlordName,
      landlordId: item.landlordId,
    })
    setShowEditModal(true)
  }

  const submitEdit = () => {
    if (
      formData.UnitType &&
      formData.projectName &&
      formData.projectId &&
      formData.landlordName &&
      formData.landlordId
    ) {
      setStock((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? { ...item, ...formData } : item)),
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
    let filtered = stock.filter(
      (item) =>
        item.UnitType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.landlordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.landlordId.toLowerCase().includes(searchTerm.toLowerCase()),
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
                  {showAddModal ? 'Add New UnitType' : 'Edit UnitType'}
                </h3>
              </div>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {['UnitType', 'projectName', 'projectId', 'landlordName', 'landlordId'].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.replace(/([A-Z])/g, ' $1').trim()} *
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                    />
                  </div>
                ),
              )}
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
                {showAddModal ? 'Add UnitType' : 'Update UnitType'}
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
                  Are you sure you want to delete <strong>{selectedItem.UnitType}</strong>?
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
              UnitType Master
            </h2>
            <p className="text-gray-600 mt-1 text-center sm:text-left">Manage UnitType Master</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <ExportButton data={stock} fileName="UnitTypeData.xlsx" sheetName="UnitType" />
            <button
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors flex items-center justify-center w-full sm:w-auto rounded"
            >
              <Plus className="w-4 h-4 mr-2" /> Add UnitType
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search UnitTypes, Project or Landlord..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                UnitType
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Landlord Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Landlord ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{item.UnitType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.projectName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.projectId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.landlordName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.landlordId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(item)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Edit className="w-4 h-4 mx-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item)}
                      className="text-red-600 hover:text-red-800 flex items-center"
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
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </button>
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
                  className={`px-3 py-1 text-sm border rounded ${currentPage === pageNumber ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  {pageNumber}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center rounded"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnitType
