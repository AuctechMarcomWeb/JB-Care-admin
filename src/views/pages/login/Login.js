import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import useCookie from '../../../Hooks/cookie'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import logo from '../../../assets/logo2.png'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setCookie } = useCookie()
  const navigate = useNavigate()

  

  const [formData, setFormData] = useState({
    userName: 'admin',
    password: 'Admin@123',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}auth/login`, formData)
      .then((res) => {
        setCookie('token', res?.data?.data?.authToken, 30)
        toast.success('User Login Successfully')
        navigate('/')
        window.location.reload()
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Login failed')
      })
      .finally(() => setLoading(false))
  }

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card p-4 bg-white shadow">
              <div className="card-body text-center">
                <img src={logo} alt="Logo" style={{ width: '100px', marginBottom: '10px',margin:"auto" }} />
                <h3 className="mb-4  text-black">Login</h3>

                <form onSubmit={handleSubmit}>
                  <div class="input-block text-start mb-4">
                    <label class="col-form-label text-black">User Name</label>
                    <input
                      type="text"
                      className="form-control bg-white text-black"
                      placeholder="userName"
                      name="userName"
                      value={formData?.userName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div class="input-block mb-4">
                    <div class="row align-items-center">
                      <div class="col text-start">
                        <label class="col-form-label text-black">Password</label>
                      </div>
                      <div class="col-auto ">
                        <a class=" text-black" href="#">
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <div class="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control bg-white text-black"
                        placeholder="Password"
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

                  <button
                    type="submit"
                    className="btn w-100 text-white"
                    style={{
                      background: 'linear-gradient(to right, #9F8054, #9F8054)',
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
      </div>
    </div>
  )
}

export default Login
