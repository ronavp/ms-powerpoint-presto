import { useEffect, useState } from "react";
import detectLang from "lang-detector";
import { Rnd } from "react-rnd";
import hljs from "highlight.js";
import "highlight.js/styles/default.css";

function DisplaySlidesPage({ slides, currentSlideIndex, onElementUpdate }) {
  const [localSlides, setLocalSlides] = useState(slides);
  const [selectedElementIndex, setSelectedElementIndex] = useState(null);
  const [editingMode, setEditingMode] = useState(false);

  useEffect(() => {
    if (slides !== localSlides) {
      setLocalSlides(slides);
    }
  }, [slides]);
  
  if (!localSlides.length) return null;
  const slide = localSlides[currentSlideIndex];
  const elements = slide.elements || [];

  // Updates the properties of a specificed elemtn
  const handleElementUpdate = (index, updatedElement) => {
    const updatedSlides = [...localSlides];
    updatedSlides[currentSlideIndex].elements[index] = updatedElement;
    setLocalSlides(updatedSlides);

    onElementUpdate(currentSlideIndex, updatedSlides[currentSlideIndex].elements);
  };

  const handleLeftClick = (index) => {
    if (selectedElementIndex === index) {
      setEditingMode(!editingMode);
      if (!editingMode) {
        setSelectedElementIndex(index);
      } else {
        setSelectedElementIndex(null);
      }
    } else {
      setSelectedElementIndex(index);
      setEditingMode(true);
    }
  };
  
  // Implementation for User Right Click input
  const handleRightClick = (e, index) => {
    e.preventDefault(); 
    const updatedSlides = [...localSlides];
    updatedSlides[currentSlideIndex].elements.splice(index, 1);
    setLocalSlides(updatedSlides);
    onElementUpdate(currentSlideIndex, updatedSlides[currentSlideIndex].elements); 
  };

  const handleStyle = {
    width: "5px",
    height: "5px",
    backgroundColor: "blue",
  };

  // Renders all the elements passed with resizeable and moveable
  const renderElements = () => {    
    return elements.map((element, index) => {
      const isSelected = selectedElementIndex === index;
      const minSize = 20;

      // Stores the detected language
      const detectedLanguage = element.type === "code" 
        ? detectLang(element.data.code).toLowerCase() 
        : "";
      
      return (
        <Rnd
          key={element.id || index}
          size={{
            width: `${element.size.width}%`,
            height: `${element.size.height}%`,
          }}
          position={{ x: element.position.x, y: element.position.y }}
          onClick={() => handleLeftClick(index)} 
          onContextMenu={(e) => handleRightClick(e, index)}
          disableDragging={!editingMode || !isSelected}
          enableResizing={editingMode && isSelected}
          onDrag={(e, data) => {
            handleElementUpdate(index, {
              ...element,
              position: { x: data.x, y: data.y },
            });
          }}
          onDragStop={(e, data) =>
            handleElementUpdate(index, {
              ...element,
              position: { x: data.x, y: data.y },
            })
          }
          onResizeStop={(e, direction, ref, delta, position) => {
            const newWidth = Math.max(ref.offsetWidth, minSize);
            const newHeight = Math.max(ref.offsetHeight, minSize);

            const parentWidth = ref.parentElement.offsetWidth;
            const parentHeight = ref.parentElement.offsetHeight;

            const newWidthPercent = (newWidth / parentWidth) * 100;
            const newHeightPercent = (newHeight / parentHeight) * 100;

            handleElementUpdate(index, {
              ...element,
              size: {
                width: newWidthPercent, 
                height: newHeightPercent, 
              },
              position: { x: position.x, y: position.y },
            });
          }}
          bounds="parent"
          minWidth={minSize}
          minHeight={minSize}
          style={{
            border: isSelected && editingMode ? "1px dashed blue" : "none",
          }}
          resizeHandleComponent={{
            topLeft: <div style={{ ...handleStyle, position: "absolute", top: "7px", left: "7px" }} />,
            topRight: <div style={{ ...handleStyle, position: "absolute", top: "7px", right: "7px" }} />,
            bottomLeft: <div style={{ ...handleStyle, position: "absolute", bottom: "7px", left: "7px" }} />,
            bottomRight: <div style={{ ...handleStyle, position: "absolute", bottom: "7px", right: "7px" }} />,
          }}
        >
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {element.type === "text" && (
              <div
                style={{
                  fontSize: `${element.data.fontSize}em`,
                  color: element.data.colour,
                  overflow: "hidden",
                  width: "100%",
                  height: "100%",
                }}
              >
                {element.data.text}
              </div>
            )}
            {element.type === "image" && (
              <img
                src={element.data.imageUrl}
                alt={element.data.altText || "Image"}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  objectFit: "cover",
                }}
              />
            )}
            {element.type === "video" && (
              <iframe
                src={`https://www.youtube.com/embed/${element.data.videoUrl}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: editingMode ? "none" : "auto",
                }}
              />
            )}
            {element.type === "code" && (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <div
                  style={{
                    position: "absolute",
                    bo: 0,
                    left: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    color: "black",
                    padding: "5px",
                    fontSize: "0.5em",
                    borderBottomRightRadius: "5px",
                  }}
                >
                  {detectedLanguage}
                </div>
                <pre style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                  <code
                    className={`language-${detectedLanguage}`}
                    ref={(codeEl) => {
                      if (codeEl) {
                        hljs.highlightElement(codeEl);
                      }
                    }}
                    style={{
                      fontSize: `${element.data.fontSize || 1}em`,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {element.data.code}
                  </code>
                </pre>
              </div>
            )}

          </div>
        </Rnd>
      );
    });
  };

  // Renders the slide number in the bottom left of Slide Page
  const renderSlideNumber = () => {
    return (
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1em",
          color: "black",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "5px",
        }}
      >
        {currentSlideIndex + 1}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
      <div
        style={{
          width: "60vw",
          height: "55vh",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {renderElements()}
        {renderSlideNumber()}
      </div>
    </div>
  );
}

export default DisplaySlidesPage;
