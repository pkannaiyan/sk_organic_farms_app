// Shopify Store Configuration
// Store: sk-nursery.myshopify.com (Sunantha Organic Farms)

export const SHOPIFY_CONFIG = {
  storeDomain: 'sk-nursery.myshopify.com',
  storefrontAccessToken: '', // Add your Storefront API token here
  apiVersion: '2024-01',
};

// Store URLs
export const STORE_URL = `https://${SHOPIFY_CONFIG.storeDomain}`;
export const STOREFRONT_API_URL = `${STORE_URL}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;

// Using placeholder images until Storefront API is configured
// These will be replaced with actual product images from API
const PLACEHOLDER_BASE = 'https://picsum.photos/seed';

// Generate consistent placeholder images for each category
export const getPlaceholderImage = (seed: string, width = 400, height = 400) => {
  return `${PLACEHOLDER_BASE}/${seed}/${width}/${height}`;
};

// Category-specific placeholder images (using seeds for consistency)
export const categoryImages = {
  seeds: getPlaceholderImage('organic-seeds', 400, 400),
  manures: getPlaceholderImage('organic-manures', 400, 400),
  growBags: getPlaceholderImage('grow-bags', 400, 400),
  tools: getPlaceholderImage('garden-tools', 400, 400),
  plants: getPlaceholderImage('live-plants', 400, 400),
  skincare: getPlaceholderImage('skincare', 400, 400),
  seaweed: getPlaceholderImage('seaweed', 400, 400),
  millets: getPlaceholderImage('millets', 400, 400),
  coffee: getPlaceholderImage('coffee-tea', 400, 400),
  sprayer: getPlaceholderImage('sprayer', 400, 400),
  potting: getPlaceholderImage('potting', 400, 400),
  packages: getPlaceholderImage('packages', 400, 400),
};

// Hero slide images
export const heroImages = [
  getPlaceholderImage('garden-hero-1', 800, 400),
  getPlaceholderImage('seeds-hero-2', 800, 400),
  getPlaceholderImage('tools-hero-3', 800, 400),
];

// Brand logos
export const brandImages = {
  falcon: getPlaceholderImage('falcon-brand', 200, 200),
  skof: getPlaceholderImage('skof-brand', 200, 200),
  bellota: getPlaceholderImage('bellota-brand', 200, 200),
  epla: getPlaceholderImage('epla-brand', 200, 200),
  biocarve: getPlaceholderImage('biocarve-brand', 200, 200),
};

// Gallery images
export const galleryImages = [
  getPlaceholderImage('farm-gallery-1', 300, 300),
  getPlaceholderImage('farm-gallery-2', 300, 300),
  getPlaceholderImage('farm-gallery-3', 300, 300),
  getPlaceholderImage('farm-gallery-4', 300, 300),
  getPlaceholderImage('farm-gallery-5', 300, 300),
  getPlaceholderImage('farm-gallery-6', 300, 300),
];

// Map images
export const mapImages = {
  chennai: getPlaceholderImage('chennai-map', 400, 200),
  farm: getPlaceholderImage('farm-map', 400, 200),
};

// Logo
export const logoImage = getPlaceholderImage('skof-logo', 200, 200);

// Special section images
export const specialImages = {
  farmVisit: getPlaceholderImage('farm-visit', 400, 300),
  spirulina: getPlaceholderImage('spirulina', 400, 300),
  blog1: getPlaceholderImage('blog-1', 400, 300),
  blog2: getPlaceholderImage('blog-2', 400, 300),
  blog3: getPlaceholderImage('blog-3', 400, 300),
};

// Product images by category
export const productImages: {[key: string]: string[]} = {
  'organic-seeds': [
    getPlaceholderImage('tomato-seeds', 400, 400),
    getPlaceholderImage('chilli-seeds', 400, 400),
    getPlaceholderImage('brinjal-seeds', 400, 400),
    getPlaceholderImage('ladyfinger-seeds', 400, 400),
    getPlaceholderImage('coriander-seeds', 400, 400),
  ],
  'justbrews': [
    getPlaceholderImage('filter-coffee', 400, 400),
    getPlaceholderImage('green-tea', 400, 400),
    getPlaceholderImage('herbal-tea', 400, 400),
  ],
  'grow-bags': [
    getPlaceholderImage('growbag-15', 400, 400),
    getPlaceholderImage('growbag-12', 400, 400),
    getPlaceholderImage('growbag-pack', 400, 400),
  ],
  'daily-deals': [
    getPlaceholderImage('combo-deal', 400, 400),
    getPlaceholderImage('starter-kit', 400, 400),
    getPlaceholderImage('manure-deal', 400, 400),
  ],
  'seaweed': [
    getPlaceholderImage('seaweed-extract', 400, 400),
    getPlaceholderImage('seaweed-spray', 400, 400),
  ],
  'skincare': [
    getPlaceholderImage('aloe-vera', 400, 400),
    getPlaceholderImage('hair-oil', 400, 400),
  ],
  'plants': [
    getPlaceholderImage('lemongrass', 400, 400),
    getPlaceholderImage('tulsi', 400, 400),
    getPlaceholderImage('curry-leaves', 400, 400),
  ],
  'biocarve': [
    getPlaceholderImage('biocarve-tomato', 400, 400),
    getPlaceholderImage('biocarve-flower', 400, 400),
  ],
  'millets': [
    getPlaceholderImage('foxtail-millet', 400, 400),
    getPlaceholderImage('little-millet', 400, 400),
    getPlaceholderImage('brown-rice', 400, 400),
  ],
  'tools': [
    getPlaceholderImage('hand-trowel', 400, 400),
    getPlaceholderImage('pruning-shears', 400, 400),
    getPlaceholderImage('garden-fork', 400, 400),
  ],
};
