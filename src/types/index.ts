import type { Vector3 } from "three";
import type { IconType } from "react-icons";

export type Language = "en" | "fr";

/** A value translated into every supported language. */
export type Translated<T = string> = Record<Language, T>;

export interface Project {
  id: number;
  title: string;
  desc: Translated;
  stack: string[];
  thumbnail?: string;
  carousel?: string[];
  imagePath?: string;
  videoPath?: string;
  githubUrl?: string;
  readmeUrl?: string;
  liveUrl?: string;
  bgColor?: string;
}

export interface ExperienceCard {
  logoPath: string;
  iconPath: string;
  imgScale?: number;
  title: Translated;
  date: Translated;
  location: Translated;
  institution?: Translated;
  details: Translated<string[]>;
}

export interface ExperienceTab {
  title: Translated;
  sub: Translated;
  tabLabel: Translated;
}

export interface SectionHeader {
  title: Translated;
  sub: Translated;
  tip?: Translated;
}

export interface NavLink {
  href: string;
  Icon: IconType;
  title: Translated;
}

export interface NavBarImage {
  src: string;
  alt: Translated;
}

export interface HeroWord {
  text: string;
  imgPath: string;
}

export interface TechIconDef {
  name: string;
  modelPath: string;
  imgPath: string;
  scale: number;
  rotation: [number, number, number];
  position?: [number, number, number];
  textPosition?: [number, number, number];
  verified?: boolean;
  xOffset?: number;
}

export interface TechStackGroup {
  name: Translated;
  icons: TechIconDef[];
}

export interface Credit {
  name: string;
  url: string;
  msg: Translated;
}

export interface VideoClip {
  title: string;
  url: string;
  type: string;
}

export interface WindowLabel {
  header: Translated;
  icon: string;
}

/** The room item a visitor has focused in the 3D hero scene. */
export interface SelectedItem {
  name: string;
  position: Vector3;
  details?: Translated;
}
