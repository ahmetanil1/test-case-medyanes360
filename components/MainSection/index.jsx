// components/MainSection.jsx
"use client"
import React from 'react'
import { useSession } from 'next-auth/react';
import LoadingScreen from '../other/loading';
import Link from 'next/link';
import Todos from '../todos';

function MainSection() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <LoadingScreen isLoading={true} />;
    }

    return (
        // The outer div now ensures it takes at least the full screen height
        // and allows for scrolling if content exceeds that.
        <div className="flex flex-grow items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className='w-full max-w-7xl mx-auto '> {/* flex-grow makes it take available space */}
                {session ? (
                    <Todos user={session.user} />
                ) : (
                    <div className="text-center p-8">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Giriş Yapmadınız</h1>
                        <p className="text-gray-700">Lütfen tam özelliklere erişmek için giriş yapın.</p>
                        <Link
                            href="/login"
                            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Giriş Yap
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MainSection;