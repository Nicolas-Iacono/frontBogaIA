import React from 'react';
import {
    Card, CardContent, Typography, CardActions, Button, Box, Chip,
    Table, TableBody, TableCell, TableContainer, TableRow, Paper, IconButton, Tooltip // Added IconButton and Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ClientCard = ({ client, onEdit, onDelete }) => {
    // Assuming client.casos is an array of case objects with a 'titulo' property
    // Or adjust as per your actual data structure
    const displayCaseInfo = () => {
        if (client.casos && client.casos.length > 0) {
            if (client.casos.length === 1) {
                return client.casos[0].titulo || "Caso sin título";
            }
            return `${client.casos.length} casos asociados`;
        }
        return 'Sin casos asociados';
    };

    return (
    <Card sx={{ minWidth: '20rem',maxWidth: '50%', mb: 2, boxShadow: 3, borderRadius: 2,display:'flex'}}>
            <CardContent sx={{ flexGrow: 1 }}> {/* Allow content to grow if card is flex */}
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none', backgroundColor: 'transparent' }}>
                    <Table size="small" aria-label="client details table">
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', borderBottom: 'none', padding: '4px 8px', width: '30%' }}>
                                    Cliente:
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', padding: '4px 8px' }}>
                                    {client.nombre} {client.apellido}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', borderBottom: 'none', padding: '4px 8px' }}>
                                    Caso(s):
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', padding: '4px 8px' }}>
                                    <Chip label={displayCaseInfo()} size="small" />
                                </TableCell>
                            </TableRow>
                           
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', borderBottom: 'none', padding: '4px 8px' }}>Email:</TableCell>
                                <TableCell sx={{ borderBottom: 'none', padding: '4px 8px' }}>{client.email || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', borderBottom: 'none', padding: '4px 8px' }}>Telefono:</TableCell>
                                <TableCell sx={{ borderBottom: 'none', padding: '4px 8px' }}>{client.telefono || 'N/A'}</TableCell>
                            </TableRow>
                        
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            <CardActions sx={{ display: 'flex',flexDirection:'column', justifyContent: 'space-around', alignItems: 'end', borderTop: '1px solid #eee', backgroundColor:"white"}}>
                <Tooltip title="Editar">
                    <IconButton
                        onClick={() => onEdit(client.id)}
                        aria-label="editar cliente"
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                    <IconButton
                        
                        onClick={() => onDelete(client.id)}
                        aria-label="eliminar cliente"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default ClientCard;
