// export const itemData = {
//   rubik: {
//     scale: 0.0015,
//     position: [0, 1.8, -1.6],
//     clickableOffset: [0, -0.11, 0],
//     viewableOffset: [-2, 1.5, 2],
//     ringScale: 0.25,
//     color: "#e67f02",
//   },

//   pikachu: {
//     scale: 0.02,
//     rotation: [0, Math.PI / 2, 0],
//     position: [-1, 1.2, 1.1],
//     clickableOffset: [0, 0.01, 0],
//     viewableOffset: [1.9, 2, 1.6],
//     color: "#d6d300",
//   },

//   spiderman: {
//     scale: 0.03,
//     position: [-1.4, 1.8, -1.34],
//     clickableOffset: [0, -0.1, 0],
//     ringScale: 0.15,
//     viewableOffset: [-2, 1.5, 2],
//     color: "#00ff00",
//   },

//   cleatsGroup: {
//     position: [1, 0.2, 2],
//     offset: [0.7, 0.1, 0],
//     viewableOffset: [-3, 3, 3],
//     color: "#00ffea",
//   },

//   cleat1: {
//     position: [0.4, 0, 0],
//     scale: [-2, 2, 2],
//     rotation: [-0.4, 0, 0],
//   },
//   cleat2: {
//     scale: 2,
//     position: [0, 0, 0],
//     rotation: [-0.4, 0, 0],
//   },
//   football: {
//     position: [1, 0.3, 0],
//     scale: 0.3,
//   },

//   ttflag: {
//     scale: 0.5,
//     rotation: [0, 0, 0],
//     position: [2.5, -1.5 + 3.5, -2],
//     clickableOffset: [-0.3, -0.47, 0],
//     viewableOffset: [-1.75, 1.5, 2.5],
//     color: "#ff0000",
//   },

//   mouseClickable: {
//     position: [1.45, 1.8, -1.9],
//     ringScale: 0.1,
//     clickableOffset: [0, -0.1, 0],
//     viewableOffset: [0, 0.5, 0.5],
//   },
//   text: {
//     position: [-1, 3.5, -3],
//     scale: 0.5,
//     rotation: [0, 0, 0],
//   },

//   leftScreen: {
//     position: [-0.22, 2.4, -2.63],
//     rotation: [0, Math.PI / 8, 0],
//     viewableOffset: [-2., -0.5, 1],
//     withRing: false,
//   },
//   rightScreen: {
//     position: [0.58, 2.4, -2.61],
//     rotation: [0, 0, 0],
//     viewableOffset: [-2.5, -0.5, 1],
//     withRing: false,
//   },
// };

// nb: viewable offset accounts for rotation
export const itemData = {
  rubik: {
    clickableProps: {
      position: [-0.15, 1.8, -2.4],
      clickableOffset: [0, -0.11, 0],
      viewableOffset: [-0.5, 0.2, 0.5],
      ringScale: 0.25,
      color: "#e67f02",
      speechOffset: [0, 0.4, 0],
      name: "rubik",
      speechDirection: "down",
    },
    itemProps: {
      scale: 0.0015,
    },
  },

  pikachu: {
    clickableProps: {
      rotation: [0, Math.PI / 2, 0],
      position: [-3.04, 4.1, 2.5],
      clickableOffset: [0, 0.01, 0],
      viewableOffset: [0.5, 0.65, 0.5],
      color: "#d6d300",
      speechOffset: [0, 0.8, 0],
      name: "pikachu",
    },
    itemProps: {
      scale: 0.015,
    },
  },

  spiderman: {
    scale: 0.035,
    position: [-2.3, 1.8, -1.8],
    rotation: [0, Math.PI / 4, 0],
    clickableOffset: [0, -0.1, 0],
    ringScale: 0.15,
    viewableOffset: [-0.15, 0.2, 0.75],
    color: "#00ff00",
    speechOffset: [0, 0.6, 0],
    speechDirection: "down",
    name: "lego",
  },

  cleatsGroup: {
    position: [-1, -0.002, 3],
    clickableOffset: [0.7, 0.1, 0],
    viewableOffset: [-1, 1.25, 2],
    color: "#00ffea",
    speechOffset: [0.5, 1, 0],
    name: "football",
  },

  cleat1: {
    position: [0.4, 0, 0],
    scale: [-2, 2, 2],
    rotation: [-0.4, 0, 0],
  },
  cleat2: {
    scale: 2,
    position: [0, 0, 0],
    rotation: [-0.4, 0, 0],
  },

  dumbbellGroup: {
    position: [2, 0.2, -1],
    clickableOffset: [0.2, -0.07, 0.4],
    viewableOffset: [-1, 1.5, 1.5],
    color: "#7410ad",
    speechOffset: [0.1, 1, 1],
    name: "gym",
  },
  dumbbell1: {
    position: [1, 0, 0],
    scale: 0.001,
    rotation: [0.3, Math.PI / 2, 0],
  },
  dumbbell2: {
    position: [-0.3, 0, 0],
    scale: 0.001,
    rotation: [0.3, Math.PI / 2, 0],
  },

  football: {
    position: [1, 0.3, 0],
    scale: 0.3,
  },

  ttflag: {
    scale: 0.5,
    rotation: [0, Math.PI / 2, 0],
    position: [-2.5, 2.2, 3],
    clickableOffset: [-0.3, -0.47, 0],
    viewableOffset: [0.5, 0.5, 0.5],
    speechOffset: [0, 0.6, 0],
    speechDirection: "down",
    color: "#ff0000",
    name: "trinidad",
  },

  purposeText: {
    position: [-3.5, 4, 0.5],
    scale: 0.5,
    rotation: [0, Math.PI / 2, 0],
  },

  exitButton: {
    position: [-3.5, 5, 4],
    scale: 0.2,
    rotation: [0, Math.PI / 2, 0],
  },

  leftScreen: {
    position: [-2.85, 2.43, -0.875],
    rotation: [0, Math.PI / 2, 0],
    itemRotation: [0, Math.PI / 2, 0],
    viewableOffset: [1, 0, 1.5],
    withRing: false,
    name: "leftScreen",
  },
};
