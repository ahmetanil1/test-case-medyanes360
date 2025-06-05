"use client"
import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import validationSchema from './formikData';
import { ToastContainer, toast } from 'react-toastify';
import LoadingScreen from '@/components/other/loading';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import { postAPI } from '@/services/fetchAPI';
import { useRouter } from 'next/navigation';

function RegisterComponent() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    return (
        <>
            {isLoading && <LoadingScreen isloading={isLoading} />}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <ToastContainer
                    position='top-right'
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme='colored'
                />
                <Formik
                    initialValues={{
                        name: '',
                        surname: '',
                        email: '',
                        password: '',
                        passwordConfirm: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        setIsLoading(true);
                        try {
                            const res = await postAPI("/auth/register", {
                                name: values.name,
                                surname: values.surname,
                                email: values.email,
                                password: values.password,
                            });
                            console.log("Kayıtlı kullanıcı:", res);

                            if (res?.error) {
                                toast.error(res.error);
                            } else {
                                toast.success("Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
                                // Başarılı kayıttan sonra kullanıcıyı giriş sayfasına yönlendirebilirsiniz
                                router.push('/login');
                            }
                        } catch (error) {
                            console.error("Kayıt API hatası:", error);
                            toast.error("Kayıt sırasında bir hata oluştu.");
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                >
                    {(props) => (
                        <Form
                            onSubmit={props.handleSubmit}
                            className='flex flex-col gap-5 w-full max-w-lg mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-200'
                        >
                            <div className='text-center mb-6'>
                                <h2 className='text-3xl font-extrabold text-gray-800'>
                                    Kayıt Ol
                                </h2>
                            </div>
                            {/* İsim Alanı */}
                            <div>
                                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>İsim</label>
                                <input
                                    id='name'
                                    name='name'
                                    autoComplete='given-name'
                                    type='text'
                                    value={props.values.name}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    placeholder='İsminizi giriniz.'
                                    className='w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition duration-150 ease-in-out'
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            {/* Soyisim Alanı */}
                            <div>
                                <label htmlFor='surname' className='block text-sm font-medium text-gray-700 mb-1'>Soyisim</label>
                                <input
                                    id='surname'
                                    name='surname'
                                    autoComplete='family-name'
                                    type='text'
                                    value={props.values.surname}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    placeholder='Soyisminizi giriniz.'
                                    className='w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition duration-150 ease-in-out'
                                />
                                <ErrorMessage name="surname" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            {/* Email Alanı */}
                            <div>
                                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                                <input
                                    id='email'
                                    name='email'
                                    autoComplete='email'
                                    type='email'
                                    value={props.values.email}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    placeholder='Mail adresinizi giriniz.'
                                    className='w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition duration-150 ease-in-out'
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            {/* Şifre Alanı */}
                            <div>
                                <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>Şifre</label>
                                <input
                                    id='password'
                                    name='password'
                                    type='password'
                                    value={props.values.password}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    placeholder='******'
                                    className='w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition duration-150 ease-in-out'
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            {/* Şifre Tekrar Alanı */}
                            <div>
                                <label htmlFor='passwordConfirm' className='block text-sm font-medium text-gray-700 mb-1'>Şifre Tekrar</label>
                                <input
                                    id='passwordConfirm'
                                    name='passwordConfirm'
                                    type='password'
                                    value={props.values.passwordConfirm}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    placeholder='******'
                                    className='w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition duration-150 ease-in-out'
                                />
                                <ErrorMessage name="passwordConfirm" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <button
                                className='mt-4 w-full px-5 py-2.5 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed'
                                type='submit'
                                disabled={!props.isValid || props.isSubmitting || isLoading}
                            >
                                Kayıt Ol
                            </button>
                            <div className='mt-6 text-center'>
                                <p className='text-sm text-gray-600'>
                                    Zaten hesabınız var mı?
                                    <Link
                                        href='/login'
                                        className='ml-1 font-medium text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out'
                                    >
                                        Giriş Yap
                                    </Link>
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
}

export default RegisterComponent;