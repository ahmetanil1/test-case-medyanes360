import LoginContainer from '@/container/auth/login'
import React from 'react'

function AdminLogin() {
    return (
        <div>
            <LoginContainer role={"ADMIN"} />
        </div>
    )
}

export default AdminLogin