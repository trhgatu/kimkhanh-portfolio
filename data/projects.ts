export type CollectionItem = {
  slug: string;
  title: string;
  year: string;
  category: string;
  description: string;
  note: string;
  color: string;
  image: string;
  imageAlt: string;
};

export const COLLECTIONS: CollectionItem[] = [
  {
    slug: "pressed-flowers",
    title: "Pressed Flowers",
    year: "ongoing",
    category: "botanical notes",
    description:
      "Petals, leaves, and tiny stems gathered from ordinary days — kept as quiet reminders of where I have been.",
    note: "saved between pages",
    color: "#d99aa0",
    image: "/assets/images/flower_2.avif",
    imageAlt: "A delicate flower from Kim Khanh's botanical collection",
  },
  {
    slug: "slow-mornings",
    title: "Slow Mornings",
    year: "lately",
    category: "daily rituals",
    description:
      "Soft light, something warm to drink, and a little time before the day begins asking for anything.",
    note: "best enjoyed unhurried",
    color: "#dfb957",
    image: "/assets/images/flower_7.avif",
    imageAlt: "A warm floral still life evoking a slow morning",
  },
  {
    slug: "little-places",
    title: "Little Places",
    year: "here & there",
    category: "places remembered",
    description:
      "Corners of the world that stayed with me: a garden path, a sunlit window, a table shared with someone dear.",
    note: "small places, fondly kept",
    color: "#a89bc4",
    image: "/assets/images/flower_11.avif",
    imageAlt: "Flowers marking a place remembered fondly",
  },
  {
    slug: "words-for-later",
    title: "Words for Later",
    year: "always growing",
    category: "notes & fragments",
    description:
      "Sentences from books, things overheard, and thoughts that arrived at the right time — all waiting to be found again.",
    note: "written in the margins",
    color: "#6b7658",
    image: "/assets/images/flower_14.avif",
    imageAlt: "A floral study beside handwritten notes",
  },
];
