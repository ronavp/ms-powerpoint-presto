// Responsible for creating the Slide Deck at the bottom when traversing through slides
function SlideDeck({ slides, onSlideSelect, currentSlideIndex, onMoveNext, onMovePrev }) {
  if (!slides || slides.length === 0) {
    return;
  }
  return (
    <div className="m-3 fixed bottom-0 left-0 right-0 bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <div className="flex justify-between items-center">
        <button
          onClick={onMovePrev}
          disabled={currentSlideIndex === 0}
          className={`p-1 ${currentSlideIndex === 0 ? 'opacity-0 cursor-not-allowed' : 'hover:bg-gray-400'}`}
        >
          <div className="w-10 h-10">
            <img src="/src/assets/slide-back-arrow.svg" alt="Previous Slide" />
          </div>
        </button>

        <div className="flex space-x-4 overflow-x-auto">
          {slides.map((slide, index) => (
            <div
              key={slide.slide}
              onClick={() => onSlideSelect(index)}
              className={`flex-none w-40 h-24 bg-gray-200 ${
                index === currentSlideIndex ? 'border-b-4 border-blue-500' : 'hover:bg-gray-300'
              } cursor-pointer flex items-center justify-center`}
            >
              <p className={`text-sm font-medium ${
                index === currentSlideIndex ? 'text-blue-500' : 'text-gray-700'
              }`}>
                Slide {slide.slide}
              </p>
            </div>
       
          ))}
        </div>

        <button
          onClick={onMoveNext}
          disabled={currentSlideIndex === slides.length - 1}
          className={`p-1 ${currentSlideIndex === slides.length - 1 ? 'opacity-0 cursor-not-allowed' : 'hover:bg-gray-300'}`}
        >
          <div className="w-10 h-10">
            <img src="/src/assets/slide-forward-arrow.svg" alt="Next Slide" />
          </div>
        </button>
      </div>
    </div>
  );
}

export default SlideDeck;
