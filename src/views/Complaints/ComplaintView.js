/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, Tag, Collapse, Image } from 'antd'
import moment from 'moment'
import { getRequest } from '../../Helpers'

const { Panel } = Collapse

const ComplaintView = () => {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getRequest(`complaints/${id}`)
      .then((res) => {
        if (res?.data?.success) setComplaint(res.data.data)
        else setError(res?.data?.message || 'Failed to fetch complaint')
      })
      .catch((err) => {
        console.error(err)
        setError('Error fetching complaint')
      })
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (dateString) => moment(dateString).format('DD-MM-YYYY HH:mm')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'gold'
      case 'Under Review':
        return 'blue'
      case 'Material Demand Raised':
        return 'purple'
      case 'Resolved':
        return 'green'
      case 'Repushed':
        return 'red'
      default:
        return 'gray'
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    )

  if (error)
    return <div className="text-red-500 py-10 text-center text-lg font-semibold">{error}</div>

  if (!complaint) return null

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6 max-w-5xl mx-auto">
      {/* Complaint Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{complaint.complaintTitle}</h1>
        <Tag color={getStatusColor(complaint.status)} className="text-lg font-medium">
          {complaint.status}
        </Tag>
      </div>

      {/* Tenant & Property Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-600 font-medium">Tenant</p>
          <p className="text-gray-800">{complaint.userId?.name}</p>
          <p className="text-gray-500 text-sm">{complaint.userId?.email}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">Property</p>
          <p className="text-gray-800">{complaint.siteId?.siteName}</p>
          <p className="text-gray-800">Unit: {complaint.unitId?.unitNumber}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">Added By</p>
          <p className="text-gray-800">{complaint.addedBy}</p>
          <p className="text-gray-500 text-sm">Created At: {formatDate(complaint.createdAt)}</p>
        </div>
      </div>

      {/* Complaint Description */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-700">{complaint.complaintDescription}</p>
      </div>

      {/* Complaint Images */}
      {complaint.images?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Images</h2>
          <div className="flex flex-wrap gap-4">
            {complaint.images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`Complaint ${i + 1}`}
                className="w-40 h-40 object-cover rounded-lg border"
                preview={{ mask: <div className="text-white text-center">View</div> }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Status History */}
      {complaint.statusHistory?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Status History</h2>
          <Collapse accordion>
            {complaint.statusHistory.map((history) => (
              <Panel
                header={
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{history.status}</span>
                    <span className="text-gray-500 text-sm">{formatDate(history.updatedAt)}</span>
                  </div>
                }
                key={history._id}
              >
                {history.comment && (
                  <p className="mb-2">
                    <strong>Comment:</strong> {history.comment}
                  </p>
                )}

                {/* Supervisor Images */}
                {history.supervisorDetails?.images?.length > 0 && (
                  <div className="mb-2">
                    <strong>Supervisor Images:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {history.supervisorDetails.images.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`Supervisor ${i + 1}`}
                          className="w-32 h-32 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Material Demand Images */}
                {history.materialDemand?.images?.length > 0 && (
                  <div className="mb-2">
                    <strong>Material Demand:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {history.materialDemand.images.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`Material ${i + 1}`}
                          className="w-32 h-32 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution Images */}
                {history.resolution?.images?.length > 0 && (
                  <div className="mb-2">
                    <strong>Resolution:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {history.resolution.images.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`Resolution ${i + 1}`}
                          className="w-32 h-32 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Repushed Reason */}
                {history.repushedDetails && (
                  <p>
                    <strong>Repushed Reason:</strong> {history.repushedDetails.reason}
                  </p>
                )}
              </Panel>
            ))}
          </Collapse>
        </div>
      )}
    </div>
  )
}

export default ComplaintView
