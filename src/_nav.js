/* eslint-disable react/react-in-jsx-scope */
import { CNavGroup, CNavItem } from '@coreui/react'
import { useState } from 'react'
import {
  LayoutDashboard,
  Database,
  Users,
  PackageSearch,
  FileSpreadsheet,
  FileWarning,
  Boxes,
  MapPin,
  Grid,
  Type,
  Wrench,
  Building2,
  Home,
  UserCog,
  ArrowLeftRight,
  ClipboardCheck,
} from 'lucide-react'

const useNav = () => {
  // ✅ Dashboard and Masters open by default
  const [openGroups, setOpenGroups] = useState(['Dashboard', 'Masters'])

  // ✅ Active menu — Billing Dashboard
  const [activeItem, setActiveItem] = useState('/biling')

  // ✅ Toggle only clicked group open/close
  const handleGroupToggle = (groupName) => {
    setOpenGroups((prev) =>
      prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName],
    )
  }

  // ✅ Set active route
  const handleItemClick = (route) => setActiveItem(route)

  const navItems = [
    // ===== DASHBOARD GROUP =====
    {
      component: CNavGroup,
      name: 'Dashboard',
      icon: <LayoutDashboard className="me-3 w-5 h-5" />,
      items: [
        {
          component: CNavItem,
          name: 'Billing Dashboard',
          to: '/biling',
          icon: <FileSpreadsheet className="me-2 w-4 h-4" />,
          active: activeItem === '/biling',
          onClick: () => handleItemClick('/biling'),
        },
        {
          component: CNavItem,
          name: 'Complaint Dashboard',
          to: '/complaints',
          icon: <FileWarning className="me-2 w-4 h-4" />,
          active: activeItem === '/complaints',
          onClick: () => handleItemClick('/complaints'),
        },
        {
          component: CNavItem,
          name: 'Inventory Dashboard',
          to: '/inventory',
          icon: <Boxes className="me-2 w-4 h-4" />,
          active: activeItem === '/inventory',
          onClick: () => handleItemClick('/inventory'),
        },
      ],
      open: openGroups.includes('Dashboard'),
      onClick: () => handleGroupToggle('Dashboard'),
    },

    // ===== MASTERS GROUP =====
    {
      component: CNavGroup,
      name: 'Masters',
      icon: <Database className="me-3 w-5 h-5" />,
      items: [
        {
          component: CNavItem,
          name: 'Site/Location',
          to: '/sitelocationMaster',
          icon: <MapPin className="me-2 w-4 h-4" />,
          active: activeItem === '/sitelocationMaster',
          onClick: () => handleItemClick('/sitelocationMaster'),
        },
        {
          component: CNavItem,
          name: 'Unit',
          to: '/unitMaster',
          icon: <Grid className="me-2 w-4 h-4" />,
          active: activeItem === '/unitMaster',
          onClick: () => handleItemClick('/unitMaster'),
        },
        {
          component: CNavItem,
          name: 'UnitType',
          to: '/unitTypeMaster',
          icon: <Type className="me-2 w-4 h-4" />,
          active: activeItem === '/unitTypeMaster',
          onClick: () => handleItemClick('/unitTypeMaster'),
        },
        {
          component: CNavItem,
          name: 'MaintenceCharge',
          to: '/maintenceCharge',
          icon: <Wrench className="me-2 w-4 h-4" />,
          active: activeItem === '/maintenceCharge',
          onClick: () => handleItemClick('/maintenceCharge'),
        },
      ],
      open: openGroups.includes('Masters'),
      onClick: () => handleGroupToggle('Masters'),
    },

    // ===== USERS GROUP =====
    {
      component: CNavGroup,
      name: 'Users',
      icon: <Users className="me-3 w-5 h-5" />,
      items: [
        {
          component: CNavItem,
          name: 'LandLord',
          to: '/landlordMaster',
          icon: <Building2 className="me-2 w-4 h-4" />,
          active: activeItem === '/landlordMaster',
          onClick: () => handleItemClick('/landlordMaster'),
        },
        {
          component: CNavItem,
          name: 'Tenant',
          to: '/rentalMaster',
          icon: <Home className="me-2 w-4 h-4" />,
          active: activeItem === '/rentalMaster',
          onClick: () => handleItemClick('/rentalMaster'),
        },
        {
          component: CNavItem,
          name: 'Supervisor',
          to: '/supervisor',
          icon: <UserCog className="me-2 w-4 h-4" />,
          active: activeItem === '/supervisor',
          onClick: () => handleItemClick('/supervisor'),
        },
      ],
      open: openGroups.includes('Users'),
      onClick: () => handleGroupToggle('Users'),
    },

    // ===== STOCK MANAGEMENT GROUP =====
    {
      component: CNavGroup,
      name: 'Stock Management',
      icon: <PackageSearch className="me-3 w-5 h-5" />,
      items: [
        {
          component: CNavItem,
          name: 'Central Stock',
          to: '/centralStock',
          icon: <Boxes className="me-2 w-4 h-4" />,
          active: activeItem === '/centralStock',
          onClick: () => handleItemClick('/centralStock'),
        },
        {
          component: CNavItem,
          name: 'Stock Transfer',
          to: '/stockTransfer',
          icon: <ArrowLeftRight className="me-2 w-4 h-4" />,
          active: activeItem === '/stockTransfer',
          onClick: () => handleItemClick('/stockTransfer'),
        },
        {
          component: CNavItem,
          name: 'Stock Consumption',
          to: '/stockConsumption',
          icon: <ClipboardCheck className="me-2 w-4 h-4" />,
          active: activeItem === '/stockConsumption',
          onClick: () => handleItemClick('/stockConsumption'),
        },
      ],
      open: openGroups.includes('Stock Management'),
      onClick: () => handleGroupToggle('Stock Management'),
    },
  ]

  return navItems
}

export default useNav
