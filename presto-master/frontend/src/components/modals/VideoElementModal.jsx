import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { handlePercentage } from '../../utils/helper';

const VideoElementModal = ({ open, onClose, onSaveVideo }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);
  const [width, setWidth] = useState(false)
  const [height, setHeight] = useState(false)

  // Saves all inputted values from user in modal
  const handleSave = () => {
    onSaveVideo({
      videoUrl,
      width,
      height,
      autoPlay
    });
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
        <Typography id="modal-title" variant="h6">Add Video to Slide</Typography>
        <TextField
          fullWidth
          label="Video URL (embed link)"
          variant="outlined"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          margin="normal"
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
        <div style={{ margin: '20px 0' }}>
          <label>
            Auto-play:
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSave}
        >
          Save Video
        </Button>
      </Box>
    </Modal>
  );
};

export default VideoElementModal;
