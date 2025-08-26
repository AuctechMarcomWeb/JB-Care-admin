import React, { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Power,
  PowerOff,
  User,
  Zap,
  DollarSign,
  Settings,
  Download,
  RefreshCw,
  X,
  AlertTriangle,
} from 'lucide-react'
import ExportButton from '../ExportButton'

const SmartMeter = () => {
  // Sample data - replace with your actual data
  const [metersData] = useState([
    {
      id: 1,
      userId: 'USR001',
      meterId: 'MTR001',
      customerName: 'John Doe',
      meterReading: 1245.6,
      amount: 89.5,
      meterType: 'prepaid',
      maintenance: 'paid',
      isActive: true,
    },
    {
      id: 2,
      userId: 'USR002',
      meterId: 'MTR002',
      customerName: 'Jane Smith',
      meterReading: 987.3,
      amount: 156.75,
      meterType: 'postpaid',
      maintenance: 'pending',
      isActive: true,
    },
    {
      id: 3,
      userId: 'USR003',
      meterId: 'MTR003',
      customerName: 'Mike Johnson',
      meterReading: 2134.8,
      amount: 201.2,
      meterType: 'prepaid',
      maintenance: 'paid',
      isActive: false,
    },
    {
      id: 4,
      userId: 'USR004',
      meterId: 'MTR004',
      customerName: 'Sarah Wilson',
      meterReading: 1567.2,
      amount: 98.4,
      meterType: 'postpaid',
      maintenance: 'pending',
      isActive: true,
    },
    {
      id: 5,
      userId: 'USR005',
      meterId: 'MTR005',
      customerName: 'David Brown',
      meterReading: 845.9,
      amount: 67.3,
      meterType: 'prepaid',
      maintenance: 'paid',
      isActive: true,
    },
    {
      id: 6,
      userId: 'USR006',
      meterId: 'MTR006',
      customerName: 'Lisa Davis',
      meterReading: 1789.4,
      amount: 134.8,
      meterType: 'postpaid',
      maintenance: 'pending',
      isActive: false,
    },
    {
      id: 7,
      userId: 'USR007',
      meterId: 'MTR007',
      customerName: 'Robert Taylor',
      meterReading: 2456.1,
      amount: 189.9,
      meterType: 'prepaid',
      maintenance: 'paid',
      isActive: true,
    },
    {
      id: 8,
      userId: 'USR008',
      meterId: 'MTR008',
      customerName: 'Emma Wilson',
      meterReading: 1023.7,
      amount: 78.6,
      meterType: 'postpaid',
      maintenance: 'pending',
      isActive: true,
    },
  ])

  // State for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [meterTypeFilter, setMeterTypeFilter] = useState('all')
  const [maintenanceFilter, setMaintenanceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedMeter, setSelectedMeter] = useState(null)
  const [meters, setMeters] = useState(metersData)

  // Toggle meter status with confirmation
  const handleToggleClick = (meter) => {
    setSelectedMeter(meter)
    setShowConfirmModal(true)
  }

  const confirmToggle = () => {
    if (selectedMeter) {
      setMeters((prev) =>
        prev.map((meter) =>
          meter.id === selectedMeter.id ? { ...meter, isActive: !meter.isActive } : meter,
        ),
      )
    }
    setShowConfirmModal(false)
    setSelectedMeter(null)
  }

  const cancelToggle = () => {
    setShowConfirmModal(false)
    setSelectedMeter(null)
  }

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = meters.filter((meter) => {
      const matchesSearch =
        meter.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meter.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meter.meterId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesMeterType = meterTypeFilter === 'all' || meter.meterType === meterTypeFilter
      const matchesMaintenance =
        maintenanceFilter === 'all' || meter.maintenance === maintenanceFilter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && meter.isActive) ||
        (statusFilter === 'inactive' && !meter.isActive)

      return matchesSearch && matchesMeterType && matchesMaintenance && matchesStatus
    })

    // Sort data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [meters, searchTerm, meterTypeFilter, maintenanceFilter, statusFilter, sortConfig])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  // Status badge component
  const StatusBadge = ({ status, type }) => {
    const styles = {
      prepaid: 'bg-blue-100 text-blue-800 border-blue-200',
      postpaid: 'bg-purple-100 text-purple-800 border-purple-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="bg-white">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
            </div>

            <p className="text-gray-600 mb-6">
              {selectedMeter && (
                <>
                  Are you sure you want to {selectedMeter.isActive ? 'turn OFF' : 'turn ON'} meter{' '}
                  <strong>{selectedMeter.meterId}</strong> for customer{' '}
                  <strong>{selectedMeter.customerName}</strong>?
                </>
              )}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelToggle}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggle}
                className={`px-6 py-2 text-white font-medium transition-colors ${
                  selectedMeter?.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {selectedMeter?.isActive ? 'Turn OFF' : 'Turn ON'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meter Management</h2>
            <p className="text-gray-600 mt-1">Manage customer meters and billing</p>
          </div>
          <div className="flex items-center space-x-3">
            <ExportButton data={meters} fileName="Complaints.xlsx" sheetName="Complaints" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, user ID, or meter ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Meter Type Filter */}
          <div>
            <select
              value={meterTypeFilter}
              onChange={(e) => setMeterTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Meter Types</option>
              <option value="prepaid">Prepaid</option>
              <option value="postpaid">Postpaid</option>
            </select>
          </div>

          {/* Maintenance Filter */}
          <div>
            <select
              value={maintenanceFilter}
              onChange={(e) => setMaintenanceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Maintenance</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('userId')}
              >
                <div className="flex items-center">
                  User ID
                  <ChevronDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('meterId')}
              >
                <div className="flex items-center">
                  Meter ID
                  <ChevronDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center">
                  Customer Name
                  <ChevronDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('meterReading')}
              >
                <div className="flex items-center">
                  Meter Reading
                  <ChevronDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  <ChevronDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meter Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Maintenance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((meter) => (
              <tr key={meter.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {meter.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {meter.meterId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{meter.customerName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                    {meter.meterReading} kWh
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-500" />${meter.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={meter.meterType} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={meter.maintenance} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleClick(meter)}
                    className={`flex items-center px-3 py-1 text-sm font-medium transition-colors ${
                      meter.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {meter.isActive ? (
                      <>
                        <Power className="w-4 h-4 mr-1" />
                        ON
                      </>
                    ) : (
                      <>
                        <PowerOff className="w-4 h-4 mr-1" />
                        OFF
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
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
                    className={`px-3 py-1 text-sm border ${
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
              className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

export default SmartMeter
