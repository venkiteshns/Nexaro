import React from 'react'
import PersonalInfo from './PersonalInfo'
import Password from './Password'
import { useFormContext } from 'react-hook-form'
import TermsAndConditions from './TermsAndConditions'
import Location from './Location'
import IdentityVerification from './IdentityVerification'
import CustomSelector from './CustomSelector'

const WorkerSignupForm = () => {
    const {handleSubmit} = useFormContext()
  return (
    <div className="bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-10">

        <form onSubmit={handleSubmit((data) => {console.log(data)})} >
            <PersonalInfo worker = {true}/>
            <Location worker={true}/>
            <CustomSelector section={"language"} />
            <CustomSelector section={"skill"} />
            <IdentityVerification/>
            <Password/>
            <TermsAndConditions/>
            <button
              type="submit"
              className="w-full bg-[#0a6e5c] hover:bg-green-900/90 transition text-white font-semibold py-3.5 rounded-xl"
            >
              Create Account
            </button>
        </form>
        </div>
    </div>
  )
}

export default WorkerSignupForm