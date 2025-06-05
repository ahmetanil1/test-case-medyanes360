import { create } from "zustand";

export const useTodoStore = create((set) => ({
    todos: [
        {
            id: '',
            title: '',
            description: '',
            completed: false,
            category: '',
            priority: '',
            allUserId: ''
        }
    ],


    setTodos: (newTodos) => set({ todos: newTodos }),
    addTodo: (todo) => set((state) => ({
        todos: [...state.todos, todo]
    })),

    updateTodo: (id, updatedTodo) => set((state) => ({
        todos: state.todos.map(todo => todo.id === id ? { ...todo, ...updatedTodo } : todo)
    })),

    deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
    })),

    setTodosByUserId: (userId) => set((state) => ({
        todos: state.todos.filter(todo => todo.allUserId === userId)
    })),

}));

