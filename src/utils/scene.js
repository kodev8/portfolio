import gsap from "gsap";
import { ORIGINAL_CAMERA_POSITION } from "../components/scenes/HeroExperience";


export const resetScene = (
    camera,
    controls,
    roomRef,
    setIsInteracting,
    setSelectedItem,
    isAnimating,
    setIsAnimating
  ) => {
  
    // Add a safety check for isAnimating
    if (isAnimating) {
    //   console.log("Animation in progress, not resetting scene");
      return;
    }
  
    controls.enabled = false;
  
    // create a timeline for better sequencing
    const tl = gsap.timeline({
      defaults: { ease: "sine.out" },
      onComplete: () => {
        document.body.classList.remove("is-interacting");
        setTimeout(() => {
          controls.enabled = true;
        }, 50);
      },
    });
  
    // First animate camera back
    tl.to(camera.position, {
      x: ORIGINAL_CAMERA_POSITION[0],
      y: ORIGINAL_CAMERA_POSITION[1],
      z: ORIGINAL_CAMERA_POSITION[2],
      duration: 0.5,
      onUpdate: () => {
        camera.lookAt(0, 0, 0); // Look at the center
      },
      onComplete: () => {
        setIsInteracting(false);
        setSelectedItem(null);
        setIsAnimating(false);
  
        // Reset any special constraints that might have been set
        controls.enablePan = false;
        controls.enableZoom = true;
      },
    });
  
    // Reset orbit controls target
    gsap.to(controls.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.5,
    });
  
    // Only reset room position if roomRef exists
    if (roomRef && roomRef.current) {
      gsap.to(roomRef.current.position, {
        x: 0,
        y: -3.5, // This is the original y position from HeroExperience.jsx
        z: 0,
        duration: 0.5,
      });
  
      // Also reset rotation if needed
      gsap.to(roomRef.current.rotation, {
        x: 0,
        y: -Math.PI / 4, // Original rotation from HeroExperience.jsx
        z: 0,
        duration: 0.5,
      });
    }
  
    // Then fade UI elements back in
    tl.to(
      [
        ".navbar",
        ".hero-text",
        "header p",
        "#button",
        "#hero-bg",
        ".hero-layout-header",
      ],
      {
        opacity: 1,
        duration: 0.3,
        zIndex: 100,
        stagger: 0.05,
      },
      "-=0.1"
    );
};
  

export const resolveZoom = ({ isInteracting, isMobile, isScreen }) => {
  let maxDistance;
  let minDistance;

  if (isInteracting) {
    maxDistance = 10;
    if (isMobile) {
      minDistance = isScreen ? 1.8 : 1.5;
    } else {
      minDistance = 3;
    }
  } else {
    maxDistance = 14;
    minDistance = 10;
  }
  console.log("Func isInteracting", isInteracting,"isMobile", isMobile, "isScreen", isScreen, "maxDistance", maxDistance, "minDistance", minDistance);

  return { maxDistance, minDistance };
};

