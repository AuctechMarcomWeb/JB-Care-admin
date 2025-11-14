/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Home, DollarSign, Users, AlertCircle, Download, Plus } from 'lucide-react'
import ExportButton from '../ExportButton'
import BilingModal from './BilingModal'
import { getRequest } from '../../Helpers'
import { useNavigate } from 'react-router-dom'

const BilingDashboard = () => {
  const [dashData, setDashData] = useState([])
  const [data, setData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dashbill, setDashBill] = useState([])
  const [selectedLandlord, setSelectedLandlord] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    getRequest(`dashboard`)
      .then((res) => {
        console.log('res', res?.data?.data)

        setDashData(res?.data?.data || [])
      })
      .catch((err) => {
        console.error('Error fetching dashboards:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  // ✅ Fetch Data with Loader
  useEffect(() => {
    setLoading(true)
    const query = [
      // `search=${searchTerm}`,
      // `page=${page}`,
      selectedLandlord && `landlordId=${selectedLandlord}`,
    ]
      .filter(Boolean)
      .join('&')
    getRequest(`billing/billingSummary?${query}`)
      .then((res) => {
        const responseData = res?.data
        console.log('dfdf', res)

        setData(responseData?.data || [])
        setTotal(res?.data?.data?.total || 0)
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => setLoading(false)) // ✅ stop loader
  }, [updateStatus, selectedLandlord])

  const navigate = useNavigate()
  const handleRowClick = (landlordId) => {
    console.log('landlordId', landlordId)
    const selected = data.find((item) => item.landlordId === landlordId)
    console.log('Selected bill', selected)

    setSelectedBill(selected) // ✅ Save selected bill globally
    navigate(`/biling-details/${landlordId}`)
  }
  // Dashboard Statistics
  const stats = [
    {
      label: 'Total Properties',
      value: dashData?.totalUnits || 0,
      icon: Home,
      color: 'from-blue-400 to-blue-500',
    },
    {
      label: 'Properties Sold',
      value: dashData?.soldProperties || 0,
      icon: TrendingUp,
      color: 'from-green-400 to-green-500',
    },
    {
      label: 'Total Billing',
      value: `₹${dashData?.totalBilling || 0}`,
      icon: DollarSign,
      color: 'from-purple-400 to-purple-500',
    },
    {
      label: 'Active Users',
      value: dashData?.totalUsers || 0,
      icon: Users,
      color: 'from-orange-400 to-orange-500',
    },
  ]

  // Property Status Data
  const propertyStatus = [
    { name: 'Total', value: dashData?.totalUnits || 0, color: '#3b82f6' },
    { name: 'Available', value: dashData?.availableProperties || 0, color: '#10b981' },
    { name: 'Sold', value: dashData?.soldProperties || 0, color: '#ef4444' },
  ]

  // Billing Summary
  const billingData = [
    {
      name: 'Total Amount',
      value: `₹${dashData?.totalBilling || 0}`,
      color: 'bg-blue-500',
      percentage: 100,
    },
    {
      name: 'Paid',
      value: `₹${dashData?.totalPaidBilling || 0}`,
      color: 'bg-green-500',
      percentage: 65,
    },
    {
      name: 'Unpaid',
      value: `₹${dashData?.totalUnpaidBilling || 0}`,
      color: 'bg-red-500',
      percentage: 35,
    },
  ]

  // Recent Properties
  const recentProperties = [
    {
      id: 1,
      landlord: 'Anuj Verma',
      property: 'Vashundra Villa 103',
      amount: '₹61.00',
      status: 'Paid',
      due: '28.47',
    },
    {
      id: 2,
      landlord: 'Soniya',
      property: 'Green villa 4BHK FLAT',
      amount: '₹61.00',
      status: 'Paid',
      due: '28.47',
    },
    {
      id: 3,
      landlord: 'DGFDS',
      property: 'Vijay Khand Villa 121',
      amount: '₹119.00',
      status: 'Pending',
      due: '55.53',
    },
    {
      id: 4,
      landlord: 'Subodh',
      property: 'Premium Estate',
      amount: '₹95.00',
      status: 'Overdue',
      due: '89.50',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-2 sm:p-6 lg:p-8">
      {/* MAIN WRAPPER CARD */}
      <div className="w-full max-w-[1800px] bg-white  shadow-lg p-2 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            {/* <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Property Billing Dashboard
            </h1> */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900"> Billing Dashboard</h2>

            <p className="text-gray-600">Welcome back! Here's your property management overview</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <ExportButton data={data} fileName="Biling.xlsx" sheetName="Biling" />
            <button
              onClick={() => {
                setIsModalOpen(true)
              }}
              className="bg-yellow-400 text-black px-3 sm:px-4 py-2 hover:bg-yellow-500 flex items-center justify-center  text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Biling
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white shadow hover:shadow-xl transition`}
              >
                <div className="flex justify-between items-start mb-3">
                  <Icon size={28} className="opacity-80" />
                  <span className="text-green-200 text-sm font-semibold">{stat.increase}</span>
                </div>
                <h3 className="text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Charts Row - 2 Parts (Compact) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900"> Property Status Distribution</h2>

            {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Property Status Distribution
            </h2> */}

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={propertyStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {propertyStatus.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} properties`} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend Centered */}
            <div className="grid grid-cols-2 gap-2 mt-3 justify-items-center">
              {propertyStatus.map((item, idx) => (
                <div key={idx} className="flex justify-center items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Summary */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h2> */}
            <h2 className="text-xl font-bold text-gray-900"> Billing Summary</h2>

            <div className="space-y-4">
              {billingData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`${item.color} h-1.5 rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              View All
            </button>
          </div>

          <div className="overflow-x-auto w-full max-h-[70vh]">
            <table className="w-full min-w-max border border-gray-200">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-2 py-2 text-left border border-gray-200">Sr. No.</th>
                  <th className="px-2 py-2 text-left border border-gray-200">Landlord</th>
                  <th className="px-2 py-2 text-left border border-gray-200">Maintenance Amount</th>
                  <th className="px-2 py-2 text-left border border-gray-200">Electricity Bill</th>
                  <th className="px-2 py-2 text-left border border-gray-200">Current Billing</th>
                  <th className="px-2 py-2 text-left border border-gray-200">GST Amount</th>
                  <th className="px-2 py-2 text-left border border-gray-200">Total Amount</th>
                  <th className="px-2 py-2 text-left border border-gray-200">Billing Till Today</th>
                  <th className="px-2 py-2 text-left border border-gray-200">Previous Unpaid</th>
                  <th className="px-2 py-2 text-left border border-gray-200">Unpaid Bill</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {data?.map((item, index) => (
                  <tr
                    key={item?.landlordId}
                    className="whitespace-nowrap cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => handleRowClick(item?.landlordId)}
                  >
                    <td className="px-2 py-2 text-sm text-gray-700 border border-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-2 py-2 border border-gray-200">
                      <div className="font-semibold text-gray-800">{item.landlordName}</div>
                      <div className="text-sm text-gray-600">{item.siteNames}</div>
                      <div className="text-sm text-gray-600">{item.unitNumbers}</div>
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-200">
                      {item.totalMaintenance}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-200">
                      {item.totalElectricity}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-200">
                      {item.totalBillingAmount}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-200">
                      {item.totalGST}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-200">
                      {item.totalBillingAmount}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-200">
                      {item.billingTillToday}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-200">
                      {item.previousUnpaidBill}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-200">
                      {item.unpaidCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <BilingModal
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

export default BilingDashboard
