import React, { useState, useMemo, useEffect } from 'react'
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

const Project = () => {
  const [stockData] = useState([
    { id: 1, ProjectName: 'Urban Nest', LocationName: 'New York', LocationId: 'NYO1' },
    { id: 2, ProjectName: 'Skyline Residences', LocationName: 'Chicago', LocationId: 'CHI2' },
    { id: 3, ProjectName: 'Metro Grove', LocationName: 'Boston', LocationId: 'BOS3' },
    { id: 4, ProjectName: 'The Urbania', LocationName: 'Seattle', LocationId: 'SEA4' },
  ])
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [stock, setStock] = useState(stockData)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const [formData, setFormData] = useState({
    ProjectName: '',
    LocationName: '',
    LocationId: '',
  })
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

  const resetForm = () =>
    setFormData({
      ProjectName: '',
      LocationName: '',
      LocationId: '',
    })

  // Add
  const handleAddProduct = () => {
    resetForm()
    setShowAddModal(true)
  }

  const submitAdd = () => {
    if (formData.ProjectName && formData.LocationName && formData.LocationId) {
      const newProject = {
        id: Date.now(),
        ...formData,
      }
      setStock((prev) => [...prev, newProject])
      setShowAddModal(false)
      resetForm()
    }
  }

  // Edit
  const handleEditProduct = (item) => {
    setSelectedItem(item)
    setFormData({
      ProjectName: item.projectName,
      LocationName: item.projectAddress,
      LocationId: item.siteId,
    })
    setShowEditModal(true)
  }

  const submitEdit = () => {
    if (formData.ProjectName && formData.LocationName && formData.LocationId) {
      setStock((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? { ...item, ...formData } : item)),
      )
      setShowEditModal(false)
      setSelectedItem(null)
      resetForm()
    }
  }

  // Delete
  const handleDeleteProduct = (item) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedItem) {
      setStock((prev) => prev.filter((item) => item.id !== selectedItem.id))
    }
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

  // Filter + Sort
  const filteredAndSortedData = useMemo(() => {
    let filtered = stock.filter((item) =>
      item.ProjectName.toLowerCase().includes(searchTerm.toLowerCase()),
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

  // Pagination
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
    <div className="bg-white w-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Master</h2>
          <p className="text-gray-600 mt-1 text-sm">Manage Project Master</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <ExportButton data={stock} fileName="Projects.xlsx" sheetName="Projects" />
          <button
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 flex items-center justify-center  w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {['ProjectName', 'LocationName', 'LocationId'].map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  {key.replace(/([A-Z])/g, ' $1')}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.projectName}</td>
                <td className="px-4 py-3">{item.projectAddress}</td>
                <td className="px-4 py-3">{item.siteId}</td>
                <td className="px-4 py-3 flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4 mx-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(item)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Items per page */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-700">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border border-gray-300 px-2 py-1 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-gray-700">
              per page | Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} of{' '}
              {filteredAndSortedData.length}
            </span>
          </div>

          {/* Pagination buttons */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50 disabled:opacity-50 flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
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

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50 disabled:opacity-50 flex items-center"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Project
