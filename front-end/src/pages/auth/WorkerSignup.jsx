import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import HeaderWorkerSignup from '../../components/Worker/HeaderWorkerSignup'
import Header from '../../components/Landing/Header'
import WorkerSignupForm from '../../components/Form/WorkerSignupForm'

const WorkerSignup = () => {
  const methods = useForm()
  return (
    <div>
      <Header landing ={false} />
      <HeaderWorkerSignup/>
      <FormProvider {...methods} >
        <WorkerSignupForm/>
      </FormProvider>
    </div>
  )
}

export default WorkerSignup