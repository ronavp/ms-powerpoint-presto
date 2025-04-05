import config from '../../backend.config.json'

// unauthorised api call
const unauthCall = async (path, method, body = null) => {
  let load = {      
    method: method,
    headers: {
      'Content-type': 'application/json',
    }
  }
  if (body !== null) {
    load.body = JSON.stringify(body);
  }
  const response = await fetch(`http://localhost:${config.BACKEND_PORT}/` + path, load)
  return response.json()
}

const authCall = async (path, method, body = null) => {
  let load = {      
    method: method,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }
  if (body !== null) {
    load.body = JSON.stringify(body);
  }
  const response = await fetch(`http://localhost:${config.BACKEND_PORT}/` + path, load)
  return response.json()
}

// Checks for authentication token
const checkAuth = () => {
  if (localStorage.getItem('token')) {
    return true;
  }
  return false;
}

// Handle sign in operation
const handleSignIn = (token) => {
  localStorage.setItem('token', String(token))
}

const handleSignOut = () => {
  localStorage.clear()
}

// Gets current data stored in database
const getStoreData = async () => {
  const response = await authCall('store', 'GET');
  if (response.error || !response.store) {
    return { error: true, message: 'Failed to load data'}
  }
  return { error: false, data: response.store };
}

// Updates the database with new input
const updateStoreData = async (updatedPresentations) => {
  const body = { store: { presentations: updatedPresentations}};
  const response = await authCall('store', 'PUT', body);
  if (response.error) {
    return { error: true, message: 'Failed to update data'}
  }
  return { error: false};
}

// Converts image file to base64
function fileToDataUrl(file) {
  const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve,reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

// Handles clipping for modal input
const handlePercentage = (value) => {
  const num = parseInt(value)
  if (num < 0) {
    return 0
  }   
  else if (num > 100) {
    return 100
  }
  else {
    return num
  }
}

export {
  unauthCall,
  authCall,
  checkAuth,
  handleSignIn,
  handleSignOut, 
  getStoreData, 
  updateStoreData,
  fileToDataUrl,
  handlePercentage
}


