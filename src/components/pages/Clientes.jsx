import { Box, Typography, Grid, CircularProgress, Alert, Button, Slide } from "@mui/material"; // Added Button, Slide
import { useAuth } from "../context/AuthContext";
import MiniCalendar from "../MiniCalendar";
import { useEffect, useState } from "react";
import { getClientes } from "../api/clienteApi";
// import ClientCard from "../common/ClientCard"; // No longer directly used here if ClientsTable handles individual cards
import ClientsTable from "../common/ClientsTable";
import ClienteForm from "../forms/ClienteForm"; // Import ClienteForm

export const Clientes = () => {
    const { user: authUser } = useAuth();
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showClienteForm, setShowClienteForm] = useState(false); // State for form visibility

    // Fetch clients
    const fetchClientesData = async () => {
        if (!authUser) {
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const data = await getClientes(authUser.username);
            setClientes(data || []);
        } catch (err) {
            console.error("Error fetching clientes:", err);
            setError(err.message || "Error al cargar los clientes.");
            setClientes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClientesData();
    }, [authUser]);

    // Handler to show the client creation form
    const handleShowClienteForm = () => {
        setShowClienteForm(true);
    };

    // Handler for when the ClienteForm is submitted
    const handleClienteFormSubmit = async (values) => {
        console.log("ClienteForm submitted in Clientes page:", values);
        // TODO: Implement API call to create client
        // For example: await createClienteApiFunction(authUser.username, values);
        // After successful submission, hide the form and refresh client list
        setShowClienteForm(false);
        fetchClientesData(); // Re-fetch client list
    };

    // Handler to cancel form display and show the table
    const handleCancelClienteForm = () => {
        setShowClienteForm(false);
    };
    
    // Placeholder handlers for edit/delete, can be passed to ClientsTable if needed
    const handleEditClient = (clientId) => {
        console.log("Edit client:", clientId);
        // TODO: Navigate to edit form or open modal
    };

    const handleDeleteClient = (clientId) => {
        console.log("Delete client:", clientId);
        // TODO: Call delete API and then fetchClientesData()
    };

    return (
        <Box sx={{
            padding: 1,
            width: "100%",
            backgroundColor: " #f5f5f5",
            overflowY: "auto",
            overflowX: "hidden",
            height:"100vh" // Ensure it takes full viewport height alongside sidebar
        }}>
            <Grid container spacing={0} sx={{ height: '100%' }}>
                {/* First Column */} 
                <Grid item xs={12} md={8} sx={{ padding: 2, display: 'flex', flexDirection: 'column', width: "70%", position: 'relative' }}>
                    <Box sx={{
                        display: 'flex',
                        width: "100%",
                        flexDirection: "column",
                        justifyContent: 'start',
                        alignItems: 'start',
                        padding: 1.5,
                        mb: 2
                    }}>
                        <Typography variant="h5" gutterBottom sx={{ textTransform: 'none', fontWeight: 'bold', color: 'black', fontSize: '1.2rem' }}>
                            Gestión de Clientes
                        </Typography>
                        <Typography variant="body2" sx={{ textTransform: 'none', color: 'gray', fontSize: '1rem' }}>
                            Aquí podrás administrar tus clientes.
                        </Typography>
                    </Box>

                    {/* This Box now directly contains the table header and table */}
                    <Box sx={{width: '100%'}}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '100%' }}>
                            <Typography variant="h6" sx={{ textTransform: 'none', fontWeight: 'bold', color: 'black', fontSize: '1.2rem' }}>
                                Listado de Clientes
                            </Typography>
                            <Button variant="contained" sx={{backgroundColor:"rgb(37, 37, 88)"}} onClick={handleShowClienteForm}>
                                Crear Nuevo Cliente
                            </Button>
                        </Box>
                        <Box sx={{
                            width: '100%',
                            flexGrow: 1,
                            overflowY: 'auto',
                            paddingRight: 1, // For scrollbar spacing
                        }}>
                            {isLoading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                                    <CircularProgress />
                                </Box>
                            )}
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                            )}
                            {!isLoading && !error && clientes.length === 0 && (
                                <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                                    No hay clientes para mostrar. Click en "Crear Nuevo Cliente" para empezar.
                                </Typography>
                            )}
                            {!isLoading && !error && clientes.length > 0 && (
                                <ClientsTable
                                    clientes={clientes}
                                    onEditClient={handleEditClient} 
                                    onDeleteClient={handleDeleteClient}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Floating Form using Slide */}
                    <Slide direction="left" in={showClienteForm} mountOnEnter unmountOnExit>
                        <Box sx={{
                            position: 'absolute',
                            top: 40, // Aligns vertically with the "Listado de Clientes" title row
                            right: -300, // Positioned with padding from the right edge
                            width: { xs: 'calc(100% - 32px)', sm: '400px', md: '300px' }, // Responsive width
                            maxHeight: 'calc(100% - 116px)', // Max height considering top offset and parent bottom padding
                            overflowY: 'auto', // Enable scroll if form content is tall
                            padding: 3,
                            backgroundColor: 'white',
                            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.12)',
                            zIndex: 1200, 
                            borderRadius: '12px',
                            border: '1px solid #e0e0e0'
                        }}>
                            <ClienteForm onSubmitForm={handleClienteFormSubmit} onCancel={handleCancelClienteForm} />
                        </Box>
                    </Slide>
                </Grid>

                {/* Second Column (Calendar and other sidebar items) */}
        
            </Grid>
        </Box>
    );
};

export default Clientes;
