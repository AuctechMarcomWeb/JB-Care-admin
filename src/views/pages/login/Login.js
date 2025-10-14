import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import logo from '../../../assets/logo2.png'
import { postRequest } from '../../../Helpers'
import useCookie from '../../../Hooks/cookie'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setCookie } = useCookie()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  })
  console.log('formData', formData)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    postRequest({ url: `auth/login`, cred: formData })
      .then((res) => {
        console.log('login=====', res)

        setCookie('jbAdminToken', res?.data?.data?.token, 30)
        toast.success(res?.data?.message || 'User Login Successfully')
        navigate('/')
        //window.location.reload()
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Login failed')
      })
      .finally(() => setLoading(false))
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: '#000',
        padding: '20px',
      }}
    >
      <div className="w-100" style={{ maxWidth: '420px' }}>
        <div className="card shadow-lg border-0 p-4 rounded-4">
          <div className="card-body  text-center">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid mb-3"
              style={{
                width: '100px',
                margin: 'auto',
                marginBottom: '10px',
                objectFit: 'contain',
              }}
            />

            <form onSubmit={handleSubmit}>
              {/* Phone Field */}
              <div className="text-start mb-4">
                <label className="form-label text-black fw-semibold">Phone Number</label>
                <input
                  type="text"
                  className="form-control bg-light text-black py-2"
                  placeholder="Enter phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="text-start mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-black fw-semibold">Password</label>
                  <a href="#" className="small text-secondary text-decoration-none">
                    Forgot password?
                  </a>
                </div>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control bg-light text-black py-2"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '15px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-black fs-5" />
                    ) : (
                      <FaEye className="text-black fs-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="btn w-100 text-white py-2 fw-semibold"
                style={{
                  background: 'linear-gradient(to right, #9F8054, #b89665)',
                  borderRadius: '8px',
                }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
