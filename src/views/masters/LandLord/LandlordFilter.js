/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import { Input, Select, DatePicker, Button, Checkbox, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const LandlordFilter = ({
  sites,
  projects,
  units,
  selectedSite,
  setSelectedSite,
  selectedProject,
  setSelectedProject,
  selectedUnit,
  setSelectedUnit,
  tempFromDate,
  setTempFromDate,
  tempToDate,
  setTempToDate,
  searchTerm,
  setSearchTerm,
  isActive,
  setIsActive,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  setPage,
  setUpdateStatus,
}) => {
  // Handle Date Range Change
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setTempFromDate(dates[0].format('YYYY-MM-DD'))
      setTempToDate(dates[1].format('YYYY-MM-DD'))
    } else {
      setTempFromDate('')
      setTempToDate('')
    }
  }

  // Apply filters only when clicked
  const handleApply = () => {
    setFromDate(tempFromDate)
    setToDate(tempToDate)
    setPage(1)
    setUpdateStatus((prev) => !prev)
  }

  // Clear all filters
  const handleClear = () => {
    setSelectedSite('')
    setSelectedProject('')
    setSelectedUnit('')
    setTempFromDate('')
    setTempToDate('')
    setFromDate('')
    setToDate('')
    setSearchTerm('')
    setIsActive(false)
    setPage(1)
    setUpdateStatus((prev) => !prev)
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <Row gutter={[16, 16]}>
        {/* 🔹 Site */}
        <Col xs={24} sm={12} md={6} lg={4}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
          <Select
            allowClear
            placeholder="Select Site"
            value={selectedSite || undefined}
            onChange={(val) => setSelectedSite(val || '')}
            style={{ width: '100%' }}
            options={sites.map((s) => ({ label: s.siteName, value: s._id }))}
          />
        </Col>

        {/* 🔹 Project */}
        <Col xs={24} sm={12} md={6} lg={4}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
          <Select
            allowClear
            placeholder="Select Project"
            value={selectedProject || undefined}
            onChange={(val) => setSelectedProject(val || '')}
            style={{ width: '100%' }}
            options={projects.map((p) => ({ label: p.projectName, value: p._id }))}
          />
        </Col>

        {/* 🔹 Unit */}
        <Col xs={24} sm={12} md={6} lg={4}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <Select
            allowClear
            placeholder="Select Unit"
            value={selectedUnit || undefined}
            onChange={(val) => setSelectedUnit(val || '')}
            style={{ width: '100%' }}
            options={units.map((u) => ({ label: u.unitNumber, value: u._id }))}
          />
        </Col>

        {/* 🔹 Date Range */}
        <Col xs={24} sm={12} md={6} lg={5}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <RangePicker
            style={{ width: '100%' }}
            value={[
              tempFromDate ? dayjs(tempFromDate) : null,
              tempToDate ? dayjs(tempToDate) : null,
            ]}
            onChange={handleDateChange}
          />
        </Col>

        {/* 🔹 Search (Live Filter) */}
        <Col xs={24} sm={12} md={6} lg={5}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <Input
            placeholder="Search by name or address..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
          />
        </Col>

        {/* 🔹 Active Checkbox */}
        <Col xs={24} sm={12} md={6} lg={3} className="flex items-end">
          <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>
            Active
          </Checkbox>
        </Col>

        {/* 🔹 Buttons */}
        <Col xs={24} className="flex flex-wrap gap-2 justify-end mt-2">
          <Button type="primary" onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
            Apply
          </Button>
          {(fromDate ||
            toDate ||
            searchTerm ||
            selectedSite ||
            selectedProject ||
            selectedUnit ||
            isActive) && (
            <Button danger onClick={handleClear}>
              Clear
            </Button>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default LandlordFilter
