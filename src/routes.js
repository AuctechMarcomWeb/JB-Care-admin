import React from 'react'
import SmartMeter from './views/smartMeter/SmartMeter'
import Complaints from './views/Complaints/Complaints'
import CentralStock from './views/stocks/CentralStock/CentralStock'
import StockTransfer from './views/stocks/StockTransfer'
import StockConsumption from './views/stocks/StockConsumption'
import ElmProfile from './views/CustomersProfile/ElmProfile'
import MaintenanceProfile from './views/CustomersProfile/MaintenanceProfile'
import Project from './views/masters/Project/Project'
import Unit from './views/masters/Unit/Unit'
import UnitType from './views/masters/UnitType/UnitType'
import SiteLocation from './views/masters/SiteLocation/SiteLocation'
import Rental from './views/masters/Rental/Rental'
import LandLord from './views/masters/LandLord/LandLord'
import UserList from './views/UserList/UserList'
import Supervisor from './views/Supervisor/Supervisor'
import Biling from './views/Biling/Biling'
import MaintenceCharges from './views/masters/MaintenceCharges/MaintenceCharges'
import Inventory from './views/Inventory/Inventory'
import BillingDetails from './views/Biling/BillingDetails'
import ComplaintView from './views/Complaints/ComplaintView'
import BilingDashboard from './views/Biling/BilingDashboard'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Biling },
  { path: '/user', name: 'User', element: UserList },
  { path: '/smartMeters', name: 'Dashboard', element: SmartMeter },
  { path: '/complaints', name: 'ELM Profile', element: Complaints },
  { path: '/elmProfile', name: 'ELM Profile', element: ElmProfile },
  { path: '/maintenanceProfile', name: 'ELM Profile', element: MaintenanceProfile },
  { path: '/projectMaster', name: 'ELM Profile', element: Project },
  { path: '/unitMaster', name: 'ELM Profile', element: Unit },
  { path: '/unitTypeMaster', name: 'ELM Profile', element: UnitType },
  { path: '/maintenceCharge', name: 'ELM Profile', element: MaintenceCharges },
  { path: '/sitelocationMaster', name: 'ELM Profile', element: SiteLocation },
  { path: '/landlordMaster', name: 'ELM Profile', element: LandLord },
  { path: '/supervisor', name: 'ELM Profile', element: Supervisor },
  { path: '/rentalMaster', name: 'ELM Profile', element: Rental },
  { path: '/centralStock', name: 'ELM Profile', element: CentralStock },
  { path: '/stockTransfer', name: 'ELM Profile', element: StockTransfer },
  { path: '/stockConsumption', name: 'ELM Profile', element: StockConsumption },
  { path: '/biling', name: 'Biling', element: Biling },
  { path: '/inventory', name: 'Inventory', element: Inventory },
  { path: '/biling-details/:landlordId', name: 'Billing Details', element: BillingDetails },
  { path: '/complaint-view/:id', name: 'Complaint View', element: ComplaintView },
  { path: '/biling/test', name: 'BilingDashboard', element: BilingDashboard },
]

export default routes
