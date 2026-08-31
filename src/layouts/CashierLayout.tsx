//
//  CashierLayout.tsx
//
import Navbar from '../components/cashier/Navbar'
import { Outlet } from 'react-router-dom'

const CashierLayout = () => {
  return (
    <div className='h-screen max-h-screen overflow-hidden'>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default CashierLayout
