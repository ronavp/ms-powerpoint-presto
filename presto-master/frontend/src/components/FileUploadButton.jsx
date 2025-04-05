import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { fileToDataUrl } from '../utils/helper';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Takes in all inputs and converts image to base64
function FileUploadButton({setThumbnail}) {
  const handleFileSubmit = (event) => {
    const file = event.target.files[0]
    fileToDataUrl(file).then(url => {
      setThumbnail(url)
    })
  }

  return (
    <Button
      sx={{display: 'flex', marginTop: '10px', marginBottom: '15px'}} 
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
    >
      Upload thumbnail
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileSubmit}
        multiple
      />
    </Button>
  );
}

export default FileUploadButton;
