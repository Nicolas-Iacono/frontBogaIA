import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import MiniCalendar from "../MiniCalendar"; // Assuming MiniCalendar is in common
import CasoForm from '../forms/CasoForm'; // The new form component
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export const CrearCaso = () => {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Placeholder for actual submission logic
    const handleCreateCaso = (values) => {
        console.log('Caso data to be submitted from CrearCaso page:', values);
        // Here you would call your API to create the case
        // e.g., createCasoApi(values).then(...).catch(...);
    };

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, backgroundColor: '#f4f6f8', minHeight: 'calc(100vh - 64px)' }}>
            <Grid container spacing={3}>
                {/* Main Content Area - CasoForm */}
                <Grid item xs={12} md={8}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: { xs: 2, sm: 3 }, 
                            borderRadius: '12px', 
                            backgroundColor: 'white', 
                            border: '1px solid #e0e0e0'
                        }}
                    >
                        {authUser ? (
                            <CasoForm onSubmitForm={handleCreateCaso} />
                        ) : (
                            <Typography>Por favor, inicie sesión para crear un caso.</Typography>
                        )}
                    </Paper>
                </Grid>

              
            </Grid>
        </Box>
    );
};
