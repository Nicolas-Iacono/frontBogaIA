import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useField } from 'formik';

const InputSelect = ({ label, options, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.touched && meta.error ? meta.error : '';
  const hasError = !!errorText;

  return (
    <TextField
      select
      fullWidth
      label={label}
      variant="outlined"
      margin="normal"
      {...field}
      {...props} // Spread other props like 'name', 'type', etc.
      error={hasError}
      helperText={errorText}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default InputSelect;
