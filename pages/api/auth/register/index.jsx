import { registerFunction } from "@/functions/auth/register";
import { getServerSession } from "next-auth";


const handler = async (req, res) => {
    if (!req) {
        return res.status(500).json({ error: "İstek bulunamadı." });
    }
    const session = await getServerSession(req, res, authOptions)
    if (!session) {

        if (req.method === 'POST' && req.body) {
            try {
                const data = req.body;
                data.password = await EncryptPassword(data.password);

                if (!data.password) {
                    throw new Error("Şifre zorunludur.");
                }

                const hashedEmail = await EncryptPassword(data.email);


                if (!hashedEmail || typeof hashedEmail === "object" && hashedEmail.error) {
                    throw new Error("hash: Kayıt sırasında bir hata oluştu.");
                }

                if (typeof mailKey == "string") {

                    const createUser = await registerFunction(data);
                    if ('error' in createUser) {
                        throw new Error(createUser.error);
                    }

                }

                return res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu.", user: { email: data.email, name: data.name, surname: data.surname, role: data.role } });

            } catch (error) {
                return res.status(500).json({ status: error.status, error: error.message });
            }
        }
        else {
            return res.status(405).json({ error: "Yalnızca POST metodu destekleniyor." });
        }
    }
    else {
        return res.status(403).json({ error: "Oturum açan kullanıcılar kayıt işlemi yapamaz" });
    }

}

export default handler;