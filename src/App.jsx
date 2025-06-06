import React from 'react';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from './components/pages/Home'; // Assuming Home.jsx is in src/components/pages/
import AuthPage from './components/pages/Auth'; // AuthPage.jsx is in src/components/pages/
import Clientes from "./components/pages/Clientes";
import Casos from "./components/pages/Casos";
import CrearCliente from "./components/pages/CrearCliente";
import CaseDetail from "./components/pages/CaseDetail";
import { CrearCaso } from './components/pages/CrearCaso'; // Import CrearCaso page
import DocumentosPage from './components/pages/Documentos'; // Import DocumentosPage
import ProtectedRoute from './components/auth/ProtectedRoute';
import ChatIa from './components/common/ChatIa'; // Import the new ChatIa component // Import ProtectedRoute
import './App.css';
import Sidebar from "./components/layout/Sidebar"; // Changed Header to Sidebar
import { AuthProvider } from "./components/context/AuthContext";
import { Box, CssBaseline } from "@mui/material"; // Added CssBaseline for consistent styling

const drawerWidth = 260; // Must match the drawerWidth in Sidebar.jsx

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Box sx={{ display: 'flex' }}> {/* Main container for sidebar and content */}
                    <CssBaseline /> {/* Ensures baseline styles, helpful with MUI Drawers */}
                    <Sidebar /> 
                    <Box 
                        component="main" 
                        sx={{
                            flexGrow: 1, 
                            // backgroundColor: (theme) => theme.palette.grey[100], // Example background for content area
                            p: 0, // Reset padding, pages will handle their own
                            width: `calc(100% - ${drawerWidth}px)`,
                            minHeight: '100vh',
                            overflow: 'auto' // Allow content to scroll independently
                        }}
                    >
                        {/* Toolbar spacer might be needed if pages don't have their own top padding/margin 
                            and content goes under a potential top bar within the page itself, 
                            but with a permanent drawer, direct page content usually starts at the top. 
                            If pages have their own AppBars, they'd need their own Toolbar equivalent. 
                        */}
                        <Routes>
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                            <Route path="/casos" element={<ProtectedRoute><Casos /></ProtectedRoute>} />
                            <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
                            <Route path="/casos/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />
                            <Route path="/crear-caso" element={<ProtectedRoute><CrearCaso /></ProtectedRoute>} /> {/* Route for Crear Caso */}
                            <Route path="/crear-cliente" element={<ProtectedRoute><CrearCliente /></ProtectedRoute>} /> {/* Route for Crear Cliente */}
                            <Route path="/documentos" element={<ProtectedRoute><DocumentosPage /></ProtectedRoute>} /> {/* Route for Documentos Page */}
                            {/* Add other routes here */}
                        </Routes>
                    </Box>
                    <ChatIa /> {/* Add ChatIa component here */}
                </Box>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
