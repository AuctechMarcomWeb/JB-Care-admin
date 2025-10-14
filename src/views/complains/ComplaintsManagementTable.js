import React, { useState, useMemo, useEffect } from 'react'
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Home,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Edit,
} from 'lucide-react'
import ExportButton from '../ExportButton'
import { getRequest } from '../../Helpers'

const ComplaintsManagementTable = () => {
  // Sample complaints data - replace with your actual data
  const [complaintsData] = useState([
    {
      id: 1,
      flatType: 'A-101',
      contactNumber: '+91 9876543210',
      problemDescription: 'Water leakage in bathroom ceiling causing damage to electrical fittings',
      status: 'pending',
      createdDate: '2024-01-15',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS17lS27WuUNirwy9zeYEoGGTqntiM7JtsYNw&s',
    },
    {
      id: 2,
      flatType: 'B-205',
      contactNumber: '+91 9876543211',
      problemDescription: 'Elevator not working properly, getting stuck between floors',
      status: 'in-progress',
      createdDate: '2024-01-14',
      image: 'https://www.shutterstock.com/shutterstock/videos/1066661740/thumb/1.jpg',
    },
    {
      id: 3,
      flatType: 'C-304',
      contactNumber: '+91 9876543212',
      problemDescription: 'Air conditioning unit making loud noise and not cooling effectively',
      status: 'completed',
      createdDate: '2024-01-13',
      image:
        'https://davisheatingair.com/wp-content/uploads/2022/03/outside-ac-unit-making-loud-noise.jpg',
    },
    {
      id: 4,
      flatType: 'A-506',
      contactNumber: '+91 9876543213',
      problemDescription: 'Main door lock mechanism broken, unable to lock properly',
      status: 'pending',
      createdDate: '2024-01-16',
      image:
        'https://media.istockphoto.com/id/1460998703/photo/photo-collage-of-bedroom-before-and-after-renovation.jpg?s=612x612&w=0&k=20&c=N8Cs57CArG9I91Ipoxk6Vjy8cswBBNHN7hJs0Sfnspw=',
    },
    {
      id: 5,
      flatType: 'D-102',
      contactNumber: '+91 9876543214',
      problemDescription: 'Kitchen sink tap leaking continuously, water wastage issue',
      status: 'in-progress',
      createdDate: '2024-01-12',
      image:
        'https://media.istockphoto.com/id/1461004319/photo/comparison-of-bedroom-before-and-after-renovation.jpg?s=612x612&w=0&k=20&c=-qPZ8RO9eii8CDWMrwgSVJ2GsCN246MuZrD1tgsrN6A=',
    },
    {
      id: 6,
      flatType: 'B-403',
      contactNumber: '+91 9876543215',
      problemDescription: 'Parking area light not working, security concern during night',
      status: 'completed',
      createdDate: '2024-01-11',
      image:
        'https://media.istockphoto.com/id/1457257406/photo/narrow-toilet-room-with-minimalist-design.jpg?s=612x612&w=0&k=20&c=_ELXJBCnvP75ycvjPr1XkRJcrQhWIsahzjHDWDFm_WE=',
    },
    {
      id: 7,
      flatType: 'C-201',
      contactNumber: '+91 9876543216',
      problemDescription: 'Balcony railing loose and unsafe, needs immediate repair',
      status: 'pending',
      createdDate: '2024-01-17',
      image:
        'https://media.istockphoto.com/id/1461004561/photo/apartment-bedroom-before-and-after-renovation.jpg?s=612x612&w=0&k=20&c=1dcqJMmNZsB988CIfWEGG-hF-RqnUGrLdpjdsZRy_-A=',
    },
    {
      id: 8,
      flatType: 'A-303',
      contactNumber: '+91 9876543217',
      problemDescription: 'Internet connection issues, slow speed and frequent disconnections',
      status: 'in-progress',
      createdDate: '2024-01-10',
      image:
        'https://media.istockphoto.com/id/1457187821/photo/interior-of-modern-kitchen-with-blue-furniture.jpg?s=612x612&w=0&k=20&c=_jYtLj0uknJU3rAw9gO2D_oywhDhYEOgkf7m6UqrrMs=',
    },
  ])

  // State for filtering, pagination, and status updates
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  // const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [complaints, setComplaints] = useState(complaintsData)
  const [data, setData] = useState([])

  // Handle status update click
  const handleStatusClick = (complaint) => {
    setSelectedComplaint(complaint)
    setNewStatus(complaint.status)
    setShowStatusModal(true)
  }

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

  const confirmStatusUpdate = () => {
    if (selectedComplaint && newStatus !== selectedComplaint.status) {
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === selectedComplaint.id ? { ...complaint, status: newStatus } : complaint,
        ),
      )
    }
    setShowStatusModal(false)
    setSelectedComplaint(null)
    setNewStatus('')
  }

  const cancelStatusUpdate = () => {
    setShowStatusModal(false)
    setSelectedComplaint(null)
    setNewStatus('')
  }

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = complaints.filter((complaint) => {
      const matchesSearch =
        complaint.flatType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.contactNumber.includes(searchTerm) ||
        complaint.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
      // const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;

      return matchesSearch && matchesStatus
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
  }, [complaints, searchTerm, statusFilter, sortConfig])

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
  const StatusBadge = ({ status, onClick, showEditIcon = false }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
    }

    const icons = {
      pending: Clock,
      'in-progress': AlertTriangle,
      completed: CheckCircle,
    }

    const Icon = icons[status]

    return (
      <button
        onClick={onClick}
        className={`px-3 py-1 text-sm font-medium border ${styles[status]} flex items-center hover:opacity-80 transition-opacity`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        {showEditIcon && <Edit className="w-3 h-3 ml-1" />}
      </button>
    )
  }

  // Priority badge component
  // const PriorityBadge = ({ priority }) => {
  //   const styles = {
  //     high: "bg-red-100 text-red-800 border-red-200",
  //     medium: "bg-orange-100 text-orange-800 border-orange-200",
  //     low: "bg-gray-100 text-gray-800 border-gray-200"
  //   };

  //   return (
  //     <span className={`px-2 py-1 text-xs font-medium border ${styles[priority]}`}>
  //       {priority.charAt(0).toUpperCase() + priority.slice(1)}
  //     </span>
  //   );
  // };

  return (
    <div className="bg-white">
      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Edit className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Update Complaint Status</h3>
            </div>

            <p className="text-gray-600 mb-4">
              {selectedComplaint && (
                <>
                  Update status for complaint from <strong>{selectedComplaint.flatType}</strong>
                </>
              )}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Status:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelStatusUpdate}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
            <p className="text-gray-600 mt-1">Track and manage property complaints</p>
          </div>
          <div className="flex items-center space-x-3">
            <ExportButton data={complaints} fileName="Complaints.xlsx" sheetName="Complaints" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by flat type, contact, or problem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex-shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
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
                onClick={() => handleSort('flatType')}
              >
                <div className="flex items-center">
                  Flat Type
                  <ChevronDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('contactNumber')}
              >
                <div className="flex items-center">
                  Contact Number
                  <ChevronDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Problem Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdDate')}
              >
                <div className="flex items-center">
                  Date Created
                  <ChevronDown className="ml-1 w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status (Action)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Home className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{complaint.flatType}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-900">{complaint.contactNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start">
                    <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-900 max-w-xs">
                      {complaint.problemDescription}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="w-20 h-20 object-cover rounded border"
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(complaint.createdDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge
                    status={complaint.status}
                    onClick={() => handleStatusClick(complaint)}
                    showEditIcon={true}
                  />
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

export default ComplaintsManagementTable
