import {
  FaGlobe,
  FaList,
  FaCode,
  FaBrain,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaDownload,
  FaMailBulk,
} from "react-icons/fa";

const MODE = import.meta.env.VITE_MODE;
let BUCKET_URL = "";
if (MODE === "production") {
  BUCKET_URL = import.meta.env.VITE_BUCKET_URL;
}

const assetsPaths = {
  files: {
    resume: `${BUCKET_URL}/files/kalev-keil-resume.pdf`,
  },
  fonts: {
    mona_sans_extralight_regular: `${BUCKET_URL}/fonts/Mona_Sans_ExtraLight_Regular.json`,
    mona_sans_extralight_italic: `${BUCKET_URL}/fonts/Mona_Sans_ExtraLight_Italic.json`,
  },
  images: {
    heroWords: {
      ideas: `${BUCKET_URL}/images/ideas.svg`,
      concepts: `${BUCKET_URL}/images/concepts.svg`,
      designs: `${BUCKET_URL}/images/designs.svg`,
      code: `${BUCKET_URL}/images/code.svg`,
    },
    desktop: {
      folder: `${BUCKET_URL}/images/folder.svg`,
      videos: `${BUCKET_URL}/images/videos.svg`,
      credits: `${BUCKET_URL}/images/credits.svg`,
      resume: `${BUCKET_URL}/images/resume.png`,
      mail: `${BUCKET_URL}/images/mail.webp`,
      logo: `${BUCKET_URL}/images/kk-logo.svg`,
    },
    profile_pics: [
      `${BUCKET_URL}/images/kalev.png`,
      `${BUCKET_URL}/images/kalev-football.jpg`,
    ],
    logos: {
      noways_icon: `${BUCKET_URL}/images/logos/noways-icon.jpeg`,
      noways_logo: `${BUCKET_URL}/images/logos/noways.png`,
      cavitry_icon: `${BUCKET_URL}/images/logos/cavitry-icon.svg`,
      cavitry_logo: `${BUCKET_URL}/images/logos/cavitry.svg`,
      epita_icon: `${BUCKET_URL}/images/logos/epita-icon.png`,
      epita_logo: `${BUCKET_URL}/images/logos/epita.png`,
      guardian_life_logo: `${BUCKET_URL}/images/logos/guardian-life.webp`,
      harvard_icon: `${BUCKET_URL}/images/logos/harvard-icon.png`,
      harvard_logo: `${BUCKET_URL}/images/logos/harvard.svg`,
      nvidia_icon: `${BUCKET_URL}/images/logos/nvidia-icon.png`,
      nvidia_logo: `${BUCKET_URL}/images/logos/nvidia.png`,
      qrc_icon: `${BUCKET_URL}/images/logos/qrc-icon.webp`,
      qrc_logo: `${BUCKET_URL}/images/logos/qrc.png`,
      solutionsconsuling_logo: `${BUCKET_URL}/images/logos/solutionsconsulting.png`,
      tsz_logo: `${BUCKET_URL}/images/logos/tsz.svg`,
    },
    projects: {
      amazon: [
        `${BUCKET_URL}/images/projects/amazon/amazon-1.png`,
        `${BUCKET_URL}/images/projects/amazon/amazon-2.png`,
        `${BUCKET_URL}/images/projects/amazon/amazon-3.png`,
        `${BUCKET_URL}/images/projects/amazon/amazon-4.png`,
        `${BUCKET_URL}/images/projects/amazon/amazon-5.png`,
        `${BUCKET_URL}/images/projects/amazon/amazon-6.png`,
        `${BUCKET_URL}/images/projects/amazon/amazon-7.png`,
      ],
      epidashboard: [
        `${BUCKET_URL}/images/projects/epidashboard/epidashboard-1.png`,
        `${BUCKET_URL}/images/projects/epidashboard/epidashboard-2.png`,
        `${BUCKET_URL}/images/projects/epidashboard/epidashboard-3.png`,
        `${BUCKET_URL}/images/projects/epidashboard/epidashboard-4.png`,
        `${BUCKET_URL}/images/projects/epidashboard/epidashboard-5.png`,
      ],
      netflix: [
        `${BUCKET_URL}/images/projects/netflix/netflix-1.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-2.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-3.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-4.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-5.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-6.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-7.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-8.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-9.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-10.png`,
        `${BUCKET_URL}/images/projects/netflix/netflix-11.png`,
      ],
      options: [
        `${BUCKET_URL}/images/projects/options/options-1.png`,
        `${BUCKET_URL}/images/projects/options/options-2.png`,
        `${BUCKET_URL}/images/projects/options/options-3.png`,
        `${BUCKET_URL}/images/projects/options/options-4.png`,
        `${BUCKET_URL}/images/projects/options/options-5.png`,
        `${BUCKET_URL}/images/projects/options/options-6.png`,
        `${BUCKET_URL}/images/projects/options/options-7.png`,
        `${BUCKET_URL}/images/projects/options/options-8.png`,
        `${BUCKET_URL}/images/projects/options/options-9.png`,
      ],
      pokebattle: [
        `${BUCKET_URL}/images/projects/pokebattle/pokebattle-1.png`,
        `${BUCKET_URL}/images/projects/pokebattle/pokebattle-2.png`,
        `${BUCKET_URL}/images/projects/pokebattle/pokebattle-3.png`,
        `${BUCKET_URL}/images/projects/pokebattle/pokebattle-4.png`,
        `${BUCKET_URL}/images/projects/pokebattle/pokebattle-5.png`,
      ],
      statroom: [
        `${BUCKET_URL}/images/projects/statroom/statroom-1.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-2.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-3.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-4.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-5.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-6.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-7.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-8.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-9.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-10.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-11.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-12.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-13.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-14.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-15.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-16.png`,
        `${BUCKET_URL}/images/projects/statroom/statroom-17.png`,
      ],
      tictactoe: [
        `${BUCKET_URL}/images/projects/tictactoe/tictactoe-1.png`,
        `${BUCKET_URL}/images/projects/tictactoe/tictactoe-2.png`,
        `${BUCKET_URL}/images/projects/tictactoe/tictactoe-3.png`,
        `${BUCKET_URL}/images/projects/tictactoe/tictactoe-4.png`,
      ],
      twitter: [
        `${BUCKET_URL}/images/projects/twitter/twitter-1.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-2.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-3.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-4.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-5.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-6.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-7.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-8.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-9.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-10.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-11.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-12.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-13.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-14.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-15.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-16.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-17.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-18.png`,
        `${BUCKET_URL}/images/projects/twitter/twitter-19.png`,
      ],
      uber: [
        `${BUCKET_URL}/images/projects/uber/uber-1.png`,
        `${BUCKET_URL}/images/projects/uber/uber-2.png`,
        `${BUCKET_URL}/images/projects/uber/uber-3.png`,
        `${BUCKET_URL}/images/projects/uber/uber-4.png`,
        `${BUCKET_URL}/images/projects/uber/uber-5.png`,
        `${BUCKET_URL}/images/projects/uber/uber-6.png`,
        `${BUCKET_URL}/images/projects/uber/uber-7.png`,
        `${BUCKET_URL}/images/projects/uber/uber-8.png`,
        `${BUCKET_URL}/images/projects/uber/uber-9.png`,
        `${BUCKET_URL}/images/projects/uber/uber-10.png`,
        `${BUCKET_URL}/images/projects/uber/uber-11.png`,
        `${BUCKET_URL}/images/projects/uber/uber-12.png`,
        `${BUCKET_URL}/images/projects/uber/uber-13.png`,
        `${BUCKET_URL}/images/projects/uber/uber-14.png`,
        `${BUCKET_URL}/images/projects/uber/uber-15.png`,
        `${BUCKET_URL}/images/projects/uber/uber-16.png`,
        `${BUCKET_URL}/images/projects/uber/uber-17.png`,
      ],
    },
  },
  videos: {
    projects: {
      pokebattle: `${BUCKET_URL}/videos/projects/pokebattle-demo.mp4`,
      statroom: `${BUCKET_URL}/videos/projects/statroom-demo.mp4`,
      uber: `${BUCKET_URL}/videos/projects/uber-demo.mp4`,
    },
    clips: [
      `${BUCKET_URL}/videos/clips/hv1.MOV`,
      `${BUCKET_URL}/videos/clips/hv2.MOV`,
      `${BUCKET_URL}/videos/clips/hv3.MOV`,
      `${BUCKET_URL}/videos/clips/hv4.MOV`,
      `${BUCKET_URL}/videos/clips/hv5.MOV`,
      `${BUCKET_URL}/videos/clips/hv6.MOV`,
      `${BUCKET_URL}/videos/clips/hv7.MOV`,
      `${BUCKET_URL}/videos/clips/hv8.MOV`,
      `${BUCKET_URL}/videos/clips/hv9.MOV`,
      `${BUCKET_URL}/videos/clips/hv10.MOV`,
      `${BUCKET_URL}/videos/clips/hv11.MOV`,
      `${BUCKET_URL}/videos/clips/hv12.MOV`,
      `${BUCKET_URL}/videos/clips/hv13.MOV`,
      `${BUCKET_URL}/videos/clips/hv14.MOV`,
      `${BUCKET_URL}/videos/clips/hv15.MOV`,
      `${BUCKET_URL}/videos/clips/hv16.MOV`,
      `${BUCKET_URL}/videos/clips/hv17.MOV`,
      `${BUCKET_URL}/videos/clips/hv18.MOV`,
      `${BUCKET_URL}/videos/clips/hv19.MOV`,
      `${BUCKET_URL}/videos/clips/hv20.MOV`,
      `${BUCKET_URL}/videos/clips/hv21.MOV`,
    ],
  },
  sounds: {
    click: `${BUCKET_URL}/sounds/click.mp3`,
  },

  models: {
    hero: {
      bedroom: `${BUCKET_URL}/models/hero/bedroom.glb`,
      cleats: `${BUCKET_URL}/models/hero/cleats.glb`,
      dumbbell: `${BUCKET_URL}/models/hero/dumbbell.glb`,
      football: `${BUCKET_URL}/models/hero/football.glb`,
      pikachu: `${BUCKET_URL}/models/hero/pikachu.glb`,
      rubik: `${BUCKET_URL}/models/hero/rubik.glb`,
      spiderman: `${BUCKET_URL}/models/hero/spiderman.glb`,
      ttflag: `${BUCKET_URL}/models/hero/ttflag.glb`,
    },
    skills: {
      aws: `${BUCKET_URL}/models/skills/aws.glb`,
      azure: `${BUCKET_URL}/models/skills/azure.glb`,
      csharp: `${BUCKET_URL}/models/skills/csharp.glb`,
      django: `${BUCKET_URL}/models/skills/django.glb`,
      docker: `${BUCKET_URL}/models/skills/docker.glb`,
      dotnet: `${BUCKET_URL}/models/skills/dotnet.glb`,
      express: `${BUCKET_URL}/models/skills/express.glb`,
      fastapi: `${BUCKET_URL}/models/skills/fastapi.glb`,
      firebase: `${BUCKET_URL}/models/skills/firebase.glb`,
      flask: `${BUCKET_URL}/models/skills/flask.glb`,
      git: `${BUCKET_URL}/models/skills/git.glb`,
      htmx: `${BUCKET_URL}/models/skills/htmx.glb`,
      javascript: `${BUCKET_URL}/models/skills/javascript.glb`,
      mongodb: `${BUCKET_URL}/models/skills/mongodb.glb`,
      mysql: `${BUCKET_URL}/models/skills/mysql.glb`,
      neo4j: `${BUCKET_URL}/models/skills/neo4j.glb`,
      next: `${BUCKET_URL}/models/skills/next.glb`,
      php: `${BUCKET_URL}/models/skills/php.glb`,
      postgresql: `${BUCKET_URL}/models/skills/postgresql.glb`,
      python: `${BUCKET_URL}/models/skills/python.glb`,
      qc: `${BUCKET_URL}/models/skills/qc.glb`,
      react: `${BUCKET_URL}/models/skills/react.glb`,
      redis: `${BUCKET_URL}/models/skills/redis.glb`,
      rust: `${BUCKET_URL}/models/skills/rust.glb`,
      sql: `${BUCKET_URL}/models/skills/sql.glb`,
      sqlite: `${BUCKET_URL}/models/skills/sqlite.glb`,
      streamlit: `${BUCKET_URL}/models/skills/streamlit.glb`,
      tailwind: `${BUCKET_URL}/models/skills/tailwind.glb`,
      three: `${BUCKET_URL}/models/skills/three.glb`,
      typescript: `${BUCKET_URL}/models/skills/typescript.glb`,
    },
    skills_as_img: {
      aws: `${BUCKET_URL}/models/skills_img/aws.svg`,
      azure: `${BUCKET_URL}/models/skills_img/azure.svg`,
      csharp: `${BUCKET_URL}/models/skills_img/csharp.svg`,
      django: `${BUCKET_URL}/models/skills_img/django.svg`,
      docker: `${BUCKET_URL}/models/skills_img/docker.svg`,
      dotnet: `${BUCKET_URL}/models/skills_img/dotnet.png`,
      express: `${BUCKET_URL}/models/skills_img/express.png`,
      fastapi: `${BUCKET_URL}/models/skills_img/fastapi.svg`,
      firebase: `${BUCKET_URL}/models/skills_img/firebase.svg`,
      flask: `${BUCKET_URL}/models/skills_img/flask.png`,
      git: `${BUCKET_URL}/models/skills_img/git.svg`,
      htmx: `${BUCKET_URL}/models/skills_img/htmx.png`,
      javascript: `${BUCKET_URL}/models/skills_img/javascript.svg`,
      mongodb: `${BUCKET_URL}/models/skills_img/mongodb.svg`,
      mysql: `${BUCKET_URL}/models/skills_img/mysql.svg`,
      neo4j: `${BUCKET_URL}/models/skills_img/neo4j.png`,
      next: `${BUCKET_URL}/models/skills_img/next.png`,
      php: `${BUCKET_URL}/models/skills_img/php.png`,
      postgresql: `${BUCKET_URL}/models/skills_img/postgresql.svg`,
      python: `${BUCKET_URL}/models/skills_img/python.svg`,
      qc: `${BUCKET_URL}/models/skills_img/qc.png`,
      react: `${BUCKET_URL}/models/skills_img/react.svg`,
      redis: `${BUCKET_URL}/models/skills_img/redis.svg`,
      rust: `${BUCKET_URL}/models/skills_img/rust.png`,
      sql: `${BUCKET_URL}/models/skills_img/sql.png`,
      sqlite: `${BUCKET_URL}/models/skills_img/sqlite.png`,
      streamlit: `${BUCKET_URL}/models/skills_img/streamlit.svg`,
      tailwind: `${BUCKET_URL}/models/skills_img/tailwind.svg`,
      three: `${BUCKET_URL}/models/skills_img/three.png`,
      typescript: `${BUCKET_URL}/models/skills_img/typescript.svg`,
    },
  },
};


// contact info
const contactInfo = {
  email: "kalev-giovanni.keil@epita.fr",
  github: "https://github.com/kodev8",
  linkedin: "https://linkedin.com/in/kalev-keil",
  resume: assetsPaths.files.resume,
};

const videos = assetsPaths.videos.clips.map((video, index) => ({
  title: `Clip ${index + 1}`,
  url: video,
  type: "local",
}));



// ---------------------------------- NAV BAR ----------------------------------
const navLinksTranslations = {
  about: {
    href: "#about",
    Icon: FaGlobe,
    title: {
      en: "About",
      fr: "À propos",
    },
  },
  experience: {
    href: "#experience",
    Icon: FaList,
    title: {
      en: "Experience",
      fr: "Expérience",
    },
  },
  projects: {
    href: "#projects",
    Icon: FaCode,
    title: {
      en: "Projects",
      fr: "Projets",
    },
  },
  skills: {
    href: "#skills",
    Icon: FaBrain,
    title: {
      en: "Skills",
      fr: "Compétences",
    },
  },
  contact: {
    href: "#contact",
    Icon: FaMailBulk,
    title: {
      en: "Contact",
      fr: "Contact",
    },
  },
  email: {
    href: `mailto:${contactInfo.email}`,
    Icon: FaEnvelope,
    title: {
      en: "Email",
      fr: "Email",
    },
  },
  linkedin: {
    href: contactInfo.linkedin,
    Icon: FaLinkedin,
    title: {
      en: "LinkedIn",
      fr: "LinkedIn",
    },
  },
  github: {
    href: contactInfo.github,
    Icon: FaGithub,
    title: {
      en: "GitHub",
      fr: "GitHub",
    },
  },
  resume: {
    href: contactInfo.resume,
    Icon: FaDownload,
    title: {
      en: "Download Resume",
      fr: "Télécharger le CV",
    },
  },
};

const navLinks = Object.keys(navLinksTranslations).map(
  (key) => navLinksTranslations[key]
);

const topNavLinks = [
  navLinksTranslations.about,
  navLinksTranslations.experience,
  navLinksTranslations.projects,
  navLinksTranslations.skills,
];

const navBarImages = [
  {
    src: assetsPaths.images.profile_pics[0],
    alt: {
      en: "Professional Me",
      fr: "Moi - professionnel",
    },
  },
  {
    src: assetsPaths.images.profile_pics[1],
    alt: {
      en: "Football Me",
      fr: "Moi - football",
    },
  },
];

// ---------------------------------- HERO ----------------------------------
const heroWords = {
  engineering: {
    en: "Engineering",
    fr: "Ingénierie",
  },
  innovativeSolutions: {
    en: "into Innovative Solutions",
    fr: "vers des solutions innovantes",
  },
  greeting: {
    en: "Hi, I'm Kalev —",
    fr: "Salut, je suis Kalev —",
  },
  fullStackDeveloper: {
    en: "a full-stack developer based in Paris, France.",
    fr: "un développeur full-stack basé à Paris, France.",
  },
  currently: {
    en: "I'm currently an intern at",
    fr: "Je suis actuellement un stagiaire à",
  },
  lookingFor: {
    en: "looking for a full-time internship",
    fr: "à la recherche d'un stage de 6 mois",
  },
  opportunities: {
    en: "where I can apply my skills, learn, and contribute to real-world projects.",
    fr: "où je peux appliquer mes compétences, apprendre et contribuer à des projets du monde réel.",
  },
  softwareEngineer: {
    en: "a software engineer based in Paris, France.",
    fr: "un ingénieur logiciel basé à Paris, France.",
  },
  noways: {
    en: "Noways",
    fr: "Noways",
  },
  focus: {
    en: "focusing on",
    fr: "spécialisé dans",
  },
  cloudandnetwork: {
    en: "cloud engineering and network security.",
    fr: "l'ingénierie cloud et la sécurité réseau.",
  },
  viewProjects: {
    en: "View my projects",
    fr: "Voir mes projets",
  },
  aboutMeIndicator: {
    en: "The scene below is a 3D model of my room to help you learn more about me outside of work. Click on ringed items or the monitor!",
    fr: "La scène ci-dessous est un modèle 3D de ma chambre pour vous aider à en savoir plus sur moi en dehors du travail. Cliquez sur les objets entourés ou le moniteur!",
  },
  wantToKnowMore: {
    en: "Want to know more about me outside of work?",
    fr: "Voulez-vous en savoir plus sur moi en dehors du travail?",
  },
  clickToExplore: {
    en: "Click to explore my space outside work — my hobbies, interests, and personal life by interacting with the items in the room.",
    fr: "Cliquez pour explorer mon espace en dehors du travail — mes loisirs, mes intérêts et ma vie personnelle en interagissant avec les objets dans la pièce.",
  },
  enterMyRoom: {
    en: "Enter My Room 🛋️",
    fr: "Entrer dans ma chambre 🛋️",
  },
  newTab: {
    en: "new",
    fr: "nouveau",
  },
};

const wordsInitial = {
  en: [
    { text: "Ideas", imgPath: assetsPaths.images.heroWords.ideas },
    { text: "Concepts", imgPath: assetsPaths.images.heroWords.concepts },
    { text: "Designs", imgPath: assetsPaths.images.heroWords.designs },
    { text: "Code", imgPath: assetsPaths.images.heroWords.code },
  ],
  fr: [
    { text: "Idées", imgPath: assetsPaths.images.heroWords.ideas },
    { text: "Concepts", imgPath: assetsPaths.images.heroWords.concepts },
    { text: "Designs", imgPath: assetsPaths.images.heroWords.designs },
    { text: "Code", imgPath: assetsPaths.images.heroWords.code },
  ],
};

const words = {
  en: [...wordsInitial.en, ...wordsInitial.en],
  fr: [...wordsInitial.fr, ...wordsInitial.fr],
};

// ---------------------------------- HERO_EXPERIENCE ----------------------------------

const aboutMe = {
  pikachu: {
    en: "I've been a Pokémon fan since I was younger, starting with Pokémon Red on the Game Boy and continuing through to Leaf Green. I even created a game called <a href='https://kodev8.itch.io/pokebattle' target='_blank'>Pokebattle</a> using Python and Pygame, a small replica of the early Pokémon games (you can check it in the projects section).",
    fr: "Je suis un fan de Pokémon depuis que j'étais plus jeune, commençant par Pokémon Rouge sur Game Boy et continuant avec Pokémon Vert Feuille. J'ai même créé un jeu appelé <a href='https://kodev8.itch.io/pokebattle' target='_blank'>Pokebattle</a> en utilisant Python et Pygame, une petite réplique des premiers jeux Pokémon (vous pouvez la vérifier dans la section projets).",
  },

  football: {
    en: "Football has been a huge part of my life, and it's given me the opportunity to travel the world, from Portugal to France to the UK. I've even played semi-professionally! Football is not just a hobby, it's a passion that will always be a part of me. You can check the monitor for some clips of me playing (from a long time ago😅)",
    fr: "Le football a été une partie importante de ma vie, et il m'a permis de voyager dans le monde, de Portugal à la France et au Royaume-Uni. J'ai même joué semi-professionnellement ! Le football n'est pas juste un loisir, c'est une passion qui sera toujours une partie de moi. Vous pouvez vérifier le moniteur pour quelques clips de moi qui jouent (il y a longtemps maintenant😅)",
  },

  rubik: {
    en: "The Rubik's Cube sparked my interest in algorithms at a young age. I keep one at my desk to practice occasionally. I'm even building a virtual Rubik's Cube solver for my website.",
    fr: "Le cube de Rubik a suscité mon intérêt pour les algorithmes dès mon enfance. Je garde un cube à mon bureau pour m'entraîner occasionnellement. Je construis même un solveur de cube de Rubik virtuel pour mon site web.",
  },

  lego: {
    en: "I recently built a Lego Spiderman that I got at a Christmas market here in Paris. I enjoy the simple yet satisfying puzzles Lego provides, whether solo or with friends—it's a fun and relaxing activity.",
    fr: "Je construis récemment un Lego Spiderman que j'ai acheté à un marché de Noël ici à Paris. J'apprécie les puzzles simples mais satisfaisants que Lego offre, que ce soit en solo ou avec des amis—c'est une activité amusante et relaxante.",
  },

  trinidad: {
    en: "Born and raised in <a href='https://en.wikipedia.org/wiki/Trinidad_and_Tobago' target='_blank'>Trinidad and Tobago</a>! I'm proud to be 'Trini to d bone!'",
    fr: "Né et élevé à <a href='https://en.wikipedia.org/wiki/Trinidad_and_Tobago' target='_blank'>Trinidad and Tobago</a>! Je suis fier de dire que je suis 'Trini to d bone!'",
  },

  gym: {
    en: "As an athlete also, I spend a lot of time in the gym to keep fit and stay healthy. I've been lifting for a while to compliment my football training and have always enjoyed it.",
    fr: "En tant qu'un athlète aussi, je passe beaucoup de temps au gymnase pour rester en forme et en bonne santé. Je fais du lifting depuis un moment pour complémenter mon entraînement de football et j'ai toujours aimé ça.",
  },
};

const canvasWarning = {
  en: "This experience is best viewed on a larger screen! But you can still try ;)",
  fr: "Cette expérience est mieux vue sur un écran plus grand! Mais vous pouvez toujours essayer ;)",
};


const credits = [
  {
    name: "Lama Dev",
    url: "https://www.youtube.com/watch?v=KGCMSaEWPVs",
    msg: {
      en: "Thanks for helping me get started!",
      fr: "Merci pour m'avoir aidé à commencer!",
    },
  },
  {
    name: "Javascript Mastery",
    url: "https://www.youtube.com/watch?v=E-fdPfRxkzQ&t=6103s&pp=ygUXanMgbWFzdGVyeSAzZCBwb3J0Zm9saW8%3D",
    msg: {
      en: "Thanks for the inspiration for layout and design!",
      fr: "Merci pour l'inspiration pour le layout et le design!",
    },
  },
  {
    name: "Joan Ramos Refusta",
    url: "https://joanramosrefusta.com",
    msg: {
      en: "Thanks for the cool interactive ideas!",
      fr: "Merci pour les idées interactives cool!",
    },
  },
  {
    name: "Sketch Fab",
    url: "https://sketchfab.com",
    msg: {
      en: "Thanks to all the 3d designer for their models (I have no clue how to make them)",
      fr: "Merci à tous les designers 3D pour leurs modèles (je n'ai aucune idée de la façon de les faire)",
    },
  },
];

const windowLabels = {
  projects: {
    header: {
      en: "Projects",
      fr: "Projets",
    },
    icon: assetsPaths.images.desktop.folder,
  },
  videos: {
    header: {
      en: "Videos",
      fr: "Vidéos",
    },
    icon: assetsPaths.images.desktop.videos,
  },
  credits: {
    header: {
      en: "Credits",
      fr: "Crédits",
    },
    icon: assetsPaths.images.desktop.credits,
  },
  resume: {
    header: {
      en: "Resume",
      fr: "CV",
    },
    icon: assetsPaths.images.desktop.resume,
  },
  contact: {
    header: {
      en: "Contact",
      fr: "Contact",
    },
    icon: assetsPaths.images.desktop.mail,
  },
};

const desktopProjectsText = {
  backToProjects: {
    en: "Back to Projects",
    fr: "Retour aux Projets",
  },
  aboutThisProject: {
    en: "All about this project",
    fr: "Tout sur ce projet",
  },
};

const viewLiveText = {
  en: "View Live",
  fr: "Voir en action",
};

const viewGitHubText = {
  en: "View GitHub",
  fr: "Voir sur GitHub",
};

const previousText = {
  en: "Previous",
  fr: "Précédent",
};

const nextText = {
  en: "Next",
  fr: "Suivant",
};

const contactText = {
  en: "Contact Me",
  fr: "Contactez-moi",
};

const downloadResumeText = {
  en: "Download Resume",
  fr: "Télécharger le CV",
};

// ---------------------------------- EXPERIENCE ----------------------------------

const experienceText = {
  details: {
    en: "Details",
    fr: "Détails",
  },
};

const expWorkCards = [
  {
    logoPath: assetsPaths.images.logos.noways_logo,
    imgScale: 0.8,
    iconPath: assetsPaths.images.logos.noways_icon,
    title: {
      en: "Software Engineer Intern",
      fr: "Stagiaire Ingénieur Logiciel",
    },
    date: {
      en: "July 2025 - Present",
      fr: "Juillet 2025 - Présent",
    },
    location: {
      en: "Noways, Paris, France",
      fr: "Noways, Paris, France",
    },
    details: {
      en: [
        "Implementation of the network digital twin to optimize network and cloud performance and security",
        "Creating a ci/cd pipeline tool to automate the deployment of cloud infrastructure and network security solutions",
      ],
      fr: [
        "Implémentation du twin numérique de réseau pour optimiser les performances et la sécurité du réseau et du cloud",
        "Création d'un outil de pipeline ci/cd pour automatiser le déploiement de l'infrastructure cloud et des solutions de sécurité réseau",
      ],
    },
    gradient: "from-white via-slate-300 to-white",
  },
  {
    logoPath: assetsPaths.images.logos.cavitry_logo,
    imgScale: 0.8,
    iconPath: assetsPaths.images.logos.cavitry_icon,
    title: {
      en: "Data Analyst Assistant & Assistant Coach",
      fr: "Assistant Analyste de Données & Assistant Coach",
    },
    date: {
      en: "June 2023 - August 2023",
      fr: "Juin 2023 - Août 2023",
    },
    location: {
      en: "CA Vitry, France",
      fr: "CA Vitry, France",
    },
    details: {
      en: [
        "Provided reports and corrected player and club data, including licenses, finances, and schedules.",
        "Served as assistant coach for the U16 team during the 2022/2023 season.",
      ],
      fr: [
        "Fourni des rapports et corrigé les données des joueurs et des clubs, y compris les licences, les finances et les horaires.",
        "Servi comme assistant coach de l'équipe U16 pendant la saison 2022/2023.",
      ],
    },
    gradient: "from-yellow-500 via-green-500 to-yellow-500",
  },
  {
    logoPath: assetsPaths.images.logos.guardian_life_logo,
    iconPath: assetsPaths.images.logos.guardian_life_logo,
    title: {
      en: "Pension Assistant - Group Pensions Department",
      fr: "Assistant de Pension - Département des Pensions Groupées",
    },
    date: {
      en: "July 2020 - September 2020, January 2022 - June 2022",
      fr: "Juillet 2020 - Septembre 2020, Janvier 2022 - Juin 2022",
    },
    location: {
      en: "Guardian Life of The Caribbean Limited, Trinidad & Tobago",
      fr: "Guardian Life of The Caribbean Limited, Trinidad & Tobago",
    },
    details: {
      en: [
        "Entered employee data for multiple pension plans.",
        "Generated reports and performed data analysis for members and employers.",
      ],
      fr: [
        "Effectué l'entrée des données des employés pour plusieurs plans de pension.",
        "Généré des rapports et effectué une analyse des données des membres et des employeurs.",
      ],
    },
    gradient: "from-yellow-500 via-orange-500 to-white",
  },
  {
    logoPath: assetsPaths.images.logos.solutionsconsuling_logo,
    iconPath: assetsPaths.images.logos.solutionsconsuling_logo,
    imgScale: 0.8,
    title: {
      en: "Data Entry Clerk",
      fr: "Assistant de Classement des Données",
    },
    date: {
      en: "June 2019 - July 2019",
      fr: "Juin 2019 - Juillet 2019",
    },
    location: {
      en: "Solutions Consulting, Trinidad & Tobago",
      fr: "Solutions Consulting, Trinidad & Tobago",
    },
    details: {
      en: [
        "Reconciled monthly and annual staff movement data.",
        "Identified and reported inconsistencies in source data.",
      ],
      fr: [
        "Réconcilié les données de mouvement des employés mensuelles et annuelles.",
        "Identifié et signalé les incohérences dans les données sources.",
      ],
    },
    gradient: "from-white via-slate-300 to-white",
  },
  {
    logoPath: assetsPaths.images.logos.tsz_logo,
    iconPath: assetsPaths.images.logos.tsz_logo,
    imgScale: 0.8,
    title: {
      en: "Administrative Assistant",
      fr: "Assistant Administratif",
    },
    date: {
      en: "July 2018 - August 2018",
      fr: "Juillet 2018 - Août 2018",
    },
    location: {
      en: "The School Zone, Trinidad & Tobago",
      fr: "The School Zone, Trinidad & Tobago",
    },
    details: {
      en: [
        "Coordinated packaging and distribution of school products.",
        "Handled filing and data entry responsibilities.",
        "Organized package delivery logistics.",
      ],
      fr: [
        "Coordiné le packaging et la distribution de produits scolaires.",
        "Géré les responsabilités de classement et d'entrée de données.",
        "Organisé les logistiques de livraison des colis.",
      ],
    },
    gradient: "from-white via-slate-300 to-white",
  },
];

const expEducationCards = [
  {
    logoPath: assetsPaths.images.logos.epita_logo,
    iconPath: assetsPaths.images.logos.epita_icon,
    title: {
      en: "Bachelor of Computer Science",
      fr: "Licence en Informatique",
    },
    location: {
      en: "Paris, France",
      fr: "Paris, France",
    },
    institution: {
      en: "EPITA - School of Engineering and Computer Science",
      fr: "EPITA - École pour l'Informatique et les Technologies Avancées",
    },
    date: {
      en: "September 2022 - Present",
      fr: "Septembre 2022 - Présent",
    },
    details: {
      en: [
        "Completed a comprehensive curriculum in computer science, including programming, data structures, algorithms, and software engineering.",
        "Gained hands-on experience through various projects and internships.",
        "Developed strong problem-solving skills and a solid foundation in computer science principles.",
      ],
      fr: [
        "Complété un cursus complet en informatique, y compris la programmation, les structures de données, les algorithmes et l'ingénierie logicielle.",
        "Gagné des compériences pratiques grâce à divers projets et stages.",
        "Développé des compériences en résolution de problèmes et une solide base en principes de l'informatique.",
      ],
    },
    gradient: "from-white to-blue-500",
  },
  {
    logoPath: assetsPaths.images.logos.qrc_logo,
    iconPath: assetsPaths.images.logos.qrc_icon,
    imgScale: 2.5,
    title: {
      en: "6th Form Education (CAPE)",
      fr: "Éducation au 6ème Forme (CAPE)",
    },
    institution: {
      en: "Queen's Royal College",
      fr: "Queen's Royal College",
    },
    location: {
      en: "Port of Spain, Trinidad & Tobago",
      fr: "Port of Spain, Trinidad & Tobago",
    },
    date: {
      en: "September 2017 - June 2019",
      fr: "Septembre 2017 - Juin 2019",
    },
    details: {
      en: [
        "Subjects: Pure Mathematics, Chemistry, Physics, Communication Studies, Caribbean Studies.",
        "Graduated with all Grade 1s and A profiles.",
        "CAPE National Open Scholarship Recipient (2019).",
        "Trinidad and Tobago National Merit List in Chemistry and Caribbean Studies (2019).",
      ],
      fr: [
        "Matières: Mathématiques Pures, Chimie, Physique, Études des Communications, Études Caraïbes.",
        "Diplômé avec tous les grades 1 et des profils A.",
        "Bourse nationale d'ouverture du CAPE (2019).",
        "Liste nationale du Mérite de la République de Tobago en Chimie et Études Caraïbes (2019).",
      ],
    },
    gradient: "from-blue-500 to-[#62e0ff]",
  },
  {
    logoPath: assetsPaths.images.logos.qrc_logo,
    iconPath: assetsPaths.images.logos.qrc_icon,
    imgScale: 2.5,
    title: {
      en: "High School Education (CSEC)",
      fr: "Éducation au Lycée (CSEC)",
    },
    institution: {
      en: "Queen's Royal College",
      fr: "Queen's Royal College",
    },
    location: {
      en: "Port of Spain, Trinidad & Tobago",
      fr: "Port of Spain, Trinidad & Tobago",
    },
    date: {
      en: "September 2012 - June 2017",
      fr: "Septembre 2012 - Juin 2017",
    },
    details: {
      en: [
        "Subjects: Mathematics, English A, Spanish, Chemistry, Physics, Biology, French, Additional Mathematics, Literature.",
        "Graduated with all Grade 1s and A profiles.",
        "First Place in Chemistry and Additional Mathematics at CSEC level (2017).",
      ],
      fr: [
        "Matières: Mathématiques, Anglais A, Espagnol, Chimie, Physique, Biologie, Français, Mathématiques Supplémentaires, Littérature.",
        "Diplômé avec tous les grades 1 et des profils A.",
        "Premier place en Chimie et Mathématiques Supplémentaires au niveau du CSEC (2017).",
      ],
    },
    gradient: "from-blue-500 to-[#62e0ff]",
  },
];

const expCertifications = [
  {
    logoPath: assetsPaths.images.logos.nvidia_logo,
    iconPath: assetsPaths.images.logos.nvidia_icon,
    title: {
      en: "Data Parallelism: How to Train Deep Learning Models on Multiple GPUs",
      fr: "Parallélisme des Données: Comment Entraîner des Modèles de Deep Learning sur Plusieurs GPUs",
    },
    location: {
      en: "NVIDIA",
      fr: "NVIDIA",
    },
    date: {
      en: "April 2025",
      fr: "Avril 2025",
    },
    details: {
      en: [
        "Explored advanced techniques in distributing data across multiple GPUs to optimize performance in deep learning models.",
      ],
      fr: [
        "Exploré des techniques avancées pour distribuer les données sur plusieurs GPUs pour optimiser les performances des modèles de deep learning.",
      ],
    },
    gradient: "from-green-500 to-white",
  },
  {
    logoPath: assetsPaths.images.logos.nvidia_logo,
    iconPath: assetsPaths.images.logos.nvidia_icon,
    title: {
      en: "Fundamentals of Deep Learning",
      fr: "Fondamentaux du Deep Learning",
    },
    location: {
      en: "NVIDIA",
      fr: "NVIDIA",
    },
    date: {
      en: "February 2025",
      fr: "Février 2025",
    },
    details: {
      en: [
        "Covered core concepts in deep learning including neural networks, activation functions, and model evaluation.",
      ],
      fr: [
        "Couvert les concepts fondamentaux du deep learning incluant les réseaux de neurones, les fonctions d'activation et l'évaluation des modèles.",
      ],
    },
    gradient: "from-white to-green-500",
  },
  {
    logoPath: assetsPaths.images.logos.nvidia_logo,
    iconPath: assetsPaths.images.logos.nvidia_icon,
    title: {
      en: "Fundamentals of Accelerated Data Science",
      fr: "Fondamentaux de la Science des Données avec Accélération GPU",
    },
    location: {
      en: "NVIDIA",
      fr: "NVIDIA",
    },
    date: {
      en: "October 2024",
      fr: "Octobre 2024",
    },
    details: {
      en: [
        "Learned how to leverage GPU acceleration for data preprocessing, visualization, and machine learning workflows.",
      ],
      fr: [
        "Appris à utiliser l'accélération GPU pour le prétraitement des données, la visualisation et les workflows de machine learning.",
      ],
    },
    gradient: "from-green-500 to-white",
  },
  {
    logoPath: assetsPaths.images.logos.harvard_logo,
    iconPath: assetsPaths.images.logos.harvard_icon,
    title: {
      en: "CS50: Introduction to Computer Science",
      fr: "CS50: Introduction à la Science de l'Informatique",
    },
    location: {
      en: "Harvard University",
      fr: "Harvard University",
    },
    date: {
      en: "September 2020",
      fr: "Septembre 2020",
    },
    details: {
      en: [
        "Completed Harvard's renowned introductory course in computer science, covering C, Python, algorithms, data structures, and web development.",
      ],
      fr: [
        "Complété le cours de introduction à la science de l'informatique de Harvard, couvrant C, Python, algorithmes, structures de données et développement web.",
      ],
    },
    gradient: "from-white to-red-500",
  },
];

const experienceTabs = {
  work: {
    title: {
      en: "Work Experience",
      fr: "Expérience Professionnelle",
    },
    sub: {
      en: "💼 My Career Overview",
      fr: "💼 Mon Parcours Professionnel",
    },
    tabLabel: {
      en: "Work",
      fr: "Travail",
    },
  },
  education: {
    title: {
      en: "Education",
      fr: "Éducation",
    },
    sub: {
      en: "🎓 My Academic Journey",
      fr: "🎓 Mon Parcours Académique",
    },
    tabLabel: {
      en: "Education",
      fr: "Éducation",
    },
  },
  certifications: {
    title: {
      en: "Certifications",
      fr: "Certifications",
    },
    sub: {
      en: "🏆 My Certifications & Achievements",
      fr: "🏆 Mes Certifications & Réalisations",
    },
    tabLabel: {
      en: "Certifications",
      fr: "Certifications",
    },
  },
};

// ---------------------------------- PROJECTS ----------------------------------
const showCaseHeader = {
  title: {
    en: "Projects",
    fr: "Projets",
  },
  sub: {
    en: "⭐ Featured",
    fr: "⭐ En vedette",
  },
};
const projects = [
  {
    id: 1,
    title: "Statroom",
    desc: {
      en: "A data analysis platform built with a modern tech stack. Statroom leverages LangGraph for AI-powered data analysis, with a React frontend and FastAPI backend. The application uses both Neo4j and MongoDB for different data storage needs.",
      fr: "Une plateforme d'analyse de données construite avec un stack moderne. Statroom utilise LangGraph pour l'analyse de données avec intelligence artificielle, avec un frontend React et un backend FastAPI. L'application utilise à la fois Neo4j et MongoDB pour différentes besoins de stockage de données.",
    },
    thumbnail: assetsPaths.images.projects.statroom[0],
    carousel: assetsPaths.images.projects.statroom,
    stack: [
      "Python",
      "Langgraph",
      "SQL",
      "FastAPI",
      "Express",
      "React",
      "Tailwind CSS",
      "Neo4j",
      "MongoDB",
      "Shadcn/UI",
    ],
    videoPath: assetsPaths.videos.projects.statroom,
    githubUrl: "https://github.com/kodev8/statroom",
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/statroom/main/README.md",
    bgColor: "bg-slate-700",
  },
  {
    id: 2,
    title: "Options Tool",
    desc: {
      en: "A financial analysis tool for options trading built with Python and Streamlit. This tool leverages Yahoo Finance API to fetch real-time market data and uses Plotly for interactive data visualization, helping traders make informed decisions.",
      fr: "Une outil d'analyse financière pour le trading d'options construit avec Python et Streamlit. Cet outil utilise l'API Yahoo Finance pour récupérer des données de marché en temps réel et utilise Plotly pour la visualisation interactive des données, aidant les traders à prendre des décisions éclairées.",
    },
    stack: [
      "Python",
      "Streamlit",
      "Yahoo Finance API",
      "Plotly",
      "Pandas",
      "Numpy",
    ],
    thumbnail: assetsPaths.images.projects.options[0],
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/options-tool/main/README.md",
    githubUrl: "https://github.com/kodev8/options-tool",
    liveUrl: "https://options-tool.streamlit.app/",
    bgColor: "bg-slate-700",
    carousel: assetsPaths.images.projects.options,
  },
  {
    id: 4,
    title: "Uber Klone",
    desc: {
      en: "A clone of the Uber ride-sharing platform built with Flask. This project implements key Uber features with a clean, responsive interface and SQL database integration.",
      fr: "Un clone de la plateforme de partage de trajets Uber construit avec Flask. Ce projet implémente les fonctionnalités clés d'Uber avec une interface propre et réactive et une intégration de base de données SQL.",
    },
    stack: ["Python", "Flask", "htmx", "SQL", "HTML", "CSS", "JavaScript"],
    thumbnail: assetsPaths.images.projects.uber[0],
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/uber-klone/main/README.md",
    videoPath: assetsPaths.videos.projects.uber,
    githubUrl: "https://github.com/kodev8/uber-klone",
    liveUrl: "https://uber-klone.onrender.com",
    bgColor: "bg-slate-700",
    carousel: assetsPaths.images.projects.uber,
  },
  {
    id: 6,
    title: "Pokebattle",
    desc: {
      en: "A Pokémon battle simulator built with Pygame. This game recreates the classic Pokémon battle experience with data from the PokeAPI, featuring turn-based combat and authentic Pokémon mechanics.",
      fr: "Un simulateur de combat Pokémon construit avec Pygame. Ce jeu redonne l'expérience de combat Pokémon classique avec des données de l'API PokeAPI, avec un combat basé sur les tours et des mécaniques Pokémon authentiques.",
    },
    stack: ["Python", "Pygame", "Pygbug", "PokeAPI"],
    thumbnail: assetsPaths.images.projects.pokebattle[0],
    videoPath: assetsPaths.videos.projects.pokebattle,
    githubUrl: "https://github.com/kodev8/pokebattle",
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/pokebattle/main/README.md",
    liveUrl: "https://kodev8.itch.io/pokebattle",
    carousel: assetsPaths.images.projects.pokebattle,
  },
  {
    id: 7,
    title: "EPIDashboard",
    desc: {
      en: "A comprehensive dashboard application built with PHP and MySQL. This project features dynamic data visualization, user authentication, and responsive design for educational institution management.",
      fr: "Une application de tableau de bord complète construite avec PHP et MySQL. Ce projet présente la visualisation dynamique des données, l'authentification des utilisateurs et le design réactif pour la gestion des institutions éducatives.",
    },
    stack: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    thumbnail: assetsPaths.images.projects.epidashboard[0],
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/epidashboard-php/main/README.md",
    githubUrl: "https://github.com/kodev8/epidashboard-php",
    liveUrl: "https://github.com/kodev8/epidashboard-php",
    carousel: assetsPaths.images.projects.epidashboard,
  },
  {
    id: 3,
    title: "Amazon Klone",
    desc: {
      en: "A functional clone of Amazon's e-commerce platform built with Flask and HTMX. This project replicates core Amazon features with a responsive design and MongoDB integration for data storage.",
      fr: "Un clone fonctionnel de la plateforme e-commerce d'Amazon construite avec Flask et HTMX. Ce projet reproduit les fonctionnalités clés d'Amazon avec un design réactif et une intégration de MongoDB pour le stockage des données.",
    },
    stack: [
      "Python",
      "Flask",
      "htmx",
      "SQL",
      "HTML",
      "CSS",
      "JavaScript",
      "MongoDB",
    ],
    thumbnail: assetsPaths.images.projects.amazon[0],
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/amazon-klone/main/README.md",
    githubUrl: "https://github.com/kodev8/amazon-klone",
    liveUrl: "https://amazon-klone.onrender.com",
    carousel: assetsPaths.images.projects.amazon,
  },
  {
    id: 5,
    title: "TicTacToe with HTMX",
    desc: {
      en: "A modern implementation of the classic TicTacToe game using HTMX and Flask. This project demonstrates how to build interactive web applications with minimal JavaScript by leveraging HTMX for dynamic content updates.",
      fr: "Une implémentation moderne du célèbre jeu TicTacToe utilisant HTMX et Flask. Ce projet montre comment construire des applications web interactives avec peu de JavaScript en exploitant HTMX pour les mises à jour de contenu dynamiques.",
    },
    stack: ["Python", "Flask", "htmx", "SQL", "HTML", "CSS", "JavaScript"],
    thumbnail: assetsPaths.images.projects.tictactoe[0],
    githubUrl: "https://github.com/kodev8/tictactoe-htmx",
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/tictactoe-htmx/main/README.md",
    liveUrl: "https://tictactoe-htmx.onrender.com",
    carousel: assetsPaths.images.projects.tictactoe,
  },
  {
    id: 8,
    title: "Netflix iOS Clone",
    desc: {
      en: "A clone of the Netflix mobile app built with Swift and SwiftUI. This project replicates the Netflix user interface and integrates with TMDb API for movie and TV show data.",
      fr: "Un clone de l'application mobile Netflix construite avec Swift et SwiftUI. Ce projet reproduit l'interface utilisateur Netflix et intègre l'API TMDb pour les données de films et de séries TV.",
    },
    stack: ["Swift", "SwiftUI", "TMDb API"],
    // readmeUrl:
    // "https://raw.githubusercontent.com/kodev8/movies-swiftui/main/README.md",
    githubUrl: "https://github.com/kodev8/movies-swift",
    carousel: assetsPaths.images.projects.netflix,
  },
  // {
  //   id: 9,
  //   title: 'SQANTI3',
  //   desc: 'Contributed to the SQANTI3 pipeline for long-read transcriptomes. Implemented optimizations and new tools for the pipeline, including processing large datasets on multiple GPUs with Dask.',
  //   stack: ['Python', 'Streamlit', 'Pandas', 'HTML', 'CSS', 'JavaScript', 'Dask'],
  //   imagePath: 'https://picsum.photos/200/300',
  //   githubUrl: 'https://github.com/ConesaLab/SQANTI3'
  // },
  {
    id: 10,
    title: "X/Twitter Clone",
    desc: {
      en: "A class group project replicating Twitter's core functionality. Implemented as a full-stack application with Flask backend and responsive frontend design.",
      fr: "Un projet de groupe de classe qui reproduit les fonctionnalités clés de Twitter. Implémenté comme une application full-stack avec un backend Flask et un design frontend réactif.",
    },
    stack: ["Python", "Flask", "SQL", "HTML", "CSS", "JavaScript"],
    imagePath: "https://picsum.photos/200/300",
    readmeUrl:
      "https://raw.githubusercontent.com/Grigoli2001/Twitter/New_dbs/README.md",
    githubUrl: "https://github.com/Grigoli2001/Twitter/tree/New_dbs",
    thumbnail: assetsPaths.images.projects.twitter[0],
    carousel: assetsPaths.images.projects.twitter,
  },
  // {
  //   id: 11,
  //   title: 'My Portfolio Website',
  //   desc: 'And last but not least, my portfolio website (this one you are looking at right now).',
  //   stack: ['React', 'Three.js', 'Tailwind CSS', 'TypeScript', 'GSAP', 'Framer Motion'],
  //   imagePath: 'https://picsum.photos/200/300',
  //   githubUrl: 'https://github.com/kodev8/portfolio',
  //   liveUrl: 'https://kodev.com',
  // }
];

const featuredProjects = projects.slice(0, 3);
const portfolioProjects = projects.slice(3);

// ---------------------------------- SKILLS ----------------------------------
const techStackHeader = {
  title: {
    en: "Tech Stack",
    fr: "Technologies",
  },
  sub: {
    en: "My everyday tools🔨",
    fr: "Mes outils quotidiens🔨",
  },
  tip: {
    en: "Click and drag the icons to interact with them",
    fr: "Cliquez et glissez les icônes pour les interagir",
  },
};

const techStackText = {
  reset: {
    en: "Reset Icons",
    fr: "Réinitialiser les icônes",
  },
  tapAndDrag: {
    en: "Tap and drag icons to interact with them",
    fr: "Tap and drag icons to interact with them",
  },
  tip3d: {
    en: "Loading 3d icons may slow down the page",
    fr: "Le chargement des icônes 3D peut ralentir la page",
  },
};

const programmingLanguages = [
  {
    name: "Python",
    modelPath: assetsPaths.models.skills.python,
    imgPath: assetsPaths.models.skills_as_img.python,
    scale: 0.2,
    rotation: [0, 0, 0],
    verified: true,
  },
  {
    name: "JavaScript",
    modelPath: assetsPaths.models.skills.javascript,
    imgPath: assetsPaths.models.skills_as_img.javascript,
    scale: 0.3,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "TypeScript",
    modelPath: assetsPaths.models.skills.typescript,
    imgPath: assetsPaths.models.skills_as_img.typescript,
    scale: 0.3,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "SQL",
    modelPath: assetsPaths.models.skills. sql,
    imgPath: assetsPaths.models.skills_as_img.sql,
    scale: 0.3,
    rotation: [1.2, 0, 0],
    verified: true,
  },
  {
    name: "PHP",
    modelPath: assetsPaths.models.skills.php,
    imgPath: assetsPaths.models.skills_as_img.php,
    scale: 0.3,
    position: [0, -1, 0],
    rotation: [0, 0, 0],
    textPosition: [0, -0.1, 0],
    verified: true,
  },
  {
    name: "Rust",
    modelPath: assetsPaths.models.skills.rust,
    imgPath: assetsPaths.models.skills_as_img.rust,
    scale: 0.3,
    rotation: [0, -1.5, 0],
    textPosition: [0, -0.8, 0],
    verified: true,
  },
  {
    name: "C#",
    modelPath: assetsPaths.models.skills.csharp,
    imgPath: assetsPaths.models.skills_as_img.csharp,
    scale: 0.02,
    rotation: [0, 0, 0],
    verified: true,
  },
];

const tools = [
  {
    name: "Git",
    modelPath: assetsPaths.models.skills.git,
    imgPath: assetsPaths.models.skills_as_img.git,
    scale: 0.0125,
    rotation: [0, -Math.PI / 4, 0],
    verified: true,
  },
  {
    name: "Docker",
    modelPath: assetsPaths.models.skills.docker,
    imgPath: assetsPaths.models.skills_as_img.docker,
    scale: 0.375,
    rotation: [0, 0, 0],
    verified: true,
  },
  {
    name: "AWS",
    modelPath: assetsPaths.models.skills.aws,
    imgPath: assetsPaths.models.skills_as_img.aws,
    scale: 0.1,
    rotation: [0, 0, 0],
    position: [0, -0.75, 0],
    verified: true,
  },
  {
    name: "Azure",
    modelPath: assetsPaths.models.skills.azure,
    imgPath: assetsPaths.models.skills_as_img.azure,
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "Firebase",
    modelPath: assetsPaths.models.skills.firebase,
    imgPath: assetsPaths.models.skills_as_img.firebase,
    scale: 0.75,
    rotation: [0, 0.1, 0],
    verified: true,
  },

  {
    name: "QuantConnect",
    modelPath: assetsPaths.models.skills.qc,
    imgPath: assetsPaths.models.skills_as_img.qc,
    scale: 0.4,
    textPosition: [0, -0.8, 0],
    rotation: [1.5, 0, 0],
    verified: true,
  },
];

const frameworks = [
  {
    name: "Django",
    modelPath: assetsPaths.models.skills.django,
    imgPath: assetsPaths.models.skills_as_img.django,
    scale: 0.5,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "",
    modelPath: assetsPaths.models.skills.flask,
    imgPath: assetsPaths.models.skills_as_img.flask,
    scale: 0.7,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "FastAPI",
    modelPath: assetsPaths.models.skills.fastapi,
    imgPath: assetsPaths.models.skills_as_img.fastapi,
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "Streamlit",
    modelPath: assetsPaths.models.skills.streamlit,
    imgPath: assetsPaths.models.skills_as_img.streamlit,
    scale: 0.5,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "Tailwind CSS",
    modelPath: assetsPaths.models.skills.tailwind,
    imgPath: assetsPaths.models.skills_as_img.tailwind,
    scale: 0.4,
    rotation: [0.25, 0, 0],
    verified: true,
  },
  {
    name: "htmx",
    modelPath: assetsPaths.models.skills.htmx,
    imgPath: assetsPaths.models.skills_as_img.htmx,
    scale: 0.4,
    rotation: [1.2, 0, 0],
    verified: true,
  },

  {
    name: "Express",
    modelPath: assetsPaths.models.skills.express,
    imgPath: assetsPaths.models.skills_as_img.express,
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "Three.js",
    modelPath: assetsPaths.models.skills.three,
    imgPath: assetsPaths.models.skills_as_img.three,
    scale: 0.015,
    rotation: [0, 0, 0],
    verified: true,
  },
  {
    name: "Next.js",
    modelPath: assetsPaths.models.skills.next,
    imgPath: assetsPaths.models.skills_as_img.next,
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: ".NET",
    modelPath: assetsPaths.models.skills.dotnet,
    imgPath: assetsPaths.models.skills_as_img.dotnet,
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },

  {
    name: "React/React Native",
    modelPath: assetsPaths.models.skills.react,
    imgPath: assetsPaths.models.skills_as_img.react,
    scale: 0.4,
    rotation: [0, 0, 0],
    verified: true,
    xOffset: 1.5,
  },
];

const databases = [
  {
    name: "MongoDB",
    modelPath: assetsPaths.models.skills.mongodb,
    imgPath: assetsPaths.models.skills_as_img.mongodb,
    scale: 0.3,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "PostgreSQL",
    modelPath: assetsPaths.models.skills.postgresql,
    imgPath: assetsPaths.models.skills_as_img.postgresql,
    scale: 0.4,
    rotation: [1, 0, 0],
    verified: true,
  },
  {
    name: "MySQL",
    modelPath: assetsPaths.models.skills.mysql,
    imgPath: assetsPaths.models.skills_as_img.mysql,
    scale: 0.5,
    rotation: [0, 0, 0],
    verified: true,
  },
  {
    name: "Redis",
    modelPath: assetsPaths.models.skills.redis,
    imgPath: assetsPaths.models.skills_as_img.redis,
    scale: 0.4,
    rotation: [1.2, 0, 0],
    verified: true,
  },

  {
    name: "SQLite",
    modelPath: assetsPaths.models.skills.sqlite,
    imgPath: assetsPaths.models.skills_as_img.sqlite,
    scale: 0.4,
    rotation: [1.2, 0, 0],
    verified: true,
  },
  {
    name: "Neo4j",
    modelPath: assetsPaths.models.skills.neo4j,
    imgPath: assetsPaths.models.skills_as_img.neo4j,
    scale: 0.3,
    rotation: [1.4, 0, 0],
    verified: true,
  },
];

const techStackGroups = [
  {
    name: {
      en: "Programming Languages",
      fr: "Langages de programmation",
    },
    icons: programmingLanguages,
  },
  
  {
    name: {
      en: "Tools",
      fr: "Outils",
    },
    icons: tools,
  },
  {
    name: {
      en: "Databases",
      fr: "Bases de données",
    },
    icons: databases,
  },
  {
    name: {
      en: "Frameworks & Libraries",
      fr: "Frameworks & Librairies",
    },
    icons: frameworks,
  },
];

// ---------------------------------- CONTACT ----------------------------------
const contactHeader = {
  title: {
    en: "Get in Touch – Let’s Connect",
    fr: "Contactez-moi",
  },
  sub: {
    en: "💬 Have questions or ideas? Let’s talk! 🚀",
    fr: "💬 Avez-vous des questions ou des idées? Parlons! 🚀",
  },
};

const contactForm = {
  name: {
    label: {
      en: "Name",
      fr: "Prénom",
    },
    placeholder: {
      en: "What should I call you?",
      fr: "Comment devrais-je vous appeler?",
    },
  },
  email: {
    label: {
      en: "Email",
      fr: "Email",
    },
    placeholder: {
      en: "What’s your email address?",
      fr: "Quel est votre adresse email?",
    },
  },
  message: {
    label: {
      en: "Message",
      fr: "Message",
    },
    placeholder: {
      en: "How can I help you?",
      fr: "Comment puis-je vous aider?",
    },
  },
  submit: {
    label: {
      en: "Send Message",
      fr: "Envoyer un message",
    },
  },
  success: {
    en: "Message sent successfully",
    fr: "Message envoyé avec succès",
  },
  error: {
    en: "Error sending message",
    fr: "Erreur lors de l'envoi du message",
  },
};

// ------------------------------------------

export {
  words,
  heroWords,
  expWorkCards,
  expEducationCards,
  expCertifications,
  techStackGroups,
  topNavLinks,
  navLinks,
  navBarImages,
  portfolioProjects,
  featuredProjects,
  aboutMe,
  projects,
  contactInfo,
  credits,
  videos,
  desktopProjectsText,
  viewLiveText,
  viewGitHubText,
  previousText,
  nextText,
  contactText,
  downloadResumeText,
  experienceTabs,
  showCaseHeader,
  techStackText,
  techStackHeader,
  contactHeader,
  contactForm,
  windowLabels,
  canvasWarning,
  experienceText,
  assetsPaths,
};
