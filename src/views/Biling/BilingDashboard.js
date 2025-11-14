/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
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

const BilingDashboard = () => {
  const [selectedProperty, setSelectedProperty] = useState(null)

  // Dashboard Statistics
  const stats = [
    {
      label: 'Total Properties',
      value: '256',
      icon: Home,
      color: 'from-blue-400 to-blue-500',
    },
    {
      label: 'Properties Sold',
      value: '48',
      icon: TrendingUp,
      color: 'from-green-400 to-green-500',
    },
    {
      label: 'Total Revenue',
      value: '₹45.2L',
      icon: DollarSign,
      color: 'from-purple-400 to-purple-500',
    },
    {
      label: 'Active Users',
      value: '1,230',
      icon: Users,
      color: 'from-orange-400 to-orange-500',
    },
  ]

  // Property Status Data
  const propertyStatus = [
    { name: 'Sold', value: 48, color: '#10b981' },
    { name: 'Available', value: 156, color: '#3b82f6' },
    { name: 'Pending', value: 32, color: '#f59e0b' },
    { name: 'Maintenance', value: 20, color: '#ef4444' },
  ]

  // Billing Summary
  const billingData = [
    {
      name: 'Total Amount',
      value: '₹12.5L',
      color: 'bg-blue-500',
      percentage: 100,
    },
    { name: 'Paid', value: '₹8.2L', color: 'bg-green-500', percentage: 65 },
    { name: 'Unpaid', value: '₹4.3L', color: 'bg-red-500', percentage: 35 },
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

          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-900 px-2 py-2 rounded-lg font-semibold  hover:bg-gray-100 transition w-full md:w-auto">
              <Download size={20} /> Export
            </button>
            <button className="flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 px-5 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition w-full md:w-auto">
              <Plus size={20} /> Add Billing
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
              {' '}
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold border border-gray-200">
                    Landlord
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold border border-gray-200">
                    Property
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold border border-gray-200">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold border border-gray-200">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold border border-gray-200">
                    Due Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((prop, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-2 px-2 text-gray-900 font-medium border border-gray-200">
                      {prop.landlord}
                    </td>
                    <td className="py-3 px-4 text-gray-700 border border-gray-200">
                      {prop.property}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-semibold border border-gray-200">
                      {prop.amount}
                    </td>
                    <td className="py-3 px-4 border border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          prop.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : prop.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-semibold">₹{prop.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BilingDashboard
