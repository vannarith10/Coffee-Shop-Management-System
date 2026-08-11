import React from 'react'
import GeneralInformation from '../../components/admin/GeneralInformation'
import ShopBranding from '../../components/admin/ShopBranding'

const SettingTab = () => {
  return (
    <div className="w-full h-full mt-20 md:mt-0 p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl xl:text-4xl font-extrabold">
          Shop Profile
        </h1>
        <p className="text-sm text-text-secondary">
          Configure your shop's core parameters and public branding.
        </p>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
        <GeneralInformation/>
        <ShopBranding/>
      </div>
    </div>
  )
}

export default SettingTab
