import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const casoApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to log the URL
casoApi.interceptors.request.use(
    (config) => {
        let fullUrl = config.url;
        // Only prepend baseURL if url is relative (doesn't start with http/https)
        if (config.baseURL && !(config.url && (config.url.startsWith('http://') || config.url.startsWith('https://')))) {
            try {
                fullUrl = new URL(config.url, config.baseURL).href;
            } catch (e) {
                // Fallback for URL construction if new URL() fails (e.g. invalid baseURL)
                const slash = (config.baseURL.endsWith('/') || config.url.startsWith('/')) ? '' : '/';
                fullUrl = `${config.baseURL}${slash}${config.url}`.replace(/([^:])\/\/+/g, '$1/'); // Remove double slashes except for protocol
            }
        }
        console.log(`Requesting URL: ${fullUrl}`);
        return config;
    },
    (error) => {
        console.error('Error in request interceptor:', error);
        return Promise.reject(error);
    }
);


export const crearCaso = async (casoData) => {
    try {
        console.log("[crearCaso] Enviando caso:", casoData);
        const response = await casoApi.post('/caso', casoData);
        console.log("[crearCaso] Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error('[crearCaso] Error creando caso:', error);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            throw error.response.data;
        }
        throw error;
    }
};

export const getCasos = async (username) => {
    console.warn("⚠️ Llamando a getCasos() → endpoint viejo");
    const path = `/caso/usuario/${username}`;
    try {
        console.log(`Fetching fresh casos for user ${username} from API (${path})`);
        const response = await casoApi.get(path);
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
        
        console.error(`Error fetching casos for user ${username} from ${failedUrl}:`);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Response Status:', error.response.status);
            // console.error('Response Headers:', JSON.stringify(error.response.headers)); // Optional: can be verbose
        } else if (error.request) {
            console.error('No response received. Request details might be in error.config or error itself if network error.');
        } else {
            console.error('Error Message:', error.message);
        }
        throw error; // Re-throw the error so the calling component can also handle it if needed
    }
};
export default getCasos;


export const getCasosLista = async (username, page = 0, size = 10, search = '') => {
    const params = new URLSearchParams({
        page,
        size,
    });

    if (search && search.trim() !== '') {
        params.append('search', search);
    }

    const path = `/caso/usuario/lista/page/${username}?${params.toString()}`;

    try {
        console.log(`Fetching paginated casos for user ${username} with search='${search}' from API (${path})`);
        const response = await casoApi.get(path);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching casos for user ${username} from ${path}:`, error);
        throw error;
    }
};