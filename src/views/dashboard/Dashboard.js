import React, { useState } from 'react'
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Zap,
  TrendingUp,
  Users,
  Building,
  Settings,
} from 'lucide-react'

const Dashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month')

  // Sample data - replace with your actual data
  const smartMeterData = {
    total: 1247,
    active: 1089,
    inactive: 158,
  }

  const complaintsData = {
    pending: 23,
    inProgress: 15,
    completed: 142,
    total: 180,
  }

  const inventoryData = {
    totalProducts: 456,
    inStock: 387,
    lowStock: 45,
    outOfStock: 24,
  }

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      red: 'bg-red-500 text-white',
      purple: 'bg-purple-500 text-white',
      gray: 'bg-gray-500 text-white',
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </div>
    )
  }

  const SectionCard = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="flex items-center">
          <Icon className="w-6 h-6 text-gray-700 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )

  const StatusBadge = ({ status, count }) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
      'in-stock': 'bg-green-100 text-green-800 border-green-200',
      'low-stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'out-of-stock': 'bg-red-100 text-red-800 border-red-200',
    }

    return (
      <div
        className={`px-4 py-2 rounded-full border ${statusStyles[status]} flex items-center justify-between min-w-[120px]`}
      >
        <span className="font-medium capitalize">{status.replace('-', ' ')}</span>
        <span className="font-bold ml-2">{count}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0">
      {/* Header */}
      <div className="mb-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2"> Dashboard</h1>
            {/* <p className="text-gray-600">Overview of your property management system</p> */}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Properties" 
          value="245" 
          icon={Building} 
          trend="+12% from last month"
          color="blue"
        />
        <StatCard 
          title="Active Tenants" 
          value="198" 
          icon={Users} 
          trend="+5% from last month"
          color="green"
        />
        <StatCard 
          title="Monthly Revenue" 
          value="$124K" 
          icon={TrendingUp} 
          trend="+8% from last month"
          color="purple"
        />
        <StatCard 
          title="Occupancy Rate" 
          value="94%" 
          icon={CheckCircle} 
          trend="+2% from last month"
          color="green"
        />
      </div> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Smart Meters Section */}
        <SectionCard title="Smart Meters" icon={Zap}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                Total: {smartMeterData.total}
              </span>
            </div>
            <div className="space-y-3">
              <StatusBadge status="active" count={smartMeterData.active} />
              <StatusBadge status="inactive" count={smartMeterData.inactive} />
            </div>
            <div className="mt-4 bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Active Rate</span>
                <span>{Math.round((smartMeterData.active / smartMeterData.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(smartMeterData.active / smartMeterData.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Complaints Section */}
        <SectionCard title="Complaints Management" icon={AlertCircle}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                Total: {complaintsData.total}
              </span>
            </div>
            <div className="space-y-3">
              <StatusBadge status="pending" count={complaintsData.pending} />
              <StatusBadge status="in-progress" count={complaintsData.inProgress} />
              <StatusBadge status="completed" count={complaintsData.completed} />
            </div>
            <div className="mt-4 bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Resolution Rate</span>
                <span>{Math.round((complaintsData.completed / complaintsData.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(complaintsData.completed / complaintsData.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Inventory Section - Full Width */}
      <SectionCard title="Inventory Management" icon={Package}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {inventoryData.totalProducts}
            </div>
            <div className="text-gray-600">Total Products</div>
          </div>
          <div className="space-y-3">
            <StatusBadge status="in-stock" count={inventoryData.inStock} />
          </div>
          <div className="space-y-3">
            <StatusBadge status="low-stock" count={inventoryData.lowStock} />
          </div>
          <div className="space-y-3">
            <StatusBadge status="out-of-stock" count={inventoryData.outOfStock} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-green-700 font-medium">Stock Level</span>
              <span className="text-green-700 font-bold">
                {Math.round((inventoryData.inStock / inventoryData.totalProducts) * 100)}%
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(inventoryData.inStock / inventoryData.totalProducts) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <span className="text-yellow-700 font-medium">Low Stock Items</span>
              <span className="text-yellow-700 font-bold">{inventoryData.lowStock}</span>
            </div>
            <p className="text-sm text-yellow-600 mt-1">Needs restocking soon</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <span className="text-red-700 font-medium">Out of Stock</span>
              <span className="text-red-700 font-bold">{inventoryData.outOfStock}</span>
            </div>
            <p className="text-sm text-red-600 mt-1">Requires immediate attention</p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export default Dashboard
