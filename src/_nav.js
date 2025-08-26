
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
      component: CNavItem,
      name: 'ELM Smart Meters',
      to: '/smartMeters',
      icon: <MdOutlineDashboard className="me-3" />,
      
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
