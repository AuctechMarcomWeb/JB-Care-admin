import React from 'react'
import SmartMeter from './views/smartMeter/SmartMeter'
import ComplaintsManagementTable from './views/complains/ComplaintsManagementTable'
import StockIn from './views/stocks/StockIn'
import StockOut from './views/stocks/StockOut'
import ElmProfile from './views/CustomersProfile/ElmProfile'
import MaintenanceProfile from './views/CustomersProfile/MaintenanceProfile'
import Project from './views/masters/Project'
import Unit from './views/masters/Unit'
import UnitType from './views/masters/UnitType'
import SiteLocation from './views/masters/Site-Location'
import Rental from './views/masters/Rental'
import LandLord from './views/masters/LandLord'
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
  { path: '/projectMaster', name: 'ELM Profile', element: Project },
  { path: '/unitMaster', name: 'ELM Profile', element: Unit },
  { path: '/unitTypeMaster', name: 'ELM Profile', element: UnitType },
  { path: '/sitelocationMaster', name: 'ELM Profile', element: SiteLocation },
  { path: '/landlordMaster', name: 'ELM Profile', element: LandLord },
  { path: '/rentalMaster', name: 'ELM Profile', element: Rental },
]

export default routes
