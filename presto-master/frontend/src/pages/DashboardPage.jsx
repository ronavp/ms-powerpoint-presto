import { useState, useEffect } from "react";
import { authCall } from "../utils/helper";
import BadAlert from '../components/BadAlert';
import CreatePresentationModal from "../components/modals/CreatePresentationModal";
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [presentations, setPresentations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertCheck, setAlertCheck] = useState(false);
  const [nextId, setNextId] = useState(1);
  const navigate = useNavigate();

  // Updates the presentation data content
  useEffect(() => {
    const fetchPresentations = async() => {
      const response = await authCall('store', 'GET'); 
      if (response.error) {
        setErrorMessage('Failed to load presentations'); 
        setAlertCheck(true); 
      } else if (response.store?.presentations) {
        setPresentations(response.store.presentations); 

        const highestId = Math.max(
          ...response.store.presentations.map((p) => p.id), 0
        );
        setNextId(highestId + 1);
      }
    };
    fetchPresentations();
  }, []);

  // Implementation for creating a new presentation on the dashboard
  const handleCreatePresentation = async (event) => {
    if (event) event.preventDefault();

    if (!newPresentationName) {
      setErrorMessage('Please enter a presentation name')
      setAlertCheck(true)
      return;
    }

    const defaultThumbnail = 'src/assets/gray-image.png';
    const validThumbnail = thumbnail || defaultThumbnail;

    const newPresentation = {
      id: nextId,
      name: newPresentationName, 
      description: description, 
      thumbnail: validThumbnail,
      slides: [{ slide: 1, elements: []}],
    };

    const updatedPresentations = [...presentations, newPresentation];

    const body = {
      store: {
        presentations: updatedPresentations,
      }
    }

    const response = await authCall('store', 'PUT', body);
    if (response.error) {
      setErrorMessage(response.error);
      setAlertCheck(true);
      return
    } else {
      setPresentations(updatedPresentations);
      setNextId(nextId + 1);
      setShowModal(false);
      setNewPresentationName('');
      setAlertCheck(false);
      setThumbnail(null);
    }
      
  }
    
  // Navigates the user to the presentation they clicked on
  const handlePresentationClick = (id) => {
    navigate(`/presentation/${id}`);
  }

  return (
    <div className="h-screen flex flex-col items-center justify-start bg-gray-100">
      {alertCheck && (
        <BadAlert message={errorMessage} setState={setAlertCheck} />
      )}

      <div className="w-full max-w-6xl mt-4 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-5xl font-bold">Dashboard</h1>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            + New Presentation
          </button>
        </div>
      </div>

      <CreatePresentationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreatePresentation}
        newPresentationName={newPresentationName}
        setNewPresentationName={setNewPresentationName}
        setDescription={setDescription}
        setThumbnail={setThumbnail}
      />

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 px-4">
        {presentations.map((presentation) => (
          <div
            key={presentation.id}
            onClick={() => handlePresentationClick(presentation.id)}
            className="bg-white shadow-lg rounded-lg overflow-hidden relative flex flex-col justify-between"
            style={{ aspectRatio: '2 / 1' }}
          >
            <div className="w-full h-full">
              {presentation.thumbnail ? (
                <img
                  src={presentation.thumbnail}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </div>
            <div className="p-2 sm:p-4 absolute bottom-0 left-0 right-0 bg-opacity-30 bg-black text-white">
              <h3 className="text-sm sm:text-lg font-semibold truncate">{presentation.name}</h3>
              <p className="text-xs sm:text-sm truncate">{presentation.description}</p>
              <p className="text-xs sm:text-sm">Slides: {presentation.slides.length}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
