
const FormError = ({ error }) => {
    return (
        <span className='text-xs text-red-500 mt-1 flex items-center gap-1' >{error?.message}</span>
    )
}

export default FormError