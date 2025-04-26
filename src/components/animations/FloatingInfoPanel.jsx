import React, { useState, useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMedia } from "../../context/MediaContext";
import { cn } from "../../utils";

const FloatingInfoPanel = ({
  content,
  position,
  visible = true,
  speechDirection = "down",
  onLinkClick,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = content ?? "No information available";
  const charIndex = useRef(0);
  const groupRef = useRef();
  const typingSpeed = 30;
  const { isMobile } = useMedia();

  const handleLinkClick = (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      const href = e.target.getAttribute("href");

      if (href.startsWith("#")) {

        // handle internal links
        if (onLinkClick) {
          onLinkClick(href);
        } else {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      }
      else {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    }
  };

  useEffect(() => {
    if (!visible) {
      setDisplayText("");
      charIndex.current = 0;
      return;
    }

    const parseAndTypeHTML = () => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = fullText;

      const textContent = tempDiv.textContent || "";

      if (charIndex.current < textContent.length) {
        let visibleLength = charIndex.current;
        let htmlOutput = "";
        let textCount = 0;
        let inTag = false;

        for (let i = 0; i < fullText.length; i++) {
          const char = fullText[i];
          if (char === "<") {
            inTag = true;
          } else if (char === ">") {
            inTag = false;
          } else if (!inTag) {
            // only increment textCount if we're not inside a tag
            textCount++;
          }
          htmlOutput += char;
          if (textCount > visibleLength) {
            break;
          }
        }


        setDisplayText(htmlOutput);
        charIndex.current += 1;

        const timer = setTimeout(parseAndTypeHTML, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        setIsTyping(false);
      }
    };

    parseAndTypeHTML();
  }, [fullText, visible]);

  useEffect(() => {
    setDisplayText("");
    charIndex.current = 0;
    setIsTyping(true);
  }, [content]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
    }
  });

  if (!visible) return null;

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1] + 0.5, position[2]]}
    >
      <Html
        transform
        distanceFactor={isMobile ? 2 : 1}
        position={[0.5, 0, 0]}
        rotation={[0, 0, 0]}
        style={{
          width: "300px",
          height: "auto",
          pointerEvents: "auto",
        }}
      >
        <div className={cn("speech-bubble", speechDirection)} onClick={handleLinkClick}>
          <span className="typewriter-text">
            <span dangerouslySetInnerHTML={{ __html: displayText }} />
            {isTyping && <span className="typing-cursor">|</span>}
          </span>
        </div>
      </Html>
    </group>
  );
};

export default FloatingInfoPanel;
