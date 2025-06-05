import { authOptions } from "../auth/[...nextauth]";
import { getAllDataAdmin, getDataByUnique } from "@/services/serviceOperation";
import { getServerSession } from "next-auth";

/**
 * Handles API requests for user data.
 * This route supports fetching all users (admin only) or a single user by ID (admin only).
 *
 * @param {object} req - The Next.js API request object.
 * @param {object} res - The Next.js API response object.
 */
export default async function handler(req, res) {
    // Get the user session to check authentication and role
    const session = await getServerSession(req, res, authOptions);

    // If no session or user ID, return unauthorized error
    if (!session || !session.user || !session.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Extract the slug from the request query (e.g., ['all'] or ['userId'])
    const { slug } = req.query;
    // Get the user's role from the session
    const userRole = session.user.role;
    // The first element of the slug array determines the operation or ID
    const identifier = slug[0];

    // Handle GET requests
    if (req.method === "GET") {
        // If the identifier is 'all', fetch all users
        if (identifier === "all") {
            // Only allow ADMIN users to fetch all data
            if (userRole !== "ADMIN") {
                return res.status(403).json({ error: "Forbidden: Admin access required to fetch all users" });
            }

            try {
                // Fetch all users using the service operation
                const users = await getAllDataAdmin("AllUser");

                // If no users are found, return 404
                if (!users || users.length === 0) {
                    return res.status(404).json({ error: "Kullanıcı bulunamadı" });
                }

                // Return success response with user data
                return res.status(200).json({ success: true, data: users, message: "Kullanıcılar başarıyla getirildi" });
            } catch (error) {
                // Log and return server error if something goes wrong
                console.error("GET /api/users/all : ", error);
                return res.status(500).json({ error: error.message || "Sunucu hatası oluştu" });
            }
        } else {
            // If the identifier is not 'all', treat it as a user ID to fetch a single user
            // For consistency with the existing admin check, fetching a single user also requires ADMIN role for this endpoint.
            // If you wish to allow non-admins to fetch their own profile, you would add a separate condition here.
            if (userRole !== "ADMIN") {
                return res.status(403).json({ error: "Forbidden: Admin access required to fetch a specific user by ID" });
            }

            try {
                const userId = identifier; // The identifier is the user ID
                // Fetch a single user by ID using the service operation
                const user = await getDataByUnique("AllUser", { id: userId });

                // If the user is not found, return 404
                if (!user) {
                    return res.status(404).json({ error: "Kullanıcı bulunamadı" });
                }

                // Return success response with single user data
                return res.status(200).json({ success: true, data: user, message: "Kullanıcı başarıyla getirildi" });
            } catch (error) {
                // Log and return server error if something goes wrong
                console.error(`GET /api/users/${identifier} : `, error);
                return res.status(500).json({ error: error.message || "Sunucu hatası oluştu" });
            }
        }
    }

    // If the request method is not GET, return Method Not Allowed error
    return res.status(405).json({ error: "Method Not Allowed" });
}
