import { authOptions } from "../auth/[...nextauth]";

import { getAllData, getAllDataAdmin } from "@/services/serviceOperation";

import { getServerSession } from "next-auth";
export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user || !session.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userRole = session.user.role;

    if (req.method === "GET" && userRole === "ADMIN") {
        try {
            const users = await getAllDataAdmin("AllUser");

            if (!users || users.length === 0) {
                return res.status(404).json({ error: "Kullanıcı bulunamadı" });
            }

            return res.status(200).json({ success: true, data: users, message: "Kullanıcılar başarıyla getirildi" });
        } catch (error) {
            console.error("GET /api/users : ", error);
            return res.status(500).json({ error: error.message || "Sunucu hatası oluştu" });
        }
    }
}