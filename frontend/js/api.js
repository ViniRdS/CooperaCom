// Detecta automaticamente se está no localhost
const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("192.168.") ||  // caso use rede local
    window.location.hostname.includes("10.") ||       // outra faixa comum de LAN
    window.location.hostname.includes("0.")  ;        // compatibilidade extra

// Define automaticamente o backend correto
const apiBaseURL = isLocalhost
    ? "http://localhost:8001/api"        // 🚀 desenvolvimento (local)
    : "https://seudominio.com/api";      // 🌐 produção (online)

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
