import { registerFunction } from "@/functions/auth/register";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import EncryptPassword from "@/functions/auth/encryptPassword";

const handler = async (req, res) => {
    if (!req) {
        return res.status(500).json({ error: "İstek bulunamadı." });
    }
    const session = await getServerSession(req, res, authOptions)
    if (!session) {

        if (req.method === 'POST' && req.body) {
            try {
                const data = req.body;
                if (!data.password) {
                    throw new Error("Şifre zorunludur.");
                }
                data.password = await EncryptPassword(data.password);

                


                const createUser = await registerFunction(data);
              
                return res.status(201).json({
                    message: "Kullanıcı başarıyla oluşturuldu.",
                    user: createUser
                });

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