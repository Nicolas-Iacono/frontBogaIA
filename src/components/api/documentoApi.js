import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const documentoApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to log the URL
documentoApi.interceptors.request.use(
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

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache duration

export const crearDocumento = async (documentoData) => {
    try {
        console.log("[crearDocumento] Enviando documento:", documentoData);
        const response = await documentoApi.post('/documentos', documentoData);
        console.log("[crearDocumento] Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error('[crearDocumento] Error creando documento:', error);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            throw error.response.data;
        }
        throw error;
    }
};

// export const getActualizaciones = async (username) => {
//     const cacheKey = `actualizaciones_${username}`;
//     const cachedItem = localStorage.getItem(cacheKey);

//     if (cachedItem) {
//         try {
//             const { timestamp, data } = JSON.parse(cachedItem);
//             if (Date.now() - timestamp < CACHE_DURATION_MS) {
//                 console.log(`Returning cached casos for user ${username} from ${cacheKey}`);
//                 return data;
//             } else {
//                 console.log(`Cache expired for ${cacheKey}`);
//                 localStorage.removeItem(cacheKey); // Remove stale data
//             }
//         } catch (e) {
//             console.error(`Error parsing cached data for ${cacheKey}:`, e);
//             localStorage.removeItem(cacheKey); // Remove corrupted data
//         }
//     }
//     const path = `/caso/usuario/${username}`;
//     try {
//         console.log(`Fetching fresh casos for user ${username} from API (${path})`);
//         const response = await casoApi.get(path);
//         const dataToCache = {
//             timestamp: Date.now(),
//             data: response.data,
//         };
//         localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
//         return response.data;
//     } catch (error) {
//         let failedUrl = path;
//         if (error.config?.baseURL && !(path && (path.startsWith('http://') || path.startsWith('https://')))) {
//              try {
//                 failedUrl = new URL(path, error.config.baseURL).href;
//             } catch (e) {
//                 const slash = (error.config.baseURL.endsWith('/') || path.startsWith('/')) ? '' : '/';
//                 failedUrl = `${error.config.baseURL}${slash}${path}`.replace(/([^:])\/\/+/g, '$1/');
//             }
//         }
        
//         console.error(`Error fetching casos for user ${username} from ${failedUrl}:`);
//         if (error.response) {
//             console.error('Response Data:', error.response.data);
//             console.error('Response Status:', error.response.status);
//             // console.error('Response Headers:', JSON.stringify(error.response.headers)); // Optional: can be verbose
//         } else if (error.request) {
//             console.error('No response received. Request details might be in error.config or error itself if network error.');
//         } else {
//             console.error('Error Message:', error.message);
//         }
//         throw error; // Re-throw the error so the calling component can also handle it if needed
//     }
// };
// export default getCasos;