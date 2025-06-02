import { getDataByUnique } from "@/services/serviceOperation";
import DecryptPassword from "../decryptPassword";

export const loginFunction = async (data) => {
    try {
        const { email, password } = data;

        if (!email || !password) {
            return { error: "Email ve şifre zorunludur.", status: 400 };
        }

        const user = await getDataByUnique('AllUser', { email: email });

        if (!user || user.error) {
            return { error: "Kullanıcı bulunamadı.", status: 404 };
        }
        const PasswordFromDB = role == "Admin" ? user.password + process.env.ADMIN_PASSWORD : user.password;
        const passwordCheck = await DecryptPassword(PasswordFromDB, password);

        if (!passwordCheck || passwordCheck == null || passwordCheck == undefined) {
            throw new Error("Mail adresi veya şifre hatalı.");
        }

        return { success: true, user: user, status: "success" };
    } catch (error) {
        return { error: error.message || "Internal server error.", status: "error", success: false };
    }
}