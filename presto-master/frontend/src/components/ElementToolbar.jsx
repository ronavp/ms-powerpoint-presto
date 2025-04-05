// Responsible for calling all element functions in toolbar
function ElementToolbar({ addText, addImage, addVideo, addCode, deleteSlide }) {
  return (
    <div className="flex space-x-2">
      <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={addText}>Add Text</button>
      <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={addImage}>Add Image</button>
      <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={addVideo}>Add Video</button>
      <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={addCode}>Add Code</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={deleteSlide}>Delete Slide</button>
    </div>
  );
}

export default ElementToolbar;
