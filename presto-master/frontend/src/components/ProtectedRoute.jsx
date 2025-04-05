import { checkAuth } from '../utils/helper'
import { Navigate } from 'react-router-dom'

// Ensure user has valid token when using presto
const ProtectedRoute = ({ route }) => {  
  if (checkAuth()) {
    return route 
  }

  return (
    <>
      <Navigate to="/"></Navigate>
    </>
  )
}

export default ProtectedRoute