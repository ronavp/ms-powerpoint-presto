import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

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

function PresentationModal({
  open,
  onClose,
  onCreate,
  newPresentationName,
  setNewPresentationName
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Enter New Presentation Name
        </Typography>
        <TextField
          fullWidth
          label="Presentation Name"
          variant="outlined"
          value={newPresentationName}
          onChange={(e) => setNewPresentationName(e.target.value)}
          margin="normal"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onCreate}
        >
          Edit
        </Button>
      </Box>
    </Modal>
  );
}

export default PresentationModal
