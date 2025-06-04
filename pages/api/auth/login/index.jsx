import { loginFunction } from "@/functions/auth/login";

const handler = async (req, res) => {
    if (!req) {
        return res.status(500).json({ error: "İstek bulunamadı." });
    }
    if (req.method === 'POST') {
        try {
            const data = req.body;

            const { user, error, status } = await loginFunction(data);

            if (error || !user) {
                let error2 = new Error();
                error2.message = error.message;
                error2.status = status;
                throw error2;
            }

            return res.status(200).json({ success: true, data: user, message: "Giriş işlemi başarılı" });

        } catch (error) {
            return res.status(500).json({ status: error.status, error: error.message });
        }
    }
    else {
        return res.status(500).json({ error: "Giriş metodunda hata oluştu." });
    }

};

export default handler;
