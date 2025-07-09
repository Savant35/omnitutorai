export const subjects = [
  { id: "maths", label: "Maths", icon: "/icons/maths.svg" },
  { id: "language", label: "Language", icon: "/icons/language.svg" },
  { id: "sciences", label: "Natural Sciences", icon: "/icons/science.svg" },
  { id: "history", label: "History", icon: "/icons/history.svg" },
  { id: "Philosophy", label: "Philosophy", icon: "/icons/history.svg" },
  { id: "coding", label: "Coding & Computer science", icon: "/icons/coding.svg" },
  { id: "economics", label: "Human & Social Sciences", icon: "/icons/economics.svg" },
] as const;

export type Subject = typeof subjects[number]["id"];


export const subjectsColors = {
  sciences:   "#E5D0FF",  // lavender (Natural Sciences)
  maths:      "#FFDA6E",  // buttery yellow
  language:   "#BDE7FF",  // sky blue
  coding:     "#FFC8E4",  // rose pink
  history:    "#FFECC8",  // apricot
  economics:  "#C8FFDF",  // mint
  Philosophy: "#E0BBE4",  // pastel purple
};


export const voices = {
  male: { casual: "2BJW5coyhAzSr8STdHbE", formal: "c6SfcYrb2t09NHXiT80T" },
  female: { casual: "ZIlrSGI4jZqobxRKprJz", formal: "sarah" },
  frenchMale: { casual: "0ZOhGcBopt9S6GBK8tnj", formal: "o86w79lw8Y208S2HjL2M" },
  africanFemale: { casual: "iJvD32aW89RhjCC00q0m", formal: "nJwS4S6dQMrtcx51spEu" },
  russianFemale: { casual: "froLDspwCiytX4g1Pobg", formal: "YO5U6V757mqh3xnbe4XE" },
  nigerianFemale: { casual: "oC2pCZZWEDRe6lmZpaaw", forma: "PEyWCmLPt74vpHWLv3Fo" },
  indianFemale: { casual: "PEyWCmLPt74vpHWLv3Fo", formal: "0ZOhGcBopt9S6GBK8tnj" }
};

