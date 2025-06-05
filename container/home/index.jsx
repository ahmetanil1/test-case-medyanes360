import Header from '@/components/Header'
import MainSection from '@/components/MainSection'
import React from 'react'

function HomeContainer() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <MainSection />
        </div>
    )
}

export default HomeContainer