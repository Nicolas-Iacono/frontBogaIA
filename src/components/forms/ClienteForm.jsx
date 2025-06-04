import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    Paper
} from '@mui/material';

export default function ClienteForm() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        dni: '',
        usuarioId: '' // Or a default/derived value
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Basic validation example (can be expanded)
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
            usuarioId: parseInt(formData.usuarioId, 10) || null // Ensure usuarioId is a number or null
        };
        console.log('Datos del Cliente (JSON):', JSON.stringify(clientJson, null, 2));
        alert('Datos del cliente enviados. Revisa la consola.');
        // Here you would typically send the data to a backend API
        // Example: apiClient.post('/clientes', clientJson);

        // Optionally, reset form after submission
        setFormData({
            nombre: '',
            apellido: '',
            telefono: '',
            email: '',
            dni: '',
            usuarioId: ''
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Registrar Nuevo Cliente
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="nombre"
                            label="Nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="apellido"
                            label="Apellido"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="telefono"
                            label="Teléfono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="dni"
                            label="DNI"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="usuarioId"
                            label="Usuario ID (Asignado)"
                            name="usuarioId"
                            type="number"
                            value={formData.usuarioId}
                            onChange={handleChange}
                            // Consider making this read-only or pre-filled if it's system-assigned
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Registrar Cliente
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}
