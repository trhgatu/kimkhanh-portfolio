export type CollectionDetailItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  botanicalNote?: string;
};

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
  details: CollectionDetailItem[];
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
    details: [
      {
        id: "pf-1",
        title: "Wild Chamomile",
        subtitle: "Matricaria chamomilla · gathered in May",
        image: "/assets/images/flower_2.avif",
        description:
          "Found alongside the gravel path after a morning drizzle. Pressed inside a heavy grammar dictionary for forty days until the yellow disk florets turned paper-thin and golden.",
        botanicalNote: "Petals retain their delicate honey-apple fragrance even when dried.",
      },
      {
        id: "pf-2",
        title: "Meadow Poppy",
        subtitle: "Papaver rhoeas · high summer",
        image: "/assets/images/flower_1.avif",
        description:
          "Tender scarlet petals that wrinkled into fine silk. Saved from an overgrown grassy verge on an uncharacteristically hot afternoon.",
        botanicalNote: "The petals are so gossamer-thin they require tweezers to mount without tearing.",
      },
      {
        id: "pf-3",
        title: "Wood Anemone",
        subtitle: "Anemonoides nemorosa · early April",
        image: "/assets/images/flower_3.avif",
        description:
          "Starry white blossoms collected under the shade of old oaks. A herald of slow spring days and cool mornings.",
        botanicalNote: "Stems dried straight with leaves intact.",
      },
      {
        id: "pf-4",
        title: "Buttercup Fragment",
        subtitle: "Ranunculus acris · late June",
        image: "/assets/images/flower_5.avif",
        description:
          "Glossy yellow petals that look almost lacquered in the sun. Kept flat against heavy handmade paper.",
        botanicalNote: "Luster remains visible under angled morning light.",
      },
    ],
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
    details: [
      {
        id: "sm-1",
        title: "Steeping Jasmine Buds",
        subtitle: "Kitchen counter · 6:45 AM",
        image: "/assets/images/flower_7.avif",
        description:
          "The kettle sighs, and dried jasmine flowers unfurl slowly in the clear pot. No rush to check the phone; only the steam rising toward the sunlit ceiling.",
        botanicalNote: "Water kept just under boiling to preserve sweet aromatics.",
      },
      {
        id: "sm-2",
        title: "Morning Linen & Sunbeam",
        subtitle: "Bedroom corner · early breeze",
        image: "/assets/images/flower_6.avif",
        description:
          "A small ceramic cup sitting on a linen tablecloth while dust motes dance in the diagonal light. The quietest fifteen minutes of the day.",
        botanicalNote: "Accompanied by a fresh stem of garden greenery.",
      },
      {
        id: "sm-3",
        title: "Unhurried Pages",
        subtitle: "Armchair reading · 7:30 AM",
        image: "/assets/images/flower_8.avif",
        description:
          "Reading twenty pages of poetry before anyone else in the building is awake. Words sound clearer when the day is young.",
        botanicalNote: "A dried petal marks the favorite verse.",
      },
    ],
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
    details: [
      {
        id: "lp-1",
        title: "The River Path at Dusk",
        subtitle: "Westbank willow trail",
        image: "/assets/images/flower_11.avif",
        description:
          "Where wild grasses lean into the slow water. The smell of damp stone and evening coolness settling into the weeds.",
        botanicalNote: "A sprig of lavender pressed on return.",
      },
      {
        id: "lp-2",
        title: "Courtyard with Wild Ferns",
        subtitle: "Quiet alleyway café",
        image: "/assets/images/flower_9.avif",
        description:
          "An iron table with slightly peeling paint, surrounded by pots of moss and tall ferns. Cool shade on a sweltering July midday.",
        botanicalNote: "Fern fronds printed directly onto parchment paper.",
      },
      {
        id: "lp-3",
        title: "The Sunlit Window Sill",
        subtitle: "Second floor studio",
        image: "/assets/images/flower_10.avif",
        description:
          "Where glass jars catch the 4 PM light, casting amber and green reflections across the wooden floorboards.",
        botanicalNote: "Home to small cuttings rooting in clear water.",
      },
    ],
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
    details: [
      {
        id: "wl-1",
        title: "On Attention & Tenderness",
        subtitle: "Scribbled in pencil",
        image: "/assets/images/flower_14.avif",
        description:
          "“Attention is the rarest and purest form of generosity.” Finding time to truly notice small things is how an ordinary life turns luminous.",
        botanicalNote: "Simone Weil / Field note.",
      },
      {
        id: "wl-2",
        title: "Bookmark Left in Summer",
        subtitle: "Between chapters 4 and 5",
        image: "/assets/images/flower_12.avif",
        description:
          "“Let everything happen to you: beauty and terror. Just keep going. No feeling is final.” A reminder tucked into the spine.",
        botanicalNote: "Rainer Maria Rilke.",
      },
      {
        id: "wl-3",
        title: "Quiet Observations",
        subtitle: "Handwritten envelope",
        image: "/assets/images/flower_13.avif",
        description:
          "Life is mostly made of small, unrecorded tendernesses: making someone tea, waiting patiently, leaving a gentle note on the door.",
        botanicalNote: "Collected slowly, kept with care.",
      },
    ],
  },
];
