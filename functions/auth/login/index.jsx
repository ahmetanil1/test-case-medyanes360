// functions/auth/login.js
import { getDataByUnique } from "@/services/serviceOperation";
import DecryptPassword from "../decryptPassword";

export const loginFunction = async (data) => {
    try {
        const { email, password } = data;

        if (!email || !password) {
            return { error: { message: "Email ve şifre zorunludur." }, status: 400 };
        }

        const user = await getDataByUnique('AllUser', { email: email });

        if (!user || user.error) {
            return { error: { message: "Kullanıcı bulunamadı." }, status: 404 };
        }

        const passwordCheck = await DecryptPassword(password, user.password);

        if (!passwordCheck) {
            return { error: { message: "Mail adresi veya şifre hatalı." }, status: 401 };
        }

        const { password: _, ...userWithoutPassword } = user;

        return { success: true, user: userWithoutPassword, status: 200 };
    } catch (error) {
        console.error("Login fonksiyon hatası:", error);
        return { error: { message: error.message || "Internal server error." }, status: 500, success: false };
    }
};
