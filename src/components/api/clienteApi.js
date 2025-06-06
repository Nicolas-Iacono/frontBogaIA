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
    const path = `/clientes/lista/usuario/${username}`;
    try {
        console.log(`Fetching fresh clientes for user ${username} from API (${path})`);
        const response = await clienteApi.get(path);
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


export const createCliente = async (clienteData) => {
    try {
        const response = await clienteApi.post("/clientes", clienteData);
        console.log("Cliente creado correctamente:", response.data);
        return response.data;
    } catch (error) {
        let failedUrl = "/clientes";
        if (error.config?.baseURL) {
            try {
                failedUrl = new URL("/clientes", error.config.baseURL).href;
            } catch (e) {
                const slash = (error.config.baseURL.endsWith('/') || "/clientes".startsWith('/')) ? '' : '/';
                failedUrl = `${error.config.baseURL}${slash}/clientes`.replace(/([^:])\/\/+/g, '$1/');
            }
        }
        console.error(`Error creando cliente en ${failedUrl}:`, error);
        throw error;
    }
};