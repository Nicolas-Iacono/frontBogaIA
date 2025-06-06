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
import { useEffect, useState } from 'react';
import { getCasosLista } from '../api/casoApi'; // Import getCasos
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';


const getStatusChip = (estado) => {
    let chipProps = {
        label: estado,
        size: "small",
        sx: { fontWeight: 'medium', borderRadius: '6px' }
    };

    switch (estado) {
        case 'Abierto':
        case 'Abierto (Nuevo)':
            chipProps.sx = { ...chipProps.sx, backgroundColor: 'success.light', color: 'success.dark', border: '1px solid', borderColor: 'success.main' };
            break;
        case 'En Proceso':
            chipProps.sx = { ...chipProps.sx, backgroundColor: 'warning.light', color: 'warning.dark', border: '1px solid', borderColor: 'warning.main' };
            break;
        case 'En Espera':
            chipProps.sx = { ...chipProps.sx, backgroundColor: 'info.light', color: 'info.dark', border: '1px solid', borderColor: 'info.main' };
            break;
        case 'Suspendido':
            chipProps.sx = { ...chipProps.sx, backgroundColor: 'grey.300', color: 'text.primary', border: '1px solid', borderColor: 'grey.500' };
            break;
        case 'Cerrado':
            chipProps.sx = { ...chipProps.sx, backgroundColor: 'grey.200', color: 'text.secondary', border: '1px solid', borderColor: 'grey.400' };
            break;
        default:
            chipProps.sx = { ...chipProps.sx, backgroundColor: 'grey.100', color: 'text.primary', border: '1px solid', borderColor: 'grey.300' };
    }
    return <Chip {...chipProps} />;
};

const CasesTable = ({ onAddNewCaseClick, onViewAllCasesClick }) => { // Accept onAddNewCaseClick as a prop
    const { user } = useAuth(); // user is an object e.g., { username: "luciaTrofa" }
    const [casos, setCasos] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
const [totalPages, setTotalPages] = useState(0);
    const navigateTo = useNavigate();

    
    useEffect(() => {
        const traerInformacion = async () => {
            if (user && user.username) {
                try {
                    console.log(`CasesTable: Fetching casos for ${user.username}`);
                    const data = await getCasosLista(user.username, page, size); 
                    setCasos(data.content);
                    setTotalPages(data.totalPages);
                } catch (error) {
                    console.error("Error al traer la información:", error);
                }
            }
        };
    
        traerInformacion();
    }, [user, page, size]); // Depend on the user object from context
    console.log(casos)
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: '12px', backgroundColor: 'white' }}>
            <TableContainer>
                <Table aria-label="cases table" size="medium">
                    <TableHead>
                        <TableRow sx={{ '& .MuiTableCell-head': { backgroundColor: 'grey.50', color: 'text.secondary', fontWeight: '600', borderBottom: '1px solid #e0e0e0', py: 1.5, fontSize: '0.875rem' } }}>
                            <TableCell sx={{pl: 2.5, width: '30%'}}>Case Title</TableCell>
                            <TableCell sx={{width: '30%'}}>Client</TableCell>
                            <TableCell sx={{width: '20%'}}>Status</TableCell>
                            <TableCell sx={{pr: 2.5, width: '20%'}}>Created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(casos) && casos.slice(-5).map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ 
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { backgroundColor: 'action.hover' },
                                    '& .MuiTableCell-root': { py: 1.5 } // Adjust vertical padding for rows
                                }}
                            >
                                <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', color: 'text.primary', pl: 2.5, fontSize: '0.875rem' }}>
                                    {row.titulo}
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.nombreCliente + ' ' + row.apellidoCliente}</TableCell>
                                <TableCell>{getStatusChip(row.estado)}</TableCell>
                                <TableCell sx={{ color: 'text.secondary', pr: 2.5, fontSize: '0.875rem' }}>{row.fechaCreacion ? format(parseISO(row.fechaCreacion), 'yyyy-MM-dd') : ''}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: 2, gap: 1.5, borderTop: '1px solid #e0e0e0', backgroundColor: 'grey.50' }}>
                <Button 
                onClick={onAddNewCaseClick} // Call the passed-in handler
                variant="contained" color="primary" sx={{textTransform: 'none', borderRadius: '8px', px: 2.5, py: 1, fontWeight: 'medium', fontSize: '0.875rem', backgroundColor:"rgb(43, 40, 61)"}}>
                    Create New Case
                </Button>
                <Button variant="outlined" 
                onClick={() => navigateTo('/casos')}
                sx={{textTransform: 'none', borderRadius: '8px', px: 2.5, py: 1, borderColor: 'grey.400', color: 'text.primary', fontWeight: 'medium', fontSize: '0.875rem', '&:hover': {borderColor: 'primary.main', backgroundColor: 'action.hover'} }}>
                    View All Cases
                </Button>
            </Box>
        </Paper>
    );
};

export default CasesTable;
