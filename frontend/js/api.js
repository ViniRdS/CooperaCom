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
        return fetch(`${api.baseUrl}/auth/register`, {
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
        return fetch(`${api.baseUrl}/volunteers/${id}/join`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    },

    leaveProject: (id) => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/volunteers/${id}/leave`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json());
    },

    getVolunteers: (projectId) => {
    const token = localStorage.getItem('token');
    return fetch(`${api.baseUrl}/volunteers/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json());
    },

    updateNoticeBoard: (projectId, text) => {
        const token = localStorage.getItem('token');
        return fetch(`${api.baseUrl}/projects/${projectId}/notice`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ notice_board: text })
        }).then(res => res.json());
    },

    getCategories: () => {
        return fetch(`${api.baseUrl}/categories`)
            .then(res => res.json());
    },
    
    getUserProfile: async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user.id) {
        throw new Error("Usuário não autenticado");
    }

    const res = await fetch(`${api.baseUrl}/users/${user.id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Erro ao buscar perfil no backend");
    }

    const data = await res.json();

    // salva versão atualizada no localStorage
    localStorage.setItem("user", JSON.stringify(data));

    return data;
    },

    updateProfile: async (data) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user.id) {
        throw new Error("Usuário não autenticado");
    }

    const res = await fetch(`${api.baseUrl}/users/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Erro ao atualizar perfil no servidor");
    }

    const updatedUser = await res.json();

    localStorage.setItem("user", JSON.stringify(updatedUser));

    return updatedUser;
    },

    deleteUser: async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user.id) {
        throw new Error("Usuário não autenticado");
    }

    const res = await fetch(`${api.baseUrl}/users/${user.id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Erro ao excluir conta");
    }

    return await res.json();
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

    updateProject: (id, data) => {
    const token = localStorage.getItem("token");
    return fetch(`${api.baseUrl}/projects/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
    },
};
