import { Box, Typography, Grid, Paper, Fab, Slide } from "@mui/material"; // Added Fab, changed Fade to Slide
import { useAuth } from "../context/AuthContext";
import CasesTable from "../common/CasesTable";
import MiniCalendar from "../MiniCalendar";
import CasoForm from "../forms/CasoForm"; 
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stateCasoForm, setStateCasoForm] = useState(false);

    // Handler to show the case creation form
    const handleShowCasoForm = () => {
        console.log("Showing CasoForm");
        setStateCasoForm(true);
    };

    // Handler for when the CasoForm is submitted
    const handleCasoFormSubmit = async (values) => {
        console.log("CasoForm submitted in Home:", values);
        // Here, you would typically make an API call to save the case
        // For example: await api.createCaso(values);
        // After successful submission (or cancellation), hide the form:
        setStateCasoForm(false);
    };

    // Handler to cancel form display and show the table
    const handleCancelCasoForm = () => {
        console.log("Cancelling CasoForm display");
        setStateCasoForm(false);
    };

    return (
        <>
            <Box sx={{
                // marginTop: "4rem", // Removed: No longer needed due to sidebar
                padding: 0, // Reset padding, let the Grid container handle it or set specific page padding
                height: "100vh", // Fill the viewport height
                width: "100%",
                backgroundColor: "#f5f5f5", // Consider moving to a theme or keeping if specific to Home
                overflowY: "auto", 
                overflowX: "hidden"
            }}>
                {/* The Grid container below will now directly fill this Box */}
                <Grid container spacing={0} sx={{ height: '100%' }}>
                    {/* First Column (approx 70%) */}
                    <Grid item xs={12} md={8} sx={{ height: '90%',padding: 2, display: 'flex', flexDirection: 'column', width:"80%" }}>
                            <Box sx={{ 
                                display: 'flex',
                                width:"40%",
                                flexDirection:"column",
                                justifyContent: 'start',
                                alignItems: 'start', 
                                padding:1.5
                            }}>
                                <Typography variant="h5" gutterBottom sx={{textTransform: 'none', fontWeight: 'bold', color: 'black', fontSize: '1.2rem'}}>Dashboard</Typography>
                                <Typography variant="body2" sx={{textTransform: 'none', color: 'gray', fontSize: '1rem'}}>Welcome back, {user?.username || 'Guest'}</Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection:"column",
                                justifyContent: 'space-around',
                                alignItems: 'start', 
                                padding:1,
                                marginTop:"1rem",
                                height:"100%",
                            }}>
                                
                        <Slide direction="left" in={stateCasoForm} timeout={500} mountOnEnter unmountOnExit>
                            <Box sx={{width: '100%'}}>
                                <CasoForm onSubmitForm={handleCasoFormSubmit} onCancel={handleCancelCasoForm} /> 
                            </Box>
                        </Slide>
                        <Slide direction="right" in={!stateCasoForm} timeout={500} mountOnEnter unmountOnExit>
                            <Box sx={{width: '100%'}}>
                                <Typography variant="h6" sx={{textTransform: 'none', fontWeight: 'bold', color: 'black', fontSize: '1.2rem', mb: 2}}>
                                    Recent Cases
                                </Typography>
                                <CasesTable onAddNewCaseClick={handleShowCasoForm} />
                            </Box>
                        </Slide>
                            </Box>  
                    </Grid>

                
                </Grid>
            </Box>


        </>
    );
};

export default Home;