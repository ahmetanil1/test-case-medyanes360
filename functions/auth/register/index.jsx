import { createNewData, getDataByUnique } from "@/services/serviceOperation";


export const registerFunction = async (user) => {
    try {
        const { email, name, surname, role } = user;
        if (!email || !password || !name || !surname) {
            return res.status(400).json({ message: "Tüm alanlar zorunludur." });
        }

        const allUserCheck = await getDataByUnique('AllUser', {
            email: email,
        });

        if (allUserCheck != null && !allUserCheck.error) {
            return res.status(409).json({ message: "Bu email adresi zaten kayıtlı." });
        }
        else {
            const userFromDB = await createNewData('AllUser', {
                email: email,
                name: name,
                role: role,
                surname: surname
            });
            if (userFromDB.error || !userFromDB) {
                return { error: 'Kayıt oluşturulamadı. REGXR' };
            }
        }
        return res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu." });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: error.message || "Internal server error." });
    }
}