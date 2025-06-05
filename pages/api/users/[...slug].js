import { authOptions } from "../auth/[...nextauth]";
import { getAllDataAdmin, getDataByUnique } from "@/services/serviceOperation";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { slug } = req.query;
    const userRole = session.user.role;
    const identifier = slug[0];

    if (req.method === "GET") {
        if (identifier === "all") {
            if (userRole !== "ADMIN") {
                return res.status(403).json({ error: "Forbidden: Admin access required to fetch all users" });
            }

            try {
                const users = await getAllDataAdmin("AllUser");

                if (!users || users.length === 0) {
                    return res.status(404).json({ error: "Kullanıcı bulunamadı" });
                }

                return res.status(200).json({ success: true, data: users, message: "Kullanıcılar başarıyla getirildi" });
            } catch (error) {
                return res.status(500).json({ error: error.message || "Sunucu hatası oluştu" });
            }
        } else {
            if (userRole !== "ADMIN") {
                return res.status(403).json({ error: "Forbidden: Admin access required to fetch a specific user by ID" });
            }

            try {
                const userId = identifier; 
                const user = await getDataByUnique("AllUser", { id: userId });

                if (!user) {
                    return res.status(404).json({ error: "Kullanıcı bulunamadı" });
                }

                return res.status(200).json({ success: true, data: user, message: "Kullanıcı başarıyla getirildi" });
            } catch (error) {
                return res.status(500).json({ error: error.message || "Sunucu hatası oluştu" });
            }
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
