import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { fileToDataUrl, handlePercentage } from '../../utils/helper';

const ImageElementModal = ({ open, onClose, onSaveImage }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [altText, setAltText] = useState('');
  const [file, setFile] = useState(null);

  // Gets the inputted image and converts the image to base64
  const handleSave = async () => {
    let finalImageUrl = imageUrl;
    try {
      if (file) {
        finalImageUrl = await fileToDataUrl(file);
      } else if (!imageUrl) {
        console.error("Please provide an image url or upload a file.");
        return;  
      }
      onSaveImage({
        imageUrl: finalImageUrl,
        width: width,
        height: height,
        altText: altText
      });
      onClose();
    } catch (error) {
      console.error("Error processing image url: ", error);
    }
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
          Add Image to Slide
        </Typography>
        <TextField
          fullWidth
          label="Image URL"
          variant="outlined"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          margin="normal"
        />
        <input
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: 'block', margin: '10px 0' }}
        />
        <TextField
          fullWidth
          label="Width (%)"
          variant="outlined"
          type="number"
          value={width}
          onChange={(e) => setWidth(handlePercentage(e.target.value))}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Height (%)"
          variant="outlined"
          type="number"
          value={height}
          onChange={(e) => setHeight(handlePercentage(e.target.value))}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Alt Text"
          variant="outlined"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          margin="normal"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSave}
        >
          Save Image
        </Button>
      </Box>
    </Modal>
  );
};

export default ImageElementModal;
