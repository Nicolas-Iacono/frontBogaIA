import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { getCasosLista } from '../api/casoApi';
import { AuthContext } from '../context/AuthContext';
import CasosTable from '../common/CasosTable';

const Casos = () => {
    const navigate = useNavigate(); // Initialize navigate
    const { user: authUser } = useContext(AuthContext);
    const [casos, setCasos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = authUser?.username;

    console.log(username)
    useEffect(() => {
        if (!authUser) {
          setIsLoading(false);
          setError('Debes iniciar sesión para ver tus casos.');
          return;
        }
      
        const fetchCasos = async () => {
          try {
            setIsLoading(true);
            setError(null);
            const data = await getCasosLista(authUser.username, 0, 10);
            setCasos(data.content || []);
          } catch (err) {
            setError(err.message || 'Error al cargar los casos.');
            setCasos([]);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchCasos();
      }, [authUser]);
      

    return (
        <Box sx={{
            padding: 2,
            minHeight: 'calc(100vh - 4rem)',
            backgroundColor: '#f5f5f5',
            height:"100%"
        }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Mis Casos
            </Typography>
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                    <CircularProgress />
                </Box>
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {!isLoading && !error && casos.length === 0 && (
                <Typography variant="body1" sx={{ color: 'text.secondary', mt: 4 }}>
                    No tienes casos registrados.
                </Typography>
            )}
            {!isLoading && !error && casos.length > 0 && (
                <CasosTable
                  casos={casos}
                  onView={caso => navigate(`/casos/${caso.id}`)}
                  onEdit={caso => alert(`Editar caso: ${caso.titulo}`)}
                  onDelete={caso => alert(`Eliminar caso: ${caso.titulo}`)}
                />
            )}
        </Box>
    );
};

export default Casos;
