import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    Chip
} from '@mui/material';
import { format, parseISO } from 'date-fns'; // format and parseISO might not be used if not displaying dates




const ClientsTable = ({ clientes = [] }) => { // Accept clientes as a prop, default to empty array
    // console.log(clientes) // You can keep this for debugging if needed
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: '12px', backgroundColor: 'white' }}>
            <TableContainer>
                <Table aria-label="cases table" size="medium">
                    <TableHead>
                        <TableRow sx={{ '& .MuiTableCell-head': { backgroundColor: 'grey.50', color: 'text.secondary', fontWeight: '600', borderBottom: '1px solid #e0e0e0', py: 1.5, fontSize: '0.875rem' } }}>
                            <TableCell sx={{pl: 2.5, width: '30%'}}>Nombre</TableCell>
                            <TableCell sx={{width: '30%'}}>DNI</TableCell>
                            <TableCell sx={{width: '20%'}}>Telefono</TableCell>
                            <TableCell sx={{pr: 2.5, width: '20%'}}>Email</TableCell>
                            <TableCell sx={{pr: 2.5, width: '20%'}}>n° Casos</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(clientes) && 
                         clientes.slice(-4) // Get the last 4 clients
                         .map((row) => ( 
                            <TableRow
                                key={row.id}
                                sx={{ 
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { backgroundColor: 'action.hover' },
                                    '& .MuiTableCell-root': { py: 1.5 } // Adjust vertical padding for rows
                                }}
                            >

                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.nombre + ' ' + row.apellido}</TableCell>
                                <TableCell sx={{ color: 'text.secondary', pr: 2.5, fontSize: '0.875rem' }}>{row.dni}</TableCell>
                                <TableCell sx={{ color: 'text.secondary', pr: 2.5, fontSize: '0.875rem' }}>{row.telefono}</TableCell>
                                <TableCell sx={{ color: 'text.secondary', pr: 2.5, fontSize: '0.875rem' }}>{row.email}</TableCell>
                                <TableCell sx={{ color: 'text.secondary', pr: 2.5, fontSize: '0.875rem' }}>{row.casos.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: 2, gap: 1.5, borderTop: '1px solid #e0e0e0', backgroundColor: 'grey.50' }}>
                <Button variant="contained" color="primary" sx={{textTransform: 'none', borderRadius: '8px', px: 2.5, py: 1, fontWeight: 'medium', fontSize: '0.875rem'}}>
                    Create New Client
                </Button>
                <Button variant="outlined" sx={{textTransform: 'none', borderRadius: '8px', px: 2.5, py: 1, borderColor: 'grey.400', color: 'text.primary', fontWeight: 'medium', fontSize: '0.875rem', '&:hover': {borderColor: 'primary.main', backgroundColor: 'action.hover'} }}>
                    View All Clients
                </Button>
            </Box>
        </Paper>
    );
};

export default ClientsTable;
