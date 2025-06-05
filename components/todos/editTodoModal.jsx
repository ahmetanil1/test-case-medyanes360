// components/editTodoModal.jsx (TodoModal)
"use client";

import React from 'react';
import TodoForm from '../other/modal'; // Doğru yol olduğuna emin olun

function TodoModal({ isOpen, onClose, todo, mode, onSuccess }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-auto relative transform transition-all duration-300 scale-100 opacity-100">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    title="Kapat"
                >
                    &times;
                </button>

                <TodoForm
                    mode={mode}
                    todo={todo}
                    onSuccess={onSuccess}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}

export default TodoModal;