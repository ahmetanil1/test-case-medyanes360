import LoginComponent from '@/components/auth/login'
import React from 'react'

function LoginContainer({ role }) {
    return (
        <div>
            <LoginComponent pageRole={role} />
        </div>
    )
}

export default LoginContainer