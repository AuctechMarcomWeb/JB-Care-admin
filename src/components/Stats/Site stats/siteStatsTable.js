import React, { useState, useEffect } from 'react'

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 800
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return <span>{display.toLocaleString()}</span>
}

export default function UnitsTable() {
  const [sites, setSites] = useState([
    { id: 1, name: 'Orchid', units: 500 },
    { id: 2, name: 'Jasmine', units: 350 },
    { id: 3, name: 'Lotus', units: 420 },
  ])

  const totalUnits = sites.reduce((sum, site) => sum + site.units, 0)

  return (
    // <div className="min-h-[50px] bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg shadow-sm bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md mt-4 border-t-4 border-[#e5af2d]">
          <div className="bg-slate-50 rounded-lg p-3">
            <h1 className="text-sm font-semibold text-slate-800">Total Units</h1>
          </div>

          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100">
                  <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-slate-700 uppercase">Sites</th>
                  <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-slate-700 uppercase text-right">Units</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id} className="border-b border-gray-100">
                    <td className="py-1.5 px-2 text-gray-800">{site.name}</td>
                    <td className="py-1.5 px-2 text-gray-800 text-right">
                      <AnimatedNumber value={site.units} />
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-200 font-bold border-t border-slate-400">
                  <td className="py-1.5 px-2">Total</td>
                  <td className="py-1.5 px-2 text-right">
                    <AnimatedNumber value={totalUnits} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    // </div>
  )
}
