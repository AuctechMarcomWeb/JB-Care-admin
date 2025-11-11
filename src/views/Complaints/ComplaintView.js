// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Spin, Card, Row, Col, Image, Divider, Timeline, Tag, Button } from 'antd';
// import {
//   ClockCircleOutlined,
//   UserOutlined,
//   HomeOutlined,
//   FileTextOutlined,
//   CheckCircleOutlined,
//   SyncOutlined,
//   CloseCircleOutlined,
//   ToolOutlined,
//   PictureOutlined,
//   ArrowLeftOutlined,
// } from '@ant-design/icons';
// import moment from 'moment';
// import { getRequest } from '../../Helpers';

// const ComplaintView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [complaint, setComplaint] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     setLoading(true);
//     getRequest(`complaints/${id}`)
//       .then(res => {
//         if (res?.data?.success) {
//           const complaintData = res.data.data.complaints ? res.data.data.complaints[0] : res.data.data;
//           setComplaint(complaintData);
//         } else {
//           setError(res?.data?.message || 'Failed to fetch complaint');
//         }
//       })
//       .catch(() => setError('Error fetching complaint'))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const formatDate = date => moment(date).format('DD MMM YYYY, hh:mm A');

//   const getStatusColor = status => {
//     switch (status) {
//       case 'Pending': return 'orange';
//       case 'Under Review': return 'blue';
//       case 'Material Demand Raised': return 'purple';
//       case 'Resolved': return 'green';
//       case 'Repushed': return 'red';
//       case 'Closed': return 'gray';
//       default: return 'gray';
//     }
//   };

//   const getStatusIcon = status => {
//     switch (status) {
//       case 'Pending': return <ClockCircleOutlined />;
//       case 'Under Review': return <SyncOutlined spin />;
//       case 'Material Demand Raised': return <ToolOutlined />;
//       case 'Resolved': return <CheckCircleOutlined />;
//       case 'Repushed': return <CloseCircleOutlined />;
//       case 'Closed': return <CheckCircleOutlined />;
//       default: return <FileTextOutlined />;
//     }
//   };

//   if (loading) return <div className="flex justify-center items-center min-h-screen"><Spin size="large" tip="Loading complaint..." /></div>;
//   if (error) return <div className="p-6"><Card><p style={{ color: 'red' }}>{error}</p></Card></div>;
//   if (!complaint) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <Button
//         type="default"
//         icon={<ArrowLeftOutlined />}
//         onClick={() => navigate(-1)}
//         style={{ marginBottom: 16 }}
//       >
//         Back
//       </Button>

//       <Card className="shadow-lg rounded-lg p-6">
//         {/* Title */}
//         <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{complaint.complaintTitle}</h1>

//         {/* Complaint Overview Row */}
//         <Row gutter={16} style={{ marginBottom: 16 }}>
//           <Col xs={24} md={8}>
//             <Card bordered className="p-3 shadow-sm">
//               <UserOutlined style={{ fontSize: 16, color: '#1890ff', marginBottom: 4 }} />
//               <p style={{ fontWeight: 500, margin: 0 }}>Tenant</p>
//               <p style={{ margin: 0 }}>{complaint.userId?.name}</p>
//               <p style={{ color: '#888', fontSize: 12, margin: 0 }}>{complaint.userId?.email}</p>
//             </Card>
//           </Col>
//           <Col xs={24} md={8}>
//             <Card bordered className="p-3 shadow-sm">
//               <HomeOutlined style={{ fontSize: 16, color: '#52c41a', marginBottom: 4 }} />
//               <p style={{ fontWeight: 500, margin: 0 }}>Site</p>
//               <p style={{ margin: 0 }}>{complaint.siteId?.siteName}</p>
//             </Card>
//           </Col>
//           <Col xs={24} md={8}>
//             <Card bordered className="p-3 shadow-sm">
//               <p style={{ fontWeight: 500, margin: 0 }}>Unit</p>
//               <p style={{ margin: 0 }}>{complaint.unitId?.unitNumber}</p>
//             </Card>
//           </Col>
//         </Row>

//         {/* Description & Images */}
//         <Row gutter={16} style={{ marginBottom: 16 }}>
//           <Col xs={24} md={12}>
//             <Card bordered className="p-3 shadow-sm">
//               <FileTextOutlined style={{ fontSize: 16, color: '#1890ff', marginBottom: 4 }} />
//               <p style={{ fontWeight: 500, marginBottom: 8 }}>Description</p>
//               <p>{complaint.complaintDescription}</p>
//             </Card>
//           </Col>
//           <Col xs={24} md={12}>
//             {complaint.images?.length > 0 && (
//               <Card bordered className="p-3 shadow-sm">
//                 <PictureOutlined style={{ fontSize: 16, color: '#1890ff', marginBottom: 4 }} />
//                 <p style={{ fontWeight: 500, marginBottom: 8 }}>Images</p>
//                 <Row gutter={8}>
//                   {complaint.images.map((img, idx) => (
//                     <Col xs={8} key={idx}>
//                       <Image
//                         src={img}
//                         alt={`complaint-${idx}`}
//                         style={{ width: '100%', height: 80, objectFit: 'cover', cursor: 'pointer' }}
//                         preview={{ mask: <PictureOutlined /> }}
//                       />
//                     </Col>
//                   ))}
//                 </Row>
//               </Card>
//             )}
//           </Col>
//         </Row>

//         <Divider />

//         {/* Status History */}
//         <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Status History</h2>
//         <Row gutter={16}>
//           {complaint.statusHistory.map((history, idx) => (
//             <Col xs={24} md={12} key={history._id || idx} style={{ marginBottom: 16 }}>
//               <Card bordered className="shadow-sm">
//                 <Tag color={getStatusColor(history.status)} icon={getStatusIcon(history.status)}>
//                   {history.status}
//                 </Tag>
//                 <p style={{ fontSize: 12, color: '#555', margin: '8px 0' }}>{formatDate(history.updatedAt)}</p>
//                 {history.comment && <p><strong>Comment:</strong> {history.comment}</p>}
//                 {history.supervisorDetails?.comments && <p><strong>Supervisor:</strong> {history.supervisorDetails.comments}</p>}

//                 {/* Images */}
//                 {[
//                   history.supervisorDetails?.images,
//                   history.materialDemand?.images,
//                   history.resolution?.images,
//                   history.closureDetails?.images
//                 ].map((imgArr, i) =>
//                   imgArr?.length > 0 ? (
//                     <Row gutter={8} style={{ marginTop: 8 }} key={i}>
//                       {imgArr.map((img, j) => (
//                         <Col xs={8} key={j}>
//                           <Image
//                             src={img}
//                             alt={`history-img-${j}`}
//                             style={{ width: '100%', height: 60, objectFit: 'cover', cursor: 'pointer' }}
//                             preview={{ mask: <PictureOutlined /> }}
//                           />
//                         </Col>
//                       ))}
//                     </Row>
//                   ) : null
//                 )}
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Card>
//     </div>
//   );
// };

// export default ComplaintView;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Card, Row, Col, Image, Divider, Tag, Button, Collapse } from 'antd';
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
} from '@ant-design/icons';
import moment from 'moment';
import { getRequest } from '../../Helpers';

const { Panel } = Collapse;

const ComplaintView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getRequest(`complaints/${id}`)
      .then(res => {
        if (res?.data?.success) {
          const complaintData = res.data.data.complaints ? res.data.data.complaints[0] : res.data.data;
          setComplaint(complaintData);
        } else {
          setError(res?.data?.message || 'Failed to fetch complaint');
        }
      })
      .catch(() => setError('Error fetching complaint'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = date => moment(date).format('DD MMM YYYY, hh:mm A');

  const getStatusColor = status => {
    switch (status) {
      case 'Pending': return 'orange';
      case 'Under Review': return 'blue';
      case 'Material Demand Raised': return 'purple';
      case 'Resolved': return 'green';
      case 'Repushed': return 'red';
      case 'Closed': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'Pending': return <ClockCircleOutlined />;
      case 'Under Review': return <SyncOutlined spin />;
      case 'Material Demand Raised': return <ToolOutlined />;
      case 'Resolved': return <CheckCircleOutlined />;
      case 'Repushed': return <CloseCircleOutlined />;
      case 'Closed': return <CheckCircleOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spin size="large" tip="Loading complaint..." /></div>;
  if (error) return <div className="p-4"><Card><p style={{ color: 'red' }}>{error}</p></Card></div>;
  if (!complaint) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Back
      </Button>

      <Card className="shadow-lg rounded-lg p-4 sm:p-6 lg:p-8">
        <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Complaint Overview</h1>
        <hr className='mb-4'/>

        <Card bordered className="p-4 sm:p-6 shadow-sm mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{complaint.complaintTitle}</h2>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <div className="flex flex-col gap-4">
                <p className="font-medium">Tenant : {complaint.userId?.name}</p>
                <p className="font-medium">Site : {complaint.siteId?.siteName}</p>
                <p className="font-medium">Unit : {complaint.unitId?.unitNumber}</p>
                <p className="font-medium">Status : {complaint.status}</p>
              </div>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <div className="flex flex-col gap-4">
                <p className="font-medium">Description : {complaint.complaintDescription}</p>

                {complaint.images?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <p className="font-medium m-0 w-full">Images:</p>
                    {complaint.images.map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        alt={`complaint-${idx}`}
                        style={{ width: 100, height: 80, objectFit: 'cover', cursor: 'pointer' }}
                        preview={{ mask: <PictureOutlined /> }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card>

        <Divider />

        <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 16 }}>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Status History</h2>
          <Collapse accordion>
            {complaint.statusHistory.map((history, idx) => (
              <Panel
                key={history._id || idx}
                header={
                  <div className="flex justify-between items-center w-full">
                    <Tag color={getStatusColor(history.status)} icon={getStatusIcon(history.status)}>
                      {history.status}
                    </Tag>
                    <span className="text-xs sm:text-sm text-gray-500">{formatDate(history.updatedAt)}</span>
                  </div>
                }
              >
                {history.comment && <p><strong>Comment:</strong> {history.comment}</p>}

                {history.supervisorDetails?.comments && (
                  <div className="mt-2">
                    <p><strong>Supervisor:</strong> {history.supervisorDetails.comments}</p>
                    {history.supervisorDetails.images?.length > 0 && (
                      <Row gutter={[8, 8]}>Images:
                        {history.supervisorDetails.images.map((img, i) => (
                          <Col xs={12} sm={8} md={6} lg={4} key={i}>
                            <Image
                              src={img}
                              alt={`supervisor-${i}`}
                              style={{ width: '100%', height: 60, objectFit: 'cover', cursor: 'pointer' }}
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
                    <p><strong>Material Demand:</strong> {history.materialDemand.materialName}</p>
                    <p><strong>Material Quantity:</strong> {history.materialDemand.quantity}</p>
                    <p><strong>Reason:</strong> {history.materialDemand.reason}</p>
                    {history.materialDemand.images?.length > 0 && (
                      <Row gutter={[8, 8]}> Images:
                        {history.materialDemand.images.map((img, i) => (
                          <Col xs={12} sm={8} md={6} lg={4} key={i}>
                            <Image
                              src={img}
                              alt={`material-${i}`}
                              style={{ width: '100%', height: 60, objectFit: 'cover', cursor: 'pointer' }}
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
                    <p><strong>Remarks:</strong> {history.resolution.remarks}</p>
                    {history.resolution.images?.length > 0 && (
                      <Row gutter={[8, 8]}> Images:
                        {history.resolution.images.map((img, i) => (
                          <Col xs={12} sm={8} md={6} lg={4} key={i}>
                            <Image
                              src={img}
                              alt={`resolution-${i}`}
                              style={{ width: '100%', height: 60, objectFit: 'cover', cursor: 'pointer' }}
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
                    <p><strong>Closure Remarks:</strong> {history.closureDetails.remarks}</p>
                    {history.closureDetails.images?.length > 0 && (
                      <Row gutter={[8, 8]}> Images:
                        {history.closureDetails.images.map((img, i) => (
                          <Col xs={12} sm={8} md={6} lg={4} key={i}>
                            <Image
                              src={img}
                              alt={`closure-${i}`}
                              style={{ width: '100%', height: 60, objectFit: 'cover', cursor: 'pointer' }}
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
                    <p><strong>Repushed Count:</strong> {history.repushedDetails.count}</p>
                    <p><strong>Reason:</strong> {history.repushedDetails.reason}</p>
                    {/* <p><strong>Repushed At:</strong> {formatDate(history.repushedDetails.repushedAt)}</p> */}
                  </div>
                )}
              </Panel>
            ))}
          </Collapse>
        </Card>

      </Card>
    </div>
  );
};

export default ComplaintView;
