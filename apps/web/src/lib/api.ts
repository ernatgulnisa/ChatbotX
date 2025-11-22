import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
if (API_URL && !API_URL.startsWith('http')) {
    API_URL = `https://${API_URL}`;
}

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
};

export const bots = {
    create: async (name: string, scenario: string) => {
        const response = await api.post('/bots', { name, scenario });
        return response.data;
    },
    findAll: async () => {
        const response = await api.get('/bots');
        return response.data;
    },
    findOne: async (id: number) => {
        const response = await api.get(`/bots/${id}`);
        return response.data;
    },
    update: async (id: number, data: { name?: string, scenario?: string }) => {
        const response = await api.patch(`/bots/${id}`, data);
        return response.data;
    },
};

export const clients = {
    create: async (name: string, phone: string, botId: number) => {
        const response = await api.post('/clients', { name, phone, botId });
        return response.data;
    },
    findAll: async () => {
        const response = await api.get('/clients');
        return response.data;
    },
    findOne: async (id: number) => {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    },
    update: async (id: number, data: { name?: string, phone?: string }) => {
        const response = await api.patch(`/clients/${id}`, data);
        return response.data;
    },
};

export const messages = {
    create: async (content: string, sender: string, clientId: number, botId: number) => {
        const response = await api.post('/messages', { content, sender, clientId, botId });
        return response.data;
    },
    findAll: async (clientId: number) => {
        const response = await api.get(`/messages/${clientId}`);
        return response.data;
    },
};

export const deals = {
    create: async (clientId: number, status: string, value: number) => {
        const response = await api.post('/deals', { clientId, status, value });
        return response.data;
    },
    findAll: async () => {
        const response = await api.get('/deals');
        return response.data;
    },
    update: async (id: number, data: { status?: string; value?: number }) => {
        const response = await api.patch(`/deals/${id}`, data);
        return response.data;
    },
};

export const stats = {
    get: async () => {
        const response = await api.get('/stats');
        return response.data;
    },
};

export const settings = {
    get: async () => {
        const response = await api.get('/settings');
        return response.data;
    },
    save: async (data: any) => {
        const response = await api.post('/settings', data);
        return response.data;
    },
};

export const marketing = {
    broadcast: async (message: string, type: 'text' | 'image', mediaUrl?: string, filter?: { tags?: string[] }) => {
        const response = await api.post('/marketing/broadcast', { message, type, mediaUrl, filter });
        return response.data;
    }
};

export const tags = {
    findAll: async () => {
        const response = await api.get('/tags');
        return response.data;
    },
    create: async (name: string, color?: string) => {
        const response = await api.post('/tags', { name, color });
        return response.data;
    },
    delete: async (id: number) => {
        const response = await api.delete(`/tags/${id}`);
        return response.data;
    },
    assign: async (clientId: number, tagId: number) => {
        const response = await api.post('/tags/assign', { clientId, tagId });
        return response.data;
    },
    remove: async (clientId: number, tagId: number) => {
        const response = await api.post('/tags/remove', { clientId, tagId });
        return response.data;
    }
};

export const calendar = {
    getServices: () => api.get("/calendar/services").then((res) => res.data),
    createService: (data: { name: string; duration: number; price: number }) =>
        api.post("/calendar/services", data).then((res) => res.data),
    getAppointments: () => api.get("/calendar/appointments").then((res) => res.data),
    createAppointment: (data: { clientId: number; serviceId: number; startTime: string }) =>
        api.post("/calendar/appointments", data).then((res) => res.data),
};

export default {
    auth,
    bots,
    clients,
    messages,
    deals,
    stats,
    settings,
    marketing,
    tags,
    calendar
};
