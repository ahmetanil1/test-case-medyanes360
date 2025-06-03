import authOptions from "@/pages/api/auth/[...nextauth]";
import {
    getAllData,        // Tüm todoları getirmek için
    createNewData,     // Yeni todo oluşturmak için
    getFirstDataByWhere, // Tekil todo getirmek için (id ve userId ile)
    updateDataByAny,   // Tekil todo güncellemek için
    deleteDataByAny,   // Tekil todo silmek için
    deleteDataAll      // Tüm todoları silmek için (where koşulu ile)
} from "@/services/serviceOperation";
import { getServerSession } from "next-auth";

export default async function todoHandler(req, res) {
    const authSession = await getServerSession(req, res, authOptions);

    if (!authSession || !authSession.user || !authSession.user.id) {
        return res.status(401).json({ error: "Unauthorized access. Please log in." });
    }

    const userId = authSession.user.id;
    const { page } = req.query;
    const requestMethod = req.method;
    const data = req.body;

    switch (requestMethod) {
        case "GET":
            switch (page) {
                case "all": // GET /api/todos/all
                    try {
                        const todos = await getAllData("Todo", { allUserId: userId });

                        if (todos && todos.error) {
                            console.error("Error fetching all todos:", todos.error);
                            return res.status(500).json({ error: todos.error });
                        }
                        return res.status(200).json({ todos: todos });
                    } catch (error) {
                        console.error("GET /api/todos/all error:", error);
                        return res.status(500).json({ error: error.message || "Internal server error." });
                    }
                case "single": // GET /api/todos/single/todo_id_here
                    const todoId = req.url.split("/")[4];
                    if (!todoId) {
                        return res.status(400).json({ error: "Todo ID is required for 'single' GET request." });
                    }
                    try {
                        const todo = await getFirstDataByWhere("Todo", { id: todoId, allUserId: userId });

                        if (todo && todo.error) {
                            console.error("Error fetching single todo:", todo.error);
                            return res.status(500).json({ error: todo.error });
                        }
                        if (!todo) {
                            return res.status(404).json({ error: "Todo not found or you don't have access to it." });
                        }
                        return res.status(200).json({ todo: todo });
                    } catch (error) {
                        console.error("GET /api/todos/single error:", error);
                        return res.status(500).json({ error: error.message || "Internal server error." });
                    }
                default:
                    return res.status(404).json({ error: "Not Found: Invalid GET operation for todos." });
            }

        case "POST":
            switch (page) {
                case "create": // POST /api/todos/create
                    try {
                        const { title, description, priority, category } = data;

                        if (!title || !description || !priority || !category) {
                            return res.status(400).json({ error: "All fields are required for a new todo." });
                        }

                        const newTodoData = {
                            title,
                            description,
                            priority,
                            category,
                            allUserId: userId // Todo'yu oturumdaki kullanıcıya bağla
                        };

                        const newTodo = await createNewData("Todo", newTodoData);

                        if (newTodo && newTodo.error) {
                            console.error("Error creating new todo:", newTodo.error);
                            return res.status(500).json({ error: newTodo.error });
                        }

                        return res.status(201).json({ message: "Todo created successfully.", todo: newTodo });
                    } catch (error) {
                        console.error("POST /api/todos/create error:", error);
                        return res.status(500).json({ error: error.message || "Internal server error." });
                    }
                case "update": // POST /api/todos/update/todo_id_here
                    const todoIdToUpdate = req.url.split("/")[4]; // Eğer URL yapınız /api/todos/update/ID şeklinde ise
                    if (!todoIdToUpdate) {
                        return res.status(400).json({ error: "Todo ID is required for 'update' PUT request." });
                    }
                    try {
                        const { title, description, isCompleted, priority, category } = data;

                        if (!title || !description || !priority || !category) {
                            return res.status(400).json({ error: "All fields are required for update." });
                        }

                        const updatedTodo = await updateDataByAny("Todo",
                            { id: todoIdToUpdate, allUserId: userId },
                            { title, description, isCompleted, priority, category } 
                        );

                        if (updatedTodo && updatedTodo.error) {
                            console.error("Error updating todo:", updatedTodo.error);
                            if (updatedTodo.error.includes("Record to update not found.")) {
                                return res.status(404).json({ error: "Todo not found or you don't have access to it." });
                            }
                            return res.status(500).json({ error: updatedTodo.error });
                        }
                        if (!updatedTodo) {
                            return res.status(404).json({ error: "Todo not found or you don't have access to it." });
                        }

                        return res.status(200).json({ message: "Todo updated successfully.", todo: updatedTodo });
                    } catch (error) {
                        console.error("PUT /api/todos/update error:", error);
                        return res.status(500).json({ error: error.message || "Internal server error." });
                    }
                default:
                    return res.status(404).json({ error: "Not Found: Invalid POST operation for todos." });
            }
        case "DELETE":
            switch (page) {
                case "delete": // DELETE /api/todos/delete/todo_id_here
                    const todoIdToDelete = req.url.split("/")[4];
                    if (!todoIdToDelete) {
                        return res.status(400).json({ error: "Todo ID is required for 'delete' DELETE request." });
                    }
                    try {
                        const deletedTodo = await deleteDataByAny("Todo", { id: todoIdToDelete, allUserId: userId });

                        if (deletedTodo && deletedTodo.error) {
                            console.error("Error deleting todo:", deletedTodo.error);
                            if (deletedTodo.error.includes("Record to delete not found.")) {
                                return res.status(404).json({ error: "Todo not found or you don't have access to it." });
                            }
                            return res.status(500).json({ error: deletedTodo.error });
                        }

                        return res.status(204).end();
                    } catch (error) {
                        console.error("DELETE /api/todos/delete error:", error);
                        return res.status(500).json({ error: error.message || "Internal server error." });
                    }
                case "deleteAll": // DELETE /api/todos/deleteAll
                    try {

                        const result = await deleteDataAll("Todo", { allUserId: userId });

                        if (result && result.error) {
                            console.error("Error deleting all todos:", result.error);
                            return res.status(500).json({ error: result.error });
                        }
                        return res.status(200).json({ message: `${result.count} todos deleted successfully.` });
                    } catch (error) {
                        console.error("DELETE /api/todos/deleteAll error:", error);
                        return res.status(500).json({ error: error.message || "Internal server error." });
                    }
                default:
                    return res.status(404).json({ error: "Not Found: Invalid DELETE operation for todos." });
            }

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            return res.status(405).json({ error: `Method ${requestMethod} Not Allowed` });
    }
}