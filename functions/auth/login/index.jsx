// functions/auth/login.js
import { getDataByUnique } from "@/services/serviceOperation";
import DecryptPassword from "../decryptPassword";

export const loginFunction = async (data) => {
    console.log("Login fonksiyonu çalışıyor", data);
    try {
        const { email, password, role = "USER" } = data;

        if (!email || !password || !role) {
            return { error: { message: "Email ve şifre zorunludur." }, status: 400 };
        }

        const user = await getDataByUnique('AllUser', { email: email });

        if (!user || user.error) {
            return { error: { message: "Kullanıcı bulunamadı." }, status: 404 };
        }
        if (user.role !== role) { // user.role sizin veritabanınızdaki rol alanı olmalı
            return { error: { message: "Hatalı kullanıcı rolü veya giriş bilgileri." }, status: 403 }; // Forbidden
        }

        const passwordCheck = await DecryptPassword(password, user.password);

        if (!passwordCheck) {
            return { error: { message: "Mail adresi veya şifre hatalı." }, status: 401 };
        }

        const { password: _, ...userWithoutPassword } = user;
        console.log("Login başarılı, kullanıcı bilgileri:", userWithoutPassword);

        return { success: true, user: userWithoutPassword, status: 200 };
    } catch (error) {
        console.error("Login fonksiyon hatası:", error);
        return { error: { message: error.message || "Internal server error." }, status: 500, success: false };
    }
};
