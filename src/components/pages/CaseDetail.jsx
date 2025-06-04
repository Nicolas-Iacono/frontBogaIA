import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pagination, Skeleton } from '@mui/material';
import {
    Box, Typography, CircularProgress, Alert, Paper, Button, Grid, Card, CardContent,
    List, ListItem, ListItemText, ListItemIcon, Divider, Avatar, Chip, IconButton, TextField, Snackbar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
    Print as PrintIcon,
    Edit as EditIcon,
    Description as DescriptionIcon,
    Update as UpdateIcon,
    CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { casoApi } from '../api/casoApi'; // Assuming this is your configured axios instance
import { AuthContext } from '../context/AuthContext'; // For user info if needed for edit/print permissions
import { actualizacionApi } from '../api/actualizacionApi';
import { documentoApi } from '../api/documentoApi'; // Assuming this is your configured axios instance for documents
const CaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useContext(AuthContext);
    const [caso, setCaso] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUpdateTitle, setNewUpdateTitle] = useState('');
    const [newUpdateContent, setNewUpdateContent] = useState('');
    const [isSavingUpdate, setIsSavingUpdate] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [updatesPage, setUpdatesPage] = useState(1);
    const updatesRowsPerPage = 4;

    // State for document upload
    const [newDocumentTitle, setNewDocumentTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const [documentUploadError, setDocumentUploadError] = useState(null);



    const fetchCaso = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await casoApi.get(`/caso/${id}`);
            setCaso(response.data);
        } catch (err) {
            console.error("Error fetching case details:", err);
            setError(err?.response?.data?.message || err?.message || 'Error al cargar el caso.');
            setCaso(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCaso();
    }, [id]);
console.log(caso)
    const getStatusChip = (status) => {
        let color;
        switch (status?.toLowerCase()) {
            case 'abierto':
                color = 'info'; // Light blue
                break;
            case 'cerrado':
                color = 'success'; // Light green
                break;
            case 'urgente':
                color = 'error'; // Light red
                break;
            case 'en progreso':
                color = 'warning'; // Orange
                break;
            default:
                color = 'default';
        }
        return <Chip label={status || 'N/A'} color={color} size="small" sx={{ textTransform: 'capitalize' }} />;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('es-AR', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch (e) {
            return dateString; // fallback to original string if parsing fails
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'grey.100', minHeight: 'calc(100vh - 64px)' }}>
                <Grid container spacing={2} sx={{ mb: 2 , display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                   
                    <Grid item>
                        <Skeleton variant="rectangular" width={80} height={36} />
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rectangular" width={80} height={36} />
                    </Grid>
                </Grid>

             
                    {/* Client Info Skeleton */}
                    <Grid item xs={12} md={4} sx={{width:"100%",display:"flex",justifyContent:"center",flexDirection:"column"}}>
                       <Box sx={{width:"100%",display:"flex",justifyContent:"center",flexDirection:"row-reverse",width:"100%",justifyContent:"flex-end",gap:"1rem"}}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, width:"20%"}}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 , flexDirection:"column"}}>
                                <Skeleton variant="circular" width={100} height={100} sx={{ mr: 2 }} />
                                <Box>
                                    <Skeleton variant="text" width={150} height={30} />
                                    <Skeleton variant="text" width={100} height={20} />
                                </Box>
                            </Box>
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="90%" />
                            <Skeleton variant="text" width="70%" />
                        </Paper>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, width:"60%"}}>
                            <Skeleton variant="text" width="60%" height={40} />
                            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
                            <Skeleton variant="text" width={120} height={30} sx={{ mb: 1 }} /> {/* Status Chip */}
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="70%" />
                            <Skeleton variant="text" width="90%" />
                        </Paper>
                       </Box> 
                    </Grid>
                    <Grid>
                    <Grid container spacing={3} sx={{display:"flex", 
                flexDirection :"column",
                gap:"1rem",
                width:"80%",
                justifyContent:"center",
                marginTop:"2rem"
                }}>
                    {/* Case Details Skeleton */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Skeleton variant="text" width="60%" height={40} />
                            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
                            <Skeleton variant="text" width={120} height={30} sx={{ mb: 1 }} /> {/* Status Chip */}
                            <Skeleton variant="text" width="70%" />
                            <Skeleton variant="text" width="90%" />
                        </Paper>
                    </Grid>
               
                    {/* Updates Section Skeleton */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 ,display:"flex",flexDirection:"column",gap:"1rem"}}>
                            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} /> {/* Nueva Actualizacion Title */}
                            <Skeleton variant="rectangular" width="100%" height={80} sx={{ mb: 1 }} /> {/* Content input */}
                            <Skeleton variant="rectangular" width={180} height={36} sx={{ mb: 2 }} /> {/* Save button */}
                            <Divider sx={{mb:2}} />
                            <Skeleton variant="text" width={250} height={30} sx={{ mb: 2 }} /> {/* Historial Title */}
                            {[1, 2].map(i => (
                                <React.Fragment key={i}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1}}>
                                       <Skeleton variant="circular" width={24} height={24} sx={{mr:1, mt:0.5}} />
                                       <Box sx={{width: '100%'}}>
                                            <Skeleton variant="text" width="40%" />
                                            <Skeleton variant="text" width="80%" />
                                            <Skeleton variant="text" width="30%" />
                                       </Box>
                                    </Box>
                                    {i < 2 && <Divider variant="inset" component="li" sx={{ml: '40px'}}/>}
                                </React.Fragment>
                            ))}
                        </Paper>
                    </Grid>

                    {/* Documents Section Skeleton */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                             <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} /> {/* Agregar Documento Title */}
                             <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 1 }} /> {/* Title input */}
                             <Skeleton variant="rectangular" width="100%" height={36} sx={{ mb: 1 }} /> {/* Select file button */}
                             <Skeleton variant="rectangular" width={180} height={36} sx={{ mb: 2 }} /> {/* Save button */}
                             <Divider sx={{my:3}}/>
                             <Skeleton variant="text" width={250} height={30} sx={{ mb: 2 }} /> {/* Documentos Existentes Title */}
                             {[1, 2].map(i => (
                                <React.Fragment key={i}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb:1}}>
                                       <Skeleton variant="circular" width={24} height={24} sx={{mr:1}} />
                                       <Skeleton variant="text" width="60%" />
                                    </Box>
                                   {i < 2 && <Divider variant="inset" component="li" sx={{ml: '40px'}}/>}
                                </React.Fragment>
                            ))}
                        </Paper>
                    </Grid>

                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button variant="outlined" onClick={() => navigate(-1)}>Volver</Button>
            </Box>
        );
    }

    if (!caso) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>No se encontró información del caso.</Alert>
                <Button variant="outlined" onClick={() => navigate(-1)}>Volver</Button>
            </Box>
        );
    }

    const handleSaveUpdate = async (idCaso) => {
        if (!newUpdateContent.trim()) {
            setUpdateError('El contenido de la actualización no puede estar vacío.');
            return;
        }
        setIsSavingUpdate(true);
        setUpdateError(null);
        try {
            const response = await actualizacionApi.post(`/actualizaciones`, { 
                titulo: newUpdateTitle.trim() || `Actualización ${new Date().toLocaleDateString()}`,
                contenido: newUpdateContent.trim(),
                casoId: idCaso
            });
            const newUpdate = response.data; // Assuming the backend returns the newly created update

            setNewUpdateTitle('');
            setNewUpdateContent('');
            setSnackbarMessage('Actualización guardada con éxito.');
            setSnackbarOpen(true);
            
            // Update local state to prepend the new update
            setCaso(prevCaso => ({
                ...prevCaso,
                actualizaciones: [newUpdate, ...(prevCaso.actualizaciones || [])]
            }));
            setUpdatesPage(1); // Go to the first page to see the new update

        } catch (err) {
            console.error("Error saving update:", err);
            setUpdateError(err?.response?.data?.message || err?.message || 'Error al guardar la actualización.');
            setSnackbarMessage('Error al guardar la actualización.');
            setSnackbarOpen(true);
        } finally {
            setIsSavingUpdate(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSaveDocument = async () => {
        if (!selectedFile) {
            setDocumentUploadError('Por favor, seleccione un archivo.');
            return;
        }
        setIsUploadingDocument(true);
        setDocumentUploadError(null);

        const formData = new FormData();
        formData.append('archivo', selectedFile);
        formData.append('titulo', newDocumentTitle.trim() || selectedFile.name); // Use filename if title is empty
        formData.append('casoId', caso.id);

        try {
            // Ensure your documentoApi is configured to handle multipart/form-data
            // And the endpoint /documentos expects 'archivo', 'titulo', and 'casoId'
            const response = await documentoApi.post('/documentos/subir', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newDocument = response.data; // Assuming backend returns the new document object

            setCaso(prevCaso => ({
                ...prevCaso,
                documentos: [newDocument, ...(prevCaso.documentos || [])]
            }));

            setNewDocumentTitle('');
            setSelectedFile(null);
            setSnackbarMessage('Documento guardado con éxito.');
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Error saving document:", err);
            setDocumentUploadError(err?.response?.data?.message || err?.message || 'Error al guardar el documento.');
            setSnackbarMessage('Error al guardar el documento.');
            setSnackbarOpen(true);
        } finally {
            setIsUploadingDocument(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'grey.100', minHeight: 'calc(100vh - 64px)' }}> {/* Adjust 64px if your AppBar/Sidebar height is different */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)} >
                    Volver
                </Button>
                <Box>
                    <IconButton aria-label="print" onClick={() => window.print()} sx={{ mr: 1 }}>
                        <PrintIcon />
                    </IconButton>
                    <Button variant="contained" startIcon={<EditIcon />} onClick={() => alert('Funcionalidad Editar Caso no implementada.')}>
                        Editar
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3} >
                <Grid item xs={12} md={8} sx={{width:"75%"}}>
                {/* Client Info Card - Left Column */} 
                <Grid item xs={12} md={4} sx={{display:"flex",flexDirection:{md:"row-reverse",xs:"column",
                    justifyContent:"space-between", width:"100%",
                }}}>
                        <Grid item xs={12} md={4} sx={{width:"22%",minWidth:"20%"}}>
                        <Card elevation={2} sx={{ borderRadius: 2, width:"100%" }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Avatar sx={{ width: 80, height: 80, margin: '0 auto 16px', bgcolor: 'primary.main' }}>
                                    {caso.cliente?.nombre?.[0]?.toUpperCase()}{caso.cliente?.apellido?.[0]?.toUpperCase()}
                                </Avatar>
                                <Typography variant="h6" gutterBottom>
                                    {caso.cliente?.nombre || 'N/A'} {caso.cliente?.apellido || ''}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Cliente ID: {caso.cliente?.id || 'N/A'}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon sx={{ minWidth: 32 }}><PhoneIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary={caso.cliente?.telefono || caso.telefonoCliente || 'No disponible'} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon sx={{ minWidth: 32 }}><EmailIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary={caso.cliente?.email || caso.emailCliente || 'No disponible'} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon sx={{ minWidth: 32 }}><BadgeIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary={`DNI: ${caso.cliente?.dni || 'No disponible'}`} />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        </Grid>

                {/* Case Details - Right Column */} 
                        <Grid item xs={12} sx={{ width:"75%", marginBottom:"1rem"}}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3, height:"100%" }}>
                        <Box sx={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",mb:2}}>

                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {caso.titulo}
                        </Typography>
                       
                        <Grid container spacing={2} sx={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"end",mb:2}}>
                        <Grid item xs={12} sm={6}><Typography><b>N° Expediente:</b> {caso.nroExpendiente || 'N/A'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><b>Estado:</b> {getStatusChip(caso.estado)}</Typography></Grid>
                        </Grid>
                        
                        </Box>
                      
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                Fecha de Creación: {formatDate(caso.fechaCreacion)}
                            </Typography>
                        </Box>
                        <Box sx={{display:"flex",flexDirection:"column",justifyContent:"flex-end",alignItems:"flex-start",mb:2, width:"100%",
                            height:"10rem"
                        }}>
                            <Typography><b>Descripción:</b></Typography>
                        <Grid item xs={12}
                        sx={{width:"100%",height:"80%",margin:"auto",border:"1px solid black",borderRadius:"12px",p:2}}
                        ><Typography variant='body2' sx={{color:"black",fontWeight:"medium",lineHeight:"1.5",textAlign:"justify"}}> {caso.descripcion || 'N/A'}</Typography></Grid>
                        </Box>
                        <Grid container spacing={2} sx={{ mb: 2, display:"flex",justifyContent:"space-between",width:"100%",
                            alignItems:"flex-end",p:2
                         }}>
                            
                            <Grid item xs={12} sm={6}><Typography><b>Materia:</b> {caso.materia || 'N/A'}</Typography></Grid>
                            <Grid item xs={12} sm={6}><Typography><b>Juzgado:</b> {caso.juzgado || 'N/A'}</Typography></Grid>
                            <Grid item xs={12} sm={6}><Typography><b>Contraparte:</b> {caso.contraparte || 'N/A'}</Typography></Grid>
                        </Grid>
                    </Paper>
                        </Grid>
                </Grid>
                    {/* Actualizaciones Section */} 
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Nueva Actualización</Typography>
                        <TextField
                            label="Título de la Actualización"
                            fullWidth
                            value={newUpdateTitle}
                            onChange={(e) => setNewUpdateTitle(e.target.value)}
                            margin="normal"
                            size="small"
                        />
                        <TextField
                            label="Detalle lo ocurrido"
                            fullWidth
                            multiline
                            rows={4}
                            value={newUpdateContent}
                            onChange={(e) => setNewUpdateContent(e.target.value)}
                            margin="normal"
                            required
                        />
                        {updateError && <Alert severity="error" sx={{ mt: 1, mb:1 }}>{updateError}</Alert>}
                        <Button 
                            variant="contained" 
                            onClick={() => handleSaveUpdate(caso.id)} 
                            disabled={isSavingUpdate || !newUpdateContent.trim()}
                            sx={{ mt: 1, mb:3 }}
                        >
                            {isSavingUpdate ? <CircularProgress size={24} /> : 'Guardar Actualización'}
                        </Button>
                        
                        <Divider sx={{mb: 2}}/>
                        <Typography variant="h6" gutterBottom>Historial de Actualizaciones</Typography>
                        {caso.actualizaciones && caso.actualizaciones.length > 0 ? (
                            <>
                                <List>
                                    {caso.actualizaciones
                                        .slice((updatesPage - 1) * updatesRowsPerPage, updatesPage * updatesRowsPerPage)
                                        .map((update, index) => (
                                        <React.Fragment key={update.id}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemIcon sx={{mt: 0.5}}><UpdateIcon color="primary"/></ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography variant="subtitle1" sx={{fontWeight: 'medium'}}>{update.titulo}</Typography>}
                                                    secondary={<>
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            {update.contenido}
                                                        </Typography>
                                                        <Typography component="span" variant="caption" display="block" color="text.secondary" sx={{mt: 0.5}}>
                                                            {formatDate(update.fechaCreacion)}
                                                        </Typography>
                                                    </>}
                                                />
                                            </ListItem>
                                            {/* Render divider only if it's not the last item on the current page AND not the last item overall */}
                                            {(index < updatesRowsPerPage - 1 && (updatesPage - 1) * updatesRowsPerPage + index < caso.actualizaciones.length - 1) && 
                                                <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                                <Pagination 
                                    count={Math.ceil(caso.actualizaciones.length / updatesRowsPerPage)}
                                    page={updatesPage}
                                    onChange={(event, value) => setUpdatesPage(value)}
                                    sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                                />
                            </>
                        ) : (
                            <Typography variant="body2" color="text.secondary">No hay actualizaciones registradas.</Typography>
                        )}

                    </Paper>

                    {/* Documentos Section */} 
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>Documentos</Typography>
                        {/* Document Upload Form */}
                        <Box component="form" sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>Agregar Nuevo Documento</Typography>
                            <TextField
                                label="Título del Documento (Opcional)"
                                fullWidth
                                value={newDocumentTitle}
                                onChange={(e) => setNewDocumentTitle(e.target.value)}
                                margin="normal"
                                size="small"
                            />
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                startIcon={<CloudUploadIcon />}
                                sx={{ mt: 1, mb: 1 }}
                            >
                                Seleccionar Archivo
                                <input 
                                    type="file" 
                                    hidden 
                                    onChange={(e) => setSelectedFile(e.target.files[0])} 
                                />
                            </Button>
                            {selectedFile && (
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Archivo seleccionado: {selectedFile.name}
                                </Typography>
                            )}
                            {documentUploadError && <Alert severity="error" sx={{ mt: 1, mb:1 }}>{documentUploadError}</Alert>}
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleSaveDocument} 
                                disabled={!selectedFile || isUploadingDocument}
                                sx={{ mt: 1 }}
                                fullWidth
                            >
                                {isUploadingDocument ? <CircularProgress size={24} /> : 'Guardar Documento'}
                            </Button>
                        </Box>
                        <Divider sx={{my:3}}/>
                        <Typography variant="h6" gutterBottom>Documentos Existentes</Typography>
                        {/* Assuming caso.documentos is an array of objects like { id, nombre, url (optional) } */}
                        {caso.documentos && caso.documentos.length > 0 ? (
                            <List>
                                {caso.documentos.map((doc, index) => (
                                    <React.Fragment key={doc.id || index}>
                                        <ListItem
                                            button 
                                            onClick={() => {
                                                if (doc.url) {
                                                    window.open(doc.url, '_blank', 'noopener,noreferrer');
                                                } else {
                                                    alert('URL del documento no disponible.');
                                                }
                                            }}
                                            secondaryAction={
                                                <IconButton 
                                                    edge="end" 
                                                    aria-label="download" 
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent ListItem onClick from firing
                                                        if (doc.url) {
                                                            const link = document.createElement('a');
                                                            link.href = doc.url;
                                                            link.setAttribute('download', doc.titulo || 'documento'); // Or use doc.nombre if available
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        } else {
                                                            alert('URL de descarga no disponible.');
                                                        }
                                                    }}
                                                    disabled={!doc.url}
                                                >
                                                    <DownloadIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemIcon><DescriptionIcon color={doc.url ? "primary" : "disabled"}/></ListItemIcon>
                                            <ListItemText primary={doc.titulo || `Documento ${index + 1}`} secondary={!doc.url ? "URL no disponible" : null} />
                                        </ListItem>
                                        {index < caso.documentos.length - 1 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">No hay documentos adjuntos.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CaseDetail;

