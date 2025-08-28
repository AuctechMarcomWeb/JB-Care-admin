
import { CNavGroup, CNavItem } from '@coreui/react'
import {  FaRegAddressCard } from 'react-icons/fa'
import {
  MdOutlineDashboard,
} from 'react-icons/md'
const useNav = () => {

  const navItems = [
   {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <MdOutlineDashboard className="me-3" />,
      
    },
     {
      component: CNavGroup,
      name: 'Masters',
      to: '/Customer-Profile',
      icon: <FaRegAddressCard className="me-3" />,
      items: [
      
        {
          component: CNavItem,
          name: 'Maintenance Master',
          to: '/maintenanceMaster',
        },
        {
          component: CNavItem,
          name: 'Category Master',
          to: '/categoryMaster',
        },
        {
          component: CNavItem,
          name: 'Product Master',
          to: '/productMaster',
        },
        {
          component: CNavItem,
          name: 'Site Master',
          to: '/siteMaster',
        },
      ],
    },
     {
      component: CNavGroup,
      name: 'Customer Profile',
      to: '/Customer-Profile',
      icon: <FaRegAddressCard className="me-3" />,
      items: [
      
        {
          component: CNavItem,
          name: 'ELM',
          to: '/elmProfile',
        },
        {
          component: CNavItem,
          name: 'Maintenance',
          to: '/maintenanceProfile',
        },
      ],
    },
 
    {
      component: CNavItem,
      name: 'Monthly Billing ',
      to: '/smartMeters',
      icon: <MdOutlineDashboard className="me-3 " />,
      
    },
    {
      component: CNavItem,
      name: 'Complaints',
      to: '/complaints',
      icon: <MdOutlineDashboard className="me-3" />,
      
    },

    {
      component: CNavGroup,
      name: 'Inventory',
      to: '/sub-menu',
      icon: <FaRegAddressCard className="me-3" />,
      items: [
      
        {
          component: CNavItem,
          name: 'Stock In',
          to: '/stockIn',
        },
        {
          component: CNavItem,
          name: 'Stock Out',
          to: '/stockOut',
        },
      ],
    },
   
  ]

  return navItems
}

export default useNav
