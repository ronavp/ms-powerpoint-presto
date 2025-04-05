import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { getStoreData, updateStoreData } from "../utils/helper";
import BadAlert from '../components/BadAlert';
import EditPresentationModal from "../components/modals/EditPresentationModal";
import SlideDeck from "../components/SlideDeck";
import ElementToolbar from "../components/ElementToolbar";
import { fileToDataUrl } from "../utils/helper";
import DisplaySlidesPage from "./DisplaySlidePage";
import TextElementModal from "../components/modals/TextElementModal";
import ImageElementModal from "../components/modals/ImageElementModal";
import VideoElementModal from "../components/modals/VideoElementModal";
import CodeElementModal from "../components/modals/CodeElementModal";

function PresentationPage() {
  const fileInputRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState({ name: '', slides: [] });
  const [showModal, setShowModal] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alertCheck, setAlertCheck] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showTextElementModal, setShowTextElementModal ] = useState(false);
  const [showImageElementModal, setImageElementModal ] = useState(false);
  const [showVideoElementModal, setShowVideoElementModal]  = useState(false);
  const [showCodeElementModal, setShowCodeElementModal] = useState(false);


  // Gets and Updates Data into databse
  const getUpdateData = async (updatedPresentation) => {
    const { error, data, message } = await getStoreData();
    if (error) {
      setErrorMessage(message);
      setAlertCheck(true);
      return null; 
    }
  
    const updatedPresentations = data.presentations.map(p =>
      p.id === updatedPresentation.id ? updatedPresentation : p
    );
  
    const updateResponse = await updateStoreData(updatedPresentations);
    if (updateResponse.error) {
      setErrorMessage(updateResponse.message);
      setAlertCheck(true);
      return null; 
    }
  
    return updatedPresentations; 
  };

  // Handles getting and saving the element to databse
  const handleElementSave = async (elementType, elementData) => {
    const { error, data, message } = await getStoreData();
    if (error) {
      setErrorMessage(message);
      setAlertCheck(true);
      return;
    }
  
    const { presentations } = data;
    const currentSlide = presentation.slides[currentSlideIndex];
  
    const newElement = {
      id: currentSlide.elements.length + 1,
      type: elementType,
      data: elementData,
      position: { x: 0, y: 0 }, 
      size: { width: elementData.width, height: elementData.height }
    };
  
    const updatedElements = [...currentSlide.elements, newElement];
    const updatedSlides = [...presentation.slides];
    updatedSlides[currentSlideIndex] = { ...currentSlide, elements: updatedElements };
  
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    const updatedPresentations = presentations.map(p =>
      p.id === updatedPresentation.id ? updatedPresentation : p
    );
  
    const updateResponse = await updateStoreData(updatedPresentations);
    if (updateResponse.error) {
      setErrorMessage(updateResponse.message);
      setAlertCheck(true);
    } else {
      setPresentation(updatedPresentation);
      setShowTextElementModal(false); 
    }
  };

  useEffect(() => {
    const fetchPresentationDetails = async () => {
      const { error, data, message } = await getStoreData();
      if (error) {
        setErrorMessage(message);
        setAlertCheck(true);
      } else {
        const presentationData = data.presentations.find(p => p.id === parseInt(id));
        if (presentationData) {
          setPresentation(presentationData);
          setNewPresentationName(presentationData.name || '');
        } else {
          setErrorMessage('Presentation not found');
          setAlertCheck(true);
        }
      }
    };
    fetchPresentationDetails();
  }, [id]);

  // Handles input for updating the title in slide
  const handleUpdateTitle = async () => {
    if (!newPresentationName) {
      setErrorMessage('Title cannot be empty');
      setAlertCheck(true);
      return;
    }

    const updatedPresentation = {
      ...presentation,
      name: newPresentationName
    };

    const updatedPresentations = await getUpdateData(updatedPresentation);
    if (updatedPresentations) {
      setPresentation(updatedPresentation);
      setShowModal(false);
      setAlertCheck(false);
    }
  };

  // Creates a new slide and adds to backend
  const handleCreateNewSlide = async (event) => {
    event.preventDefault();
    const newSlide = {
      slide: presentation.slides.length + 1,
      elements: [],
    };

    const updatedSlides = [...presentation.slides, newSlide];
    const updatedPresentation = { ...presentation, slides: updatedSlides };

    const updatedPresentations = await getUpdateData(updatedPresentation);
    if (updatedPresentations) {
      setPresentation(updatedPresentation);
    }
  };

  // Sets the current slide index
  const handleSelectSlide = async (index) => {
    setCurrentSlideIndex(index);
  };

  // Finds the next slide in data to traverse to 
  const handleNextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
    }
  };
  
  // Finds the previous slide in data to traverse to 
  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Takes user input for arrow key traversal 
  useEffect(() => {
    const handleKeyArrows = (event) => {
      if (event.key === 'ArrowRight') {
        handleNextSlide();
      } else if (event.key === 'ArrowLeft') {
        handlePrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyArrows);
    return () => {
      window.removeEventListener('keydown', handleKeyArrows);
    };
  }, [currentSlideIndex, presentation.slides.length]);

  // Handles input for delete presentation and updating database
  const handleDeletePresentation = async () => {
    const { error, data, message } = await getStoreData();
    if (error) {
      setErrorMessage(message);
      setAlertCheck(true);
      true;
    }

    const updatedPresentations = data.presentations.filter(p => p.id !== parseInt(id));

    const updateResponse = await updateStoreData(updatedPresentations);
    if (updateResponse.error) {
      setErrorMessage(updateResponse.message);
      setAlertCheck(true);
    } else {
      navigate('/dashboard'); 
    }
  }

  const handleFileClick = () => {
    fileInputRef.current.click();
  }

  // Handles when user uploads a file for thumbnail
  const handleFileUpload = async (event) => {
    const url = await fileToDataUrl(event.target.files[0]);
  
    const updatedPresentation = {...presentation, thumbnail: url};

    const updatedPresentations = await getUpdateData(updatedPresentation);
    if (updatedPresentations) {
      setPresentation(updatedPresentation);
    }

  }
  
  // Update backend when a slide is deleted
  const deleteSlide = async () => {
    if (presentation.slides.length === 1) {
      setShowDeletePopup(true)
      return
    }
    
    let updatedPresentation = { ...presentation }
    const index = currentSlideIndex
    updatedPresentation.slides.splice(index, 1)

    // Re-apply slide id
    for (const i in updatedPresentation.slides) {
      updatedPresentation.slides[i].slide = parseInt(i) + 1
    }

    const { error, data, message } = await getStoreData();
    if (error) {
      setErrorMessage(message);
      setAlertCheck(true);
      return;
    }

    const updatedPresentations = data.presentations.map(p =>
      p.id === updatedPresentation.id ? updatedPresentation : p
    );

    const updateResponse = await updateStoreData(updatedPresentations);
    if (updateResponse.error) {
      setErrorMessage(updateResponse.message);
      setAlertCheck(true);
    } else {
      setPresentation(updatedPresentation);
      setShowModal(false);
      setAlertCheck(false);
      setCurrentSlideIndex(0)
    }

  };

  // Implementation for when add text is clicked in toolbar
  const addText = () => {
    setShowTextElementModal(true); 
  };

  const handleSaveText = async (info) => {
    const elementData = {
      colour: info.colour,
      fontSize: info.fontSize,
      text: info.text,
      width: info.width,
      height: info.height
    };
    handleElementSave('text', elementData);
  }

  // Implementation for when add image is clicked in toolbar
  const addImage = () => {
    setImageElementModal(true);
  };
  
  const handleSaveImage = async (info) => {
    const elementData = {
      imageUrl: info.imageUrl,
      altText: info.altText,
      width: info.width,
      height: info.height
    };
    handleElementSave('image', elementData);
  }

  // Implementation for when add video is clicked in toolbar
  const addVideo = () => {
    setShowVideoElementModal(true);
  };

  const handleSaveVideo = async (videoInfo) => {
    let url = String(videoInfo.videoUrl);
    url = url.match(/[^/]+$/)[0];
  
    if (videoInfo.autoPlay) {
      url = url + '&autoplay=1';
    }
  
    const elementData = {
      videoUrl: url,
      width: videoInfo.width,
      height: videoInfo.height
    };
    handleElementSave('video', elementData);
  };
  
  // Implementation for when add code is clicked in toolbar
  const addCode = () => {
    setShowCodeElementModal(true);
  }

  const handleSaveCode = async (codeInfo) => {
    const elementData = {
      code: codeInfo.code,
      fontSize: codeInfo.fontSize,
      language: codeInfo.language,
      width: codeInfo.width,
      height: codeInfo.height
    };
    handleElementSave('code', elementData);
  };
  
  // Implementation to updates elements size and pos when resizing or moveable
  const handleElementUpdate = async (slideIndex, updatedElements) => {
    const response = await getStoreData();
    if (response.error) {
      setErrorMessage(response.message);
      setAlertCheck(true);
      return;
    }
  
    const presentations = response.data.presentations;
  
    const updatedSlides = [...presentation.slides];
    updatedSlides[slideIndex] = {
      ...updatedSlides[slideIndex],
      elements: updatedElements,
    };

    const updatedPresentation = { ...presentation, slides: updatedSlides };
    const updatedPresentations = presentations.map((p) =>
      p.id === updatedPresentation.id ? updatedPresentation : p
    );
  
    const updateResponse = await updateStoreData(updatedPresentations);
  
    if (updateResponse.error) {
      setErrorMessage(updateResponse.message);
      setAlertCheck(true);
    } else {
      setPresentation(updatedPresentation);
    }
  };
  
  if (!presentation) {
    return <div>Loading Page...</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex flex-col">
      {alertCheck && <BadAlert message={errorMessage} onDismiss={() => setAlertCheck(false)} />}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <button className="p-2 text-white rounded hover:bg-blue-300" onClick={handleFileClick}>
            <img src="/src/assets/upload-thumbnail-button.svg" alt="Upload thumbnail" className="w-6 h-6" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          <button className="p-2 text-white rounded hover:bg-blue-300" onClick={() => setShowModal(true)}>
            <img src="/src/assets/edit-title-button.svg" alt="Edit Title" className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold truncate">{presentation.name}</h1>
        </div>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => setShowDeletePopup(true)}>
          Delete Presentation
        </button>
      </div>
  
      <TextElementModal
        open={showTextElementModal}
        onClose={() => setShowTextElementModal(false)}
        onSaveText={handleSaveText}
      />
      <ImageElementModal
        open={showImageElementModal}
        onClose={() => setImageElementModal(false)}
        onSaveImage={handleSaveImage}
      />
      <VideoElementModal
        open={showVideoElementModal}
        onClose={() => setShowVideoElementModal(false)}
        onSaveVideo={handleSaveVideo}
      />
      <CodeElementModal
        open={showCodeElementModal}
        onClose={() => setShowCodeElementModal(false)}
        onSaveCode={handleSaveCode}
      />
  
      <EditPresentationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleUpdateTitle}
        newPresentationName={newPresentationName}
        setNewPresentationName={setNewPresentationName}
      />
  
      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={handleCreateNewSlide} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          + New Slide
        </button>
        <ElementToolbar addText={addText} addImage={addImage} addVideo={addVideo} addCode={addCode} deleteSlide={deleteSlide} />
      </div>
  
      <main className="flex-grow flex flex-col items-center justify-start overflow-hidden mt-4">
        <SlideDeck
          slides={presentation.slides}
          currentSlideIndex={currentSlideIndex}
          onSlideSelect={handleSelectSlide}
          onMoveNext={handleNextSlide}
          onMovePrev={handlePrevSlide}
        />
        <DisplaySlidesPage
          slides={presentation.slides}
          currentSlideIndex={currentSlideIndex}
          onElementUpdate={handleElementUpdate}
        />
      </main>
  
      {showDeletePopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4 text-lg">Are you sure you want to delete this presentation?</p>
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleDeletePresentation}>
                Yes
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" onClick={() => setShowDeletePopup(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default PresentationPage;