import React, { useState, useRef, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Chip, Box, TablePagination, TextField, Button, InputAdornment, Collapse } from '@mui/material'; // Added Button
import RefreshIcon from '@mui/icons-material/Refresh'; // Added RefreshIcon // Added TextField // Added TablePagination // Added Chip and Box
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search'; // Import SearchIcon
import ArrowIcon from '@mui/icons-material/ArrowForward';
import { getCasosLista } from '../api/casoApi';
import { useAuth } from '../context/AuthContext';
import debounce from 'lodash/debounce';
import { CircularProgress } from '@mui/material';

const CasosTable = ({ onView, onEdit, onDelete, onRefresh }) => { // Added onRefresh prop // Added default for casos
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);
  const { user } = useAuth(); // 👈 esto te da el username
  const [totalCasos, setTotalCasos] = useState(0);
  const [casos, setCasos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (user?.username) {
    setLoading(true); 
    getCasosLista(user.username, page, rowsPerPage, searchTerm)
      .then((data) => {
        setCasos(data.content);
        setTotalCasos(data.totalElements);
      })
      .finally(() => {
        setLoading(false); 
      });
  }
}, [user, page, rowsPerPage, searchTerm]);



  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setInputValue(value); 
    debouncedSearch(value);
  };

  const debouncedSearch = React.useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(0);
    }, 400), 
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));

    setPage(0);
  };
console.log(casos)
  const filteredCasos = casos.filter((caso) => {
    const term = searchTerm.toLowerCase();
    return (
      caso.titulo?.toLowerCase().includes(term) ||
      caso.estado?.toLowerCase().includes(term) ||
      (caso.nombreCliente + " " + caso.apellidoCliente || caso.clienteId)?.toString().toLowerCase().includes(term) ||
      caso.materia?.toLowerCase().includes(term) ||
      caso.juzgado?.toLowerCase().includes(term) ||
      caso.nroDeExpediente
      ?.toString().toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    console.log('Filtered Casos in CasosTable:', JSON.stringify(filteredCasos, null, 2));
  }, [filteredCasos]); // Log when filteredCasos changes

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
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgb(39, 33, 70)',
          borderRadius: '30px',
          height: '50px',
          marginLeft: 'auto',
          my: 2,
          cursor: searchExpanded ? 'default' : 'pointer',
          transition: 'width 0.3s ease-in-out, padding-left 0.3s ease-in-out, padding-right 0.3s ease-in-out',
          overflow: 'hidden',
          width: searchExpanded ? { xs: '100%', sm: '350px' } : '50px', // Expanded width includes padding
          paddingLeft: searchExpanded ? '10px' : '0px',
          paddingRight: searchExpanded ? '15px' : '0px',
          transition: 'width 0.3s ease-in-out, padding-left 0.3s ease-in-out, padding-right 0.3s ease-in-out',
          marginRight: '40px',
          justifyContent: searchExpanded ? 'flex-start' : 'center',
        }}
        onClick={!searchExpanded ? () => setSearchExpanded(true) : undefined}
      >
        {!searchExpanded && (
          <IconButton sx={{ color: 'white', padding: '12px' }} onClick={() => setSearchExpanded(true)} aria-label="expand search">
            <SearchIcon />
          </IconButton>
        )}
        <Collapse in={searchExpanded} timeout="auto" orientation="horizontal" unmountOnExit sx={{
          display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"
        }}>
          <TextField
            inputRef={searchInputRef}
            placeholder="Buscar caso..."
            variant="outlined"
            size="small"
            value={inputValue}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()} // Prevent Box onClick when TextField is clicked
            sx={{
              width: '100%', // TextField takes full width of its Collapse container
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor: 'rgba(255,255,255,0.05)', // Slightly more subtle background
                height: '36px', // Adjusted height to better fit 50px outer box
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)', // Softer border
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
                '& .MuiInputAdornment-root .MuiSvgIcon-root': { // Style icon within adornment
                    color: 'rgba(255, 255, 255, 0.7)',
                }
              },
              '& .MuiInputBase-input': { // Style the input text itself
                color: 'white',
                fontSize: '0.9rem',
                padding: '8px 14px 8px 0px', // Adjust padding with startAdornment
              },
              // Hide label as we use placeholder
              '& .MuiInputLabel-root': {
                display: 'none',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: '2px' }}>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
           
        </Collapse>
        
        {searchExpanded && (
            <IconButton sx={{ color: 'white', padding: '12px' }} onClick={() => setSearchExpanded(false)} aria-label="expand search">
            <ArrowIcon />
            </IconButton>
        )}
       {loading && (
          <CircularProgress size={24} color="inherit" sx={{ color: 'white' }}/>
        )}
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 600, textTransform: 'uppercase', color: 'text.secondary', backgroundColor: '#f9fafb', borderBottom: '1px solid #e0e0e0' } }}>
            <TableCell sx={{ padding: '12px 16px' }}>Caratula</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>Estado</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>Cliente</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>Materia</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>Juzgado</TableCell>
            <TableCell sx={{ padding: '12px 16px' }}>Expediente</TableCell>
            <TableCell sx={{ padding: '12px 16px', textAlign: 'center' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
             {casos.map((caso) => (
              <TableRow key={caso.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& td': { padding: '12px 16px', verticalAlign: 'middle' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{caso.titulo}</TableCell>
                <TableCell>{getStatusChip(caso.estado)}</TableCell>
                <TableCell>{caso.nombreCliente + " " + caso.apellidoCliente}</TableCell>
                <TableCell>{caso.materia}</TableCell>
                <TableCell>{caso.juzgado}</TableCell>
                <TableCell>{caso.nroDeExpediente
                }</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  <Tooltip title="Ver Detalle">
                    <IconButton color="gray" onClick={() => onView(caso)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton color="gray" onClick={() => onEdit(caso)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="gray" onClick={() => onDelete(caso)}>
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
  rowsPerPageOptions={[4, 8, 16, { label: 'Todos', value: -1 }]}
  colSpan={7}
  count={totalCasos} // 🔁 ya no usás `filteredCasos.length`
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
