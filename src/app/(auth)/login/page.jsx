"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react'; // NextAuth.js'in signIn fonksiyonunu import ediyoruz
import { useRouter } from 'next/navigation'; // Yönlendirme için useRouter

// Tailwind CSS sınıflarını kullanabilmek için script ekliyoruz
// Bu script, HTML çıktısında Tailwind'i kullanılabilir hale getirecektir.
// Normalde Next.js projenizde Tailwind CSS kurulumu varsa buna gerek kalmaz.
// Ancak bu örnek, bağımsız çalışabilmesi için eklenmiştir.
// <script src="https://cdn.tailwindcss.com"></script>

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Hata mesajlarını göstermek için
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Formun varsayılan gönderimini engelle

        setError(null); // Önceki hataları temizle

        // NextAuth.js'in signIn fonksiyonunu Credentials sağlayıcımızla çağırıyoruz
        const result = await signIn('credentials', {
            redirect: false, // Otomatik yönlendirmeyi kapatıp hatayı kendimiz işleyeceğiz
            email,
            password,
            // callbackUrl: '/dashboard' // Başarılı girişten sonra yönlendirilecek URL (isteğe bağlı)
        });
        console.log("Giriş sonucu:", result);

        if (result.error) {
            // Giriş başarısız olursa hata mesajını ayarla
            setError(result.error);
            console.error("Giriş hatası:", result.error);
        } else {
            // Giriş başarılı olursa dashboard sayfasına yönlendir
            console.log("Giriş başarılı!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Giriş Yap</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">Hata!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Adresi
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="ornek@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Şifre
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="Şifrenizi girin"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out font-semibold text-lg"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}
