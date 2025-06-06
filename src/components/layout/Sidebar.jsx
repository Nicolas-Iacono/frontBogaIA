import React, { useState } from 'react';
import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    Stack,
    Button,
    Toolbar
} from "@mui/material";
import {
    Link as RouterLink,
    useNavigate,
    useLocation
} from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CasesIcon from '@mui/icons-material/WorkOutline';
import ClientsIcon from '@mui/icons-material/PeopleOutline';
import DocumentsIcon from '@mui/icons-material/ArticleOutlined';
import BillingIcon from '@mui/icons-material/ReceiptOutlined';
import ReportsIcon from '@mui/icons-material/AssessmentOutlined';
import { Collapse } from '@mui/material';
import AppLogo from '../../assets/boga-logo.svg'; // <<< PLEASE REPLACE with your actual logo path and filename

const standardDrawerWidth = 260;
const authPageDrawerWidth = '50vw';

const navLinks = [
    { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { title: 'Cases', path: '/casos', icon: <CasesIcon /> },
    { title: 'Clients', path: '/clientes', icon: <ClientsIcon /> },
    { title: 'Documents', path: '/documentos', icon: <DocumentsIcon /> },
    { title: 'Billing', path: '/facturacion', icon: <BillingIcon /> },
    { title: 'Reports', path: '/reportes', icon: <ReportsIcon /> },
];

export default function Sidebar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const isOnAuthPage = location.pathname.includes('/auth');
    const currentDrawerWidth = isOnAuthPage && !isAuthenticated ? authPageDrawerWidth : `${standardDrawerWidth}px`;
    const showNavItems = isAuthenticated;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/auth');
    };

    const userAvatar = user ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: currentDrawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: currentDrawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: ' #1E1E2D',
                    color: '#A2A3B7',
                    borderRight: '1px solid #2A2A3F',
                    overflowX: 'hidden',
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2, backgroundColor: ' #161622' }}>
                <img 
                            src={AppLogo} 
                            alt="BogaDoctor AI Logo" 
                            style={{ 
                                maxWidth: '30%',      // Adjust percentage for desired width relative to sidebar
                                maxHeight: '50px',   // Adjust pixel value for desired max height
                                objectFit: 'contain', // Ensures the logo scales nicely without distortion
                                filter:'invert(60%)'
                            }} 
                        />
                    <Typography
                        variant="h5"
                        component={RouterLink}
                        to="/"
                        sx={{
                            color: " #FFFFFF",
                            textDecoration: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        BogaDoctor
                    </Typography>
                </Toolbar>
                <Divider sx={{ borderColor: ' #2A2A3F' }} />

                {/* Logo display for Auth Page */}
                {isOnAuthPage && !isAuthenticated && (
                    <Box
                        sx={{
                            flexGrow: 1, // Takes up available vertical space
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3, // Padding around the logo
                        }}
                    >
                        <img 
                            src={AppLogo} 
                            alt="BogaDoctor AI Logo" 
                            style={{ 
                                maxWidth: '60%',      // Adjust percentage for desired width relative to sidebar
                                maxHeight: '250px',   // Adjust pixel value for desired max height
                                objectFit: 'contain', // Ensures the logo scales nicely without distortion
                                filter:'invert(60%)'
                            }} 
                        />
                    </Box>
                )}

                <Collapse in={showNavItems} timeout="auto" unmountOnExit sx={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <List sx={{ px: 1, mt: 1, overflowY: 'auto' }}>
                            {navLinks.map((link) => (
                                <ListItem
                                    key={link.title}
                                    disablePadding
                                    component={RouterLink}
                                    to={link.path}
                                    sx={{
                                        color: location.pathname === link.path ? '#FFFFFF' : '#A2A3B7',
                                        backgroundColor: location.pathname === link.path ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                                        borderRadius: '8px',
                                        mb: 0.5,
                                        '&:hover': {
                                            backgroundColor: 'rgba(3, 31, 239, 0.05)',
                                        },
                                    }}
                                >
                                    <ListItemButton sx={{ borderRadius: '8px', py: 1.2, px: 2 }}>
                                        <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>{link.icon}</ListItemIcon>
                                        <ListItemText primary={link.title} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: location.pathname === link.path ? 'bold' : 'normal' }} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>

                        <Box sx={{ p: 2, borderTop: '1px solid #2A2A3F', mt: 'auto' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Search..."
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        backgroundColor: ' #2A2A3F',
                                        color: ' #A2A3B7',
                                        '& fieldset': {
                                            borderColor: 'transparent',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: ' #4A4A6A',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#7B7B9E',
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            color: '#6E6E86',
                                            opacity: 1,
                                        },
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: ' #6E6E86'
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                <IconButton onClick={handleMenuOpen} size="small">
                                    <Avatar sx={{ bgcolor: '#4A4A6A', width: 36, height: 36, fontSize: '1rem', color: '#FFFFFF' }}>{userAvatar}</Avatar>
                                </IconButton>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexGrow: 1, overflow: 'hidden', ml: 1 }}>
                                    <Typography variant="subtitle2" noWrap sx={{ color: '#FFFFFF', fontWeight: 'medium' }}>{user?.username || 'User'}</Typography>
                                    <Typography variant="caption" noWrap sx={{ color: '#A2A3B7' }}>Role/Status</Typography>
                                </Box>
                                <IconButton sx={{ color: '#A2A3B7' }}>
                                    <NotificationsNoneOutlinedIcon />
                                </IconButton>
                            </Stack>
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleMenuClose}
                                MenuListProps={{ 'aria-labelledby': 'user-menu-button' }}
                                PaperProps={{
                                    sx: {
                                        backgroundColor: ' #2A2A3F',
                                        color: ' #A2A3B7',
                                        mt: 1,
                                        minWidth: 180,
                                    }
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            >
                                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>Profile</MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ '&:hover': { backgroundColor: 'rgba(29, 37, 107, 0.05)' } }}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Collapse>

                {!isAuthenticated && !isOnAuthPage && (
                    <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid #2A2A3F' }}>
                        <Button component={RouterLink} to="/auth" variant="contained" color="primary" fullWidth sx={{ textTransform: 'none' }}>
                            Login / Register
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
}
