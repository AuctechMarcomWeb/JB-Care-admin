/* eslint-disable prettier/prettier */
import React from 'react'
import { Button, Card } from 'antd'
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './UnderDevelopment.css'

const UnderDevelopment = () => {
  const navigate = useNavigate() // 👈 React Router navigation

  const handleGoBack = () => {
    navigate('/biling') // 👈 Redirect to dashboard
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 px-4">
      <Card
        bordered={false}
        className="relative overflow-hidden max-w-2xl w-full rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white animate-fadeIn"
      >
        {/* Image Section */}
        <div className="relative">
          <img
            src="https://res.cloudinary.com/ddkzmnsqy/image/upload/v1763028166/user_uploads/hxzls4odg2y3lcsoszm1.jpg"
            alt="Under Development"
            className="w-full h-80 object-cover rounded-t-2xl"
          />

          {/* Overlay Text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col items-center justify-center rounded-t-2xl px-4">
            <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg mb-2 tracking-wide">
              Under Development
            </h1>
            <p className="text-gray-100 text-center text-base md:text-lg max-w-md">
              We’re building something amazing. Please check back soon!
            </p>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-white px-6 py-4 border-t border-gray-100 text-center">
          <div className="flex justify-center items-start space-x-2 text-gray-700 text-sm md:text-base">
            <ExclamationCircleOutlined className="text-yellow-500 text-lg mt-0.5" />
            <p className="max-w-md text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">Disclaimer:</span> This page is
              currently under development. Some features or data shown here may not be final or
              functional.
            </p>
          </div>
        </div>

        {/* Button Section */}
        <div className="text-center py-6 bg-white rounded-b-2xl">
          <Button
            type="primary"
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
          >
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default UnderDevelopment
