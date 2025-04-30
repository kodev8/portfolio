import { FaGlobe, FaList, FaCode, FaBrain, FaEnvelope, FaLinkedin, FaGithub, FaDownload, FaMailBulk } from "react-icons/fa";

// contact info
const contactInfo = {
  email: "kalevkeil@gmail.com",
  github: "https://github.com/kodev8",
  linkedin: "https://linkedin.com/in/kalev-keil",
  resume: "/files/kalev-keil-resume.pdf",
};

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

const navLinks = Object.keys(navLinksTranslations).map((key) => navLinksTranslations[key]);


const topNavLinks = [
  navLinksTranslations.about,
  navLinksTranslations.experience,
  navLinksTranslations.projects,
  navLinksTranslations.skills,
];

const navBarImages = [
  {
    src: "/images/kalev.png", 
    alt: {
      en: "Professional Me",
      fr: "Moi - professionnel",
    },
  },
  {
    src: "/images/kalev-football.jpg",
    alt: {
      en: "Football Me",
      fr: "Moi - football",
    },
  },
]


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
    en: "I'm currently",
    fr: "Je suis actuellement",
  },
  lookingFor: {
    en: "looking for a full-time internship",
    fr: "à la recherche d'un stage de 6 mois",
  },
  opportunities: {
    en: "where I can apply my skills, learn, and contribute to real-world projects.",
    fr: "où je peux appliquer mes compétences, apprendre et contribuer à des projets du monde réel.",
  },
  viewProjects: {
    en: "View my projects",
    fr: "Voir mes projets",
  },
  aboutMeIndicator: {
    en: "The scene below is a 3D model of my room to help you learn more about me outside of work.",
    fr: "La scène ci-dessous est un modèle 3D de ma chambre pour vous aider à en savoir plus sur moi en dehors du travail.",
  },
};

const wordsInitial = {
  en: [
    { text: "Ideas", imgPath: "/images/ideas.svg" },
    { text: "Concepts", imgPath: "/images/concepts.svg" },
    { text: "Designs", imgPath: "/images/designs.svg" },
    { text: "Code", imgPath: "/images/code.svg" },
  ],
  fr: [
    { text: "Idées", imgPath: "/images/ideas.svg" },
    { text: "Concepts", imgPath: "/images/concepts.svg" },
    { text: "Designs", imgPath: "/images/designs.svg" },
    { text: "Code", imgPath: "/images/code.svg" },
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
    fr: "Comme un athlète aussi, je passe beaucoup de temps au gymnase pour rester en forme et en bonne santé. Je fais du lifting depuis un moment pour complémenter mon entraînement de football et j'ai toujours aimé ça.",
  },
};

const canvasWarning = {
  en: "This experience is best viewed on a larger screen! But you can still try ;)",
  fr: "Cette expérience est mieux vue sur un écran plus grand! Mais vous pouvez toujours essayer ;)",
};

const videos = [
  {
    title: "Clip 1",
    url: "/videos/clips/hv1.MOV",
    type: "local",
  },
  {
    title: "Clip 2",
    url: "/videos/clips/hv2.MOV",
    type: "local",
  },
  {
    title: "Clip 3",
    url: "/videos/clips/hv3.MOV",
    type: "local",
  },

  {
    title: "Clip 4",
    url: "/videos/clips/hv4.MOV",
    type: "local",
  },
  {
    title: "Clip 5",
    url: "/videos/clips/hv5.MOV",
    type: "local",
  },
  {
    title: "Clip 6",
    url: "/videos/clips/hv6.MOV",
    type: "local",
  },
  {
    title: "Clip 7",
    url: "/videos/clips/hv7.MOV",
    type: "local",
  },
  {
    title: "Clip 8",
    url: "/videos/clips/hv8.MOV",
    type: "local",
  },
  {
    title: "Clip 9",
    url: "/videos/clips/hv9.MOV",
    type: "local",
  },
  {
    title: "Clip 10",
    url: "/videos/clips/hv10.MOV",
    type: "local",
  },
  {
    title: "Clip 11",
    url: "/videos/clips/hv11.MOV",
    type: "local",
  },
  {
    title: "Clip 12",
    url: "/videos/clips/hv12.MOV",
    type: "local",
  },
  {
    title: "Clip 13",
    url: "/videos/clips/hv13.MOV",
    type: "local",
  },
  {
    title: "Clip 14",
    url: "/videos/clips/hv14.MOV",
    type: "local",
  },
  {
    title: "Clip 15",
    url: "/videos/clips/hv15.MOV",
    type: "local",
  },
  {
    title: "Clip 16",
    url: "/videos/clips/hv16.MOV",
    type: "local",
  },
  {
    title: "Clip 17",
    url: "/videos/clips/hv17.MOV",
    type: "local",
  },
  {
    title: "Clip 18",
    url: "/videos/clips/hv18.MOV",
    type: "local",
  },
  {
    title: "Clip 19",
    url: "/videos/clips/hv19.MOV",
    type: "local",
  },
  {
    title: "Clip 20",
    url: "/videos/clips/hv20.MOV",
    type: "local",
  },
  {
    title: "Clip 21",
    url: "/videos/clips/hv21.MOV",
    type: "local",
  },
];

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
    icon: "/images/folder.svg",

  },
  videos: {
    header: {
      en: "Videos",
      fr: "Vidéos",
    },
    icon: "/images/videos.svg",
  },
  credits: {
    header: {
      en: "Credits",
      fr: "Crédits",
    },
    icon: "/images/credits.svg",
  },
  resume: {
    header: {
      en: "Resume",
      fr: "CV",
    },
    icon: "/images/resume.png",
  },
  contact: {
    header: {
      en: "Contact",
      fr: "Contact",
    },
    icon: "/images/mail.webp",
  },
}

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
    imgPath: "/images/logos/cavitry.svg",
    imgScale: 0.8,
    logoPath: "/images/logos/cavitry-icon.svg",
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
    imgPath: "/images/logos/guardian-life.webp",
    logoPath: "/images/logos/guardian-life.webp",
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
        "Effectué l'entrée des données des employés pour plusieurs plans de pension.",
        "Généré des rapports et effectué une analyse des données des membres et des employeurs.",
      ],
      fr: [
        "Effectué l'entrée des données des employés pour plusieurs plans de pension.",
        "Généré des rapports et effectué une analyse des données des membres et des employeurs.",
      ],
    },
    gradient: "from-yellow-500 via-orange-500 to-white",
  },
  {
    imgPath: "/images/logos/solutionsconsulting.png",
    logoPath: "/images/logos/solutionsconsulting.png",
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
    imgPath: "/images/logos/tsz.svg",
    logoPath: "/images/logos/tsz.svg",
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
    imgPath: "/images/logos/epita.png",
    logoPath: "/images/logos/epita-icon.png",
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
    imgPath: "/images/logos/qrc.png",
    imgScale: 2.5,
    logoPath: "/images/logos/qrc-icon.webp",
    title: {
      en: "6th Form Education (CAPE)",
      fr: "Éducation au 6ème Forme (CAPE)",
    },
    institution: {
      en: "Queen's Royal College",
      fr: "Queen's Royal College",
    },
    location: {
      en: "Tobago, Trinidad & Tobago",
      fr: "Tobago, Trinidad & Tobago",
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
        "Tobago National Merit List in Chemistry and Caribbean Studies (2019).",
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
    imgPath: "/images/logos/qrc.png",
    imgScale: 2.5,
    logoPath: "/images/logos/qrc-icon.webp",
    title: {
      en: "High School Education (CSEC)",
      fr: "Éducation au Lycée (CSEC)",
    },
    institution: {
      en: "Queen's Royal College",
      fr: "Queen's Royal College",
    },
    location: {
      en: "Tobago, Trinidad & Tobago",
      fr: "Tobago, Trinidad & Tobago",
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
    imgPath: "/images/logos/nvidia.png",
    logoPath: "/images/logos/nvidia-icon.png",
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
    imgPath: "/images/logos/nvidia.png",
    logoPath: "/images/logos/nvidia-icon.png",
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
    imgPath: "/images/logos/nvidia.png",
    logoPath: "/images/logos/nvidia-icon.png",
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
    imgPath: "/images/logos/harvard.svg",
    logoPath: "/images/logos/harvard-icon.png",
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
    thumbnail: "/images/projects/statroom/statroom-1.png",
    carousel: [
      "/images/projects/statroom/statroom-1.png",
      "/images/projects/statroom/statroom-2.png",
      "/images/projects/statroom/statroom-3.png",
      "/images/projects/statroom/statroom-4.png",
      "/images/projects/statroom/statroom-5.png",
      "/images/projects/statroom/statroom-6.png",
      "/images/projects/statroom/statroom-7.png",
      "/images/projects/statroom/statroom-8.png",
      "/images/projects/statroom/statroom-9.png",
      "/images/projects/statroom/statroom-10.png",
      "/images/projects/statroom/statroom-11.png",
      "/images/projects/statroom/statroom-12.png",
      "/images/projects/statroom/statroom-13.png",
      "/images/projects/statroom/statroom-14.png",
      "/images/projects/statroom/statroom-15.png",
      "/images/projects/statroom/statroom-16.png",
      "/images/projects/statroom/statroom-17.png",
      
    ],
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
    videoPath: "/videos/projects/statroom-demo.mp4",
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
    thumbnail: "/images/projects/options/options-1.png",
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/options-tool/main/README.md",
    githubUrl: "https://github.com/kodev8/options-tool",
    liveUrl: "https://options-tool.streamlit.app/",
    bgColor: "bg-slate-700",
    carousel: [
      "/images/projects/options/options-1.png",
      "/images/projects/options/options-2.png",
      "/images/projects/options/options-3.png",
      "/images/projects/options/options-4.png",
      "/images/projects/options/options-5.png",
      "/images/projects/options/options-6.png",
      "/images/projects/options/options-7.png",
      "/images/projects/options/options-8.png",
      "/images/projects/options/options-9.png",
    ],
  },
  {
    id: 4,
    title: "Uber Klone",
    desc: {
      en: "A clone of the Uber ride-sharing platform built with Flask. This project implements key Uber features with a clean, responsive interface and SQL database integration.",
      fr: "Un clone de la plateforme de partage de trajets Uber construit avec Flask. Ce projet implémente les fonctionnalités clés d'Uber avec une interface propre et réactive et une intégration de base de données SQL.",
    },
    stack: ["Python", "Flask","htmx", "SQL", "HTML", "CSS", "JavaScript"],
    thumbnail: "/images/projects/uber/uber-1.png",
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/uber-klone/main/README.md",
    videoPath: "/videos/projects/uber-demo.mp4",
    githubUrl: "https://github.com/kodev8/uber-klone",
    liveUrl: "https://uber-klone.onrender.com",
    bgColor: "bg-slate-700",
    carousel: [
      "/images/projects/uber/uber-1.png",
      "/images/projects/uber/uber-2.png",
      "/images/projects/uber/uber-3.png",
      "/images/projects/uber/uber-4.png",
      "/images/projects/uber/uber-5.png",
      "/images/projects/uber/uber-6.png",
      "/images/projects/uber/uber-7.png",
      "/images/projects/uber/uber-8.png",
      "/images/projects/uber/uber-9.png",
      "/images/projects/uber/uber-10.png",
      "/images/projects/uber/uber-11.png",
      "/images/projects/uber/uber-12.png",
      "/images/projects/uber/uber-13.png",
      "/images/projects/uber/uber-14.png",
      "/images/projects/uber/uber-15.png",
      "/images/projects/uber/uber-16.png",
      "/images/projects/uber/uber-17.png",
    ],
  },
  {
    id: 6,
    title: "Pokebattle",
    desc: {
      en: "A Pokémon battle simulator built with Pygame. This game recreates the classic Pokémon battle experience with data from the PokeAPI, featuring turn-based combat and authentic Pokémon mechanics.",
      fr: "Un simulateur de combat Pokémon construit avec Pygame. Ce jeu redonne l'expérience de combat Pokémon classique avec des données de l'API PokeAPI, avec un combat basé sur les tours et des mécaniques Pokémon authentiques.",
    },
    stack: ["Python", "Pygame", "Pygbug", "PokeAPI"],
    thumbnail: "/images/projects/pokebattle/pokebattle-1.png",
    videoPath: "/videos/projects/pokebattle-demo.mp4",
    githubUrl: "https://github.com/kodev8/pokebattle",
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/pokebattle/main/README.md",
    liveUrl: "https://kodev8.itch.io/pokebattle",
    carousel: [
      "/images/projects/pokebattle/pokebattle-1.png",
      "/images/projects/pokebattle/pokebattle-2.png",
      "/images/projects/pokebattle/pokebattle-3.png",
      "/images/projects/pokebattle/pokebattle-4.png",
      "/images/projects/pokebattle/pokebattle-5.png",
    ],
  },
  {
    id: 7,
    title: "EPIDashboard",
    desc: {
      en: "A comprehensive dashboard application built with PHP and MySQL. This project features dynamic data visualization, user authentication, and responsive design for educational institution management.",
      fr: "Une application de tableau de bord complète construite avec PHP et MySQL. Ce projet présente la visualisation dynamique des données, l'authentification des utilisateurs et le design réactif pour la gestion des institutions éducatives.",
    },
    stack: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    thumbnail: "/images/projects/epidashboard/epidashboard-1.png",
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/epidashboard-php/main/README.md",
    githubUrl: "https://github.com/kodev8/epidashboard-php",
    liveUrl: "https://github.com/kodev8/epidashboard-php",
    carousel: [
      "/images/projects/epidashboard/epidashboard-1.png",
      "/images/projects/epidashboard/epidashboard-2.png",
      "/images/projects/epidashboard/epidashboard-3.png",
      "/images/projects/epidashboard/epidashboard-4.png",
      "/images/projects/epidashboard/epidashboard-5.png",
    ],
  },
  {
    id: 3,
    title: "Amazon Klone",
    desc: {
      en: "A functional clone of Amazon's e-commerce platform built with Flask and HTMX. This project replicates core Amazon features with a responsive design and MongoDB integration for data storage.",
      fr: "Un clone fonctionnel de la plateforme e-commerce d'Amazon construite avec Flask et HTMX. Ce projet reproduit les fonctionnalités clés d'Amazon avec un design réactif et une intégration de MongoDB pour le stockage des données.",
    },
    stack: ["Python", "Flask","htmx", "SQL", "HTML", "CSS", "JavaScript", "MongoDB"],
    thumbnail: "/images/projects/amazon/amazon-1.png",
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/amazon-klone/main/README.md",
    githubUrl: "https://github.com/kodev8/amazon-klone",
    liveUrl: "https://amazon-klone.onrender.com",
    carousel: [
      "/images/projects/amazon/amazon-1.png",
      "/images/projects/amazon/amazon-2.png",
      "/images/projects/amazon/amazon-3.png",
      "/images/projects/amazon/amazon-4.png",
      "/images/projects/amazon/amazon-5.png",
      "/images/projects/amazon/amazon-6.png",
      "/images/projects/amazon/amazon-7.png",
    ],
  },
  {
    id: 5,
    title: "TicTacToe with HTMX",
    desc: {
      en: "A modern implementation of the classic TicTacToe game using HTMX and Flask. This project demonstrates how to build interactive web applications with minimal JavaScript by leveraging HTMX for dynamic content updates.",
      fr: "Une implémentation moderne du célèbre jeu TicTacToe utilisant HTMX et Flask. Ce projet montre comment construire des applications web interactives avec peu de JavaScript en exploitant HTMX pour les mises à jour de contenu dynamiques.",
    },
    stack: ["Python", "Flask", "htmx", "SQL", "HTML", "CSS", "JavaScript"],
    thumbnail: "/images/projects/tictactoe/tictactoe-1.png",
    githubUrl: "https://github.com/kodev8/tictactoe-htmx",
    readmeUrl:
      "https://raw.githubusercontent.com/kodev8/tictactoe-htmx/main/README.md",
    liveUrl: "https://tictactoe-htmx.onrender.com",
    carousel: [
      "/images/projects/tictactoe/tictactoe-1.png",
      "/images/projects/tictactoe/tictactoe-2.png",
      "/images/projects/tictactoe/tictactoe-3.png",
      "/images/projects/tictactoe/tictactoe-4.png",
    ],
  },
  {
    id: 8,
    title: "Netflix iOS Clone",
    desc: {
      en: "A clone of the Netflix mobile app built with Swift and SwiftUI. This project replicates the Netflix user interface and integrates with TMDb API for movie and TV show data.",
      fr: "Un clone de l'application mobile Netflix construite avec Swift et SwiftUI. Ce projet reproduit l'interface utilisateur Netflix et intègre l'API TMDb pour les données de films et de séries TV.",
    },
    stack: ["Swift", "SwiftUI", "TMDb API"],
    imagePath: "https://picsum.photos/200/300",
    // readmeUrl:
      // "https://raw.githubusercontent.com/kodev8/movies-swiftui/main/README.md",
    githubUrl: "https://github.com/kodev8/movies-swift",
    carousel: [
      "/images/projects/netflix/netflix-1_with_bgc.png",
      "/images/projects/netflix/netflix-2_with_bgc.png",
      "/images/projects/netflix/netflix-3_with_bgc.png",
      "/images/projects/netflix/netflix-4_with_bgc.png",
      "/images/projects/netflix/netflix-5_with_bgc.png",
      "/images/projects/netflix/netflix-6_with_bgc.png",
      "/images/projects/netflix/netflix-7_with_bgc.png",
      "/images/projects/netflix/netflix-8_with_bgc.png",
      "/images/projects/netflix/netflix-9_with_bgc.png",
      "/images/projects/netflix/netflix-10_with_bgc.png",
      "/images/projects/netflix/netflix-11_with_bgc.png",
    ],
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
    thumbnail: "/images/projects/twitter/twitter-1.png",
    carousel: [
      "/images/projects/twitter/twitter-1.png",
      "/images/projects/twitter/twitter-2.png",
      "/images/projects/twitter/twitter-3.png",
      "/images/projects/twitter/twitter-4.png",
      "/images/projects/twitter/twitter-5.png",
      "/images/projects/twitter/twitter-6.png",
      "/images/projects/twitter/twitter-7.png",
      "/images/projects/twitter/twitter-8.png",
      "/images/projects/twitter/twitter-9.png",
      "/images/projects/twitter/twitter-10.png",
      "/images/projects/twitter/twitter-11.png",
      "/images/projects/twitter/twitter-12.png",
      "/images/projects/twitter/twitter-13.png",
      "/images/projects/twitter/twitter-14.png",
      "/images/projects/twitter/twitter-15.png",
      "/images/projects/twitter/twitter-16.png",
      "/images/projects/twitter/twitter-17.png",
      "/images/projects/twitter/twitter-18.png",
      "/images/projects/twitter/twitter-19.png",
    ],
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
};

const programmingLanguages = [
  {
    name: "Python",
    modelPath: "/models/skills/python.glb",
    scale: 0.2,
    rotation: [0, 0, 0],
    verified: true,
  },
  {
    name: "JavaScript",
    modelPath: "/models/skills/javascript.glb",
    scale: 0.3,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "TypeScript",
    modelPath: "/models/skills/typescript.glb",
    scale: 0.3,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "SQL",
    modelPath: "/models/skills/sql.glb",
    scale: 0.3,
    rotation: [1.2, 0, 0],
    verified: true,
  },
  {
    name: "PHP",
    modelPath: "/models/skills/php.glb",
    scale: 0.3,
    position: [0, -1, 0],
    rotation: [0, 0, 0],
    textPosition: [0, -0.1, 0],
    verified: true,
  },
  {
    name: "Rust",
    modelPath: "/models/skills/rust.glb",
    scale: 0.3,
    rotation: [0, -1.5, 0],
    textPosition: [0, -0.8, 0],
    verified: true,
  },
  {
    name: "C#",
    modelPath: "/models/skills/csharp.glb",
    scale: 0.02,
    rotation: [0, 0, 0],
    verified: true,
  },
];

const tools = [
  {
    name: "Git",
    modelPath: "/models/skills/git.glb",
    scale: 0.0125,
    rotation: [0, -Math.PI / 4, 0],
    verified: true,
  },
  {
    name: "Docker",
    modelPath: "/models/skills/docker.glb",
    scale: 0.375,
    rotation: [0, 0, 0],
    verified: true,
  },
  {
    name: "AWS",
    modelPath: "/models/skills/aws.glb",
    scale: 0.1,
    rotation: [0, 0, 0],
    position: [0, -0.75, 0],
    verified: true,
  },
  {
    name: "Azure",
    modelPath: "/models/skills/azure.glb",
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "Firebase",
    modelPath: "/models/skills/firebase.glb",
    scale: 0.75,
    rotation: [0, 0.1, 0],
    verified: true,
  },

  {
    name: "QuantConnect",
    modelPath: "/models/skills/qc.glb",
    scale: 0.4,
    textPosition: [0, -0.8, 0],
    rotation: [1.5, 0, 0],
    verified: true,
  },
];

const frameworks = [
  {
    name: "Django",
    modelPath: "/models/skills/django.glb",
    scale: 0.5,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "",
    modelPath: "/models/skills/flask.glb",
    scale: 0.7,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "FastAPI",
    modelPath: "/models/skills/fastapi.glb",
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "Streamlit",
    modelPath: "/models/skills/streamlit.glb",
    scale: 0.5,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "Tailwind CSS",
    modelPath: "/models/skills/tailwind.glb",
    scale: 0.4,
    rotation: [0.25, 0, 0],
    verified: true,
  },
  {
    name: "htmx",
    modelPath: "/models/skills/htmx.glb",
    scale: 0.4,
    rotation: [1.2, 0, 0],
    verified: true,
  },

  {
    name: "Express",
    modelPath: "/models/skills/express.glb",
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "Three.js",
    modelPath: "/models/skills/three.glb",
    scale: 0.015,
    rotation: [0, 0, 0],
    verified: true,
  },
  {
    name: "Next.js",
    modelPath: "/models/skills/next.glb",
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: ".NET",
    modelPath: "/models/skills/dotnet.glb",
    scale: 0.4,
    rotation: [1.5, 0, 0],
    verified: true,
  },

  {
    name: "React/React Native",
    modelPath: "/models/skills/react.glb",
    scale: 0.4,
    rotation: [0, 0, 0],
    verified: true,
    xOffset: 1.5,
  },
];

const databases = [
  {
    name: "MongoDB",
    modelPath: "/models/skills/mongodb.glb",
    scale: 0.3,
    rotation: [1.5, 0, 0],
    verified: true,
  },
  {
    name: "PostgreSQL",
    modelPath: "/models/skills/postgresql.glb",
    scale: 0.4,
    rotation: [1, 0, 0],
    verified: true,
  },
  {
    name: "MySQL",
    modelPath: "/models/skills/mysql.glb",
    scale: 0.5,
    rotation: [0, 0, 0],
    verified: true,
  },
  {
    name: "Redis",
    modelPath: "/models/skills/redis.glb",
    scale: 0.4,
    rotation: [1.2, 0, 0],
    verified: true,
  },

  {
    name: "SQLite",
    modelPath: "/models/skills/sqlite.glb",
    scale: 0.4,
    rotation: [1.2, 0, 0],
    verified: true,
  },
  {
    name: "Neo4j",
    modelPath: "/models/skills/neo4j.glb",
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
      en: "Frameworks & Libraries",
      fr: "Frameworks & Librairies",
    },
    icons: frameworks,
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
};
