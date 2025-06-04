import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Typography, Link as MuiLink, Checkbox, FormControlLabel } from '@mui/material';
import InputText from '../common/InputText'; // Assuming InputText is in the common folder
import { useAuth } from '../context/AuthContext'; // Adjusted path
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Validation Schema using Yup
const LoginSchema = Yup.object().shape({
  username: Yup.string().required('This field is required'),
  password: Yup.string().required('Password is required'),
  rememberMe: Yup.boolean(),
});

const LoginForm = ({ onSwitchToRegister }) => { // onSubmit prop might be re-evaluated or removed
  const initialValues = {
    username: '',
    password: '',
    rememberMe: false,
  };

    const { login } = useAuth(); // Get login from AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        console.log("Login input values:", values);
        const response = await login(values.username, values.password);
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error.message || error);
        let errorMessage = 'Login failed. Please check your credentials or try again.';
        if (error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if (error && typeof error === 'string') {
          errorMessage = error;
        }
        alert(errorMessage);
      } finally {
        setSubmitting(false);
      }
    };
    

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, handleBlur, values, touched, errors }) => (
          <Form style={{ width: '100%' }}>
            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium', textAlign: 'left' }}>
                Username
              </Typography>
              <InputText
                placeholder="Enter your username"
                name="username" // Stays as 'email' to match backend expectation
                type="text"  // Changed from 'email' to 'text'
                // Assuming InputText uses Formik's context or useField hook
              />
            </Box>

            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium', textAlign: 'left' }}>
                Password
              </Typography>
              <InputText
                placeholder="Enter your password"
                name="password"
                type="password"
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', my: 1 }}>
              <Typography variant="body2">
                Remember me
              </Typography>
              <Checkbox 
                name="rememberMe" 
                color="primary" 
                checked={values.rememberMe} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                sx={{ p: 0.5 }} // Adjust padding for the checkbox if needed
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 2, mb: 2, py: 1.25, textTransform: 'none', fontSize: '1rem', borderRadius: '8px' }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            {onSwitchToRegister && (
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                Don't have an account?{' '}
                <MuiLink component="button" variant="body2" onClick={onSwitchToRegister} sx={{ cursor: 'pointer', fontWeight: 'medium' }}>
                  Register
                </MuiLink>
              </Typography>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;
