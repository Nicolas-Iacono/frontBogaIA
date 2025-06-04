import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'; // Changed from StaticDatePicker
import { Paper } from '@mui/material';
import { es } from 'date-fns/locale'; // For Spanish locale

const MiniCalendar = () => {
    const [date, setDate] = useState(new Date());

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '12px', 
                overflow: 'hidden',
                backgroundColor: 'white',
                width: '100%',
                maxWidth: 340, // Adjusted for a more compact look
                margin: '0 auto',
                p: 0.5 // Small padding around the calendar itself
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DateCalendar // Changed from StaticDatePicker
                    value={date}
                    onChange={(newDate) => {
                        setDate(newDate);
                    }}
                    sx={{
                        minWidth: 'auto',
                        backgroundColor: 'transparent',
                        '& .MuiCalendarPicker-root': { // This targets the main calendar container
                            width: '100%',
                            maxHeight: 320, 
                        },
                        '& .MuiPickersCalendarHeader-labelContainer': {
                            fontSize: '1rem',
                            fontWeight: 'medium',
                        },
                        '& .MuiPickersCalendarHeader-switchViewButton': {
                            display: 'none', 
                        },
                        '& .MuiDayPicker-weekDayLabel': { 
                            fontSize: '0.75rem',
                            fontWeight: 'medium',
                            color: 'text.secondary'
                        },
                        '& .MuiPickersDay-root': { // Consolidated styling for individual day cells
                            width: '36px',    // Control day size
                            height: '36px',   // Control day size
                            margin: '1px',    // Margin around day cells
                            fontSize: '0.8rem', // Font size for day numbers
                        },
                        '& .MuiPickersDay-today': { 
                            borderColor: 'primary.main',
                            border: '1px solid',
                        },
                        '& .Mui-selected': { 
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                            '&:focus': {
                                backgroundColor: 'primary.main',
                            }
                        }
                    }}
                />
            </LocalizationProvider>
        </Paper>
    );
};

export default MiniCalendar;
