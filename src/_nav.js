/* eslint-disable react/react-in-jsx-scope */
import { CNavGroup, CNavItem } from '@coreui/react'
import { useEffect, useState } from 'react'
import { FaRegAddressCard } from 'react-icons/fa'
import { MdOutlineDashboard } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
const useNav = () => {
  // const navigate = useNavigate()
  const navigate = useNavigate()
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const location = useLocation()

  // 👇 Keep submenu open if in dashboard-related routes
  useEffect(() => {
    if (
      location.pathname.startsWith('/biling') ||
      location.pathname.startsWith('/complaints') ||
      location.pathname.startsWith('/inventory')
    ) {
      setIsDashboardOpen(true)
    } else if (location.pathname === '/dashboard') {
      setIsDashboardOpen(false)
    }
  }, [location.pathname])

  const handleDashboardClick = (e) => {
    e.preventDefault() // prevent CoreUI's default toggle behavior
    if (isDashboardOpen) {
      setIsDashboardOpen(false)
      navigate('/dashboard')
    } else {
      setIsDashboardOpen(true)
      navigate('/dashboard')
    }
  }

  const navItems = [
    // 🟢 DASHBOARD MENU
    {
      component: CNavGroup,
      name: (
        <div
          onClick={handleDashboardClick}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <MdOutlineDashboard className="me-3" />
          <span>Dashboard</span>
        </div>
      ),
      icon: false, // we already included the icon above manually
      items: [
        { component: CNavItem, name: 'Billing Dashboard', to: '/biling' },
        { component: CNavItem, name: 'Complaint Dashboard', to: '/complaints' },
        { component: CNavItem, name: 'Inventory Dashboard', to: '/inventory' },
      ],
      show: isDashboardOpen, // manually control open state
    },
    {
      component: CNavGroup,
      name: 'Users',
      to: '/sub-menu',
      icon: <FaRegAddressCard className="me-3" />,
      items: [
        {
          component: CNavItem,
          name: 'LandLord',
          to: '/landlordMaster',
          icon: <MdOutlineDashboard className="me-3" />,
        },
        {
          component: CNavItem,
          name: 'Tenant',
          to: '/rentalMaster',
          icon: <MdOutlineDashboard className="me-3" />,
        },
        {
          component: CNavItem,
          name: 'Supervisor',
          to: '/supervisor',
          icon: <MdOutlineDashboard className="me-3" />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Masters',
      to: '/Customer-Profile',
      // eslint-disable-next-line react/react-in-jsx-scope
      icon: <FaRegAddressCard className="me-3" />,
      items: [
        {
          component: CNavItem,
          name: 'Site/Location ',
          to: '/sitelocationMaster',
        },
        // {
        //   component: CNavItem,
        //   name: 'Project ',
        //   to: '/projectMaster',
        // },
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
          name: 'MaintenceCharge',
          to: '/maintenceCharge',
        },
      ],
    },

    {
      component: CNavGroup,
      name: 'Stock Management',
      to: '/sub-menu',
      icon: <FaRegAddressCard className="me-3" />,
      items: [
        {
          component: CNavItem,
          name: ' Central Stock',
          to: '/centralStock',
        },
        {
          component: CNavItem,
          name: 'Stock Transfer',
          to: '/stockTransfer',
        },
        {
          component: CNavItem,
          name: 'Stock Consumption',
          to: '/stockConsumption',
        },
      ],
    },
    ,
  ]

  return navItems
}

export default useNav
