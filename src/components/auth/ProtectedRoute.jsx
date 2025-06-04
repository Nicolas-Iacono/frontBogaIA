import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust path if your AuthContext is elsewhere
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading, token } = useContext(AuthContext);

    if (isLoading) {
        // Optional: A more centered loading indicator
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    width: '100%', // Ensure it takes full width of its container in App.jsx
                }}
            >
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Cargando sesión...</Typography>
            </Box>
        );
    }

    // Check for user and token.
    // If you only store the token and derive the user from it,
    // you might primarily check for the token's existence and validity.
    if (!user || !token) {
        // User not authenticated, redirect to auth page
        // Pass the current location to redirect back after login (optional)
        return <Navigate to="/auth" replace />;
    }

    // User is authenticated, render the child routes/component
    // Outlet is used if ProtectedRoute is wrapping other Route elements
    // children is used if ProtectedRoute is wrapping a direct component
    return children ? children : <Outlet />;
};

export default ProtectedRoute;