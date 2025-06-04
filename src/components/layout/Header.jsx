import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, TextField, InputAdornment, IconButton, Avatar, Menu, MenuItem, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
// You might need to install @mui/icons-material if not already: npm install @mui/icons-material

const navLinks = [
  { title: 'Dashboard', path: '/' },
  { title: 'Cases', path: '/casos' },
  { title: 'Clients', path: '/clientes' },
  { title: 'Documents', path: '/documentos' },
  { title: 'Billing', path: '/facturacion' },
  { title: 'Reports', path: '/reportes' },
];

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/auth'); // Redirect to login page after logout
    };
    
    // Placeholder for avatar image - replace with actual user avatar if available
    const userAvatar = user ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ 
                backgroundColor: "white", 
                color: "black", 
                boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)' 
            }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Replace with your actual logo if you have one */}
                        {/* <img src="/path-to-your-logo.png" alt="Logo" style={{ height: 30, marginRight: 10 }} /> */}
                        <Typography 
                            variant="h6" 
                            component={RouterLink} 
                            to="/" 
                            sx={{ 
                                color: "black", 
                                textDecoration: 'none', 
                                fontWeight: 'bold', 
                                mr: 3 
                            }}
                        >
                            BogaDoctor AI
                        </Typography>
                        
                        {isAuthenticated && (
                            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                {navLinks.map((link) => (
                                    <Button 
                                        key={link.title} 
                                        component={RouterLink} 
                                        to={link.path} 
                                        sx={{ 
                                            color: 'text.secondary', 
                                            textTransform: 'none',
                                            '&:hover': {
                                                color: 'primary.main',
                                                backgroundColor: 'transparent'
                                            }
                                        }}
                                    >
                                        {link.title}
                                    </Button>
                                ))}
                            </Stack>
                        )}
                    </Box>

                    {isAuthenticated && user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search..."
                                sx={{
                                    width: 250, // Adjust width as needed
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        backgroundColor: 'grey.100',
                                        '& fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'grey.400',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.disabled' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <IconButton sx={{ color: 'text.secondary' }}>
                                <NotificationsNoneOutlinedIcon />
                            </IconButton>
                            <IconButton onClick={handleMenuOpen} size="small">
                                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>{userAvatar}</Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleMenuClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
                                    Profile (Hello, {user})
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        // Optional: Show Login/Register buttons if not authenticated and not on /auth page
                        // This part can be customized based on where you want login buttons
                        !window.location.pathname.includes('/auth') && (
                             <Button component={RouterLink} to="/auth" color="primary" variant="contained" sx={{textTransform: 'none'}}>
                                Login / Register
                            </Button>
                        )
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
