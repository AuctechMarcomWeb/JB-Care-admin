/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRequest } from '../../Helpers'
import { Spin, Button, Tag, Card, Modal, Empty } from 'antd'
import moment from 'moment'
import { Edit, Plus, ArrowLeft } from 'lucide-react'
import BilingModal from '../Biling/BilingModal'
import { BillingSummaryContext } from '../../context/BillingSummaryContext'
const BillingDetails = () => {
  const { landlordId } = useParams()
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState(null)
  const [billingData, setBillingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { billingSummary } = useContext(BillingSummaryContext)

  // 🔄 Fetch billing data
  const fetchBillingData = useCallback(async () => {
    if (!landlordId) return
    setLoading(true)
    try {
      const res = await getRequest(`billing?landlordId=${landlordId}`)
      setBillingData(res?.data?.data || [])
    } catch (err) {
      console.error('Error fetching billing data:', err)
    } finally {
      setLoading(false)
    }
  }, [landlordId])

  useEffect(() => {
    fetchBillingData()
  }, [fetchBillingData])

  console.log('billingSummary?.billingTillToday', billingSummary?.[0]?.billingTillToday)

  const landlord = billingData[0]?.landlordId || {}
  const site = billingData[0]?.siteId || {}
  const unit = billingData[0]?.unitId || {}

  // 🧭 Loading & Empty State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    )
  }

  if (!billingData.length) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-center">
        <Empty description="No billing data found for this landlord." />
        <Button
          type="primary"
          icon={<ArrowLeft size={16} />}
          className="mt-4"
          onClick={() => navigate('/biling')}
        >
          Back to Billing
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      {/* 🔙 Back Button (Outside Card) */}
      <div className="w-full max-w-5xl mb-4">
        <div
          onClick={() => navigate('/biling')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-all w-fit"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back</span>
        </div>
      </div>

      {/* 🧾 Main Card Container */}
      <Card
        bordered={false}
        className="w-full h-full max-w-5xl rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-white p-6"
      >
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Landlord Billing Profile</h1>

          <div className="flex gap-3">
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Bill
            </Button>
          </div>
        </div>

        {/* Profile Section */}
        <Card className="rounded-xl border shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
              alt="avatar"
              className="w-28 h-28 rounded-full border mx-auto md:mx-0"
            />
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-bold">{landlord?.name || 'N/A'}</h2>
              <p className="text-gray-500">📞 {landlord?.phone || 'N/A'}</p>
              <p className="text-gray-500">✉️ {landlord?.email || 'N/A'}</p>
              <p className="text-gray-500">🏠 {landlord?.address || 'N/A'}</p>
            </div>
            <div className="text-right md:min-w-[200px]">
              <p className="font-semibold text-gray-700">Site: {site?.siteName || 'N/A'}</p>
              <p className="text-gray-500">
                Unit: {unit?.unitNumber || 'N/A'} ({unit?.block || '-'})
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <div className="bg-yellow-200 text-black p-2 rounded">
              <span className="font-semibold">Billing Till Today:</span>{' '}
              {billingSummary?.[0]?.billingTillToday || 'N/A'}
            </div>
            <div className="bg-green-200 text-black p-2 rounded">
              <span className="font-semibold">Previous Unpaid Bill:</span>{' '}
              {billingSummary?.[0]?.previousUnpaidBill || 'N/A'}
            </div>
          </div>
        </Card>

        {/* Billing Table */}
        <Card className="rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Billing Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  {[
                    '#',
                    'From',
                    'To',
                    'Electricity',
                    'Maintenance',
                    'GST',
                    'Total',
                    'Status',
                    'Payment ID',
                    'Action',
                  ].map((col) => (
                    <th key={col} className="border p-2 text-center font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billingData.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-center">
                      {moment(item.fromDate).format('DD MMM YYYY')}
                    </td>
                    <td className="border p-2 text-center">
                      {moment(item.toDate).format('DD MMM YYYY')}
                    </td>
                    <td className="border p-2 text-right">₹{item.electricityAmount}</td>
                    <td className="border p-2 text-right">₹{item.maintenanceAmount}</td>
                    <td className="border p-2 text-right">₹{item.gstAmount}</td>
                    <td className="border p-2 text-right font-semibold text-gray-800">
                      ₹{item.totalAmount}
                    </td>
                    <td className="border p-2 text-center">
                      <Tag color={item.status === 'Paid' ? 'green' : 'red'}>{item.status}</Tag>
                    </td>

                    <td className="border p-2 text-center">{item.paymentId || '-'}</td>
                    <td className="border p-2 text-center">
                      {' '}
                      <Button
                        icon={<Edit size={16} />}
                        onClick={() => {
                          setSelectedItem(item)
                          setIsEditModalOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Card>

      {/* ➕ Add Bill Modal */}
      <BilingModal
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        setUpdateStatus={fetchBillingData} // triggers refresh after adding bill
        modalData={null}
        setModalData={() => {}} // not used in add mode
      />
      {isEditModalOpen && (
        <BilingModal
          isModalOpen={isEditModalOpen}
          setIsModalOpen={setIsEditModalOpen}
          setUpdateStatus={fetchBillingData}
          modalData={selectedItem} // ✅ now this is the full item
          setModalData={setSelectedItem}
          landlordId={landlord?._id}
        />
      )}
    </div>
  )
}

export default BillingDetails
