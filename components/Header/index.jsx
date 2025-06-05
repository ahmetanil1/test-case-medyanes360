"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserBadge from "../other/userBadge";
import LoadingScreen from "../other/loading";

function Header() {
    const { data: session, status } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="p-6 bg-indigo-700 text-white flex justify-between items-center">
            <h1 className="text-3xl font-extrabold tracking-wide">Medyanes Todo App</h1>

            <nav className="relative">
                { session ? (
                    <UserBadge user={session.user} />
                ) : (
                    <ul className="flex space-x-4">
                        <li className="relative">
                            <button
                                ref={buttonRef}
                                onClick={toggleDropdown}
                                className="px-4 py-2 bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                                aria-label="Toggle Account Dropdown"
                            >
                                Account
                            </button>

                            {isDropdownOpen && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl z-20 overflow-hidden text-gray-800"
                                >
                                    <Link
                                        href="/login"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-3 hover:bg-indigo-600 hover:text-white transition duration-200 ease-in-out"
                                    >
                                        Giriş Yap
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-3 hover:bg-indigo-600 hover:text-white transition duration-200 ease-in-out"
                                    >
                                        Kayıt Ol
                                    </Link>
                                </div>
                            )}
                        </li>
                    </ul>
                )}
            </nav>
        </header>
    );
}

export default Header;