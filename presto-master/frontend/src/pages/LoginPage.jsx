import { useState } from "react";
import { handleSignIn, unauthCall } from "../utils/helper";
import BadAlert from "../components/BadAlert";
import { useNavigate } from "react-router-dom";

function LoginPage({ setLoginStatus }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertCheck, setAlertCheck] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  // Handles all user inputted values for login
  const handleSubmit = async (event) => {
    event.preventDefault()
    const body = {
      email: email,
      password: password
    }

    // API call to check if valid login input
    const response = await unauthCall('admin/auth/login', 'POST', body)
    if (response.error) {
      setErrorMessage(response.error)
      setAlertCheck(true)
    }   else {
      handleSignIn(response.token)
      setLoginStatus(true)
      navigate('/dashboard')
    }
  }
  return (
    <>
      {alertCheck &&(
        <BadAlert message={errorMessage} setState={setAlertCheck}></BadAlert>)
      }   
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-1/3 h-1/2 bg-white rounded-lg shadow-lg flex flex-col items-center border-0 text-black text-lg font-bold border-white p-6">
          <h1 className="mb-5 text-4xl">Login.</h1>
          <form>
            <label className="text-gray-500">email:</label>
            <input 
              onChange={e => setEmail(e.target.value)}
              className="bg-gray-200 border-2 w-full py-3 px-2 text-gray-700 focus:outline-none focus:border-blue-500" type="text" placeholder="email">
            </input>
            <div className="mt-2">
              <label className="mt-5 text-gray-500">password:</label>
              <input 
                onChange={e => setPassword(e.target.value)}
                className="bg-gray-200 border-2 w-full py-3 px-2 text-gray-700 focus:outline-none focus:border-blue-500" type="password" placeholder="password">
              </input>
            </div>
            <div className="flex flex-col items-center justify-center mt-[15%]">
              <button onClick={handleSubmit} className="items-center bg-blue-500 rounded px-3 py-2 text-white font-bold">
                                Sign in!
              </button>
            </div>      
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginPage