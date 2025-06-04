import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Chip, Box, TablePagination, TextField, Button } from '@mui/material'; // Added Button
import RefreshIcon from '@mui/icons-material/Refresh'; // Added RefreshIcon // Added TextField // Added TablePagination // Added Chip and Box
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CasosTable = ({ casos = [], onView, onEdit, onDelete, onRefresh }) => { // Added onRefresh prop // Added default for casos
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when search term changes
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));

    setPage(0);
  };

  const filteredCasos = casos.filter((caso) => {
    const term = searchTerm.toLowerCase();
    return (
      caso.titulo?.toLowerCase().includes(term) ||
      caso.estado?.toLowerCase().includes(term) ||
      (caso.cliente.nombre + " " + caso.cliente.apellido || caso.clienteId)?.toString().toLowerCase().includes(term) ||
      caso.materia?.toLowerCase().includes(term) ||
      caso.juzgado?.toLowerCase().includes(term) ||
      caso.nroExpendiente?.toString().toLowerCase().includes(term)
    );
  });

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCasos.length) : 0;


  const getStatusChip = (estado) => {
    let chipColor = 'default';
    let chipVariant = 'filled'; // or 'outlined'
    let chipSx = {};

    switch (estado?.toLowerCase()) {
      case 'abierto':
        chipColor = 'info';
        chipSx = { backgroundColor: '#e3f2fd', color: '#0d47a1', fontWeight: 500 }; // Light blue
        break;
      case 'en proceso':
      case 'en progreso':
        chipColor = 'warning';
        chipSx = { backgroundColor: '#fff8e1', color: '#e65100', fontWeight: 500 }; // Light orange/yellow
        break;
      case 'cerrado':
        chipColor = 'success';
        chipSx = { backgroundColor: '#e8f5e9', color: '#1b5e20', fontWeight: 500 }; // Light green
        break;
      case 'urgente':
        chipColor = 'error';
        chipSx = { backgroundColor: '#ffebee', color: '#b71c1c', fontWeight: 500 }; // Light red
        break;
      default:
        chipSx = { backgroundColor: '#f5f5f5', color: '#424242', fontWeight: 500 }; // Default grey
        break;
    }
    return <Chip label={estado} size="small" sx={chipSx} />;
  };

  return (
    <Box>
      <Box sx={{
        padding: "0 10px",
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        flexWrap: 'nowrap', // Prevent wrapping
        width: { xs: '100%', sm: 'auto' }, // Responsive width
        backgroundColor: 'rgb(39, 33, 70)',
        borderRadius: '30px',
        height: '50px',
        marginLeft: 'auto', // Align to the right
        my: 2 // Add vertical margin
      }}>
        <TextField
          label="Buscar caso..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: { xs: 'calc(100% - 48px)', sm: '300px' }, 
            mb: { xs: 1, sm: 0 }, 
            mr: 1, 
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: 'rgba(255,255,255,0.1)', 
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
            '& .MuiOutlinedInput-input': {
              color: 'white',
            }
          }}
          InputLabelProps={{ shrink: true }} 
        />
        <Tooltip title="Refrescar casos">
          <IconButton onClick={onRefresh} sx={{ color: 'white' }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 600, textTransform: 'uppercase', color: 'text.secondary', backgroundColor: '#f9fafb', borderBottom: '1px solid #e0e0e0' } }}>
            <TableCell sx={{ padding: '12px 16px' }}>Título</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>Estado</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>Cliente</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>Materia</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>Juzgado</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>N° Expediente</TableCell>
            <TableCell sx={{ padding: '12px 16px', textAlign: 'center' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? filteredCasos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : filteredCasos
          ).map((caso) => (
            <TableRow key={caso.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& td': { padding: '12px 16px', verticalAlign: 'middle' } }}>
              <TableCell sx={{ fontWeight: 500 }}>{caso.titulo}</TableCell>
              <TableCell>{getStatusChip(caso.estado)}</TableCell>
              <TableCell>{caso.cliente.nombre + " " + caso.cliente.apellido|| caso.clienteId}</TableCell>
              <TableCell>{caso.materia}</TableCell>
              <TableCell>{caso.juzgado}</TableCell>
              <TableCell>{caso.nroExpendiente}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                <Tooltip title="Ver Detalle">
                  <IconButton color="primary" onClick={() => onView(caso)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton color="secondary" onClick={() => onEdit(caso)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton color="error" onClick={() => onDelete(caso)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: (53 + 12*2) * emptyRows }}> {/* Adjust height based on your cell padding + content height estimate */}
              <TableCell colSpan={7} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
  rowsPerPageOptions={[4, 16, 24, { label: 'Todos', value: -1 }]}
  colSpan={7}
  count={filteredCasos.length}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  labelRowsPerPage="Filas por página:"
/>
      </TableContainer>
    </Box>
  );
};

export default CasosTable;
