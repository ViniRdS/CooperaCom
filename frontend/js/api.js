const apiBaseURL = "http://localhost:3000/api";

console.log("API em uso:", apiBaseURL);

const api = {
    baseUrl: apiBaseURL,

    login: (email, password) => {
        return fetch(`${api.baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(res => res.json());
    },

    register: (data) => {
        return fetch(`${api.baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    },

    leaveProject: (id) => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/projects/${id}/leave`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    },

    /* -----------------------------
       getUserProfile — agora local
       ----------------------------- */
    getUserProfile: () => {
        const user = localStorage.getItem("user");
        if (!user) {
            return Promise.reject("Usuário não encontrado no localStorage");
        }
        return Promise.resolve(JSON.parse(user));
    },

    updateProfile: (data) => {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const updated = { ...user, ...data };

        localStorage.setItem("user", JSON.stringify(updated));

        return Promise.resolve({ success: true, user: updated });
    },

    deleteUser: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return Promise.resolve({ success: true });
    },

    contactMessage: (data) => {
        return fetch(`${api.baseUrl}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },

    getProjectMessages: (projectId) => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/messages/projects/${projectId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    },
};
