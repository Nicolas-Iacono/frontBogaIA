import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const chatIaApi = axios.create({
    baseURL: API_URL,
    // Axios will automatically set Content-Type for FormData and JSON objects
});

// Add a request interceptor to log the URL
chatIaApi.interceptors.request.use(
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

export const subirArchivoIa = async (archivoData) => {
    try {
        console.log("[subirArchivoIa] Enviando archivo:", archivoData);
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No authentication token found for subirArchivoIa');
            throw new Error('No authentication token found');
        }

        const response = await chatIaApi.post('/archivo-ia/subir', archivoData, {
            headers: {
                // Axios should set 'Content-Type': 'multipart/form-data' automatically for FormData
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log("[subirArchivoIa] Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error('[subirArchivoIa] Error subiendo archivo:', error);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            throw error.response.data;
        }
        throw error;
    }
};

export const buscarDocumentos = async (username, query) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('No authentication token found for buscarDocumentos');
    throw new Error('No authentication token found');
  }

  try {
    const encodedUsername = encodeURIComponent(username);
    const encodedQuery = encodeURIComponent(query);
    
    const response = await fetch(`${API_URL}/archivo-ia/buscar?username=${encodedUsername}&query=${encodedQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      throw new Error(errorData?.message || errorData?.error || `Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching documents in API call:', error);
    throw error;
  }
};

export const hacerPregunta = async (username, query) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('No authentication token found for hacerPregunta');
    throw new Error('No authentication token found');
  }

  try {
    const encodedUsername = encodeURIComponent(username);
    const encodedQuery = encodeURIComponent(query);
    
    const response = await fetch(`${API_URL}/archivo-ia/responder?username=${encodedUsername}&query=${encodedQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorText; // Changed from errorData to reflect it's text
      try {
        errorText = await response.text(); // Read error as text
      } catch (e) {
        // If reading as text fails for some reason (unlikely for error responses)
        throw new Error(`Error ${response.status}: ${response.statusText} (and failed to read error body)`);
      }
      // Use the errorText in the error message
      throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
    }
    return await response.text(); // API returns plain text for success as well
  } catch (error) {
    console.error('Error asking question via API:', error);
    throw error; 
  }
};

// Placeholder for fetching documents for a user
export const listarDocumentos = async (username) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('No authentication token found for listarDocumentos');
    throw new Error('No authentication token found');
  }
  if (!username) {
    console.error('Username is required for listarDocumentos');
    throw new Error('Username required');
  }

  console.log(`[listarDocumentos] Fetching documents for user: ${username}`);
  // Replace with actual API call
  // For now, simulating a delay and returning mock data or an empty array
  try {
    // const encodedUsername = encodeURIComponent(username);
    // const response = await fetch(`${API_URL}/archivo-ia/listar?username=${encodedUsername}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });

    // if (!response.ok) {
    //   const errorText = await response.text();
    //   throw new Error(errorText || `Error ${response.status}`);
    // }
    // return await response.json(); // Assuming API returns JSON array of documents

    // Mock implementation:
    await new Promise(resolve => setTimeout(resolve, 700));
    const mockDocs = [
        { id: 'doc1', nombre: 'Contrato_Cliente_A.pdf', tipo: 'pdf', fechaSubida: '2024-05-10' },
        { id: 'doc2', nombre: 'Evidencia_Caso_001.docx', tipo: 'docx', fechaSubida: '2024-05-11' },
    ];
    console.log('[listarDocumentos] Returning mock documents:', mockDocs);
    return mockDocs;

  } catch (error) {
    console.error('Error in listarDocumentos API call:', error);
    throw error;
  }
};

export const getArchivosIaResumen = async (username) => {
  const API_URL = import.meta.env.VITE_API_URL; // Should be like http://localhost:8080
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.error('No authentication token found for getArchivosIaResumen');
    throw new Error('No authentication token found');
  }
  if (!username) {
    console.error('Username is required for getArchivosIaResumen');
    throw new Error('Username required');
  }

  try {
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch(`${API_URL}/archivo-ia/resumen/${encodedUsername}`, { // Removed redundant /api, assuming VITE_API_URL includes /api
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        // Try to parse as JSON first, as backend might send structured errors
        errorData = await response.json();
      } catch (e) {
        // If not JSON, try to get as text
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
      }
      // If JSON parsing was successful but response not ok
      throw new Error(errorData?.message || errorData?.error || `Error ${response.status}: ${response.statusText}`);
    }
    return await response.json(); // Endpoint returns a JSON array
  } catch (error) {
    console.error('Error fetching AI file summaries in API call:', error);
    throw error;
  }
};
