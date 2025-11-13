import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spin, Card, Row, Col, Image, Divider, Tag, Button, Collapse } from 'antd'
import {
  ClockCircleOutlined,
  UserOutlined,
  HomeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ToolOutlined,
  PictureOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import { getRequest } from '../../Helpers'
import { ArrowLeft } from 'lucide-react'

const { Panel } = Collapse

const ComplaintView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
 
  useEffect(() => {
    setLoading(true)
    getRequest(`complaints/${id}`)
      .then((res) => {
        if (res?.data?.success) {
          const complaintData = res.data.data.complaints
            ? res.data.data.complaints[0]
            : res.data.data
          setComplaint(complaintData)
        } else {
          setError(res?.data?.message || 'Failed to fetch complaint')
        }
      })
      .catch(() => setError('Error fetching complaint'))
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (date) => moment(date).format('DD MMM YYYY, hh:mm A')

 const [activeKeys, setActiveKeys] = useState([]);

// Compute pendingKey only when complaint exists
useEffect(() => {
  if (complaint?.statusHistory?.length) {
    const pending = complaint.statusHistory.find(h => h.status === "Pending");
    if (pending) {
      setActiveKeys([pending._id]); // open pending panel initially
    }
  }
}, [complaint]);

const handleChange = (keys) => {
  // Ensure keys is always an array
  const updatedKeys = Array.isArray(keys) ? keys : [keys];

  // Find Pending key dynamically from complaint
  const pending = complaint?.statusHistory?.find(h => h.status === "Pending")?._id;

  // Always include Pending in active keys
  if (pending && !updatedKeys.includes(pending)) {
    updatedKeys.push(pending);
  }

  setActiveKeys(updatedKeys);
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange'
      case 'Under Review':
        return 'blue'
      case 'Material Demand Raised':
        return 'purple'
      case 'Resolved':
        return 'green'
      case 'Repushed':
        return 'red'
      case 'Closed':
        return 'gray'
      default:
        return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <ClockCircleOutlined />
      case 'Under Review':
        return <SyncOutlined spin />
      case 'Material Demand Raised':
        return <ToolOutlined />
      case 'Resolved':
        return <CheckCircleOutlined />
      case 'Repushed':
        return <CloseCircleOutlined />
      case 'Closed':
        return <CheckCircleOutlined />
      default:
        return <FileTextOutlined />
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading complaint..." />
      </div>
    )
  if (error)
    return (
      <div className="p-4">
        <Card>
          <p style={{ color: 'red' }}>{error}</p>
        </Card>
      </div>
    )
  if (!complaint) return null

  return (
    <div className="min-h-screen bg-gray-50 p-1 sm:p-6 lg:p-8">
      {/* 🔙 Back Button (Outside Card) */}
      <div className="w-full max-w-5xl mb-2">
        <div
          onClick={() => navigate('/complaints')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer transition-all w-fit"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back</span>
        </div>
      </div>

      <Card className="shadow-lg rounded-lg p-1 sm:p-6 lg:p-8">
        <h1 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-6 text-center">
          Complaint Overview
        </h1>
        <hr className="mt-1" />

        <Card bordered className="shadow-sm mb-2 p-2 sm:p-3">
          {/* Centered Title */}
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
            Complaint Title : {complaint.complaintTitle}
          </h2>
          <Row gutter={[12, 12]}>
            {/* Left column */}
            <Col xs={24} sm={24} md={12}>
              <div className="flex flex-col gap-2 text-[15px] sm:text-[16px] leading-snug">
                <p className="break-words">
                  <span className="font-semibold">Tenant :</span>{' '}
                  <span className="font-normal">{complaint.userId?.name}</span>
                </p>
                <p className="break-words">
                  <span className="font-semibold">Site :</span>{' '}
                  <span className="font-normal">{complaint.siteId?.siteName}</span>
                </p>
                <p className="break-words">
                  <span className="font-semibold">Unit :</span>{' '}
                  <span className="font-normal">{complaint.unitId?.unitNumber}</span>
                </p>

                {/* Highlighted Status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">Status :</span>
                  <Tag
                    color={
                      complaint.status === 'Pending'
                        ? 'orange'
                        : complaint.status === 'In Progress'
                          ? 'blue'
                          : complaint.status === 'Resolved'
                            ? 'green'
                            : complaint.status === 'Closed'
                              ? 'red'
                              : 'default'
                    }
                    className="text-[15px] sm:text-[16px] px-2 py-[2px] rounded-md font-normal"
                  >
                    {complaint.status}
                  </Tag>
                </div>
              </div>
            </Col>

            {/* Right column */}
            <Col xs={24} sm={24} md={12}>
              <div className="flex flex-col gap-2 text-[15px] sm:text-[16px] leading-snug">
                <p className="break-words">
                  <span className="font-semibold">Description :</span>{' '}
                  <span className="font-normal">{complaint.complaintDescription}</span>
                </p>

                {/* Inline Images with Label */}
                {complaint.images?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="font-semibold whitespace-nowrap">Images :</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {complaint.images.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`complaint-${idx}`}
                          className="rounded-md shadow-sm"
                          style={{
                            width: 90,
                            height: 70,
                            objectFit: 'cover',
                            cursor: 'pointer',
                          }}
                          preview={{ mask: <PictureOutlined /> }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card>
        <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 16 }}>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">Status History</h2>
    <Collapse accordion={false} activeKey={activeKeys} onChange={handleChange}>

            {complaint.statusHistory.map((history, idx) => (
              <Panel
                key={history._id || idx}
                header={
                  <div className="flex justify-between items-center w-full">
                    <Tag
                      color={getStatusColor(history.status)}
                      icon={getStatusIcon(history.status)}
                    >
                      {history.status}
                    </Tag>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {formatDate(history.updatedAt)}
                    </span>
                  </div>
                }
              >
                {history.comment && (
                  <p>
                    <strong>Comment:</strong> {history.comment}
                  </p>
                )}

                {history.supervisorDetails?.comments && (
                  <div className="mt-2">
                    <p>
                      <strong>Supervisor:</strong> {history.supervisorDetails.comments}
                    </p>
                    {history.supervisorDetails.images?.length > 0 && (
                      <Row gutter={[8, 8]}>
                        Images:
                        {history.supervisorDetails.images.map((img, i) => (
                          <Col xs={12} sm={8} md={6} lg={4} key={i}>
                            <Image
                              src={img}
                              alt={`supervisor-${i}`}
                              style={{
                                width: '100%',
                                height: 60,
                                objectFit: 'cover',
                                cursor: 'pointer',
                              }}
                              preview={{ mask: <PictureOutlined /> }}
                            />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                )}

                {history.materialDemand && (
                  <div className="mt-2">
                    <p>
                      <strong>Material Demand:</strong> {history.materialDemand.materialName}
                    </p>
                    <p>
                      <strong>Material Quantity:</strong> {history.materialDemand.quantity}
                    </p>
                    <p>
                      <strong>Reason:</strong> {history.materialDemand.reason}
                    </p>
                    {history.materialDemand.images?.length > 0 && (
                      <Row gutter={[8, 8]}>
                        {' '}
                        Images:
                        {history.materialDemand.images.map((img, i) => (
                          <Col xs={12} sm={8} md={6} lg={4} key={i}>
                            <Image
                              src={img}
                              alt={`material-${i}`}
                              style={{
                                width: '100%',
                                height: 60,
                                objectFit: 'cover',
                                cursor: 'pointer',
                              }}
                              preview={{ mask: <PictureOutlined /> }}
                            />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                )}

                {history.resolution && (
                  <div className="mt-2">
                    <p>
                      <strong>Remarks:</strong> {history.resolution.remarks}
                    </p>
                    {history.resolution.images?.length > 0 && (
                      <Row gutter={[8, 8]}>
                        {' '}
                        Images:
                        {history.resolution.images.map((img, i) => (
                          <Col xs={12} sm={8} md={6} lg={4} key={i}>
                            <Image
                              src={img}
                              alt={`resolution-${i}`}
                              style={{
                                width: '100%',
                                height: 60,
                                objectFit: 'cover',
                                cursor: 'pointer',
                              }}
                              preview={{ mask: <PictureOutlined /> }}
                            />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                )}

                {history.closureDetails && (
                  <div className="mt-2">
                    <p>
                      <strong>Closure Remarks:</strong> {history.closureDetails.remarks}
                    </p>
                    {history.closureDetails.images?.length > 0 && (
                      <Row gutter={[8, 8]}>
                        {' '}
                        Images:
                        {history.closureDetails.images.map((img, i) => (
                          <Col xs={12} sm={8} md={6} lg={4} key={i}>
                            <Image
                              src={img}
                              alt={`closure-${i}`}
                              style={{
                                width: '100%',
                                height: 60,
                                objectFit: 'cover',
                                cursor: 'pointer',
                              }}
                              preview={{ mask: <PictureOutlined /> }}
                            />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </div>
                )}

                {history.repushedDetails && (
                  <div className="mt-2">
                    <p>
                      <strong>Repushed Count:</strong> {history.repushedDetails.count}
                    </p>
                    <p>
                      <strong>Reason:</strong> {history.repushedDetails.reason}
                    </p>
                    {/* <p><strong>Repushed At:</strong> {formatDate(history.repushedDetails.repushedAt)}</p> */}
                  </div>
                )}
              </Panel>
            ))}
          </Collapse>
        </Card>
      </Card>
    </div>
  )
}

export default ComplaintView
