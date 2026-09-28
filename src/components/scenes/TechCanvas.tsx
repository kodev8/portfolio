import { memo, Suspense, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { useMemo } from "react";
import TechIcon from "../TechIcon";
import { Spinner } from "../ui/spinner";
import type { TechIconDef, TechStackGroup } from "../../types";

/**
 * The 3D half of the tech stack section, split into its own module so three,
 * r3f, drei and rapier are fetched only when a visitor turns 3D on. Keeping
 * it in TechStack.tsx pinned all of it into the initial bundle even though
 * the section renders a plain list by default.
 */

export interface ViewportData {
  viewport: { width: number; height: number };
  size: { width: number; height: number };
  is3d: boolean;
}

// some icons carry an ad-hoc yOffset at runtime that TechIconDef doesn't declare
type TechIconWithOffset = TechIconDef & { yOffset?: number };

interface ViewportProviderProps {
  is3d: boolean;
  children: (data: ViewportData) => ReactNode;
}

// created this to stop rerender when scrolling
// since getting the viewport size was causing rerenders
const ViewportProvider = ({ is3d, children }: ViewportProviderProps) => {
  const { viewport, size } = useThree();
  const viewPortData = useMemo(() => {
    // console.log("in vp is3d", is3d, "viewport.width", viewport.width, "viewport.height", viewport.height, "size.width", size.width, "size.height", size.height);
    return {
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
      size: {
        width: size.width,
        height: size.height,
      },
      is3d: is3d,
    };
  }, [viewport.width, viewport.height, size.width, size.height, is3d]);
  return children(viewPortData);
};

const Boundaries = memo(() => {
  const { viewport } = useThree();
  const margin = 0.3;
  const width = viewport.width - margin * 2;
  const height = viewport.height - margin * 2;
  const thickness = 0.2;

  return (
    <>
      {/* top */}
      <RigidBody type="fixed" position={[0, height / 2 + thickness / 2, 0]}>
        <CuboidCollider args={[width / 2 + thickness, thickness / 2, 1]} />
      </RigidBody>

      {/* bottom */}
      <RigidBody type="fixed" position={[0, -height / 2 - thickness / 2, 0]}>
        <CuboidCollider args={[width / 2 + thickness, thickness / 2, 1]} />
      </RigidBody>

      {/* left */}
      <RigidBody type="fixed" position={[-width / 2 - thickness / 2, 0, 0]}>
        <CuboidCollider args={[thickness / 2, height / 2 + thickness, 1]} />
      </RigidBody>

      {/* right */}
      <RigidBody type="fixed" position={[width / 2 + thickness / 2, 0, 0]}>
        <CuboidCollider args={[thickness / 2, height / 2 + thickness, 1]} />
      </RigidBody>
    </>
  );
});

const BoundsBox = memo(() => {
  const { viewport } = useThree();
  const margin = 0.3;
  const width = viewport.width - margin * 2;
  const height = viewport.height - margin * 2;

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color="white" wireframe opacity={0.5} transparent />
    </mesh>
  );
});

const TechCanvasFallback = () => {
  return (
    <div className="flex-center w-full h-full">
      <Spinner className="w-10 h-10 text-room-accent" />
    </div>
  );
};

interface TechCanvasProps {
  group: TechStackGroup;
  resetTrigger: boolean;
  is3d: boolean;
}

const TechCanvas = memo(({ group, resetTrigger, is3d }: TechCanvasProps) => {
  return (
    <Suspense fallback={<TechCanvasFallback />}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ViewportProvider is3d={is3d}>
          {(sizedData) => (
            <>
              <ambientLight intensity={2} />
              <Environment preset="city" />
              <Physics
                gravity={[0, 0, 0]}
                interpolate={false}
                timeStep={1 / 60}
                // maxStabilizationIterations is gone from rapier v2's PhysicsProps
                // (0 references in its bundle); spread keeps the prop at runtime as before
                {...({ maxStabilizationIterations: 5 } as Record<string, number>)}
              >
                <Boundaries />
                <IconGrid
                  icons={group.icons}
                  resetTrigger={resetTrigger}
                  sizedData={sizedData}
                />
              </Physics>
              {/* <BoundsBox /> */}
            </>
          )}
        </ViewportProvider>
      </Canvas>
    </Suspense>
  );
});

interface IconGridProps {
  icons: TechIconWithOffset[];
  resetTrigger: boolean;
  sizedData: ViewportData;
}

const IconGrid = memo(({ icons, resetTrigger, sizedData }: IconGridProps) => {
  const { viewport } = sizedData;

  // greedy algorithm to get the best fit for the icons
  const getBestFit = (icons: TechIconWithOffset[]) => {
    let bestFit = { columns: 1, rows: 1 } as {
      columns: number;
      rows: number;
      itemWidth: number;
      itemHeight: number;
    };
    let bestScore = Infinity;

    for (let columns = 2; columns <= 5; columns++) {
      const rows = Math.ceil(icons.length / columns);
      const itemWidth = viewport.width / columns;
      const itemHeight = viewport.height / rows;
      const aspectRatio = itemWidth / itemHeight;
      const idealAspectRatio = 1;
      const score = Math.abs(aspectRatio - idealAspectRatio);
      if (score < bestScore) {
        bestFit = { columns, rows, itemWidth, itemHeight };
        bestScore = score;
      }
    }
    return bestFit;
  };

  const { columns, rows, itemWidth, itemHeight } = getBestFit(icons);
  const spacingX = itemWidth;
  const spacingY = itemHeight;

  const offsetX = ((columns - 1) * spacingX) / 2;
  const offsetY = ((rows - 1) * spacingY) / 2;
  return (
    <group>
      {icons.map((icon, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);

        const x = col * spacingX - offsetX + (icon.xOffset || 0);
        const y = -row * spacingY + offsetY + (icon.yOffset || 0);

        return (
          <TechIcon
            key={index}
            model={icon}
            position={[x, y, 0]}
            resetTrigger={resetTrigger}
            initialPosition={[x, y, 0]}
            sizedData={sizedData}
          />
        );
      })}
    </group>
  );
});

export default TechCanvas;
