import { Box, Typography, Grid, CircularProgress, Alert } from "@mui/material"; // Added CircularProgress, Alert
import { useAuth } from "../context/AuthContext";
import MiniCalendar from "../MiniCalendar";
import { useEffect, useState } from "react"; // Added useEffect, useState
import { getClientes } from "../api/clienteApi"; // Import getClientes
import ClientCard from "../common/ClientCard"; // Import ClientCard
import ClientsTable from "../common/ClientsTable";

export const Clientes = () => {
    const { user: authUser } = useAuth(); // Renamed to avoid conflict if 'user' is in client data
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authUser) { // Ensure authUser (username) is available
            const fetchClientes = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const data = await getClientes(authUser.username); // Use username from auth context
                    setClientes(data || []); // Ensure clientes is an array
                } catch (err) {
                    console.error("Error fetching clientes:", err);
                    setError(err.message || "Error al cargar los clientes.");
                    setClientes([]); // Clear clients on error
                } finally {
                    setIsLoading(false);
                }
            };
            fetchClientes();
        } else {
            setIsLoading(false); // Not logged in, so not loading
            // Optionally, set an error or message indicating user needs to log in
        }
    }, [authUser]); // Dependency array includes authUser

    const handleEditClient = (clientId) => {
        console.log("Edit client:", clientId);
        // Implement edit functionality (e.g., open a modal, navigate to an edit page)
    };

    const handleDeleteClient = (clientId) => {
        console.log("Delete client:", clientId);
        // Implement delete functionality (e.g., show confirmation, call delete API)
        // Potentially refresh client list:
        // setClientes(prevClientes => prevClientes.filter(c => c.id !== clientId));
    };

    return (
        <Box sx={{
            padding: 1,
            height: "calc(100vh - 4rem)", // Adjust height to fill viewport below header
            width: "100%",
            backgroundColor: " #f5f5f5",
            overflowY: "auto",
            overflowX: "hidden",
            height:"100%"
        }}>
            <Grid container spacing={0} sx={{ height: '100%' }}>
                {/* First Column (approx 70%) */}
                <Grid item xs={12} md={8} sx={{ padding: 2, display: 'flex', flexDirection: 'column', width: "70%" }}> {/* Removed height: '100%' to allow content to define height */}
                    <Box sx={{
                        display: 'flex',
                        width: "100%", // Adjusted to full width of the column
                        flexDirection: "column",
                        justifyContent: 'start',
                        alignItems: 'start',
                        padding: 1.5,
                        mb: 2 // Added margin bottom
                    }}>

                        <Typography variant="h5" gutterBottom sx={{ textTransform: 'none', fontWeight: 'bold', color: 'black', fontSize: '1.2rem' }}>
                            Gestión de Clientes
                        </Typography>
                        <Typography variant="body2" sx={{ textTransform: 'none', color: 'gray', fontSize: '1rem' }}>
                            Aquí podrás administrar tus clientes.
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: "column",
                        justifyContent: 'start', // Changed from space-around
                        alignItems: 'start',
                        padding: 1,
                        marginTop: "2rem",
                        height: "100%"
                    }}>
                        <Typography variant="h6" sx={{ textTransform: 'none', fontWeight: 'bold', color: 'black', fontSize: '1.2rem', marginBottom: 2 }}>
                            Listado de Clientes
                        </Typography>
                        <Box sx={{
                            width: '100%', // Ensure this box takes full width
                            flexGrow: 1, // Allow this box to grow and fill available space
                            overflowY: 'auto', // Allow scrolling for client cards if they overflow
                            paddingRight: 1, // Add some padding to prevent scrollbar overlap
                        }}>
                            {isLoading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <CircularProgress />
                                </Box>
                            )}
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                            )}
                            {!isLoading && !error && clientes.length === 0 && (
                                <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                                    No hay clientes para mostrar.
                                </Typography>
                            )}
                            {!isLoading && !error && clientes.length > 0 && (
                                <ClientsTable
                                    clientes={clientes} // Pass the full list of clientes once
                                />
                            )}
                        </Box>
                    </Box>
                </Grid>

                {/* Second Column (Calendar and other sidebar items) */}
                <Grid item xs={12} md={4} sx={{
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: "30%"
                }}>
                    <Typography variant="h6" gutterBottom sx={{ textTransform: 'none', fontWeight: 'bold', color: 'black', fontSize: '1.2rem' }}>
                        Calendario
                    </Typography>
                    <MiniCalendar />
                    {/* You can add more client-specific sidebar items here */}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Clientes;
