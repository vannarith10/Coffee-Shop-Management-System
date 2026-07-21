import React from 'react'
import SellByCategory from '../../components/admin/SellByCategory'
import BusiestHours from '../../components/admin/BusiestHours'
import RevenueTrends from '../../components/admin/RevenueTrends'

const ReportTab = () => {
  return (
    <div className="w-full h-full mt-20 md:mt-0 p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl xl:text-4xl font-extrabold">
          Revenue Trends
        </h1>
        <p className="text-sm text-text-secondary">
          Monthly performance and daily revenue analysis.
        </p>
      </div>

      <SellByCategory/>
      <BusiestHours/>
      <RevenueTrends/>
    </div>
  )
}

export default ReportTab
