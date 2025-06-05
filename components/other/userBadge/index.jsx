"use client";

import { signOut } from "next-auth/react";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";

const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function UserBadge({ user }) {
    if (!user) return null; 

    const capitalizedName = capitalizeFirstLetter(user.name);
    const capitalizedSurname = capitalizeFirstLetter(user.surname);
    const { role } = user;

    return (
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200 text-gray-800">
            <div className="flex items-center gap-2 font-semibold">
                {role === "ADMIN" && (
                    <MdAdminPanelSettings className="text-blue-600 text-xl" />
                )}
                <span>
                    {capitalizedName} {capitalizedSurname}
                    {role === "ADMIN" && (
                        <span className="ml-1 text-xs text-white bg-blue-600 px-2 py-0.5 rounded-full">
                            Admin
                        </span>
                    )}
                </span>
            </div>
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Çıkış Yap"
            >
                <FaSignOutAlt className="text-lg" />
            </button>
        </div>
    );
}