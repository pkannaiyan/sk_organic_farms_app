// SK Organic Farms / Sunantha Organic Farms Theme
// Colors from Shopify theme settings

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

// Brand Info
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
  },
};

// Collections from Shopify
export const collections = [
  { id: 'organic-manures', name: 'Organic Manures', icon: '🌱' },
  { id: 'organic-seeds', name: 'Native Organic Seeds', icon: '🌾' },
  { id: 'organic-millets-rice', name: 'Millets & Rice', icon: '🍚' },
  { id: 'falcon-1', name: 'Garden Tools', icon: '🔧' },
  { id: 'grow-bags-for-terrace-garden', name: 'Grow Bags', icon: '🛍️' },
  { id: 'skin-and-hair-care', name: 'Skin & Hair Care', icon: '✨' },
  { id: 'sea-weed-products', name: 'Sea Weed Products', icon: '🌿' },
  { id: 'our-packages', name: 'Our Packages', icon: '📦' },
  { id: 'potting-medium', name: 'Potting Medium', icon: '🪴' },
  { id: 'garden-sprayer', name: 'Garden Sprayer', icon: '💦' },
  { id: 'live-plants', name: 'Live Plants', icon: '🌺' },
  { id: 'justbrews', name: 'JustBrews', icon: '☕' },
  { id: 'daily-deals', name: 'Daily Deals', icon: '🏷️' },
  { id: 'biocarve', name: 'BioCarve Seeds', icon: '🌻' },
];

export default {
  colors,
  fonts,
  spacing,
  borderRadius,
  brand,
  collections,
};

