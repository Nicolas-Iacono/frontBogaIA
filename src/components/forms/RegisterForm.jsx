import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Typography, Link as MuiLink } from '@mui/material';
import InputText from '../common/InputText'; // Assuming InputText is in the common folder
import { registerUser } from '../api/userApi';

// Validation Schema using Yup
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterForm = ({ onSwitchToLogin, onSubmit }) => {
  const initialValues = {
    name: '',
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const { confirmPassword, ...submissionValues } = values;

    try {
      setSubmitting(true);
      // The 'onSubmit' prop from AuthPage is no longer directly called here for API submission.
      // We are calling the API directly from the form.
      const response = await registerUser(submissionValues);
      console.log('Registration successful:', response);
      alert('Registration successful! You can now log in.');

      if (onSwitchToLogin) {
        onSwitchToLogin(); // Switch to login form view after successful registration
      }
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      let errorMessage = 'Registration failed. Please try again.';
      // Attempt to get a more specific error message from the API response
      if (error.response && error.response.data && typeof error.response.data.message === 'string') {
        errorMessage = error.response.data.message;
      } else if (error.response && error.response.data && Array.isArray(error.response.data.message) && error.response.data.message.length > 0) {
        errorMessage = error.response.data.message.join(', '); // If messages are an array
      } else if (typeof error.message === 'string') {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',}}>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form style={{ width: '100%' }}>
            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium', textAlign: 'left' }}>
                Name
              </Typography>
              <InputText
                placeholder="Enter your name"
                name="name"
                type="text"
              />
            </Box>

            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium', textAlign: 'left' }}>
                Username
              </Typography>
              <InputText
                placeholder="Enter your username"
                name="username"
                type="text"
              />
            </Box>

            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium', textAlign: 'left' }}>
                Email Address
              </Typography>
              <InputText
                placeholder="Enter your email"
                name="email"
                type="email"
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

            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium', textAlign: 'left' }}>
                Confirm Password
              </Typography>
              <InputText
                placeholder="Confirm your password"
                name="confirmPassword"
                type="password"
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
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>

            {onSwitchToLogin && (
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                Already have an account?{' '}
                <MuiLink component="button" variant="body2" onClick={onSwitchToLogin} sx={{ cursor: 'pointer', fontWeight: 'medium' }}>
                  Log in
                </MuiLink>
              </Typography>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default RegisterForm;
