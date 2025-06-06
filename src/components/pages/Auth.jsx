import React, { useState } from 'react';
import LoginForm from '../forms/LoginForm';
import RegisterForm from '../forms/RegisterForm';
import { Container, Paper, Box, Typography, Grid } from '@mui/material';

import { useTheme } from '@mui/material/styles'; // Import useTheme

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const theme = useTheme();

  const switchToRegister = () => setShowLogin(false);
  const switchToLogin = () => setShowLogin(true);

  const handleLoginSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  const handleRegisterSubmit = (values, { setSubmitting }) => {
    console.log('Registration attempt:', values);
    setTimeout(() => {
      alert('Registration Submitted (simulated):\n' + JSON.stringify(values, null, 2));
      setSubmitting(false);
      switchToLogin();
    }, 1000);
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'row', // Side-by-side columns
        height: '100vh',
        width: '100%',
        margin: 0,
        padding: 0, // No padding on the outermost container
        paddingTop: '64px', // Assuming 64px fixed header; adjust if necessary
        backgroundColor: theme.palette.grey[50], // Light grey background for the page
        overflow: 'hidden', // Prevent scrollbars on the container itself
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Form Column */} 
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center form vertically if space allows
          width: { xs: '100%', md: '500px' }, // Full width on xs, auto on md based on maxWidth
          maxWidth: { xs: '100%', md: '700px' }, // Max width for the form section
          p: { xs: 2, sm: 4 },
          height: '100%', // Take full available height within the padded container
          maxHeight: 'calc(100vh - 64px)', // Ensure it fits below header
          overflowY: 'hidden', // Scroll form content if it's too tall
          backgroundColor: 'background.paper',
          boxShadow: { md: theme.shadows[2] }, // Shadow on medium screens and up
          // No border radius at this level if it's meant to be flush on one side
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mt:2, mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          {showLogin ? 'Welcome back' : 'Create your account'}
        </Typography>
        {showLogin ? (
          <LoginForm 
            onSwitchToRegister={switchToRegister} 
            onSubmit={handleLoginSubmit} 
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={switchToLogin} 
            onSubmit={handleRegisterSubmit} 
          />
        )}
      </Box>

      {/* Image Column */} 
     
    </Container>
  );
};

export default AuthPage;
