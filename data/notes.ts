export type NoteItem = {
  id: string;
  title: string;
  date: string;
  category: "work" | "drawing" | "reading" | "sport" | "flowers";
  excerpt: string;
  content: string;
  source?: string;
  accentColor: string;
  rotation: number;
  tapeColor?: string;
};

export const NOTES_DATA: NoteItem[] = [
  {
    id: "note-1",
    title: "Three hundred vessels",
    date: "A three-year journey",
    category: "work",
    excerpt:
      "Behind every vessel is a trail of details that needs patience, accuracy, and clear communication.",
    content:
      "During three years in port operations, I have handled documents for more than 300 vessels carrying several kinds of cargo. Each case is different, but the habits remain the same: listen carefully, check every detail, communicate clearly, and follow the work through to the end.",
    source: "Notes from port life",
    accentColor: "var(--color-sage)",
    rotation: -1.8,
    tapeColor: "rgba(107, 118, 88, 0.35)",
  },
  {
    id: "note-2",
    title: "A hundred celebrations",
    date: "Four seasonal years",
    category: "work",
    excerpt:
      "Working at more than one hundred weddings taught me how much care can hide inside a smooth celebration.",
    content:
      "Wedding reception work was one of the longest chapters of my student years. Across four seasonal years and more than one hundred weddings, I learned to stay composed, work closely with a team, notice what guests need, and respond quickly when plans change.",
    source: "Part-time diary",
    accentColor: "var(--color-blush)",
    rotation: 1.5,
    tapeColor: "rgba(217, 154, 160, 0.45)",
  },
  {
    id: "note-3",
    title: "Raw lines are enough",
    date: "Whenever a pencil is nearby",
    category: "drawing",
    excerpt:
      "I like a sketch that still shows the first thought—the loose line before everything becomes too polished.",
    content:
      "I enjoy drawing quickly from reference images, especially small doodles and raw sketches. I do not need every line to be perfect. What I enjoy most is catching the gesture, shape, or feeling before it disappears.",
    source: "Sketchbook habit",
    accentColor: "var(--color-lavender)",
    rotation: -2.2,
    tapeColor: "rgba(168, 155, 196, 0.45)",
  },
  {
    id: "note-4",
    title: "Across the chessboard",
    date: "2021 · 2022 · 2024",
    category: "sport",
    excerpt:
      "Sport taught me to stay present—whether reacting quickly on court or thinking several moves ahead.",
    content:
      "At university I joined both the badminton club and chess club. I took part in the 6th and 7th Van Lang Cup Ho Chi Minh City Open Student Chess Tournaments in 2021 and 2022, and the University of Transport HCMC badminton tournament in 2024.",
    source: "University memories",
    accentColor: "var(--color-butter)",
    rotation: 2.1,
    tapeColor: "rgba(223, 185, 87, 0.45)",
  },
  {
    id: "note-5",
    title: "Books I return to",
    date: "Quiet hours",
    category: "reading",
    excerpt:
      "Literature is always my first choice, especially stories written in Vietnamese.",
    content:
      "Reading gives me a slower rhythm after busy working days. Literature is always the shelf I return to first, and Vietnamese books are especially close to me because of the language, places, and feelings they carry.",
    source: "Reading corner",
    accentColor: "var(--color-red)",
    rotation: -1.2,
    tapeColor: "rgba(189, 99, 92, 0.35)",
  },
  {
    id: "note-6",
    title: "Things that keep me joyful",
    date: "An ongoing list",
    category: "flowers",
    excerpt:
      "Flowers, nature, áo dài, animals, vessels, new places, and a good meal shared after a long day.",
    content:
      "I am happiest when life has variety: planting and arranging flowers, swimming, playing guitar, travelling, enjoying food, spending time in nature, and noticing animals and vessels. These small interests keep me positive, curious, and open to new experiences.",
    source: "Little favourites",
    accentColor: "var(--color-pink)",
    rotation: 1.8,
    tapeColor: "rgba(240, 203, 194, 0.45)",
  },
];
