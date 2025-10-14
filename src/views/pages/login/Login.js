import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import useCookie from '../../../Hooks/cookie'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import logo from '../../../assets/logo2.png'
import { postRequest } from '../../../Helpers'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setCookie } = useCookie()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    axios
      .postRequest(`auth/login`, formData)
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
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: '100px', marginBottom: '10px', margin: 'auto' }}
                />
                <h3 className="mb-4  text-black">Login</h3>

                <form onSubmit={handleSubmit}>
                  <div className="input-block text-start mb-4">
                    <label className="col-form-label text-black">User Name</label>
                    <input
                      type="tel"
                      className="form-control bg-white text-black"
                      placeholder="userName"
                      name="userName"
                      value={formData?.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-block mb-4">
                    <div className="row align-items-center">
                      <div className="col text-start">
                        <label className="col-form-label text-black">Password</label>
                      </div>
                      <div className="col-auto ">
                        <a className=" text-black" href="#">
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <div className="position-relative">
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

// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import useCookie from '../../../Hooks/cookie'
// import { FaEye, FaEyeSlash } from 'react-icons/fa'
// import logo from '../../../assets/logo2.png'
// import { postRequest } from '../../../Helpers'

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const { setCookie } = useCookie()
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({
//     phone: '',
//     password: '',
//   })

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const res = await axios.postRequest('auth/login', formData)

//       const token = res?.data?.token
//       const user = res?.data?.user

//       //  Only allow admin
//       if (user?.role !== 'admin') {
//         toast.error('Unauthorized: Admin access only')
//         setLoading(false)
//         return
//       }

//       if (token) {
//         setCookie('token', token, 30)
//         localStorage.setItem('user', JSON.stringify(user))
//         toast.success(res?.data?.message || 'Admin login successful')

//         // Redirect admin to dashboard
//         navigate('/admin/dashboard')
//         window.location.reload()
//       } else {
//         toast.error('Invalid response from server')
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Login failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div
//       className="min-vh-100 d-flex justify-content-center align-items-center"
//       style={{ backgroundColor: '#000000' }}
//     >
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-md-6 col-lg-5">
//             <div className="card p-4 bg-white shadow">
//               <div className="card-body text-center">
//                 <img
//                   src={logo}
//                   alt="Logo"
//                   style={{ width: '100px', marginBottom: '10px', margin: 'auto' }}
//                 />
//                 <h3 className="mb-4 text-black">Admin Login</h3>

//                 <form onSubmit={handleSubmit}>
//                   {/* PHONE */}
//                   <div className="input-block text-start mb-4">
//                     <label className="col-form-label text-black">Phone Number</label>
//                     <input
//                       type="tel"
//                       className="form-control bg-white text-black"
//                       placeholder="Enter admin phone number"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>

//                   {/* PASSWORD */}
//                   <div className="input-block mb-4">
//                     <div className="row align-items-center">
//                       <div className="col text-start">
//                         <label className="col-form-label text-black">Password</label>
//                       </div>
//                       <div className="col-auto">
//                         <a className="text-black" href="#">
//                           Forgot password?
//                         </a>
//                       </div>
//                     </div>
//                     <div className="position-relative">
//                       <input
//                         type={showPassword ? 'text' : 'password'}
//                         className="form-control bg-white text-black"
//                         placeholder="Enter password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleInputChange}
//                         required
//                       />
//                       <span
//                         onClick={() => setShowPassword(!showPassword)}
//                         style={{
//                           position: 'absolute',
//                           top: '50%',
//                           right: '15px',
//                           transform: 'translateY(-50%)',
//                           cursor: 'pointer',
//                         }}
//                       >
//                         {showPassword ? (
//                           <FaEyeSlash className="text-black fs-5" />
//                         ) : (
//                           <FaEye className="text-black fs-5" />
//                         )}
//                       </span>
//                     </div>
//                   </div>

//                   {/* SUBMIT BUTTON */}
//                   <button
//                     type="submit"
//                     className="btn w-100 text-white"
//                     style={{
//                       background: 'linear-gradient(to right, #9F8054, #9F8054)',
//                     }}
//                     disabled={loading}
//                   >
//                     {loading ? 'Loading...' : 'Login as Admin'}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login
