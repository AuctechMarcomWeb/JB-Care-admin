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
      increase: '+12%',
    },
    {
      label: 'Properties Sold',
      value: '48',
      icon: TrendingUp,
      color: 'from-green-400 to-green-500',
      increase: '+8%',
    },
    {
      label: 'Total Revenue',
      value: '₹45.2L',
      icon: DollarSign,
      color: 'from-purple-400 to-purple-500',
      increase: '+24%',
    },
    {
      label: 'Active Users',
      value: '1,230',
      icon: Users,
      color: 'from-orange-400 to-orange-500',
      increase: '+15%',
    },
  ]

  // Property Status Data
  const propertyStatus = [
    { name: 'Sold', value: 48, color: '#10b981' },
    { name: 'Available', value: 156, color: '#3b82f6' },
    { name: 'Pending', value: 32, color: '#f59e0b' },
    { name: 'Maintenance', value: 20, color: '#ef4444' },
  ]

  // Monthly Revenue Data
  const revenueData = [
    { month: 'Jan', revenue: 320, target: 400 },
    { month: 'Feb', revenue: 380, target: 400 },
    { month: 'Mar', revenue: 420, target: 400 },
    { month: 'Apr', revenue: 390, target: 400 },
    { month: 'May', revenue: 450, target: 400 },
    { month: 'Jun', revenue: 380, target: 400 },
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
    <div className="min-h-screen bg-white-50 p-1 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Property Billing Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your property management overview</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition">
            <Download size={20} /> Export
          </button>
          <button className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
            <Plus size={20} /> Add Billing
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow hover:shadow-lg transition`}
            >
              <div className="flex justify-between items-start mb-4">
                <Icon size={28} className="opacity-80" />
                <span className="text-green-200 text-sm font-semibold">{stat.increase}</span>
              </div>
              <h3 className="text-white text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Property Status Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={propertyStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {propertyStatus.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} properties`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {propertyStatus.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue vs Target</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="#e5e7eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Billing Summary */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Billing Summary</h2>
          <div className="space-y-6">
            {billingData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-xl p-6 shadow mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend (Last 6 Months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#f59e0b"
              strokeWidth={3}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Landlord</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Property</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Due Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentProperties.map((prop, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-gray-900 font-medium">{prop.landlord}</td>
                  <td className="py-3 px-4 text-gray-700">{prop.property}</td>
                  <td className="py-3 px-4 text-gray-900 font-semibold">{prop.amount}</td>
                  <td className="py-3 px-4">
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
  )
}

export default BilingDashboard
