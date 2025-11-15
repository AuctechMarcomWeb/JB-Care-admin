import React, { useState, useEffect, useRef } from 'react'
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

// Counter Animation Component
const CounterAnimation = ({ target, duration = 2000, prefix = '₹', suffix = '' }) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)

          const startTime = Date.now()
          const startValue = 0
          const endValue = target

          const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentValue = startValue + (endValue - startValue) * easeOutQuart

            setCount(currentValue)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(endValue)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.1 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [target, duration, hasAnimated])

  const formatNumber = (num) => {
    return Math.floor(num).toLocaleString('en-IN')
  }

  return (
    <span ref={elementRef}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}

// Percentage Counter Animation
const PercentageCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)

          const startTime = Date.now()

          const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentValue = target * easeOutQuart

            setCount(currentValue)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(target)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.1 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [target, duration, hasAnimated])

  return <span ref={elementRef}>{count.toFixed(1)}%</span>
}

export default function BillingDashboard() {
  const [fromDate, setFromDate] = useState('2024-01-01')
  const [toDate, setToDate] = useState('2024-12-31')
  const [animate, setAnimate] = useState(true)

  // Sample data
  const billingData = [
    {
      category: 'Maintenance',
      totalBill: 150000,
      collectedBills: 120000,
      pendingBills: 30000,
      totalAmount: 30000,
    },
    {
      category: 'Electricity',
      totalBill: 80000,
      collectedBills: 65000,
      pendingBills: 15000,
      totalAmount: 15000,
    },
  ]

  const totalStats = {
    totalBill: billingData.reduce((sum, row) => sum + row.totalBill, 0),
    collectedBills: billingData.reduce((sum, row) => sum + row.collectedBills, 0),
    pendingBills: billingData.reduce((sum, row) => sum + row.pendingBills, 0),
    totalAmount: billingData.reduce((sum, row) => sum + row.totalAmount, 0),
  }

  const collectionRate = (totalStats.collectedBills / totalStats.totalBill) * 100

  // Reset animation when dates change
  const handleDateChange = (setter) => (e) => {
    setter(e.target.value)
    setAnimate(false)
    setTimeout(() => setAnimate(true), 50)
  }

  return (
    // <div className="min-h-[50px] bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg shadow-sm bg-white">
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-3 mt-4 border-t-4 border-[#e5af2d]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Date Range */}
          <div className="flex flex-wrap gap-0.5">
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={handleDateChange(setFromDate)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-xs"
              />
              <Calendar className="absolute left-2 top-2 text-slate-400 w-3.5 h-3.5" />
            </div>

            <span className="flex items-center text-slate-600 font-medium">to</span>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100">
                    <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-slate-700 uppercase">
                      Category
                    </th>
                    <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                      Total Bill
                    </th>
                    <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                      Collected
                    </th>
                    <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                      Pending
                    </th>
                    {/* <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                      Total Amt
                    </th> */}
                    <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                      % Collected
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {animate &&
                    billingData.map((row, index) => {
                      const collectionPercent = (row.collectedBills / row.totalBill) * 100
                      return (
                        <tr
                          key={index}
                          className="border-b border-slate-200 hover:bg-white transition-colors"
                        >
                          <td className="px-2 py-1.5 text-xs font-medium text-slate-800">
                            {row.category}
                          </td>

                          <td className="px-2 py-1.5 text-right text-xs">
                            <CounterAnimation target={row.totalBill} duration={2000} />
                          </td>

                          <td className="px-2 py-1.5 text-right text-green-600 text-xs font-semibold">
                            <CounterAnimation target={row.collectedBills} duration={2000} />
                          </td>

                          <td className="px-2 py-1.5 text-right text-orange-600 text-xs font-semibold">
                            <CounterAnimation target={row.pendingBills} duration={2000} />
                          </td>

                          {/* <td className="px-2 py-1.5 text-right text-red-600 text-xs font-semibold">
                            <CounterAnimation target={row.totalAmount} duration={2000} />
                          </td> */}

                          <td className="px-2 py-1.5 text-right">
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-xxs font-bold ${
                                collectionPercent >= 80
                                  ? 'bg-green-100 text-green-700'
                                  : collectionPercent >= 50
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-red-100 text-red-700'
                              }`}
                            >
                              <PercentageCounter target={collectionPercent} duration={2000} />
                            </span>
                          </td>
                        </tr>
                      )
                    })}

                  {animate && (
                    <tr className="bg-slate-200 font-bold border-t border-slate-400">
                      <td className="px-2 py-1.5 text-xs text-slate-800 uppercase">Total</td>

                      <td className="px-2 py-1.5 text-right text-xs text-slate-800">
                        <CounterAnimation target={totalStats.totalBill} duration={2000} />
                      </td>

                      <td className="px-2 py-1.5 text-right text-xs text-green-700">
                        <CounterAnimation target={totalStats.collectedBills} duration={2000} />
                      </td>

                      <td className="px-2 py-1.5 text-right text-xs text-orange-700">
                        <CounterAnimation target={totalStats.pendingBills} duration={2000} />
                      </td>

                      {/* <td className="px-2 py-1.5 text-right text-xs text-red-700">
                        <CounterAnimation target={totalStats.totalAmount} duration={2000} />
                      </td> */}

                      <td className="px-2 py-1.5 text-right">
                        <span className="inline-block px-1.5 py-0.5 rounded text-xxs font-bold bg-blue-100 text-blue-700">
                          <PercentageCounter target={collectionRate} duration={2000} />
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detailed Table with Counter Animation */}
        <div className="bg-slate-50 rounded-lg p-3">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Billing Details</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100">
                  <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-slate-700 uppercase">
                    Category
                  </th>
                  <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                    Total Bill
                  </th>
                  <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                    Collected
                  </th>
                  <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                    Pending
                  </th>
                  {/* <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                      Total Amt
                    </th> */}
                  <th className="px-2 py-1.5 text-right text-[10px] font-semibold text-slate-700 uppercase">
                    % Collected
                  </th>
                </tr>
              </thead>

              <tbody>
                {animate &&
                  billingData.map((row, index) => {
                    const collectionPercent = (row.collectedBills / row.totalBill) * 100
                    return (
                      <tr
                        key={index}
                        className="border-b border-slate-200 hover:bg-white transition-colors"
                      >
                        <td className="px-2 py-1.5 text-xs font-medium text-slate-800">
                          {row.category}
                        </td>

                        <td className="px-2 py-1.5 text-right text-xs">
                          <CounterAnimation target={row.totalBill} duration={2000} />
                        </td>

                        <td className="px-2 py-1.5 text-right text-green-600 text-xs font-semibold">
                          <CounterAnimation target={row.collectedBills} duration={2000} />
                        </td>

                        <td className="px-2 py-1.5 text-right text-orange-600 text-xs font-semibold">
                          <CounterAnimation target={row.pendingBills} duration={2000} />
                        </td>

                        {/* <td className="px-2 py-1.5 text-right text-red-600 text-xs font-semibold">
                          <CounterAnimation target={row.totalAmount} duration={2000} />
                        </td> */}

                        <td className="px-2 py-1.5 text-right">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-xxs font-bold ${
                              collectionPercent >= 80
                                ? 'bg-green-100 text-green-700'
                                : collectionPercent >= 50
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            <PercentageCounter target={collectionPercent} duration={2000} />
                          </span>
                        </td>
                      </tr>
                    )
                  })}

                {animate && (
                  <tr className="bg-slate-200 font-bold border-t border-slate-400">
                    <td className="px-2 py-1.5 text-xs text-slate-800 uppercase">Total</td>

                    <td className="px-2 py-1.5 text-right text-xs text-slate-800">
                      <CounterAnimation target={totalStats.totalBill} duration={2000} />
                    </td>

                    <td className="px-2 py-1.5 text-right text-xs text-green-700">
                      <CounterAnimation target={totalStats.collectedBills} duration={2000} />
                    </td>

                    <td className="px-2 py-1.5 text-right text-xs text-orange-700">
                      <CounterAnimation target={totalStats.pendingBills} duration={2000} />
                    </td>

                    {/* <td className="px-2 py-1.5 text-right text-xs text-red-700">
                      <CounterAnimation target={totalStats.totalAmount} duration={2000} />
                    </td> */}

                    <td className="px-2 py-1.5 text-right">
                      <span className="inline-block px-1.5 py-0.5 rounded text-xxs font-bold bg-blue-100 text-blue-700">
                        <PercentageCounter target={collectionRate} duration={2000} />
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    // </div>
  )
}
