import './Admin.css'
import Logo from "../../components/Logo/Logo";
import { ShieldCheck } from 'lucide-react';

const AdminLoginBanner = () => {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 bg-green-600/5 border border-[#DDE7E2] ">

      <div className="relative z-10 flex flex-col justify-between h-full w-full px-16 py-12">
        {/* Logo */}
        <div>
          <div className="flex flex-col justify-center gap-2">
            <Logo />
            <p className="text-[#5F6B66] text-sm tracking-wide ">
              Admin Control Center
            </p>
          </div>
        </div>

        {/* Hero  */}
        <div className="max-w-xl">

          <h2 className="banner-text font-[600] text-4xl tracking-tight w-80">
            Precision <span className='text-[#0a6e5c]' >Control</span> for Modern Operations.
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-[#5B6670] max-w-lg">
            Access the core administrative infrastructure of NEXARO with
            enterprise-grade security and operational intelligence.
          </p>

          {/* Card */}
          <div className=" w-100 mt-12 bg-white/70 border border-[#E2ECE7] rounded-3xl p-8 ">
            <div className="flex items-start gap-5">
              <div className="p-2 rounded-2xl bg-[#0A6E5C]/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#0a6e5c]" />
              </div>

              <div>
                <h3 className="text-md font-bold text-[#111827]">
                  Security Architecture
                </h3>

                <p className="mt-1 text-[#5F6B66] text-xs">
                  Manage users, tasks, platform operations, securely.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-400">
          © 2026 NEXARO Editorial Premium. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default AdminLoginBanner