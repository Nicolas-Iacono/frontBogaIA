import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
    Chip,
    TablePagination,
    IconButton
} from '@mui/material';
import { format, parseISO } from 'date-fns'; // format and parseISO might not be used if not displaying dates




const ClientsTable = ({ clientes = [] }) => { // Accept clientes as a prop, default to empty array
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    const handleMenuOpen = (event, client) => {
        setAnchorEl(event.currentTarget);
        setSelectedClient(client);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedClient(null);
    };

    const handleEdit = (clientId) => {
        console.log('Edit client:', clientId);
        handleMenuClose();
    };

    const handleDelete = (clientId) => {
        console.log('Delete client:', clientId);
        handleMenuClose();
    };

    const handleViewDetails = (clientId) => {
        console.log('View details for client:', clientId);
        handleMenuClose();
    };

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
                            <TableCell sx={{width: '20%'}}>Email</TableCell>
                            <TableCell sx={{width: '10%'}}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {( (
                            (rowsPerPage > 0 && Array.isArray(clientes))
                                ? clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : (Array.isArray(clientes) ? clientes : []) 
                            )
                        ).map((row, index) => ( 
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
                                <TableCell align="center" sx={{ pr: 1 }}>
                                    <IconButton aria-label="actions" onClick={(event) => handleMenuOpen(event, row)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[6, 10, 25, { label: 'All', value: -1 }]}
                component="div" // Ensure it's a div, not a colSpan if outside Table
                count={Array.isArray(clientes) ? clientes.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                    inputProps: {
                        'aria-label': 'rows per page',
                    },
                    native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ borderTop: '1px solid #e0e0e0' }}
            />
            {selectedClient && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        style: {
                            maxHeight: 48 * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    <MenuItem onClick={() => handleEdit(selectedClient.id)}>
                        <EditIcon sx={{ mr: 1 }} /> Editar
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(selectedClient.id)} sx={{ color: 'error.main' }}>
                        <DeleteIcon sx={{ mr: 1 }} /> Eliminar
                    </MenuItem>
                    <MenuItem onClick={() => handleViewDetails(selectedClient.id)}>
                        <VisibilityIcon sx={{ mr: 1 }} /> Ver Detalles
                    </MenuItem>
                </Menu>
            )}
         
        </Paper>
    );
};

export default ClientsTable;
