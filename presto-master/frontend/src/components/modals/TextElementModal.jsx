import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { ChromePicker } from 'react-color';
import { useState } from 'react';
import { handlePercentage } from '../../utils/helper';

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

function TextElementModal({ open, onClose, onSaveText, initialText = '', initialFontSize = '1.0', initialColour = '#000000' }) {
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [colour, setColour] = useState(initialColour);
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  // Saves all inputted values from modal
  const handleSave = () => {
    onSaveText({ text, fontSize, colour, width, height });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6">
          Add Text to Slide
        </Typography>
        <TextField fullWidth label="Width (%)" variant="outlined" type="number" value={width} onChange={e => setWidth(handlePercentage(e.target.value))} margin="normal" />
        <TextField fullWidth label="Height (%)" variant="outlined" type="number" value={height} onChange={e => setHeight(handlePercentage(e.target.value))} margin="normal" />
        <TextField fullWidth label="Text Content" variant="outlined" value={text} onChange={e => setText(e.target.value)} margin="normal" multiline rows={4} />
        <TextField fullWidth label="Font Size (em)" variant="outlined" type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} margin="normal" />
        <Typography sx={{ mt: 2, mb: 1 }}>Text Colour</Typography>
        <ChromePicker color={colour} onChangeComplete={color => setColour(color.hex)} />
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>Save Text</Button>
      </Box>
    </Modal>
  );
}


export default TextElementModal;