// components/Todos.jsx
"use client";

import React, { useState, useEffect } from 'react';
import TodoModal from './editTodoModal'; // editTodoModal yerine TodoModal olarak adlandırdık
import LoadingScreen from '../other/loading';
import { useTodoStore } from '@/utils/store'; // Zustand store import edildi
import { getAPI, postAPI } from '@/services/fetchAPI';

function Todos({ user }) { // user prop'u next-auth session'dan gelmeli
    const { todos, setTodos, addTodo, updateTodo, deleteTodo } = useTodoStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);

    // Todoları API'den çekmek için useEffect
    useEffect(() => {
        const fetchTodos = async () => {
            // user objesi veya user.id yoksa API çağrısı yapma
            if (!user || !user.id) {
                // console.log("User bilgisi eksik, todolar yüklenemiyor."); // Debug için
                setError("Kullanıcı bilgisi eksik. Todolar yüklenemiyor.");
                return;
            }

            setIsLoading(true);
            try {
                if (user.role === "ADMIN") {
                    const response = await getAPI("/todos/all");
                    if (response.todos) {
                        setTodos(response.todos);
                    } else {
                        setError(response.error || "Todolar alınırken bir sorun oluştu.");
                    }
                }
                else {
                    const response = await getAPI("/todos/all", { userId: user.id });
                    if (response.todos) {
                        setTodos(response.todos);
                    } else {
                        setError(response.error || "Todolar alınırken bir sorun oluştu.");
                    }
                }
            } catch (err) {
                console.error("Todoları çekerken hata oluştu:", err);
                setError(err.message || "Todolar yüklenirken bir hata oluştu.");
            } finally {
                setIsLoading(false);
            }
        };

        // user objesi veya user.id değiştiğinde todoları yeniden çek
        // Sadece user ve user.id mevcutsa fetchTodos'u çağır
        if (user && user.id) {
            fetchTodos();
        }
    }, [user, setTodos]); // setTodos, bir Zustand eylemi olduğu için genelde stabil referansa sahiptir.

    const handleEditClick = (todo) => {
        setSelectedTodo(todo);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (todoId) => {
        if (window.confirm("Bu todoyu silmek istediğinizden emin misiniz?")) {
            setIsLoading(true);
            try {
                // Backend'iniz DELETE metodunu destekliyorsa, doğrudan "DELETE" göndermek daha iyidir.
                // Eğer postAPI sadece POST yapabiliyor ve DELETE'i body içinde bir parametreyle bekliyorsa
                // mevcut kullanımınız doğru olabilir. Ancak, idealde 'DELETE' metodu kullanılmalı.
                await postAPI(`/todos/delete/${todoId}`, {}, "DELETE");
                deleteTodo(todoId);
                alert("Todo başarıyla silindi!");
            } catch (err) {
                console.error("Todoyu silerken hata oluştu:", err);
                setError(err.message || "Todoyu silerken bir hata oluştu.");
                alert(`Todoyu silerken hata oluştu: ${err.message || "Bilinmeyen Hata"}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setSelectedTodo(null); // Modül kapandığında seçili todo'yu sıfırla
    };

    const handleSuccess = async () => {
        handleModalClose();
        // İşlem başarılı olduğunda todoları yeniden çek
        // Bu, Zustand store'daki todoların güncel olmasını sağlar.
        setIsLoading(true);
        try {
            if (user.role === "ADMIN") {
                const response = await getAPI("/todos/all");
                if (response.todos) {
                    setTodos(response.todos);
                } else {
                    setError(response.error || "Todolar alınırken bir sorun oluştu.");
                }
            }
            else {
                const response = await getAPI("/todos/all", { userId: user.id });
                if (response.todos) {
                    setTodos(response.todos);
                } else {
                    setError(response.error || "Todolar alınırken bir sorun oluştu.");
                }
            }
        } catch (err) {
            console.error("Todoları çekerken hata oluştu:", err);
            setError(err.message || "Todolar yüklenirken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingScreen isLoading={true} message="Todolar Yükleniyor..." />;
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Todolarım</h2>

            <div className="mb-6 text-right">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors font-medium"
                >
                    Yeni Todo Oluştur
                </button>
            </div>

            {error ? (
                <p className="text-center text-red-500 text-lg">Hata: {error}</p>
            ) : todos.length > 0 ? (
                <ul className="space-y-4">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 relative"
                        >
                            <h3 className={`text-xl mb-3 font-semibold ${todo.isCompleted ? 'line-through text-gray-600' : 'text-gray-900'}`}>
                                {todo.title}
                            </h3>

                            {todo.description && (
                                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                                    {todo.description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 text-sm">
                                {todo.category && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                        Kategori: {todo.category}
                                    </span>
                                )}
                                {todo.priority && (
                                    <span className={`px-3 py-1 rounded-full font-medium ${todo.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                                        todo.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        Öncelik: {todo.priority}
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${todo.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {todo.isCompleted ? 'Tamamlandı' : 'Bekliyor'}
                                </span>
                            </div>

                            <div className="absolute top-3 right-3 flex space-x-2">
                                <button
                                    onClick={() => handleEditClick(todo)}
                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                    title="Todoyu Düzenle"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-7.536 7.536l-2.828 2.828.793.793 2.828-2.828-.793-.793zM11 11.586V15H7v-4.414l7-7 4.414 4.414-7 7z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(todo.id)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    title="Todoyu Sil"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm6 4a1 1 0 100 2h-2a1 1 0 100-2h2z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 text-lg">Henüz hiç todo bulunmamaktadır.</p>
            )}

            {isEditModalOpen && selectedTodo && (
                <TodoModal
                    isOpen={isEditModalOpen}
                    onClose={handleModalClose}
                    todo={selectedTodo}
                    mode="edit"
                    onSuccess={handleSuccess}
                />
            )}

            {isCreateModalOpen && (
                <TodoModal
                    isOpen={isCreateModalOpen}
                    onClose={handleModalClose}
                    mode="create"
                    // 'todo' prop'unu create modunda boş göndermek doğru, çünkü yeni bir todo oluşturuluyor
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}

export default Todos;