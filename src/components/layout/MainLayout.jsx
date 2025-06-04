import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import ChatIa from '../common/ChatIa';

const standardDrawerWidth = 260; // Standard width of the sidebar
const authPageDrawerWidth = '50vw'; // Width of the sidebar on the auth page when not authenticated

export default function MainLayout() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    const isOnAuthPage = location.pathname.includes('/auth');
    const currentDrawerWidth = isOnAuthPage && !isAuthenticated ? authPageDrawerWidth : `${standardDrawerWidth}px`;
    const mainContentMarginLeft = isOnAuthPage && !isAuthenticated ? authPageDrawerWidth : `${standardDrawerWidth}px`;
    const mainContentWidth = isOnAuthPage && !isAuthenticated ? '50vw' : `calc(100% - ${standardDrawerWidth}px)`;

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar /> {/* Sidebar will manage its own width and content visibility internally */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // backgroundColor: (theme) => theme.palette.grey[100], // Optional: for content area background
                    p: 0, // Pages will handle their own padding
                    marginLeft: mainContentMarginLeft,
                    width: mainContentWidth,
                    minHeight: '100vh',
                    overflow: 'auto',
                    transition: (theme) => theme.transitions.create(['margin-left', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Outlet />
            </Box>
            <ChatIa />
        </Box>
    );
}
