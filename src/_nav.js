
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
          name: 'Site/Location ',
          to: '/sitelocationMaster',
        },
        {
          component: CNavItem,
          name: 'Project ',
          to: '/projectMaster',
        },
        {
          component: CNavItem,
          name: 'Unit',
          to: '/unitMaster',
        },
      
          {
          component: CNavItem,
          name: 'UnitType',
          to: '/unitTypeMaster',
        },
             {
          component: CNavItem,
          name: 'LandLord',
          to: '/landlordMaster',
        },
             {
          component: CNavItem,
          name: 'Rental',
          to: '/rentalMaster',
        },
      ],
    },
    //  {
    //   component: CNavGroup,
    //   name: 'Customer Profile',
    //   to: '/Customer-Profile',
    //   icon: <FaRegAddressCard className="me-3" />,
    //   items: [
      
    //     {
    //       component: CNavItem,
    //       name: 'ELM',
    //       to: '/elmProfile',
    //     },
    //     {
    //       component: CNavItem,
    //       name: 'Maintenance',
    //       to: '/maintenanceProfile',
    //     },
        
    //   ],
    // },
 
    // {
    //   component: CNavItem,
    //   name: 'Monthly Billing ',
    //   to: '/smartMeters',
    //   icon: <MdOutlineDashboard className="me-3 " />,
      
    // },
    // {
    //   component: CNavItem,
    //   name: 'Complaints',
    //   to: '/complaints',
    //   icon: <MdOutlineDashboard className="me-3" />,
      
    // },

    // {
    //   component: CNavGroup,
    //   name: 'Inventory',
    //   to: '/sub-menu',
    //   icon: <FaRegAddressCard className="me-3" />,
    //   items: [
      
    //     {
    //       component: CNavItem,
    //       name: 'Stock In',
    //       to: '/stockIn',
    //     },
    //     {
    //       component: CNavItem,
    //       name: 'Stock Out',
    //       to: '/stockOut',
    //     },
    //   ],
    // },
   
  ]

  return navItems
}

export default useNav
