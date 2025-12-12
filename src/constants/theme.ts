// SK Organic Farms / Sunantha Organic Farms Theme
// Colors and data from Shopify theme settings_data.json

export const colors = {
  // Primary Colors
  primary: '#198754',
  primaryDark: '#1da362',
  primaryLight: '#8bd4b2',
  
  // Header Colors
  headerPrimaryText: '#163340',
  headerPrimaryBg: '#FFFFFF',
  headerSecondaryText: '#163340',
  headerSecondaryBg: '#198754',
  headerSearchBg: '#8bd4b2',
  
  // Footer
  footerBg: '#1da362',
  footerText: '#FFFFFF',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F3F3F3',
  
  // Text Colors
  text: '#121212',
  textLight: '#666666',
  textWhite: '#FFFFFF',
  
  // Accent Colors
  accent1: '#121212',
  accent2: '#334FB4',
  
  // Button Colors
  buttonBg: '#198754',
  buttonText: '#FFFFFF',
  
  // Status Colors
  success: '#198754',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#0dcaf0',
};

export const fonts = {
  header: 'System', // Nunito in web
  body: 'System', // Instrument Sans in web
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Brand Info from settings_data.json
export const brand = {
  name: 'Sunantha Organic Farms',
  previousName: 'SK Organic Farms',
  tagline: 'Promoting Organic Living',
  email: 'skofarms@gmail.com',
  phone: '6380464748',
  social: {
    twitter: 'https://www.skorganicfarms.com/@skorganicfarms1',
    facebook: 'https://www.facebook.com/skorganicfarms',
    instagram: 'https://www.instagram.com/sk_organic_farms/',
    youtube: 'https://www.youtube.com/channel/UCskorganicfarms',
  },
  locations: {
    chennaiShop: {
      name: 'Chennai Shop (Mahathi Biotech)',
      address: 'Kalasathamman Koil St, Moogambigai Nagar, Ramapuram, Chennai, Tamil Nadu 600089',
      hours: 'Mon - Sun, 9am - 11pm',
    },
    farm: {
      name: 'Our Farm & Outlet',
      address: 'SK Organic Farms, Road, Melkothakuppam, Tamil Nadu 635805',
      hours: 'Mon - Sun, 9am - 11pm',
    },
  },
};

// Homepage Slideshow - from index.json
export const heroSlides = [
  {
    id: 1,
    title: 'Garden Setup',
    subtitle: 'Shade House and Vegetable & Herbal Garden Setup',
    buttonText: 'View All Products',
    buttonLink: 'hdpe-grow-bags',
    image: 'IMG_2100.png',
  },
  {
    id: 2,
    title: 'Native Organic Seeds',
    subtitle: 'Vegetable, Flower, Tree, Fruit & Herbal Seeds',
    buttonText: 'View all products',
    buttonLink: 'seeds',
    image: 'IMG_2099.png',
  },
  {
    id: 3,
    title: 'Garden Tools',
    subtitle: 'Shade House and Vegetable and Herbal Garden Setup',
    buttonText: 'View all products',
    buttonLink: 'garden-tools-1',
    image: 'IMG_2101.png',
  },
];

// Collections from index.json - "Our Collection" section
export const collections = [
  {
    id: 'organic-manures',
    handle: 'organic-manures',
    title: 'Organic Manures',
    image: 'IMG-2096.png',
    icon: '🌱',
  },
  {
    id: 'organic-seeds',
    handle: 'organic-seeds',
    title: 'Organic Seeds',
    image: 'IMG-2091.png',
    icon: '🌾',
  },
  {
    id: 'organic-millets-rice',
    handle: 'organic-millets-rice',
    title: 'Millets & Rice',
    image: null,
    icon: '🍚',
  },
  {
    id: 'falcon-1',
    handle: 'falcon-1',
    title: 'Garden Tools (Falcon)',
    image: 'falcon.jpg',
    icon: '🔧',
  },
  {
    id: 'grow-bags-for-terrace-garden',
    handle: 'grow-bags-for-terrace-garden',
    title: 'Grow Bags',
    image: 'IMG-2104.png',
    icon: '🛍️',
  },
  {
    id: 'skin-and-hair-care',
    handle: 'skin-and-hair-care',
    title: 'Skin & Hair Care',
    image: '4786E3F2-BDCD-484D-9274-66DE8A5A4834.webp',
    icon: '✨',
  },
  {
    id: 'sea-weed-products',
    handle: 'sea-weed-products',
    title: 'Sea Weed Products',
    image: 'SEAWEED.jpg',
    icon: '🌿',
  },
  {
    id: 'our-packages',
    handle: 'our-packages',
    title: 'Our Packages',
    image: 'IMG-2097.png',
    icon: '📦',
  },
  {
    id: 'potting-medium',
    handle: 'potting-medium',
    title: 'Potting Medium',
    image: 'IMG-2090.png',
    icon: '🪴',
  },
  {
    id: 'garden-sprayer',
    handle: 'garden-sprayer',
    title: 'Garden Sprayer',
    image: '3110-05.jpg',
    icon: '💦',
  },
  {
    id: 'live-plants',
    handle: 'live-plants',
    title: 'Live Plants',
    image: 'LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg',
    icon: '🌺',
  },
];

// Featured Collections from index.json (order matters)
export const featuredCollections = [
  {
    id: 'organic-seeds',
    handle: 'organic-seeds',
    title: 'Native Organic Seeds',
    subtitle: '',
  },
  {
    id: 'justbrews',
    handle: 'justbrews',
    title: 'JustBrews',
    subtitle: 'Coffee & Tea Powder',
  },
  {
    id: 'grow-bags-for-terrace-garden',
    handle: 'grow-bags-for-terrace-garden',
    title: 'Grow Bags',
    subtitle: '',
  },
  {
    id: 'daily-deals',
    handle: 'daily-deals',
    title: 'Daily Deals',
    subtitle: '',
  },
  {
    id: 'sea-weed-products',
    handle: 'sea-weed-products',
    title: 'Sea Weed Products',
    subtitle: '',
  },
  {
    id: 'skin-and-hair-care',
    handle: 'skin-and-hair-care',
    title: 'Skin & Hair Care',
    subtitle: '',
  },
  {
    id: 'live-plants',
    handle: 'live-plants',
    title: 'Live Plants & Saplings',
    subtitle: '',
  },
  {
    id: 'biocarve',
    handle: 'biocarve',
    title: 'BioCarve Seeds',
    subtitle: '',
  },
  {
    id: 'organic-millets-rice',
    handle: 'organic-millets-rice',
    title: 'Rice and Millets',
    subtitle: '',
  },
  {
    id: 'falcon-1',
    handle: 'falcon-1',
    title: 'Garden Tools',
    subtitle: '',
  },
];

// Featured Products from index.json
export const featuredProducts = [
  {
    handle: 'potting-mix',
    title: 'Potting Soil',
  },
  {
    handle: 'terrace-kitchen-garden-setup-shade-house-setup',
    title: 'Terrace/Kitchen Garden Setup',
  },
];

// Our Brands (Logo list from index.json)
export const brands = [
  {
    id: 'falcon',
    name: 'Falcon',
    image: 'falcon.jpg',
    link: 'falcon-1',
  },
  {
    id: 'skof',
    name: 'SKOF',
    image: 'SKOF_new_logo_tm_9b6a7846-af4e-4def-ac18-8b7165eaf2b9.jpg',
    link: '',
  },
  {
    id: 'bellota',
    name: 'Bellota',
    image: 'bellota_logo.jpg',
    link: '',
  },
  {
    id: 'epla',
    name: 'EPLA',
    image: 'EPLA-logo_802a7aba-6c86-4917-a3f7-6d457d52659c.jpeg',
    link: '',
  },
  {
    id: 'biocarve',
    name: 'BioCarve',
    image: 'biocurve.jpg',
    link: 'biocarve',
  },
];

// Special sections from index.json
export const specialSections = {
  farmVisit: {
    title: 'Farm Visit',
    description: 'Visiting a live farm can be a wonderful family activity, educational experience and entertainment for children and adults. If you would like to know more about organic food and farming, why not visit our organic farm? In Sunantha Organic Farms, we encourage individuals and groups (Schools, colleges and corporate) to visit our farm and learn our traditional and natural way of farming.',
    buttonText: 'Pay Here',
    productHandle: 'farm-visit-payment',
    image: 'DSC_0253.JPG',
  },
  spirulinaTraining: {
    title: 'Spirulina Setup & Training',
    description: 'We at, Sunantha Organic Farms have developed a world class solution for spirulina cultivation. By employing the best and advanced technology, we provide high quality products and support to setup end to end spirulina pond and provide necessary training.',
    buttonText: 'Pay Here',
    productHandle: 'training-spirulina-cultivation',
    image: 'DSC_0237.JPG',
  },
  videoSection: {
    title: 'Interview SOF Director',
    subtitle: 'How to identify fake organic products',
    videoUrl: 'https://www.youtube.com/watch?v=4eyA_sqPCzY',
  },
};

// Gallery images from index.json
export const galleryImages = [
  {image: 'SPIRU9.jpg', product: 'training-spirulina-cultivation', subtitle: 'Spirulina Class room training by Dr.Babu'},
  {image: 'IMG-2097.png', product: 'terrace-kitchen-garden-setup-shade-house-setup', subtitle: ''},
  {image: 'DSC_0253.JPG', product: 'farm-visit-payment', subtitle: ''},
  {image: 'DSC_0192.JPG', product: '', subtitle: ''},
  {image: 'IMG_1355.JPG', product: '', subtitle: 'Our Ambur Nursery'},
  {image: 'IMG-2097.png', product: 'organic-terrace-garden-pack-only-vegetable-garden', subtitle: ''},
];

// Newsletter section
export const newsletter = {
  heading: 'Subscribe to our Newsletter',
  subheading: 'Promotions, new products and sales. Directly to your inbox.',
};

export default {
  colors,
  fonts,
  spacing,
  borderRadius,
  brand,
  heroSlides,
  collections,
  featuredCollections,
  featuredProducts,
  brands,
  specialSections,
  galleryImages,
  newsletter,
};
