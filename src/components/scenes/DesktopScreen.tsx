import { useEffect, useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Vector3, type Group } from "three";
import { useHero } from "../../context/HeroContext";
import { useMedia } from "../../context/MediaContext";
import DesktopOS from "../desktop/DesktopOS";
import { useOsChoice } from "../desktop/hooks";
import { createScreenPreview } from "../desktop/screenPreview";

// CSS px of desktop per world unit of screen. Phones use fewer, so the same UI
// comes out about 1.5x larger instead of unreadably small.
const PX_PER_UNIT = 400;
const PX_PER_UNIT_COMPACT = 260;
const HOVER_GLOW = "#35e0c8";

interface DesktopScreenProps {
  width: number;
  height: number;
}

/**
 * The monitor. From the room it shows a painted preview; once the camera has
 * landed face-on, the live desktop is laid over it as flat 2D DOM.
 *
 * Flat on purpose: the camera is square to the screen by then, so no 3D CSS
 * is needed, and Safari mis-draws drei's 3D-transformed <Html> (it drew this
 * desktop half a screen too low on an iPhone).
 */
const DesktopScreen = ({ width, height }: DesktopScreenProps) => {
  const { isMobile } = useMedia();
  const { isInteracting, isAnimating, selectedItem } = useHero();
  const size = useThree((state) => state.size);
  const [os, setOs] = useOsChoice();
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);

  const live = selectedItem?.name === "leftScreen" && !isAnimating;
  const showGlow = hovered && !isInteracting;
  const pxPerUnit = isMobile ? PX_PER_UNIT_COMPACT : PX_PER_UNIT;

  const preview = useMemo(() => createScreenPreview(os), [os]);
  useEffect(() => () => preview.dispose(), [preview]);

  useEffect(() => {
    if (!showGlow) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [showGlow]);

  // drei scales flat <Html> by distanceFactor / (world height in view). Solve
  // it so the CSS box lands exactly on the panel, room scale included.
  const worldScale = groupRef.current?.getWorldScale(new Vector3()).y ?? 1;
  const distanceFactor = (worldScale * size.height) / pxPerUnit;

  return (
    <group ref={groupRef}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={preview} toneMapped={false} />
      </mesh>

      {showGlow && (
        <mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[width + 0.06, height + 0.06]} />
          <meshBasicMaterial
            color={HOVER_GLOW}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>
      )}

      {live && (
        <Html center distanceFactor={distanceFactor} zIndexRange={[20, 10]}>
          <div
            className="desk-fade-in"
            style={{ width: width * pxPerUnit, height: height * pxPerUnit }}
          >
            <DesktopOS
              width={width * pxPerUnit}
              height={height * pxPerUnit}
              compact={isMobile}
              os={os}
              onOsChange={setOs}
            />
          </div>
        </Html>
      )}
    </group>
  );
};

export default DesktopScreen;
