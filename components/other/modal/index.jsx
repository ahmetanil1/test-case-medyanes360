"use client";

import React, { useState, useEffect } from 'react';
import { useTodoStore } from '@/utils/store';
import { getAPI, postAPI } from '@/services/fetchAPI';
import { useSession } from 'next-auth/react';

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
    isCompleted: false, // Ensure consistency with Zustand if you use 'completed' there
    allUserId: '',
};

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};


function TodoForm({ mode = 'create', todo = {}, onSuccess, onCancel }) {
    const { addTodo, updateTodo } = useTodoStore();
    const { data: session, status } = useSession(); // 'status' added for session loading state

    const userRole = session?.user?.role || 'USER';
    const currentUserId = session?.user?.id || '';
    const isAdmin = userRole === 'ADMIN';

    // 1. useState Initialization: This runs ONLY once on component mount.
    // It sets the initial state based on 'mode'. For 'create', allUserId is initially empty.
    const [formData, setFormData] = useState(() => {
        if (mode === 'edit' && todo && todo.id) {
            return {
                title: todo.title || '',
                description: todo.description || '',
                priority: todo.priority || 'LOW',
                category: todo.category || 'OTHER',
                isCompleted: todo.isCompleted || false,
                allUserId: todo.allUserId || '',
            };
        } else {
            // For 'create' mode, start with default values.
            // 'allUserId' will be populated by a separate useEffect once session is ready.
            return {
                ...defaultNewTodo,
                allUserId: '', // Set by next effect
            };
        }
    });

    const [formError, setFormError] = useState(null);
    const [users, setUsers] = useState([]);
    const [fetchingUsers, setFetchingUsers] = useState(false);

    // 2. useEffect for Mode Switching & Full Form Reset/Population
    // This effect ensures the form is correctly reset or populated
    // when the 'mode' prop changes (e.g., from 'edit' to 'create')
    // or when the 'todo' prop changes in 'edit' mode.
    useEffect(() => {
        if (mode === 'edit' && todo && todo.id) {
            // Populate form with existing todo data for edit mode
            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                priority: todo.priority || 'LOW',
                category: todo.category || 'OTHER',
                isCompleted: todo.isCompleted || false,
                allUserId: todo.allUserId || '',
            });
        } else if (mode === 'create') {
            // For 'create' mode, always reset the form to a clean default state.
            // This is crucial to clear previous inputs if the component was re-used.
            // allUserId will be handled by the next useEffect.
            setFormData(defaultNewTodo);
        }
    }, [mode, todo]); // Dependencies: Only re-run when 'mode' or 'todo' object reference changes.

    // 3. useEffect for allUserId (Session & Admin User Fetching)
    // This effect specifically handles setting the 'allUserId' field
    // based on session status and user role, without resetting other form fields.
    useEffect(() => {
        // Only proceed if session status is authenticated
        if (status === 'authenticated') {
            // Update allUserId for regular users immediately
            if (!isAdmin) {
                setFormData(prevData => {
                    if (prevData.allUserId !== currentUserId) {
                        return { ...prevData, allUserId: currentUserId };
                    }
                    return prevData;
                });
            }

            // Fetch users for admin and set default allUserId
            const fetchUsersAndSetDefault = async () => {
                // Only fetch if admin, in 'create' mode, and users haven't been fetched yet
                if (isAdmin && mode === 'create' && users.length === 0) {
                    setFetchingUsers(true);
                    try {
                        const response = await getAPI('/users');
                        if (response.data) {
                            setUsers(response.data);
                            setFormData(prevData => {
                                // If 'allUserId' is currently empty (or still default) and users were fetched,
                                // set it to the first user's ID as a default for admin.
                                if (!prevData.allUserId && response.data.length > 0) {
                                    return {
                                        ...prevData,
                                        allUserId: response.data[0].id,
                                    };
                                }
                                return prevData; // Keep existing allUserId if already set (e.g., admin selected one)
                            });
                        } else {
                            setFormError(response.error || "Kullanıcılar alınırken bir sorun oluştu.");
                        }
                    } catch (err) {
                        console.error("Kullanıcıları çekerken hata oluştu:", err);
                        setFormError(err.message || "Kullanıcılar yüklenirken bir hata oluştu.");
                    } finally {
                        setFetchingUsers(false);
                    }
                }
            };
            fetchUsersAndSetDefault();
        }
    }, [status, isAdmin, currentUserId, mode, users.length]); // Depend on 'status', 'isAdmin', 'currentUserId', 'mode' and 'users.length'

    // This handleChange is correct and directly updates the formData state
    // without interference from the useEffects for standard user input.
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

        try {
            if (mode === 'create') {
                const userIdToSend = isAdmin ? formData.allUserId : currentUserId;

                if (!userIdToSend) {
                    setFormError("Todo oluşturmak için bir kullanıcı seçmelisiniz veya oturumunuzda bir kullanıcı ID'si bulunmalı.");
                    return;
                }

                const newTodoData = { ...formData, allUserId: userIdToSend };
                const response = await postAPI('/todos/create', newTodoData);
                if (response.todo) {
                    addTodo(response.todo);
                    // IMPORTANT: Replace alert with a custom message box for better UX
                    console.log("Todo başarıyla oluşturuldu!"); // For debugging
                    onSuccess();
                } else {
                    throw new Error(response.error || "Todo oluşturulurken bir hata oluştu.");
                }
            } else if (mode === 'edit') {
                const updatedTodoData = { ...formData };
                const response = await postAPI(`/todos/update/${todo.id}`, updatedTodoData, "POST"); // Assuming POST for update
                if (response.todo) {
                    updateTodo(todo.id, response.todo);
                    // IMPORTANT: Replace alert with a custom message box for better UX
                    console.log("Todo başarıyla güncellendi!"); // For debugging
                    onSuccess();
                } else {
                    throw new Error(response.error || "Todo güncellenirken bir hata oluştu.");
                }
            }
        } catch (err) {
            console.error("Form gönderilirken hata oluştu:", err);
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

            {/* Admin ve "create" modunda ise kullanıcı seçimi göster */}
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
                            required
                        >
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {capitalizeFirstLetter(user.name)} {capitalizeFirstLetter(user.surname)}
                                    </option>
                                ))
                            ) : (
                                <option value="">Kullanıcı bulunamadı</option>
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
