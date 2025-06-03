import { createNewData, getDataByUnique } from "@/services/serviceOperation";


export const registerFunction = async (user) => {
    try {
        const { email, name, surname, password } = user;
        if (!email || !password || !name || !surname) {
            throw new Error("Email, şifre, ad ve soyad zorunludur.");
        }

        const allUserCheck = await getDataByUnique('AllUser', {
            email: email,
        });

        if (allUserCheck != null && !allUserCheck.error) {
            throw new Error("Bu email zaten kayıtlı.");
        }
        const userFromDB = await createNewData('AllUser', {
            email: email,
            name: name,
            password: password,
            surname: surname
        });
        return {
            message: "Kullanıcı başarıyla oluşturuldu.",
            status: "success",
            user: userFromDB
        };
    } catch (error) {
        console.error("Register error:", error);
        return { message: error.message || "Internal server error.", status: "error" };
    }
}