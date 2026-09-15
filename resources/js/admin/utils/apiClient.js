const BASE_URL = '/api';

const apiClient = {
    async get(endpoint, params = {}) {
        const url = new URL(BASE_URL + endpoint, window.location.origin);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("API GET Error:", error);
            throw error;
        }
    },

    async post(endpoint, data = {}) {
        try {
            const response = await fetch(BASE_URL + endpoint, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("API POST Error:", error);
            throw error;
        }
    },

    async put(endpoint, data = {}) {
        try {
            const response = await fetch(BASE_URL + endpoint, {
                method: 'PUT',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("API PUT Error:", error);
            throw error;
        }
    },

    async delete(endpoint) {
        try {
            const response = await fetch(BASE_URL + endpoint, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("API DELETE Error:", error);
            throw error;
        }
    }
};

// Expose globally for admin screens
window.apiClient = apiClient;

export default apiClient;
