import React from 'react'
import SmartMeter from './views/smartMeter/SmartMeter'
import ComplaintsManagementTable from './views/complains/ComplaintsManagementTable'
import StockIn from './views/stocks/StockIn'
import StockOut from './views/stocks/StockOut'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/smartMeters', name: 'Dashboard', element: SmartMeter },
  { path: '/complaints', name: 'Dashboard', element: ComplaintsManagementTable },
  { path: '/stockIn', name: 'Dashboard', element: StockIn },
  { path: '/stockOut', name: 'Dashboard', element: StockOut },
]

export default routes
