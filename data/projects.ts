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

const JOURNEY_ORDER: Record<string, number> = {
  "learning-journey": 0,
  "many-little-jobs": 1,
  "port-life": 2,
  "life-beyond-work": 3,
};

export const COLLECTIONS: CollectionItem[] = [
  {
    slug: "port-life",
    title: "Port Life",
    year: "2023—Present",
    category: "work & operations",
    description:
      "I work as a commercial specialist in port operations, coordinating quotations, deposits, documents, procedures, payments, invoices, and customer support. So far, I have handled documentation for more than 300 vessels carrying different kinds of cargo.",
    note: "300+ vessels, carefully handled",
    color: "#6b7658",
    image: "/assets/images/port-life/port-life.jpg",
    imageAlt: "Kim Khanh standing at the port in front of a docked vessel",
    details: [
      {
        id: "port-1",
        title: "Commercial Coordination",
        subtitle: "quotation · deposit · payment · invoice",
        image: "/assets/images/port-life/port-life_2.jpg",
        description:
          "My daily work connects commercial requests with the documents and procedures required to keep each port call moving clearly and accurately.",
      },
      {
        id: "port-2",
        title: "Vessel Documentation",
        subtitle: "more than 300 vessels",
        image: "/assets/images/port-life/port-life.jpg",
        description:
          "Over three years, I have checked and handled documents for more than 300 vessels across several kinds of cargo.",
      },
      {
        id: "port-3",
        title: "Customer Support",
        subtitle: "communication · listening · follow-through",
        image: "/assets/images/port-life/port-life_3.jpg",
        description:
          "I communicate with customers, listen closely to what each case needs, and follow details through from the first request to completion.",
      },
    ],
  },
  {
    slug: "many-little-jobs",
    title: "Many Little Jobs",
    year: "student years",
    category: "experience & people",
    description:
      "Before settling into my main career, I wanted to understand work from many angles. Convenience stores, wedding receptions, film sets, telesales, fashion studios, online retail, and a bus internship each taught me something different about people and responsibility.",
    note: "every job left a lesson",
    color: "#d99aa0",
    image: "/assets/images/flower_7.avif",
    imageAlt: "Temporary floral placeholder for Kim Khanh's part-time work chapter",
    details: [
      {
        id: "jobs-1",
        title: "Five 7-Eleven Stores",
        subtitle: "convenience store staff · 2 years",
        image: "/assets/images/flower_7.avif",
        description:
          "Two years working across five stores helped me become adaptable, attentive, and comfortable supporting many customers in a fast-moving environment.",
      },
      {
        id: "jobs-2",
        title: "More Than 100 Weddings",
        subtitle: "wedding reception staff · 4 years",
        image: "/assets/images/flower_6.avif",
        description:
          "Seasonal reception work across more than one hundred weddings taught me teamwork, composure, timing, and care for small details.",
      },
      {
        id: "jobs-3",
        title: "Behind the Scenes",
        subtitle: "film · styling · telesales · online retail",
        image: "/assets/images/flower_8.avif",
        description:
          "I also worked as an extra in five films and two TV commercials, assisted a photo-studio stylist, supported an online clothing store, and worked remotely in telesales.",
      },
      {
        id: "jobs-4",
        title: "On the Bus",
        subtitle: "graduation internship",
        image: "/assets/images/flower_9.avif",
        description:
          "Working as a bus conductor during my internship gave me direct experience of transport operations before graduation.",
      },
    ],
  },
  {
    slug: "learning-journey",
    title: "Learning Journey",
    year: "2020—2026",
    category: "education",
    description:
      "I studied Transport Operations at Ho Chi Minh City University of Transport, graduating in 2024 with a GPA of 3.18 and a Very Good classification. I later achieved an IELTS overall band score of 6.0 in 2026.",
    note: "always learning, step by step",
    color: "#dfb957",
    image: "/assets/images/learning/learning.jpg",
    imageAlt: "Kim Khanh in her graduation gown at Ho Chi Minh City University of Transport",
    details: [
      {
        id: "learning-1",
        title: "Transport Operations",
        subtitle: "Ho Chi Minh City University of Transport · 2020—2024",
        image: "/assets/images/learning/learning.jpg",
        description:
          "I completed my degree in Transport Operations with a GPA of 3.18 and graduated with a Very Good classification in 2024.",
      },
      {
        id: "learning-2",
        title: "IELTS Academic",
        subtitle: "overall 6.0 · 2026",
        image: "/assets/images/learning/learning_3.jpg",
        description:
          "Listening 5.0, Reading 6.0, Speaking 6.0, and Writing 6.5.",
      },
    ],
  },
  {
    slug: "life-beyond-work",
    title: "Life Beyond Work",
    year: "always",
    category: "interests & small joys",
    description:
      "Away from documents and port procedures, I make room for badminton, swimming, guitar, chess, raw doodles, flower arranging, Vietnamese literature, travel, and good food. These are the things that keep me curious and joyful.",
    note: "curiosity keeps life colourful",
    color: "#a89bc4",
    image: "/assets/images/little-joys/little-joys_3.png",
    imageAlt: "Kim Khanh holding a bouquet of small white flowers in front of a mirror",
    details: [
      {
        id: "life-1",
        title: "Raw Doodles",
        subtitle: "quick sketches from references",
        image: "/assets/images/little-joys/little-joy_7.jpg",
        description:
          "I enjoy sketching quickly from reference images and keeping the lines loose, raw, and full of movement.",
      },
      {
        id: "life-2",
        title: "Badminton & Chess",
        subtitle: "clubs and student tournaments",
        image: "/assets/images/little-joys/little-joys_9.jpg",
        description:
          "At university I joined badminton and chess clubs, including the University of Transport badminton tournament in 2024 and the Van Lang Cup student chess tournaments in 2021 and 2022.",
      },
      {
        id: "life-3",
        title: "Books, Flowers & Places",
        subtitle: "the things I return to",
        image: "/assets/images/little-joys/little-joys.png",
        description:
          "Vietnamese literature is my first reading choice. I also love planting and arranging flowers, travelling, discovering food, nature, animals, áo dài, and vessels.",
      },
    ],
  },
].sort((a, b) => JOURNEY_ORDER[a.slug] - JOURNEY_ORDER[b.slug]);
