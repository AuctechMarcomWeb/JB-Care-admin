/* eslint-disable prettier/prettier */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from '../assets/logo1.png'

import useNav from '../_nav'

const AppSidebar = () => {
  const navigation = useNav()
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      style={{ zIndex: '3' }}
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
    >
      <CSidebarHeader style={{ backgroundColor: '#000000' }} className="border-bottom">
        <CSidebarBrand
          to="/"
          className="d-flex justify-content-center align-items-center w-100"
          style={{
            padding: '12px 0',
            backgroundColor: '#000',
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '120px', // Adjust size
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </CSidebarBrand>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />

      </CSidebarFooter> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
