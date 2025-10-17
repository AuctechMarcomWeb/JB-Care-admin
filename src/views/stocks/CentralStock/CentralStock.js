/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Package, AlertTriangle } from 'lucide-react'
import ExportButton from '../../ExportButton'
import toast from 'react-hot-toast'
import { Empty, Pagination, Spin } from 'antd'
import CentralStockModal from './CentralStockModal'

const CentralStock = () => {
  // Static mock data
  const staticStockData = [
    {
      id: 1,
      productName: 'Electric Meter',
      productDetails:
        'Digital smart meter with WiFi connectivity, LCD display, and remote monitoring capabilities',
      quantity: 150,
      category: 'Electronics',
      minStockLevel: 20,
    },
    {
      id: 2,
      productName: 'Water Pipes',
      productDetails:
        'PVC pipes for water supply, 1 inch diameter, 10 feet length, corrosion resistant',
      quantity: 75,
      category: 'Plumbing',
      minStockLevel: 15,
    },
    {
      id: 3,
      productName: 'Door Locks',
      productDetails: 'Heavy duty mortise locks with 5 lever mechanism, anti-pick technology',
      quantity: 45,
      category: 'Hardware',
      minStockLevel: 10,
    },
    {
      id: 4,
      productName: 'LED Bulbs',
      productDetails: '12W LED energy saving bulbs, warm white light, B22 base, 2 year warranty',
      quantity: 200,
      category: 'Electronics',
      minStockLevel: 50,
    },
    {
      id: 5,
      productName: 'Cable Wires',
      productDetails:
        'Copper electrical wires, 2.5mm thickness, fire resistant coating, 100 meter roll',
      quantity: 30,
      category: 'Electrical',
      minStockLevel: 5,
    },
    {
      id: 6,
      productName: 'Paint Brushes',
      productDetails:
        'Professional paint brushes set, various sizes, synthetic bristles, ergonomic handle',
      quantity: 60,
      category: 'Tools',
      minStockLevel: 12,
    },
    {
      id: 7,
      productName: 'Faucets',
      productDetails:
        'Chrome finished bathroom faucets, single handle design, water saving aerator',
      quantity: 25,
      category: 'Plumbing',
      minStockLevel: 8,
    },
    {
      id: 8,
      productName: 'Floor Tiles',
      productDetails: 'Ceramic floor tiles, 2x2 feet, anti-slip surface, suitable for wet areas',
      quantity: 120,
      category: 'Construction',
      minStockLevel: 25,
    },
  ]

  // UI + filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [data, setData] = useState(staticStockData)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(false)

  // Modal & delete states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Filter and pagination logic
  useEffect(() => {
    setLoading(true)

    let filtered = [...staticStockData]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(term) ||
          item.productDetails.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term),
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    setTimeout(() => {
      setData(filtered)
      setLoading(false)
    }, 300) // simulate loading
  }, [searchTerm, categoryFilter, updateStatus])

  // Delete handler
  const confirmDelete = () => {
    if (!selectedItem) return
    const updated = data.filter((item) => item.id !== selectedItem.id)
    setData(updated)
    toast.success('Item deleted successfully!')
    setShowDeleteModal(false)
    setSelectedItem(null)
  }

  const categories = [...new Set(staticStockData.map((d) => d.category).filter(Boolean))]

  // Pagination slice
  const paginatedData = data.slice((page - 1) * limit, page * limit)
  const total = data.length

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
              Are you sure you want to delete{' '}
              <strong>{selectedItem?.productName || 'this item'}</strong>?
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
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
          <p className="text-gray-600 text-sm">Manage inventory and track stock levels</p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton data={data} fileName="StockData.xlsx" sheetName="Stock" />
          <button
            onClick={() => {
              setModalData(null)
              setIsModalOpen(true)
            }}
            className="bg-green-600 text-white px-3 sm:px-4 py-2 hover:bg-green-700 flex items-center justify-center rounded-md text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        {/* Search */}
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, details or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Clear button */}
        <div>
          <button
            onClick={() => {
              setSearchTerm('')
              setCategoryFilter('all')
              setUpdateStatus((p) => !p)
            }}
            className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 rounded-md mt-6"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spin size="large" />
            <div className="mt-4 text-blue-500 font-medium text-center">Loading stock...</div>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Empty description="No records found" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-3">Sr. No.</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Details</th>
                <th className="px-6 py-3 text-left">Qty</th>
                <th className="px-6 py-3 text-left">Min Stock</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {(page - 1) * limit + idx + 1}
                  </td>
                  <td className="px-6 py-4 flex items-center">
                    <Package className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{item.productName}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.productDetails}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 text-gray-500">{item.minStockLevel}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.quantity <= item.minStockLevel ? (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Low</span>
                    ) : item.quantity <= item.minStockLevel * 2 ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Medium
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => {
                        setModalData(item)
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && data.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              pageSizeOptions={['5', '10', '15', '20', '30', '50']}
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

      {/* Modal */}
      {isModalOpen && (
        <CentralStockModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modalData={modalData}
          setModalData={setModalData}
          setUpdateStatus={setUpdateStatus}
        />
      )}
    </div>
  )
}

export default CentralStock
