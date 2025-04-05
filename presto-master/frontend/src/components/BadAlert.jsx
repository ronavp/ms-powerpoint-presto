import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// Takes in an error message and setState function to toggle on and off visbility
function BadAlert({message, setState}) {
  return (
    <Stack sx={{ width: '100%' }}>
      <Alert severity="error" onClose={() => {setState(false)}}>
        {message}
      </Alert>
    </Stack>
  );
}

export default BadAlert