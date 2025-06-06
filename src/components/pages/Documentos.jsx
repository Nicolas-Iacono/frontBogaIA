import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, IconButton, Fab, Modal, TextField, Button, CircularProgress } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../../components/context/AuthContext'; // Adjusted path if AuthContext is in src/
import { getArchivosIaResumen, subirArchivoIa } from '../api/chatIaApi';



const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #ccc',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

function DocumentosPage() {
    const { user } = useAuth(); // User from AuthContext is the username string
    const [documentos, setDocumentos] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [openNameModal, setOpenNameModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null);

    // Placeholder for fetching documents - to be replaced with API call
    const fetchDocuments = async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            console.log('[DocumentosPage] Fetching documents for user:', user);
            const fetchedDocsFromApi = await getArchivosIaResumen(user.username);
            console.log('[DocumentosPage] Fetched documents:', fetchedDocsFromApi);
            const formattedDocs = fetchedDocsFromApi.map(doc => {
                let tipo = 'file'; // Default type
                if (doc.archivoUrl) {
                    const urlParts = doc.archivoUrl.split('.');
                    if (urlParts.length > 1) {
                        const extension = urlParts.pop().toLowerCase();
                        // You might want to map common extensions to more friendly types or icons
                        tipo = extension;
                    }
                }
                return {
                    id: doc.id,       // Assuming API provides 'id'
                    nombre: doc.titulo, // Assuming API provides 'titulo' as the name
                    tipo: tipo,
                    archivoUrl: doc.archivoUrl // Keep original URL if needed for opening/downloading
                };
            });
            setDocumentos(formattedDocs);
        } catch (err) {
            console.error("Error fetching documents:", err);
            setError(err.message || 'Error al cargar documentos.');
            setDocumentos([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [user]);

    const handleUploadBoxClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setDocumentName(file.name.substring(0, file.name.lastIndexOf('.')) || file.name); // Pre-fill without extension
            setOpenNameModal(true);
            event.target.value = null; // Reset file input
        }
    };

    const handleModalClose = () => {
        setOpenNameModal(false);
        setSelectedFile(null);
        setDocumentName('');
    };

    const handleUploadConfirm = async () => {
        if (!selectedFile || !documentName.trim() || !user?.username) {
            alert('Por favor, selecciona un archivo, ingresa un nombre y asegúrate de estar logueado.');
            return;
        }
        setIsUploading(true);
        
        const formData = new FormData();
        formData.append('archivo', selectedFile);
        formData.append('titulo', documentName.trim()); 
        formData.append('username', user.username);

        console.log('Attempting to upload:', selectedFile.name, 'as', documentName.trim(), 'for user', user.username);
        try {
          const uploadedDoc = await subirArchivoIa(formData); 
          console.log('Document uploaded successfully:', uploadedDoc);
          fetchDocuments(); // Refresh the list to show the new document
          handleModalClose();
        } catch (uploadError) {
          console.error("Error uploading document:", uploadError);
          // The error from subirArchivoIa might already be an object/string with a message
          const errorMessage = uploadError?.message || uploadError?.error || (typeof uploadError === 'string' ? uploadError : 'Error desconocido al subir el documento.');
          alert(`Error al subir el documento: ${errorMessage}`);
        } finally {
          setIsUploading(false);
        }
    };


    return (
        <Box sx={{ p: 3, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}> {/* Adjust 64px if AppBar/Sidebar height differs */}
            <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
                Mis Documentos
            </Typography>

            {/* Document Display Area */} 
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 3, pr: 1 /* For scrollbar */ }}>
                {isLoading && <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}><CircularProgress /></Box>}
                {error && <Typography color="error" align="center" sx={{mt: 5}}>Error cargando documentos: {error.message}</Typography>}
                {!isLoading && !error && documentos.length > 0 && (
                    <Grid container spacing={3}>
                        {documentos.map((doc) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 130,
                                        width: 130,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        userSelect: 'none', // Prevents text selection on click
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                    onClick={() => {
                                        if (doc.archivoUrl) {
                                            window.open(doc.archivoUrl, '_blank', 'noopener,noreferrer');
                                        } else {
                                            console.warn('No archivoUrl found for document:', doc.nombre);
                                            alert('No se pudo encontrar la URL del documento.');
                                        }
                                    }}
                                >
                                    <DescriptionIcon sx={{ fontSize: 50, color: 'primary.light', mb: 1 }} />
                                    <Typography variant="subtitle2" component="div" align="center" sx={{ wordBreak: 'break-word', lineHeight: 1.3, maxHeight: '3.9em', overflow: 'hidden' }}>
                                        {doc.nombre}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{mt: 0.5}}>
                                        {doc.tipo?.toUpperCase() || 'FILE'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
                 {!isLoading && !error && documentos.length === 0 && (
                    <Typography variant="subtitle1" align="center" sx={{mt: 5, color: 'text.secondary'}}>
                        No tienes documentos subidos aún. ¡Comienza subiendo uno!
                    </Typography>
                )}
            </Box>

            {/* Upload Area */} 
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
                    mt: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor: 'grey.400',
                    borderRadius: 2,
                    cursor: 'pointer',
                    minHeight: { xs: 120, sm: 150 },
                    backgroundColor: 'grey.50',
                    transition: 'background-color 0.3s, border-color 0.3s',
                    '&:hover': {
                        backgroundColor: 'grey.100',
                        borderColor: 'primary.main',
                    },
                }}
                onClick={handleUploadBoxClick}
            >
                <CloudUploadIcon sx={{ fontSize: {xs: 40, sm: 50}, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="text.primary" textAlign="center">
                    Haz clic o arrastra archivos aquí para subir
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    (Max. 50MB por archivo)
                </Typography>
            </Paper>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                // accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg,.xls,.xlsx,.ppt,.pptx" // Example accept types
            />

            {/* Document Name Modal */} 
            <Modal
                open={openNameModal}
                onClose={handleModalClose}
                aria-labelledby="document-name-modal-title"
            >
                <Box sx={modalStyle}>
                    <Typography id="document-name-modal-title" variant="h6" component="h2">
                        Nombrar Documento
                    </Typography>
                    <TextField
                        fullWidth
                        label="Nombre del Documento"
                        variant="outlined"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        disabled={isUploading}
                        autoFocus
                    />
                    {selectedFile && <Typography variant="caption">Archivo original: {selectedFile.name} ({ (selectedFile.size / 1024 / 1024).toFixed(2) } MB)</Typography>}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button onClick={handleModalClose} disabled={isUploading} color="inherit">
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleUploadConfirm}
                            disabled={isUploading || !documentName.trim() || !selectedFile}
                            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isUploading ? 'Subiendo...' : 'Guardar y Subir'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default DocumentosPage;
