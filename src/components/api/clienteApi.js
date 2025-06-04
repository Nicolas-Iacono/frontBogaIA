import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache duration

export const clienteApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Add a request interceptor for logging, similar to casoApi.js if desired
clienteApi.interceptors.request.use(
    (config) => {
        let fullUrl = config.url;
        if (config.baseURL && !(config.url && (config.url.startsWith('http://') || config.url.startsWith('https://')))) {
            try {
                fullUrl = new URL(config.url, config.baseURL).href;
            } catch (e) {
                const slash = (config.baseURL.endsWith('/') || config.url.startsWith('/')) ? '' : '/';
                fullUrl = `${config.baseURL}${slash}${config.url}`.replace(/([^:])\/\/+/g, '$1/');
            }
        }
        console.log(`Requesting URL (clienteApi): ${fullUrl}`);
        return config;
    },
    (error) => {
        console.error('Error in clienteApi request interceptor:', error);
        return Promise.reject(error);
    }
);

export const getClientes = async (username) => {
    const cacheKey = `clientes_${username}`;
    const cachedItem = localStorage.getItem(cacheKey);

    if (cachedItem) {
        try {
            const { timestamp, data } = JSON.parse(cachedItem);
            if (Date.now() - timestamp < CACHE_DURATION_MS) {
                console.log(`Returning cached clientes for user ${username} from ${cacheKey}`);
                return data;
            } else {
                console.log(`Cache expired for ${cacheKey}`);
                localStorage.removeItem(cacheKey);
            }
        } catch (e) {
            console.error(`Error parsing cached data for ${cacheKey}:`, e);
            localStorage.removeItem(cacheKey);
        }
    }

    const path = `/clientes/usuario/${username}`;
    try {
        console.log(`Fetching fresh clientes for user ${username} from API (${path})`);
        const response = await clienteApi.get(path);
        const dataToCache = {
            timestamp: Date.now(),
            data: response.data,
        };
        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        return response.data;
    } catch (error) {
        let failedUrl = path;
        if (error.config?.baseURL && !(path && (path.startsWith('http://') || path.startsWith('https://')))) {
             try {
                failedUrl = new URL(path, error.config.baseURL).href;
            } catch (e) {
                const slash = (error.config.baseURL.endsWith('/') || path.startsWith('/')) ? '' : '/';
                failedUrl = `${error.config.baseURL}${slash}${path}`.replace(/([^:])\/\/+/g, '$1/');
            }
        }
        console.error(`Error fetching clientes for user ${username} from ${failedUrl}:`, error);
        // More detailed error logging can be added here if needed
        throw error;
    }
};

export default getClientes; // Default export for convenience if only one main function
