import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const InputText = ({ ...props }) => { // Removed 'label' from destructured props
  const [field, meta] = useField(props);
  const errorText = meta.touched && meta.error ? meta.error : '';
  const hasError = !!errorText;

  return (
    <TextField
      fullWidth
      // label prop removed as labels are now external
      variant="outlined"
      margin="none" // Margin is now controlled by parent components
      size="small" // For a more compact field
      {...field}
      {...props} // This will pass down 'placeholder', 'name', 'type', etc.
      error={hasError}
      helperText={errorText}
    />
  );
};

export default InputText;
