const BASE_URL = (window.__APP_BASE_URL__ || '') + '/api';

/**
 * Custom error class agar response body dari Laravel bisa diakses oleh caller.
 * Mirip pola axios: error.data berisi JSON body dari server.
 */
class ApiError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.data = data; // JSON body dari Laravel (e.g. { status, message, errors })
    }
}

/**
 * Helper: parse response, lempar ApiError bila tidak OK, kembalikan JSON bila OK.
 */
async function handleResponse(response) {
    let body = null;
    try {
        body = await response.json();
    } catch (_) {
        // response bukan JSON, biarkan body null
    }

    if (!response.ok) {
        const message = body?.message || `HTTP error! status: ${response.status}`;
        throw new ApiError(message, response.status, body);
    }
    return body;
}

const apiClient = {
    async get(endpoint, params = {}) {
        const url = new URL(BASE_URL + endpoint, window.location.origin);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("API GET Error:", error);
            throw error;
        }
    },

    async post(endpoint, data = {}) {
        try {
            const response = await fetch(BASE_URL + endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("API POST Error:", error);
            throw error;
        }
    },

    async put(endpoint, data = {}) {
        try {
            const response = await fetch(BASE_URL + endpoint, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("API PUT Error:", error);
            throw error;
        }
    },

    async delete(endpoint) {
        try {
            const response = await fetch(BASE_URL + endpoint, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("API DELETE Error:", error);
            throw error;
        }
    }
};

// Expose globally so admin screens can use window.apiClient
window.apiClient = apiClient;

export { ApiError };
export default apiClient;
