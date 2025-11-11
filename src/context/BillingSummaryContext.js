/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getRequest } from '../Helpers'
import toast from 'react-hot-toast'

export const BillingSummaryContext = createContext()

export const BillingSummaryProvider = ({ children }) => {
  const [billingSummary, setBillingSummary] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    getRequest('billing/billingSummary')
      .then((res) => {
        console.log('billingSummary', res)
        const responseData = res?.data
        setBillingSummary(responseData?.data || [])
        setTotal(responseData?.total || 0)
      })
      .catch((error) => {
        console.log('error', error)
        setError(error)
        toast.error('Failed to fetch billing summary')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <BillingSummaryContext.Provider
      value={{
        billingSummary,
        loading,
        error,
        total,
      }}
    >
      {children}
    </BillingSummaryContext.Provider>
  )
}

export const useBillingSummary = () => useContext(BillingSummaryContext)
