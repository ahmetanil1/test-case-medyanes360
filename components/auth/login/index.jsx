"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import validationSchema from "./formikData";
import { ToastContainer, toast } from "react-toastify";
import LoadingScreen from "@/components/other/loading";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

export default function LoginComponent({ pageRole }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(values, actions) {
        setIsLoading(true);

        const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            role: pageRole,
            redirect: false,
        });

        if (res?.error || !res || !res.ok || res.status !== 200) {
            if (
                res.error.includes("rol") ||
                res.error.includes("Role") ||
                res.error.includes("yetki") ||
                res.status === 401
            ) {
                toast.error("Yetkisiz Giriş!");
            } else {
                toast.error(res.error);
            }
        } else {
            toast.success("Giriş Başarılı");
            actions.resetForm();
            router.push("/");
        }


        setIsLoading(false);
    }

    return (
        <>
            {isLoading && <LoadingScreen isloading={isLoading} />}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, isValid }) => (
                        <Form className="flex flex-col gap-5 w-full max-w-lg mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-200">
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-extrabold text-gray-800">
                                    {pageRole === "ADMIN" ? "Admin Girişi" : "Kullanıcı Girişi"}
                                </h2>
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    placeholder="Mail adresinizi giriniz."
                                    className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition duration-150 ease-in-out"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Şifre
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="******"
                                    className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:ring-1 transition duration-150 ease-in-out"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="mt-4 w-full px-5 py-2.5 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Giriş Yap
                            </button>

                            {pageRole === "USER" && (
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        Hesabınız yok mu?
                                        <Link
                                            href="/register"
                                            className="ml-1 font-medium text-blue-600 hover:text-blue-800 hover:underline transition duration-150 ease-in-out"
                                        >
                                            Kayıt Ol
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
}
