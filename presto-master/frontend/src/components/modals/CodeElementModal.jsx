import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { handlePercentage } from '../../utils/helper';

const CodeElementModal = ({ open, onClose, onSaveCode }) => {
  const [code, setCode] = useState('');
  const [fontSize, setFontSize] = useState(1); 
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  // Saves the code inputted into modal
  const handleSave = () => {
    if (!code) {
      console.error('Code and language are required.');
      return;
    }

    onSaveCode({
      code,
      fontSize,
      height,
      width
    })
    onClose();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6">
          Add Code to Slide
        </Typography>
        <TextField
          fullWidth
          label="Code"
          variant="outlined"
          multiline
          rows={4}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Font Size (em)"
          variant="outlined"
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          margin="normal"
        />
        <TextField fullWidth label="Width (%)" variant="outlined" type="number" value={width} onChange={e => setWidth(handlePercentage(e.target.value))} margin="normal" />
        <TextField fullWidth label="Height (%)" variant="outlined" type="number" value={height} onChange={e => setHeight(handlePercentage(e.target.value))} margin="normal" />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSave}
        >
          Save Code Block
        </Button>
      </Box>
    </Modal>
  );
};

export default CodeElementModal;