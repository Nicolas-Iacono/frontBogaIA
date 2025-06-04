import React, { useEffect, useState, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, MenuItem, CircularProgress, Alert, Grid, Typography, Paper,Box } from '@mui/material';
import { getClientes } from '../api/clienteApi'; // To fetch clients for dropdown
import { crearCaso } from '../api/casoApi';
import { AuthContext } from '../context/AuthContext';

const CasoSchema = Yup.object().shape({
    titulo: Yup.string().required('El título es requerido'),
    descripcion: Yup.string(),
    juzgado: Yup.string(),
    nroExpendiente: Yup.string(),
    materia: Yup.string(),
    estado: Yup.string().required('El estado es requerido'),
    contraparte: Yup.string(),
    clienteId: Yup.number().required('Debe seleccionar un cliente'),
});
const ESTADO_OPTIONS = [
    { label: 'Abierto', value: 'Abierto' },
    { label: 'En proceso', value: 'EnProceso' },
    { label: 'En espera', value: 'EnEspera' },
    { label: 'Suspendido', value: 'Suspendido' },
    { label: 'Cerrado', value: 'Cerrado' }
  ];
const CasoForm = ({ onSubmitForm, onCancel }) => { // Add onCancel to props
    const { user: authUser } = useContext(AuthContext);
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingClientes, setLoadingClientes] = useState(false);
    const [errorClientes, setErrorClientes] = useState(null);
    const name = authUser.username
    console.log(name)


    useEffect(() => {
        if (authUser) { // Ensure authUser (username) is available
            const fetchClientes = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    console.log("[CasoForm] Llamando a getClientes con username:", name);
                    const data = await getClientes(name); // Use username from auth context
                    console.log("[CasoForm] Clientes recibidos:", data);
                    setClientes(data || []); // Ensure clientes is an array
                } catch (err) {
                    console.error("[CasoForm] Error fetching clientes:", err);
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
    }, [authUser]);

    console.log("[CasoForm] Estado clientes:", clientes)
    const initialValues = {
        titulo: '',
        descripcion: '',
        juzgado: '',
        nroExpendiente: '',
        materia: '',
        estado: 'Abierto', // Default estado
        contraparte: '',
        clienteId: '',
        username: name
    };

    return (
        <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', width:"100%", backgroundColor: 'white' }}>
            <Box sx={{display:'flex',
                 flexDirection:'column', alignItems:'start', justifyContent:'flex-start',
                 width:'100%'}}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: '600', color: 'text.primary' }}>
                Crear Nuevo Caso
            </Typography>
                
            </Box>
            
            <Formik
                initialValues={initialValues}
                validationSchema={CasoSchema}
                onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
                    try {
                        // Intenta obtener usuarioId del contexto si existe
                        const username = authUser; // según cómo guardás tu authUser
                        
                        const casoPayload = {
                            ...values,
                            username: authUser.username,
                        };
                        console.log('[CasoForm] Enviando caso:', casoPayload);
                        await crearCaso(casoPayload);
                        setStatus({ success: 'Caso creado exitosamente.' });
                        resetForm();
                    } catch (error) {
                        console.error('[CasoForm] Error al crear caso:', error);
                        setStatus({ error: error?.message || 'Error al crear el caso.' });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
                    <Form noValidate>
                        <Grid container spacing={2} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width:'100%'}}>

                                <Box sx={{display:'flex', flexDirection:'row', width:'100%', 
                                    justifyContent:'space-between',
                                    alignItems:'center'
                                    // Removed height:"6rem"
                                    }}>

                                    <Grid item xs={12} sm={6} sx={{width:'65%'}}>
                                        <Field
                                            as={TextField}
                                            name="titulo"
                                            label="Título del Caso"
                                            fullWidth
                                            required
                                            error={touched.titulo && !!errors.titulo}
                                            helperText={touched.titulo && errors.titulo}
                                            size="small" // Added size small
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{width:"30%"}}>
                                <Field
                                    as={TextField}
                                    name="clienteId"
                                    label="Cliente"
                                    select
                                    fullWidth
                                    required
                                    disabled={isLoading || !!error}
                                    error={touched.clienteId && !!errors.clienteId}
                                    helperText={touched.clienteId && errors.clienteId || error}
                                    value={values.clienteId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    size="small" // Added size small
                                >
                                    {isLoading && <MenuItem value=""><em>Cargando clientes...</em></MenuItem>}
                                    {!isLoading && clientes.length === 0 && !error && <MenuItem value=""><em>No hay clientes disponibles</em></MenuItem>}
                                    {!isLoading && clientes.map((cliente) => (
                                        <MenuItem key={cliente.id} value={cliente.id}>
                                            {cliente.nombre} {cliente.apellido}
                                        </MenuItem>
                                    ))}
                                </Field>
                                {error && <Alert severity="error" sx={{mt:1}}>{error}</Alert>}
                            </Grid>
                                </Box>
                            <Box sx={{display:'flex', flexDirection:'row', width:'100%', 
                                justifyContent:'center',
                                alignItems:'center'}}>


                        <Grid item xs={12} sx={{width:'100%'}}>
                                <Field
                                    as={TextField}
                                    name="descripcion"
                                    label="Descripción"
                                    multiline
                                    rows={2} // Reduced rows
                                    size="small" // Added size small
                                    fullWidth
                                    error={touched.descripcion && !!errors.descripcion}
                                    helperText={touched.descripcion && errors.descripcion}
                                />
                            </Grid>
                            </Box>
                            
                            <Box sx={{display:'flex', flexDirection:'row', width:'100%', 
                                justifyContent:'space-between',
                                alignItems:'center'}}>
                            <Grid item xs={12} sm={6} sx={{width:'30%'}}>
                                <Field
                                    as={TextField}
                                    name="juzgado"
                                    label="Juzgado"
                                    fullWidth
                                    error={touched.juzgado && !!errors.juzgado}
                                    helperText={touched.juzgado && errors.juzgado}
                                    size="small" // Added size small
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{width:'30%'}}>
                                <Field
                                    as={TextField}
                                    name="nroExpendiente"
                                    label="N° Expediente"
                                    fullWidth
                                    error={touched.nroExpendiente && !!errors.nroExpendiente}
                                    helperText={touched.nroExpendiente && errors.nroExpendiente}
                                    size="small" // Added size small
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{width:'30%'}}>
                                <Field
                                    as={TextField}
                                    name="materia"
                                    label="Materia"
                                    fullWidth
                                    error={touched.materia && !!errors.materia}
                                    helperText={touched.materia && errors.materia}
                                    size="small" // Added size small
                                />
                            </Grid>


                            </Box>
                
                <Box sx={{display:'flex', flexDirection:'row', width:'100%', 
                                justifyContent:'flex-end',
                                alignItems:'center', gap:2}}>
                                    <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    name="contraparte"
                                    label="Contraparte"
                                    fullWidth
                                    error={touched.contraparte && !!errors.contraparte}
                                    helperText={touched.contraparte && errors.contraparte}
                                    size="small" // Added size small
                                />
                            </Grid>

                                <Grid item xs={12} sm={6}>
                                <Field
                                as={TextField}
                                name="estado"
                                label="Estado"
                                select
                                fullWidth
                                required
                                value={values.estado}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                size="small" // Added size small
                                >
                                {ESTADO_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                                </Field>
                            </Grid>
                            

                                </Box>
                          
                        <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, width: '100%' }}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary" 
                                    disabled={isSubmitting || loadingClientes}
                                    sx={{textTransform: 'none', borderRadius: '8px', px: 2.5, py: 1, fontWeight: 'medium', fontSize: '0.875rem', backgroundColor:"rgb(43, 40, 61)", minWidth: 150}}
                                >
                                    {isSubmitting ? <CircularProgress size={24} /> : 'Crear Caso'}
                                </Button>
                                <Button 
                                    type="button" // Important: type="button" to prevent form submission
                                    variant="outlined" 
                                    onClick={onCancel} // Call the onCancel prop
                                    disabled={isSubmitting} // Disable if form is submitting
                                    sx={{textTransform: 'none', borderRadius: '8px', px: 2.5, py: 1, fontWeight: 'medium', fontSize: '0.875rem', borderColor: 'grey.400', color: 'text.primary', '&:hover': {borderColor: 'rgb(43, 40, 61)', backgroundColor: 'action.hover'}, minWidth: 150}}
                                >
                                    Cancelar
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default CasoForm;
