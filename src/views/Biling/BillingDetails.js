import React, { useEffect, useState, useCallback, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRequest } from '../../Helpers'
import { Spin, Button, Tag, Card } from 'antd'
import moment from 'moment'
import { Edit, Plus, ArrowLeft, Wallet, Home, Mail, Phone } from 'lucide-react'
import BilingModal from '../Biling/BilingModal'
import { BillingSummaryContext } from '../../context/BillingSummaryContext'
import { useBillingContext } from '../../context/bilingContext'

const BillingDetails = () => {
  const { landlordId } = useParams()
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState(null)
  const [billingData, setBillingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { billingSummary } = useContext(BillingSummaryContext)
  const { selectedBill } = useBillingContext()

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

  const landlord = billingData[0]?.landlordId || {}
  const site = billingData[0]?.siteId || {}
  const unit = billingData[0]?.unitId || {}

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading billing data..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-1 sm:p-6 lg:p-8">
      {/* 🔙 Back Button */}
      <div className="w-full max-w-5xl mb-2">
        <div
          onClick={() => navigate('/biling')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-all w-fit"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back</span>
        </div>
      </div>

      <Card className="shadow-lg rounded-lg p-0.5 sm:p-6 lg:p-8">
        <h1 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-6 text-center">
          Landlord Billing Profile
        </h1>
        <hr className="mt-1 mb-4" />

        {/* Profile Section */}
        <Card className="shadow-sm rounded-lg mb-6 p-2 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <img
              src={landlord?.profilePic||"https://cdn-icons-png.flaticon.com/512/4140/4140048.png"}
              alt="avatar"
              className="w-40 h-40 rounded-full border mx-auto md:mx-0"
            />
            <div className="flex-1 space-y-2">
      <h2 className="text-xl font-bold">{landlord?.name || 'N/A'}</h2>

      <p className="flex items-center gap-2 text-gray-500">
        <Phone size={16} className="text-current" /> {landlord?.phone || 'N/A'}
      </p>

      <p className="flex items-center gap-2 text-gray-500">
        <Mail size={16} className="text-current" /> {landlord?.email || 'N/A'}
      </p>

      <p className="flex items-center gap-2 text-gray-500">
        <Home size={16} className="text-current" /> {landlord?.address || 'N/A'}
      </p>

      <p className="flex items-center gap-2 text-gray-500">
        <Wallet size={16} className="text-current" /> Wallet Balance: ₹{landlord?.walletBalance || 0}
      </p>
    </div>

            <div className="text-right md:min-w-[200px] space-y-1">
              <p className="font-semibold text-gray-700">Site: {site?.siteName || 'N/A'}</p>
              <p className="text-gray-500">
                Unit: {unit?.unitNumber || 'N/A'} ({unit?.block || '-'})
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-2">
            <div className="bg-yellow-200 text-black p-2 rounded">
              <span className="font-semibold">Billing Till Today:</span>{' '}
              {selectedBill.billingTillToday || 'N/A'}
            </div>
            <div className="bg-green-200 text-black p-2 rounded">
              <span className="font-semibold">Previous Unpaid Bill:</span>{' '}
              {selectedBill.previousUnpaidBill || 'N/A'}
            </div>
          </div>
        </Card>

        {/* Billing Table */}
        <Card className="shadow-sm rounded-lg p-2 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Billing Summary</h3>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-200 text-black"
            >
              Add Bill
            </Button>
          </div>
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

      {/* Add/Edit Modal */}
      <BilingModal
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        setUpdateStatus={fetchBillingData}
        modalData={null}
        setModalData={() => {}}
        landlordId={landlord?._id}
      />
      {isEditModalOpen && (
        <BilingModal
          isModalOpen={isEditModalOpen}
          setIsModalOpen={setIsEditModalOpen}
          setUpdateStatus={fetchBillingData}
          modalData={selectedItem}
          setModalData={setSelectedItem}
          landlordId={landlord?._id}
        />
      )}
    </div>
  )
}

export default BillingDetails
