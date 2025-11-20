import React from 'react'
import StaffPortalTabsOverview from './StaffPortalTabsOverview'
import StaffPortalTabsCustomer from './StaffPortalTabsCustomer'
import StaffPortalTabsProduct from './StaffPortalTabsProduct'
import StaffPortalTabsAppointment from './StaffPortalTabsAppointment'

const StaffPortalTabs = () => {
  return (
    <div>
      <StaffPortalTabsOverview/>
      <StaffPortalTabsCustomer/>
      <StaffPortalTabsAppointment/>
      <StaffPortalTabsProduct/> 
    </div>
  )
}

export default StaffPortalTabs
