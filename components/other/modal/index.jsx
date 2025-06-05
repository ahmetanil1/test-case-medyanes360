"use client";

import React, { useState, useEffect } from 'react';
import { useTodoStore } from '@/utils/store';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';

const CategoryOptions = [
    { value: 'WORK', label: 'İş' },
    { value: 'PERSONAL', label: 'Kişisel' },
    { value: 'DEVELOPMENT', label: 'Gelişim' },
    { value: 'URGENT', label: 'Acil' },
    { value: 'FINANCE', label: 'Finans' },
    { value: 'HEALTH', label: 'Sağlık' },
    { value: 'OTHER', label: 'Diğer' },
];

const PriorityOptions = [
    { value: 'LOW', label: 'Düşük' },
    { value: 'MEDIUM', label: 'Orta' },
    { value: 'HIGH', label: 'Yüksek' },
];

const defaultNewTodo = {
    title: '',
    description: '',
    priority: 'LOW',
    category: 'OTHER',
    isCompleted: false,
    allUserId: '',
};

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function TodoForm({ mode = 'create', todo = {}, onSuccess, onCancel }) {
    const { addTodo, updateTodo } = useTodoStore();
    const { data: session, status } = useSession();

    const userRole = session?.user?.role || 'USER';
    const currentUserId = session?.user?.id || '';
    const isAdmin = userRole === 'ADMIN';

    const [formData, setFormData] = useState({ ...defaultNewTodo }); 

    const [formError, setFormError] = useState(null);
    const [users, setUsers] = useState([]);
    const [fetchingUsers, setFetchingUsers] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && todo && todo.id) {
            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                priority: todo.priority || 'LOW',
                category: todo.category || 'OTHER',
                isCompleted: todo.isCompleted || false,
                allUserId: todo.allUserId || '',
            });
        } else if (mode === 'create') {
            setFormData(prevData => ({
                ...defaultNewTodo,
                allUserId: prevData.allUserId || ''
            }));
        }
    }, [mode, todo?.id, todo?.title, todo?.description, todo?.priority, todo?.category, todo?.isCompleted, todo?.allUserId]);

    useEffect(() => {
        if (status === 'authenticated') {
            if (!isAdmin) {
                setFormData(prevData => {
                    if (prevData.allUserId !== currentUserId) {
                        return { ...prevData, allUserId: currentUserId };
                    }
                    return prevData;
                });
            } else if (isAdmin && mode === 'create') {
                if (users.length === 0 && !fetchingUsers) {
                    setFetchingUsers(true);
                    const fetchUsers = async () => {
                        try {
                            const response = await getAPI('/users/all');
                            if (response.data) {
                                setUsers(response.data);
                                setFormData(prevData => {
                                    if (!prevData.allUserId && response.data.length > 0) {
                                        return { ...prevData, allUserId: response.data[0].id };
                                    }
                                    return prevData;
                                });
                            } else {
                                setFormError(response.error || "Kullanıcılar alınırken bir sorun oluştu.");
                            }
                        } catch (err) {
                            setFormError(err.message || "Kullanıcılar yüklenirken bir hata oluştu.");
                        } finally {
                            setFetchingUsers(false);
                        }
                    };
                    fetchUsers();
                }
            }
        }
    }, [status, isAdmin, currentUserId, mode, users.length, fetchingUsers]); 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        let userIdToUse = formData.allUserId;

        if (!isAdmin && mode === 'create') {
            userIdToUse = currentUserId;
        }

        if (!userIdToUse) {
            setFormError("Todo oluşturmak için bir kullanıcı seçmelisiniz veya oturumunuzda bir kullanıcı ID'si bulunmalı.");
            return;
        }

        try {
            if (mode === 'create') {
                const newTodoData = { ...formData, allUserId: userIdToUse };
                const response = await postAPI('/todos/create', newTodoData);
                if (response.todo) {
                    addTodo(response.todo);
                    toast.success("Todo başarıyla oluşturuldu!");
                    onSuccess();
                } else {
                    throw new Error(response.error || "Todo oluşturulurken bir hata oluştu.");
                }
            } else if (mode === 'edit') {
                const updatedTodoData = { ...formData };
                const response = await postAPI(`/todos/update/${todo.id}`, updatedTodoData, "POST");
                if (response.todo) {
                    updateTodo(todo.id, response.todo);
                    toast.success("Todo başarıyla güncellendi!");
                    onSuccess();
                } else {
                    throw new Error(response.error || "Todo güncellenirken bir hata oluştu.");
                }
            }
        } catch (err) {
            setFormError(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    const formTitle = mode === 'edit' ? 'Todoyu Düzenle' : 'Yeni Todo Oluştur';
    const submitButtonText = mode === 'edit' ? 'Kaydet' : 'Oluştur';

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white ">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{formTitle}</h2>

            {formError && (
                <p className="text-red-500 text-sm text-center">{formError}</p>
            )}

            {isAdmin && mode === 'create' && (
                <div>
                    <label htmlFor="allUserId" className="block text-sm font-medium text-gray-700">
                        Bu Todoyu Kime Atayacaksınız?
                    </label>
                    {fetchingUsers ? (
                        <p className="text-gray-500 text-sm mt-1">Kullanıcılar yükleniyor...</p>
                    ) : (
                        <select
                            id="allUserId"
                            name="allUserId"
                            value={formData.allUserId}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required={isAdmin} 
                        >
                            <option value="">-- Kullanıcı Seçin --</option>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {capitalizeFirstLetter(user.name)} {capitalizeFirstLetter(user.surname)}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Kullanıcı bulunamadı</option>
                            )}
                        </select>
                    )}
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Başlık</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category} 
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    {CategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Öncelik</label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority} 
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    {PriorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {mode === 'edit' && (
                <div className="flex items-center">
                    <input
                        id="isCompleted"
                        name="isCompleted"
                        type="checkbox"
                        checked={formData.isCompleted} 
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-900">Tamamlandı</label>
                </div>
            )}
            <div className="flex justify-end space-x-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {submitButtonText}
                </button>
            </div>
        </form>
    );
}

export default TodoForm;