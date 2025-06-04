import authOptions from "@/pages/api/auth/[...nextauth]";
import {
    getAllData,         // Tüm todoları getirmek için
    createNewData,      // Yeni todo oluşturmak için
    getFirstDataByWhere, // Tekil todo getirmek için (id ve userId ile)
    updateDataByAny,    // Tekil todo güncellemek için
    deleteDataByAny,    // Tekil todo silmek için
    deleteDataAll        // Tüm todoları silmek için (where koşulu ile)
} from "@/services/serviceOperation";
import { getServerSession } from "next-auth";

export default async function todoHandler(req, res) {
    // const authSession = await getServerSession(req, res, authOptions);

    // if (!authSession || !authSession.user || !authSession.user.id) {
    //     return res.status(401).json({ error: "Yetkisiz erişim. Lütfen giriş yapın." });
    // }

    const userId = "68401de7b2599a7ab6dbdd5b"; 

    const { slug } = req.query;
    console.log("req.query.slug:", slug);

    const requestMethod = req.method;
    const data = req.body;

    const operation = slug?.[0];
    const todoId = slug?.[1];

    switch (requestMethod) {
        case "GET":
            switch (operation) {
                case "all": // GET /api/todos/all
                    try {
                        const todos = await getAllData("Todo", { allUserId: userId });

                        if (todos && todos.error) {
                            console.error("Error fetching all todos:", todos.error);
                            return res.status(500).json({ error: "Tüm todolar getirilirken bir hata oluştu." });
                        }
                        return res.status(200).json({ todos: todos });
                    } catch (error) {
                        console.error("GET /api/todos/all error:", error);
                        return res.status(500).json({ error: error.message || "Sunucu hatası oluştu." });
                    }
                case "single": // GET /api/todos/single/todo_id_here
                    if (!todoId) {
                        return res.status(400).json({ error: "Todo ID bilgisi eksik. Tek bir todo getirmek için gereklidir." });
                    }
                    try {
                        const todo = await getFirstDataByWhere("Todo", { id: todoId, allUserId: userId });

                        if (todo && todo.error) {
                            console.error("Error fetching single todo:", todo.error);
                            return res.status(500).json({ error: "Todo getirilirken bir hata oluştu." });
                        }
                        if (!todo) {
                            return res.status(404).json({ error: "Todo bulunamadı veya bu todo'ya erişim yetkiniz yok." });
                        }
                        return res.status(200).json({ todo: todo });
                    } catch (error) {
                        console.error("GET /api/todos/single error:", error);
                        return res.status(500).json({ error: error.message || "Sunucu hatası oluştu." });
                    }
                default:
                    return res.status(404).json({ error: "Geçersiz GET işlemi. Lütfen geçerli bir işlem belirtin." });
            }

        case "POST":
            switch (operation) {
                case "create": // POST /api/todos/create
                    try {
                        const { title, description, priority, category, isCompleted } = data;

                        if (!title || !description || !priority || !category) {
                            return res.status(400).json({ error: "Yeni todo oluşturmak için tüm alanların doldurulması zorunludur." });
                        }

                        const newTodoData = {
                            title,
                            description,
                            priority,
                            category,
                            allUserId: userId, // Todo'yu oturumdaki kullanıcıya bağla
                            isCompleted: isCompleted
                        };

                        const newTodo = await createNewData("Todo", newTodoData);

                        if (newTodo && newTodo.error) {
                            console.error("Error creating new todo:", newTodo.error);
                            return res.status(500).json({ error: "Yeni todo oluşturulurken bir hata oluştu." });
                        }

                        return res.status(201).json({ message: "Todo başarıyla oluşturuldu.", todo: newTodo });
                    } catch (error) {
                        console.error("POST /api/todos/create error:", error);
                        return res.status(500).json({ error: error.message || "Sunucu hatası oluştu." });
                    }
                case "update": // POST /api/todos/update/todo_id_here
                    // todoId, slug dizisinin ikinci elemanından geliyor
                    if (!todoId || typeof todoId !== 'string' || todoId.trim() === '') {
                        return res.status(400).json({ error: "Todo ID bilgisi eksik. Güncelleme işlemi için gereklidir." });
                    }
                    try {
                        const { title, description, isCompleted, priority, category } = data;

                        const updateFields = {};
                        if (title !== undefined) updateFields.title = title;
                        if (description !== undefined) updateFields.description = description;
                        if (isCompleted !== undefined) updateFields.isCompleted = isCompleted;
                        if (priority !== undefined) updateFields.priority = priority;
                        if (category !== undefined) updateFields.category = category;

                        if (Object.keys(updateFields).length === 0) {
                            return res.status(400).json({ error: "Güncelleme için herhangi bir alan gönderilmedi. Lütfen en az bir alan gönderin." });
                        }

                        const updatedTodo = await updateDataByAny("Todo",
                            { id: todoId, allUserId: userId },
                            updateFields
                        );

                        if (updatedTodo && updatedTodo.error) {
                            console.error("Error updating todo:", updatedTodo.error);
                            if (updatedTodo.error.includes("Record to update not found.") || updatedTodo.error.includes("No records updated.")) {
                                return res.status(404).json({ error: "Todo bulunamadı, erişim yetkiniz yok veya herhangi bir değişiklik algılanmadı." });
                            }
                            return res.status(500).json({ error: "Todo güncellenirken bir hata oluştu." });
                        }

                        if (!updatedTodo) {
                            return res.status(404).json({ error: "Todo bulunamadı veya bu todo'ya erişim yetkiniz yok." });
                        }

                        return res.status(200).json({ message: "Todo başarıyla güncellendi.", todo: updatedTodo });
                    } catch (error) {
                        console.error("POST /api/todos/update error:", error);
                        return res.status(500).json({ error: error.message || "Sunucu hatası oluştu." });
                    }
                default:
                    return res.status(404).json({ error: "Geçersiz POST işlemi. Lütfen geçerli bir işlem belirtin." });
            }
        case "DELETE":
            switch (operation) {
                case "delete": // DELETE /api/todos/delete/todo_id_here
                    if (!todoId || typeof todoId !== 'string' || todoId.trim() === '') {
                        return res.status(400).json({ error: "Todo ID bilgisi eksik. Silme işlemi için gereklidir." });
                    }
                    try {
                        const deletedTodo = await deleteDataByAny("Todo", { id: todoId, allUserId: userId });

                        if (deletedTodo && deletedTodo.error) {
                            console.error("Error deleting todo:", deletedTodo.error);
                            if (deletedTodo.error.includes("Record to delete not found.") || deletedTodo.error.includes("No records deleted.")) {
                                return res.status(404).json({ error: "Todo bulunamadı veya bu todo'ya erişim yetkiniz yok." });
                            }
                            return res.status(500).json({ error: "Todo silinirken bir hata oluştu." });
                        }

                        if (!deletedTodo || (deletedTodo.count !== undefined && deletedTodo.count === 0)) {
                            return res.status(404).json({ error: "Todo bulunamadı veya bu todo'ya erişim yetkiniz yok." });
                        }

                        return res.status(200).json({ message: "Todo başarıyla silindi.", status: "success", data: deletedTodo });
                    } catch (error) {
                        console.error("DELETE /api/todos/delete error:", error);
                        return res.status(500).json({ error: error.message || "Sunucu hatası oluştu." });
                    }
                case "deleteAll": // DELETE /api/todos/deleteAll
                    try {
                        const result = await deleteDataAll("Todo", { allUserId: userId });

                        if (result && result.error) {
                            console.error("Error deleting all todos:", result.error);
                            return res.status(500).json({ error: "Tüm todolar silinirken bir hata oluştu." });
                        }
                        return res.status(200).json({
                            message: `${result.count || 0} adet todo başarıyla silindi.`,
                            status: "success",
                            deletedCount: result.count || 0
                        });
                    } catch (error) {
                        console.error("DELETE /api/todos/deleteAll error:", error);
                        return res.status(500).json({ error: error.message || "Sunucu hatası oluştu." });
                    }
                default:
                    return res.status(404).json({ error: "Geçersiz DELETE işlemi. Lütfen geçerli bir işlem belirtin." });
            }

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            return res.status(405).json({ error: `Geçersiz Yöntem: ${requestMethod} bu kaynak için izin verilmiyor.` });
    }
}