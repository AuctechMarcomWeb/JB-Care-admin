import React from 'react'
import SmartMeter from './views/smartMeter/SmartMeter'
import ComplaintsManagementTable from './views/complains/ComplaintsManagementTable'
import CentralStock from './views/stocks/CentralStock'
import StockTransfer from './views/stocks/StockTransfer'
import StockConsumption from './views/stocks/stockConsumption'
import ElmProfile from './views/CustomersProfile/ElmProfile'
import MaintenanceProfile from './views/CustomersProfile/MaintenanceProfile'
import Project from './views/masters/Project/Project'
import Unit from './views/masters/Unit'
import UnitType from './views/masters/UnitType'
import SiteLocation from './views/masters/SiteLocation/SiteLocation'
import Rental from './views/masters/Rental'
import LandLord from './views/masters/LandLord'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/smartMeters', name: 'Dashboard', element: SmartMeter },
  { path: '/complaints', name: 'ELM Profile', element: ComplaintsManagementTable },
  { path: '/elmProfile', name: 'ELM Profile', element: ElmProfile },
  { path: '/maintenanceProfile', name: 'ELM Profile', element: MaintenanceProfile },
  { path: '/projectMaster', name: 'ELM Profile', element: Project },
  { path: '/unitMaster', name: 'ELM Profile', element: Unit },
  { path: '/unitTypeMaster', name: 'ELM Profile', element: UnitType },
  { path: '/sitelocationMaster', name: 'ELM Profile', element: SiteLocation },
  { path: '/landlordMaster', name: 'ELM Profile', element: LandLord },
  { path: '/rentalMaster', name: 'ELM Profile', element: Rental },
  { path: '/CentralStock', name: 'ELM Profile', element: CentralStock },
  { path: '/StockTransfer', name: 'ELM Profile', element: StockTransfer },
  { path: '/StockConsumption', name: 'ELM Profile', element: StockConsumption },
]

export default routes
