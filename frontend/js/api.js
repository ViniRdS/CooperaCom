// Define automaticamente o backend correto
const apiBaseURL = "http://localhost:3000/api";

// Apenas para debug
console.log("API em uso:", apiBaseURL);

// API centralizada
const api = {
    baseUrl: apiBaseURL,

    login: (email, password) => {
        return fetch(`${api.baseUrl}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        }).then(res => res.json());
    },

    register: (data) => {
        return fetch(`${api.baseUrl}/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => res.json());
    },

    getProjects: (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        return fetch(`${api.baseUrl}/projects?${query}`)
            .then(res => res.json());
    },

    getProjectById: (id) => {
        return fetch(`${api.baseUrl}/projects/${id}`)
            .then(res => res.json());
    },

    createProject: (data) => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },

    joinProject: (id) => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/projects/${id}/join`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`}
        }).then(res => res.json());
    },

    leaveProject: (id) => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/projects/${id}/leave`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`}
        }).then(res => res.json());
    },

    getUserProfile: () => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/profile`, {
            headers: {'Authorization': `Bearer ${token}`}
        }).then(res => res.json());
    },

    updateProfile: (data) => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },

    deleteUser: () => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/profile`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`}
        }).then(res => res.json());
    },

    contactMessage: (data) => {
        return fetch(`${api.baseUrl}/contact`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => res.json());
    }
};
