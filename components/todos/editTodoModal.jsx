"use client";

import React from 'react';
import TodoForm from '../other/modal'; // Form bileşeni

function TodoModal({ isOpen, onClose, todo, mode, onSuccess, onDelete }) {
    if (!isOpen) return null;

    const isDelete = mode === 'delete';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    title="Kapat"
                >
                    &times;
                </button>

                {isDelete ? (
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Todoyu silmek istiyor musunuz?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={onDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                            >
                                Evet, Sil
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                ) : (
                    <TodoForm
                        mode={mode}
                        todo={todo}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                    />
                )}
            </div>
        </div>
    );
}

export default TodoModal;
