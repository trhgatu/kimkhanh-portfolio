export type NoteItem = {
  id: string;
  title: string;
  date: string;
  category: "reading" | "morning" | "botany" | "places" | "thoughts";
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
    title: "On keeping petals",
    date: "Spring, a quiet Sunday",
    category: "botany",
    excerpt:
      "A daisy does not lose its summer simply because it was pressed between two heavy dictionaries.",
    content:
      "A daisy does not lose its summer simply because it was pressed between two heavy dictionaries. If anything, it remembers the sunlight more intensely in the flat quiet of paper. When you open an old volume months later, it is never just dried fiber that falls out — it is an entire Tuesday morning you thought you had forgotten.",
    source: "Pocket notebook no. 4",
    accentColor: "var(--color-pink)",
    rotation: -1.8,
    tapeColor: "rgba(223, 185, 87, 0.45)",
  },
  {
    id: "note-2",
    title: "Before the kettle boils",
    date: "7:15 AM, early autumn",
    category: "morning",
    excerpt:
      "The house is coolest right before the water begins to hum. A blue-grey light sits on the tabletop.",
    content:
      "The house is coolest right before the water begins to hum. A blue-grey light sits on the tabletop, slow and forgiving. You don't have to explain yourself to the morning; you only have to stand still and let the warm ceramic cup thaw your palms.",
    source: "Tea table notes",
    accentColor: "var(--color-butter)",
    rotation: 1.5,
    tapeColor: "rgba(217, 154, 160, 0.45)",
  },
  {
    id: "note-3",
    title: "Sentences for later",
    date: "Book margin, page 142",
    category: "reading",
    excerpt:
      "“Pay attention to what stays soft inside you, even when the world gets loud.”",
    content:
      "“Pay attention to what stays soft inside you, even when the world gets loud.” Found scribbled lightly in pencil with a dog-eared corner. Sometimes a single sentence is enough shelter for the whole week.",
    source: "Mary Oliver / Notes on attention",
    accentColor: "var(--color-sage)",
    rotation: -2.2,
    tapeColor: "rgba(107, 118, 88, 0.35)",
  },
  {
    id: "note-4",
    title: "The bench under the fig tree",
    date: "Late afternoon",
    category: "places",
    excerpt:
      "There is a small stone bench tucked away in the courtyard where the pigeons never rush.",
    content:
      "There is a small stone bench tucked away in the courtyard where the pigeons never rush. If you sit long enough, you begin to notice the leaves breathing against the brick wall. A good place to bring a book you don't actually intend to finish.",
    source: "City wanderings",
    accentColor: "var(--color-lavender)",
    rotation: 2.1,
    tapeColor: "rgba(168, 155, 196, 0.45)",
  },
  {
    id: "note-5",
    title: "Small definitions of joy",
    date: "Everyday fragment",
    category: "thoughts",
    excerpt:
      "Washing delicate ceramic cups by hand. The scent of rain hitting warm concrete. Clean linen folded warm.",
    content:
      "Washing delicate ceramic cups by hand. The scent of rain hitting warm concrete. Clean linen folded warm from the sun. Writing with a pen that flows just a little too generously. Finding a forgotten five-petaled flower dried inside an atlas.",
    source: "Ongoing list",
    accentColor: "var(--color-blush)",
    rotation: -1.2,
    tapeColor: "rgba(189, 99, 92, 0.35)",
  },
  {
    id: "note-6",
    title: "A letter not yet mailed",
    date: "Dusk, by the window",
    category: "thoughts",
    excerpt:
      "I hope you are taking your time somewhere quiet, and that someone brought you flowers this week.",
    content:
      "I hope you are taking your time somewhere quiet, and that someone brought you flowers this week without asking what they were for. Be tender with your hours. They slip away like fine sand, but they leave warmth on your fingers.",
    source: "Unsent envelope",
    accentColor: "var(--color-paper-deep)",
    rotation: 1.8,
    tapeColor: "rgba(223, 185, 87, 0.4)",
  },
];
