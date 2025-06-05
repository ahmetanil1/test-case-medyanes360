// components/MainSection.jsx
"use client"
import React from 'react'
import { useSession } from 'next-auth/react';
import LoadingScreen from '../other/loading'; // Doğru yolu kontrol edin
import Link from 'next/link';
import Todos from '../todos';

function MainSection() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        // Oturum yüklenirken LoadingScreen'i göster
        return <LoadingScreen isLoading={true} />;
    }

    // Oturum yüklendikten sonra ana içeriği göster
    return (
        // En dıştaki div: Ekran yüksekliğinin tamamını kaplar ve içeriği ortalar.
        // overflow-y-auto'yu buradan kaldırdım, çünkü içeriği sınırlayıp kaydırmayı iç div'de yapacağız.
        <div className=" h-[calc(100vh-90px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">

            <div className='w-full max-w-4xl mx-auto p-4'>
                {session ? (
                    <Todos user={session.user} />
                ) : (
                    <div className="text-center p-8">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Giriş Yapmadınız</h1>
                        <p className="text-gray-700">Lütfen tam özelliklere erişmek için giriş yapın.</p>
                        <Link
                            href="/login" // Linki '/auth/login' olarak güncelledim, eğer öyleyse
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