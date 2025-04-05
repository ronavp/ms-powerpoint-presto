import { useNavigate } from "react-router-dom";
import LandingAnimation from '../components/LandingAnimation'

// Implementation for Landing Page
function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');  
  };

  return (
    <div className="flex flex-row w-screen h-screen items-center bg-gray-100">
      <p className="ml-[5%] mb-[10%] text-8xl w-1/2">
                Make the best <br></br>
        <LandingAnimation />
      </p>
      <div className="flex flex-col mb-[7%]">
        <button 
          className="hover:bg-blue-500 text-blue-700 font-bold hover:text-white py-[1.5rem] px-[12rem] border border-blue-500 hover:border-transparent rounded"
          onClick={handleLoginClick}>
                    Log in
        </button>
        <hr 
          className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-200 to-transparent opacity-30 dark:via-neutral-500" 
        />
        <button className="hover:bg-gray-500 text-gray-400 font-bold hover:text-white py-[1.5rem] px-[12rem] border border-gray-500 hover:border-transparent rounded"
          onClick={handleRegisterClick}>
                    Register
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
