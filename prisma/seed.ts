import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const paintings = [
  {
    slug: "interior-scene-with-resting-figure",
    title: "Interior Scene with Resting Figure",
    artist: "A. Batta (attributed)",
    year: "c. 1880",
    medium: "Oil on canvas",
    dimensions: "34.7 × 23.5 cm",
    category: "orientalist",
    featured: true,
    description:
      "A hushed interior rendered in cool blues and warm earth tones. A resting figure occupies the lower left, surrounded by wooden posts and diffuse light from high openings. Signed lower right.",
    imageUrl: "/images/paintings/painting-1.jpg",
    sortOrder: 1,
  },
  {
    slug: "young-musician-with-oud",
    title: "Young Musician with Oud",
    artist: "Continental School",
    year: "c. 1870–1885",
    medium: "Oil on canvas",
    dimensions: "44 × 33 cm",
    category: "orientalist",
    featured: false,
    description:
      "A turbaned youth absorbed in playing the oud, bare feet crossed, surrounded by small vessels. Dark background focuses attention on the figure. Fluid confident brushwork.",
    imageUrl: "/images/paintings/painting-2.jpg",
    sortOrder: 2,
  },
  {
    slug: "sentinel-in-white-burnous",
    title: "Sentinel in White Burnous",
    artist: "Monogrammed R.A.",
    year: "c. 1875–1890",
    medium: "Oil on canvas",
    dimensions: "76 × 35 cm",
    category: "orientalist",
    featured: true,
    description:
      "A lone figure wrapped in a white burnous, holding a long rifle across his body, a powder horn at his belt. Tall vertical format. Signed lower left.",
    imageUrl: "/images/paintings/painting-3.jpg",
    sortOrder: 3,
  },
  {
    slug: "palace-guard-with-rifle",
    title: "Palace Guard with Rifle",
    artist: "Continental School",
    year: "c. 1880–1895",
    medium: "Oil on canvas",
    dimensions: "52 × 38 cm",
    category: "orientalist",
    featured: true,
    description:
      "A richly dressed guard in embroidered blue vest and orange turban stands in an ornate Moorish archway. Detailed tilework and carved columns rendered with precision.",
    imageUrl: "/images/paintings/painting-4.jpg",
    sortOrder: 4,
  },
  {
    slug: "portrait-of-a-bearded-man",
    title: "Portrait of a Bearded Man",
    artist: "European School",
    year: "c. 1860–1880",
    medium: "Oil on canvas",
    dimensions: "42 × 38 cm",
    category: "portrait",
    featured: false,
    description:
      "A powerful head study of a bearded man with long auburn hair. Direct gaze, warm palette, summary lower composition directing focus to the expressive face.",
    imageUrl: "/images/paintings/painting-5.jpg",
    sortOrder: 5,
  },
  {
    slug: "dancer-before-a-moorish-arch",
    title: "Dancer Before a Moorish Arch",
    artist: "Continental School",
    year: "c. 1880–1900",
    medium: "Oil on panel",
    dimensions: "58 × 22 cm",
    category: "orientalist",
    featured: false,
    description:
      "A slender dancer in elaborate dress raises one arm beneath a horseshoe arch hung with a patterned rug. Arabic calligraphy on the column. Gold-leaf ground. Narrow vertical panel.",
    imageUrl: "/images/paintings/painting-6.jpg",
    sortOrder: 6,
  },
  {
    slug: "head-study-hajj-nasser-al-din",
    title: "Head Study: Hajj Nasser Al-Din",
    artist: "European School (inscribed)",
    year: "c. 1870–1885",
    medium: "Watercolour and pencil on paper",
    dimensions: "22 × 16 cm",
    category: "works-on-paper",
    featured: false,
    description:
      "A delicate head study in watercolour and pencil. Arabic inscription at lower right reads Al-Hajj Nasser Al-Din. Direct observation from life. Mounted.",
    imageUrl: "/images/paintings/painting-7.jpg",
    sortOrder: 7,
  },
];

async function main() {
  // Create admin user
  const passwordHash = bcrypt.hashSync("alhamad2024", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@alhamadgallery.com" },
    update: { passwordHash },
    create: {
      email: "admin@alhamadgallery.com",
      passwordHash,
    },
  });
  console.log("Admin user created: admin@alhamadgallery.com");

  // Create paintings
  for (const p of paintings) {
    await prisma.painting.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`Seeded ${paintings.length} paintings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
