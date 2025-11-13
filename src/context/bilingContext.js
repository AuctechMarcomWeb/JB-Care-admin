/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { createContext, useContext, useState, useEffect } from 'react'

const BillingContext = createContext()

export const BillingProvider = ({ children }) => {
  // ✅ Load from localStorage initially
  const [selectedBill, setSelectedBill] = useState(() => {
    const saved = localStorage.getItem('selectedBill')
    return saved ? JSON.parse(saved) : {}
  })

  // ✅ Whenever selectedBill changes, store it in localStorage
  useEffect(() => {
    if (selectedBill && Object.keys(selectedBill).length > 0) {
      localStorage.setItem('selectedBill', JSON.stringify(selectedBill))
    } else {
      localStorage.removeItem('selectedBill')
    }
  }, [selectedBill])

  return (
    <BillingContext.Provider value={{ selectedBill, setSelectedBill }}>
      {children}
    </BillingContext.Provider>
  )
}

export const useBillingContext = () => useContext(BillingContext)
