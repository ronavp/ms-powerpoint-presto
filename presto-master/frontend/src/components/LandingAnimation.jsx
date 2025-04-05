import Typed from "typed.js";
import { useEffect, useRef } from "react";

// Animation at Landing Page Implementation
function LandingAnimation() {
  const el = useRef(null);  

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Presentations.", "Cards.", "Slides."], 
      startDelay: 250,
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 200,
      smartBackspace: true,
      loop: true
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return <span ref={el}></span>
}

export default LandingAnimation;