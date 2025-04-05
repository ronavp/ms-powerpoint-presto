import { useState } from 'react';
import BadAlert from '../components/BadAlert';
import { unauthCall, handleSignIn } from '../utils/helper';
import { useNavigate } from 'react-router-dom';

function RegistrationPage({ setLoginStatus }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [alertCheck, setAlertCheck] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();

  // Handles user input with authentication to register to database
  const handleSubmit = async (event) => {
    event.preventDefault()


    if (password !== passwordConfirm) {
      setErrorMessage('Password do not match')
      setAlertCheck(true)
      return
    }

    const body = {
      email: email,
      password: password,
      name: name, 
    }
        
    const response = await unauthCall('admin/auth/register', 'POST', body)
    if (response.error) {
      setErrorMessage(response.error)
      setAlertCheck(true)
      return
    }   else {
      setLoginStatus(true)
      handleSignIn(response.token)
      navigate('/dashboard')
    }
  }   

  return (
    <>
      {alertCheck &&(
        <BadAlert message={errorMessage} setState={setAlertCheck}></BadAlert>)
      }   
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-1/3 h-[70%] bg-white rounded-lg shadow-lg flex flex-col items-center border-0 text-black text-lg font-bold border-white p-6">
          <h1 className="mb-5 text-4xl">Register.</h1>
          <form>
            <label className="mt-[8%] text-gray-500">email:</label>
            <input 
              onChange={e => setEmail(e.target.value)}
              className="bg-gray-200 border-2 w-full py-3 px-2 text-gray-700 focus:outline-none focus:border-blue-500" type="text" placeholder="email">
            </input>
            <div className="mt-[5%]">
              <label className="mt-[15%] text-gray-500">name:</label>
              <input 
                onChange={e => setName(e.target.value)}
                className="bg-gray-200 border-2 w-full py-3 px-2 text-gray-700 focus:outline-none focus:border-blue-500" type="text" placeholder="password">
              </input>
            </div>
            <div className="mt-[5%]">
              <label className="mt-[15%] text-gray-500">password:</label>
              <input 
                onChange={e => setPassword(e.target.value)}
                className="bg-gray-200 border-2 w-full py-3 px-2 text-gray-700 focus:outline-none focus:border-blue-500" type="password" placeholder="password">
              </input>
            </div>
            <div className='mt-[5%]'>
              <label className="mt-[15%] text-gray-500">confirm password:</label>
              <input 
                onChange={e => setPasswordConfirm(e.target.value)}
                className=" bg-gray-200 border-2 w-full py-3 px-2 text-gray-700 focus:outline-none focus:border-blue-500" type="password" placeholder="confirm password">
              </input>
            </div>
            <div className="flex flex-col items-center justify-center mt-[7%]">
              <button onClick={handleSubmit} className="items-center bg-blue-500 rounded px-3 py-2 text-white font-bold">
                                    Sign up!
              </button>
            </div>      
          </form>
        </div>
      </div>
    </>
  )
}

export default RegistrationPage