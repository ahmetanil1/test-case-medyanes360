"use client";

import React, { useState, useEffect, useMemo } from 'react';
import TodoModal from './editTodoModal';
import LoadingScreen from '../other/loading';
import { useTodoStore } from '@/utils/store';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { toast, ToastContainer } from 'react-toastify';
const ITEMS_PER_PAGE = 6;

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function Todos({ user }) {
    const { todos, setTodos } = useTodoStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchTodos = async () => {
            if (!user || !user.id) {
                setError("Kullanıcı bilgisi eksik. Todolar yüklenemiyor.");
                toast.error("Kullanıcı bilgisi eksik. Todolar yüklenemiyor.");
                return;
            }

            setIsLoading(true);
            try {
                let response;
                if (user.role === "ADMIN") {
                    response = await getAPI("/todos/all");
                } else {
                    response = await getAPI("/todos/all", { userId: user.id });
                }
                if (response.todos) {
                    let fetchedTodos = response.todos;

                    if (user.role === "ADMIN") {
                        const todosWithOwners = await Promise.all(
                            fetchedTodos.map(async (todo) => {
                                try {
                                    // todo.userId kullanarak kullanıcının adını ve soyadını çek
                                    const ownerResponse = await getAPI(`/users/${todo.allUserId}`);
                                    if (ownerResponse.success && ownerResponse.data) {
                                        return {
                                            ...todo,
                                            ownerName: capitalizeFirstLetter(ownerResponse.data.name),
                                            ownerSurname: capitalizeFirstLetter(ownerResponse.data.surname),
                                        };
                                    }
                                } catch (ownerErr) {
                                }
                                return todo; 
                            })
                        );
                        fetchedTodos = todosWithOwners;
                    }

                    setTodos(fetchedTodos);
                    setCurrentPage(1);
                } else {
                    setError(response.error || "Todolar alınırken bir sorun oluştu.");
                    toast.error(response.error || "Todolar alınırken bir sorun oluştu.");
                }
            } catch (err) {
                setError(err.message || "Todolar yüklenirken bir hata oluştu.");
                toast.error(err.message || "Todolar yüklenirken bir hata oluştu.");
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.id) {
            fetchTodos();
        }
    }, [user, setTodos]);

    const handleEditClick = (todo) => {
        setSelectedTodo(todo);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (todo) => {
        setSelectedTodo(todo);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedTodo) return;

        setIsLoading(true);
        try {
            await postAPI(`/todos/delete/${selectedTodo.id}`, {}, "DELETE");
            setTodos(todos.filter(todo => todo.id !== selectedTodo.id));
            toast.success("Todo başarıyla silindi.");
            handleModalClose();
            if (todos.length - 1 === (currentPage - 1) * ITEMS_PER_PAGE && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        } catch (err) {
            setError(err.message || "Todoyu silerken bir hata oluştu.");
            toast.error(`Todoyu silerken hata oluştu: ${err.message || "Bilinmeyen Hata"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedTodo(null);
    };

    const handleSuccess = async (message) => {
        handleModalClose();
        setIsLoading(true);
        try {
            let response;
            if (user.role === "ADMIN") {
                response = await getAPI("/todos/all");
            } else {
                response = await getAPI("/todos/all", { userId: user.id });
            }
            if (response.todos) {
                let fetchedTodos = response.todos;
                if (user.role === "ADMIN") {
                    const todosWithOwners = await Promise.all(
                        fetchedTodos.map(async (todo) => {
                            try {
                                const ownerResponse = await getAPI(`/users/${todo.allUserId}`);
                                if (ownerResponse.success && ownerResponse.data) {
                                    return {
                                        ...todo,
                                        ownerName: capitalizeFirstLetter(ownerResponse.data.name),
                                        ownerSurname: capitalizeFirstLetter(ownerResponse.data.surname),
                                    };
                                }
                            } catch (ownerErr) {
                            }
                            return todo;
                        })
                    );
                    fetchedTodos = todosWithOwners;
                }
                setTodos(fetchedTodos);
                setCurrentPage(1);
                toast.success(message || "İşlem başarıyla tamamlandı!");
            } else {
                setError(response.error || "Todolar alınırken bir sorun oluştu.");
                toast.error(response.error || "Todolar alınırken bir sorun oluştu.");
            }
        } catch (err) {
            setError(err.message || "Todolar yüklenirken bir hata oluştu.");
            toast.error(err.message || "Todolar yüklenirken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(todos.length / ITEMS_PER_PAGE);

    const currentTodos = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return todos.slice(startIndex, endIndex);
    }, [todos, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    if (isLoading) {
        return <LoadingScreen isLoading={true} message="Todolar Yükleniyor..." />;
    }

    return (
        <div className="p-4 w-full mt-10">

            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Todolarım</h2>

            <div className="mb-6 text-center">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors font-medium"
                >
                    Yeni Todo Oluştur
                </button>
            </div>

            {error ? (
                <p className="text-center text-red-500 text-lg">Hata: {error}</p>
            ) : currentTodos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {currentTodos.map((todo) => (
                        <div
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
                                {user.role === "ADMIN" && todo.ownerName && todo.ownerSurname && (
                                    <span className="px-3 py-1 bg-cyan-500 text-white rounded-full font-medium">
                                        Sahibi: {todo.ownerName} {todo.ownerSurname}
                                    </span>
                                )}
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
                                    onClick={() => handleDeleteClick(todo)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    title="Todoyu Sil"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm6 4a1 1 0 100 2h-2a1 1 0 100-2h2z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">Henüz hiç todo bulunmamaktadır.</p>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${pageNumber === currentPage ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            )}

            {isEditModalOpen && selectedTodo && (
                <TodoModal
                    isOpen={isEditModalOpen}
                    onClose={handleModalClose}
                    todo={selectedTodo}
                    mode="edit"
                    onSuccess={() => handleSuccess("Todo başarıyla güncellendi!")}
                />
            )}

            {isCreateModalOpen && (
                <TodoModal
                    isOpen={isCreateModalOpen}
                    onClose={handleModalClose}
                    mode="create"
                    onSuccess={() => handleSuccess("Yeni todo başarıyla oluşturuldu!")}
                />
            )}

            {isDeleteModalOpen && selectedTodo && (
                <TodoModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleModalClose}
                    todo={selectedTodo}
                    mode="delete"
                    onDelete={confirmDelete}
                />
            )}


        </div>
    );
}

export default Todos;