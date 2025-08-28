import React from 'react'
import SmartMeter from './views/smartMeter/SmartMeter'
import ComplaintsManagementTable from './views/complains/ComplaintsManagementTable'
import StockIn from './views/stocks/StockIn'
import StockOut from './views/stocks/StockOut'
import ElmProfile from './views/CustomersProfile/ElmProfile'
import MaintenanceProfile from './views/CustomersProfile/MaintenanceProfile'
import Category from './views/masters/Category'
import Maintenance from './views/masters/Maintenance'
import Product from './views/masters/Product'
import Site from './views/masters/Site'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/smartMeters', name: 'Dashboard', element: SmartMeter },
  { path: '/complaints', name: 'Dashboard', element: ComplaintsManagementTable },
  { path: '/stockIn', name: 'Dashboard', element: StockIn },
  { path: '/stockOut', name: 'Dashboard', element: StockOut },
  { path: '/elmProfile', name: 'ELM Profile', element: ElmProfile },
  { path: '/maintenanceProfile', name: 'ELM Profile', element: MaintenanceProfile },
  { path: '/maintenanceMaster', name: 'ELM Profile', element: Maintenance },
  { path: '/categoryMaster', name: 'ELM Profile', element: Category },
  { path: '/productMaster', name: 'ELM Profile', element: Product },
  { path: '/siteMaster', name: 'ELM Profile', element: Site },
]

export default routes
