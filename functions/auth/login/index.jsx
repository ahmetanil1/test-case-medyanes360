// functions/auth/login.js
import { getDataByUnique } from "@/services/serviceOperation";
import DecryptPassword from "../decryptPassword";

export const loginFunction = async (data) => {
    try {
        const { email, password, role = "USER" } = data;

        if (!email || !password || !role) {
            return { error: { message: "Email ve şifre zorunludur." }, status: 400 };
        }

        const user = await getDataByUnique('AllUser', { email: email });

        if (!user || user.error) {
            return { error: { message: "Kullanıcı bulunamadı." }, status: 404 };
        }
        if (user.role !== role) {
            return { error: { message: "Hatalı kullanıcı rolü veya giriş bilgileri." }, status: 403 }; 
        }

        const passwordCheck = await DecryptPassword(password, user.password);

        if (!passwordCheck) {
            return { error: { message: "Mail adresi veya şifre hatalı." }, status: 401 };
        }

        const { password: _, ...userWithoutPassword } = user;

        return { success: true, user: userWithoutPassword, status: 200 };
    } catch (error) {
        return { error: { message: error.message || "Internal server error." }, status: 500, success: false };
    }
};
