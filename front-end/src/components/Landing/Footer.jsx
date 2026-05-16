import React from 'react'
import Logo from '../Logo/Logo'

const Footer = () => {
  return (
    <div className='bg-gray-500/10 flex flex-col items-center justify-center gap-2' >
        <div className='mt-6'><Logo/></div>
        <div className='text-xs text-slate-600/80 text-center px-2'>
            <p>The editorial platform for professional marketplaces. Connecting verified talent with high-impact needs.</p>
        </div>
        <div className='text-xs text-slate-600/80 mb-5 px-2'>
            <p>© {new Date().getFullYear()} NEXARO Editorial Premium. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer