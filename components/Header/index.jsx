"use client";
import React, { useState } from 'react';
import Link from 'next/link';

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">Medyanes Todo App</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">

                    <li className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="text-white hover:underline focus:outline-none"
                        >
                            Account
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                                <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
                                    Login
                                </Link>
                                <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
                                    Register
                                </Link>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;