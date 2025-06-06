import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    Paper,
    IconButton,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { createCliente } from '../api/clienteApi';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
export default function ClienteForm({ onSubmitForm, onCancel }){
    const { user } = useAuth();
    const name = user.username
    console.log(name)
console.log(user);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        dni: '',
        username: name
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.nombre || !formData.apellido || !formData.email) {
            alert('Por favor, complete los campos obligatorios: Nombre, Apellido, Email.');
            return;
        }
    
        const clientJson = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            email: formData.email,
            dni: formData.dni,
            username: name
        };
    
        try {
            const createdCliente = await createCliente(clientJson);
            console.log("Cliente creado:", createdCliente);
    
            if (onSubmitForm) {
                onSubmitForm(createdCliente); // opcional: notificar al padre
            }
    
            // limpiar formulario
            setFormData({
                nombre: '',
                apellido: '',
                telefono: '',
                email: '',
                dni: '',
                username: name
            });
    
        } catch (error) {
            console.error("Error al crear cliente:", error);
            alert("Ocurrió un error al crear el cliente. Revisá la consola.");
        }
    };     

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'start' }}>
                    Nuevo Cliente
                </Typography>
                <IconButton onClick={onCancel} color="inherit" variant="outlined">
                    <ArrowForwardIosRoundedIcon />
                </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2} sx={{display:"flex", flexDirection:"column"}}>
                        <TextField
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  height:"2.5rem",
                                  fontSize:"1rem",
                                  fontWeight: "medium",
                                  display:"flex",
                                  alignItems:"center",
                                  justifyContent:"center"
                                },
                              }}
                            id="nombre"
                            label="Nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            autoFocus
                        />
                        <TextField
                        
                        sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              height:"2.5rem",
                              fontSize:"1rem",
                              fontWeight: "medium",
                              display:"flex",
                              alignItems:"center",
                              justifyContent:"center"
                            },
                          }}
                            id="apellido"
                            label="Apellido"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                        />
                   
                        <TextField 
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  height:"2.5rem",
                                  fontSize:"1rem",
                                  fontWeight: "medium",
                                  display:"flex",
                                  alignItems:"center",
                                  justifyContent:"center"
                                },
                              }}
                            id="telefono"
                            label="Teléfono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        <TextField 
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  height:"2.5rem",
                                  fontSize:"1rem",
                                  fontWeight: "medium",
                                  display:"flex",
                                  alignItems:"center",
                                  justifyContent:"center"
                                },
                              }}
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField 
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  height:"2.5rem",
                                  fontSize:"1rem",
                                  fontWeight: "medium",
                                  display:"flex",
                                  alignItems:"center",
                                  justifyContent:"center"
                                },
                              }}
                            id="dni"
                            label="Doc. de Identidad"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                        />
                    <Grid item xs={12}>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 ,flexDirection:"column"}}>
                   
                               <Button
                         sx={{
                      
                            mb: 2,
                            backgroundColor: 'rgb(44, 38, 80)',
                            borderRadius: 2.5,
                            height: '2rem',
                            fontSize: '1rem',
                            fontWeight: '500', // 'medium' no es válido, usá números o palabras como 'bold'
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                              backgroundColor: 'rgb(29, 25, 49)', // o cualquier color que prefieras al hacer hover
                            },
                          }}
                            type="submit"
                            fullWidth
                            variant="contained"

                        >
                            Registrar Cliente
                        </Button>
                        </Box>
                    
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
