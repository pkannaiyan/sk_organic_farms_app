/**
 * Custom Collection Screens - All templates from SK_Organic_Updated_Dec2025 theme
 */

import React from 'react';
import CollectionTemplateScreen, {CollectionTemplateConfig} from '../CollectionTemplateScreen';

// ============ SEEDS COLLECTION ============
const SEEDS_CONFIG: CollectionTemplateConfig = {
  name: 'Seeds Collection',
  headerColor: '#1B5E20',
  accentColor: '#4CAF50',
  heroImage: 'IMG_2099.png',
  heroTitle: 'Native Organic Seeds',
  heroSubtitle: '100% Non-GMO • Heirloom Varieties • High Germination Rate',
  heroTagline: 'Grow Your Own Garden',
  heroButtonText: 'Shop All Seeds',
  heroButtonHandle: 'organic-seeds',
  trustBadges: [
    {icon: '🌱', title: 'Non-GMO Seeds', desc: '100% natural varieties'},
    {icon: '🌿', title: 'High Germination', desc: '85%+ success rate'},
    {icon: '🚚', title: 'Fast Shipping', desc: 'Fresh seeds delivered'},
    {icon: '📖', title: 'Growing Guide', desc: 'Free with every order'},
  ],
  categories: [
    {emoji: '🥬', name: 'Vegetable Seeds', handle: 'vegetable-seeds'},
    {emoji: '🌸', name: 'Flower Seeds', handle: 'flower-seeds'},
    {emoji: '🌿', name: 'Herb Seeds', handle: 'herb-seeds'},
    {emoji: '🌳', name: 'Tree Seeds', handle: 'tree-seeds'},
  ],
  categoriesTitle: 'Shop Seeds by Type',
  categoriesSubtitle: 'Find the perfect seeds for your garden',
  featuredSections: [
    {handle: 'vegetable-seeds', title: '🥬 Vegetable Seeds', subtitle: 'Grow fresh veggies at home'},
    {handle: 'flower-seeds', title: '🌸 Flower Seeds', subtitle: 'Add color to your garden'},
    {handle: 'herb-seeds', title: '🌿 Herb Seeds', subtitle: 'Fresh herbs for cooking'},
    {handle: 'organic-seeds', title: '🌱 All Seeds', subtitle: 'Complete seed catalog'},
  ],
  tips: {
    tag: 'Expert Tips',
    title: 'Seed Starting Guide 🌱',
    content: '1. Soil: Use well-draining potting mix\n2. Watering: Keep moist, not soggy\n3. Sunlight: 6-8 hours of light\n4. Temperature: 20-25°C for germination',
    buttonText: 'Contact Expert',
    image: 'IMG-2091.png',
  },
  newsletterTitle: 'Get Seed Growing Tips 🌱',
  newsletterSubtitle: 'Subscribe for seasonal planting guides & exclusive seed deals!',
};

export const SeedsScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={SEEDS_CONFIG} />
);

// ============ MANURE COLLECTION ============
const MANURE_CONFIG: CollectionTemplateConfig = {
  name: 'Organic Manures',
  headerColor: '#5D4037',
  accentColor: '#A1887F',
  heroImage: 'IMG-2096.png',
  heroTitle: 'Organic Manures & Fertilizers',
  heroSubtitle: '100% Organic • Chemical-Free • Rich in Nutrients',
  heroTagline: 'Feed Your Plants Naturally',
  heroButtonText: 'Shop All Manures',
  heroButtonHandle: 'organic-manures',
  trustBadges: [
    {icon: '🌿', title: '100% Organic', desc: 'No chemicals'},
    {icon: '🌱', title: 'Nutrient Rich', desc: 'Boosts plant growth'},
    {icon: '♻️', title: 'Eco-Friendly', desc: 'Sustainable farming'},
    {icon: '🚚', title: 'Bulk Available', desc: 'For farms & gardens'},
  ],
  categories: [
    {emoji: '🪱', name: 'Vermicompost', handle: 'vermicompost'},
    {emoji: '🥥', name: 'Cocopeat', handle: 'cocopeat'},
    {emoji: '🌿', name: 'Neem Cake', handle: 'neem-cake'},
    {emoji: '🌱', name: 'Potting Mix', handle: 'potting-mix'},
  ],
  categoriesTitle: 'Shop by Type',
  categoriesSubtitle: 'Choose the right fertilizer for your plants',
  featuredSections: [
    {handle: 'vermicompost', title: '🪱 Vermicompost', subtitle: "Nature's best fertilizer"},
    {handle: 'potting-medium', title: '🌱 Potting Mix & Soil', subtitle: 'Ready-to-use growing medium'},
    {handle: 'organic-manures', title: '🧪 All Manures', subtitle: 'Complete organic range'},
  ],
  tips: {
    title: 'How to Use Organic Manure 🧪',
    content: 'For Pots: Mix 20% manure with soil\nFor Gardens: Apply 2kg per sq meter\nFrequency: Every 30-45 days\nBest Time: Early morning or evening',
    buttonText: 'Bulk Order Inquiry',
    image: 'IMG-2096.png',
  },
  newsletterTitle: 'Gardening Tips 🌱',
  newsletterSubtitle: 'Learn organic farming techniques & get exclusive deals!',
};

export const ManureScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={MANURE_CONFIG} />
);

// ============ MILLETS COLLECTION ============
const MILLETS_CONFIG: CollectionTemplateConfig = {
  name: 'Millets & Rice',
  headerColor: '#795548',
  accentColor: '#FFD54F',
  heroImage: 'IMG_2100.png',
  heroTitle: 'Organic Millets & Rice',
  heroSubtitle: 'Stone Ground • Unpolished • Farm Fresh',
  heroTagline: 'Ancient Grains, Modern Health',
  heroButtonText: 'Shop All Millets',
  heroButtonHandle: 'organic-millets-rice',
  trustBadges: [
    {icon: '🌿', title: '100% Organic', desc: 'No pesticides'},
    {icon: '❤️', title: 'Heart Healthy', desc: 'Low glycemic'},
    {icon: '🌾', title: 'Unpolished', desc: 'Full nutrition'},
    {icon: '🚚', title: 'Farm Fresh', desc: 'Direct sourcing'},
  ],
  categories: [
    {emoji: '🌾', name: 'Foxtail Millet', handle: 'foxtail-millet'},
    {emoji: '🌾', name: 'Little Millet', handle: 'little-millet'},
    {emoji: '🌾', name: 'Barnyard', handle: 'barnyard-millet'},
    {emoji: '🍚', name: 'Organic Rice', handle: 'organic-rice'},
  ],
  categoriesTitle: 'Shop by Grain Type',
  categoriesSubtitle: 'Traditional grains for healthy living',
  featuredSections: [
    {handle: 'organic-millets-rice', title: '🌾 Popular Millets', subtitle: 'Customer favorites'},
    {handle: 'organic-rice', title: '🍚 Organic Rice', subtitle: 'Traditional rice varieties'},
  ],
  tips: {
    title: 'Health Benefits of Millets 💪',
    content: 'Diabetic Friendly: Low glycemic index\nWeight Management: High fiber content\nHeart Health: Rich in magnesium\nGluten-Free: Safe for celiac patients',
    buttonText: 'Learn More',
    image: 'IMG_2100.png',
  },
  newsletterTitle: 'Healthy Recipes 🍽️',
  newsletterSubtitle: 'Get millet recipes, cooking tips & exclusive deals!',
};

export const MilletsScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={MILLETS_CONFIG} />
);

// ============ PLANTS COLLECTION ============
const PLANTS_CONFIG: CollectionTemplateConfig = {
  name: 'Live Plants',
  headerColor: '#2E7D32',
  accentColor: '#8BC34A',
  heroImage: 'LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg',
  heroTitle: 'Live Organic Plants',
  heroSubtitle: 'Healthy • Pesticide-Free • Expert Grown',
  heroTagline: 'Ready to Grow',
  heroButtonText: 'Shop All Plants',
  heroButtonHandle: 'live-plants',
  trustBadges: [
    {icon: '🌿', title: 'Organic Plants', desc: 'No chemicals used'},
    {icon: '🚚', title: 'Safe Delivery', desc: 'Careful packaging'},
    {icon: '✅', title: 'Healthy Guarantee', desc: 'Quality assured'},
    {icon: '🎧', title: 'Plant Care Tips', desc: 'Free guidance'},
  ],
  categories: [
    {emoji: '🥬', name: 'Vegetable Plants', handle: 'vegetable-plants'},
    {emoji: '🌺', name: 'Flowering', handle: 'flowering-plants'},
    {emoji: '🌿', name: 'Herb Plants', handle: 'herb-plants'},
    {emoji: '🍋', name: 'Fruit Plants', handle: 'fruit-plants'},
  ],
  categoriesTitle: 'Shop Plants by Type',
  categoriesSubtitle: 'Find the perfect plants for your space',
  featuredSections: [
    {handle: 'vegetable-plants', title: '🥬 Vegetable Plants', subtitle: 'Ready-to-harvest vegetables'},
    {handle: 'live-plants', title: '🪴 All Plants', subtitle: 'Browse complete collection'},
  ],
  tips: {
    title: 'Plant Care Guide 🪴',
    content: 'Watering: Check soil moisture before watering\nSunlight: Most plants need 4-6 hours of light\nFertilizing: Use organic manure monthly\nPruning: Remove dead leaves regularly',
    buttonText: 'Get Expert Help',
    image: 'DSC_0253.JPG',
  },
  newsletterTitle: 'Plant Care Tips 🌱',
  newsletterSubtitle: 'Get weekly plant care guides & exclusive offers!',
};

export const PlantsScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={PLANTS_CONFIG} />
);

// ============ TOOLS COLLECTION ============
const TOOLS_CONFIG: CollectionTemplateConfig = {
  name: 'Garden Tools',
  headerColor: '#37474F',
  accentColor: '#FF9800',
  heroImage: 'falcon.jpg',
  heroTitle: 'Garden Tools & Equipment',
  heroSubtitle: 'Durable • Ergonomic • Professional Grade',
  heroTagline: 'Quality Tools for Every Gardener',
  heroButtonText: 'Shop All Tools',
  heroButtonHandle: 'falcon-1',
  trustBadges: [
    {icon: '🛡️', title: 'Premium Quality', desc: 'Built to last'},
    {icon: '✋', title: 'Ergonomic Design', desc: 'Comfortable grip'},
    {icon: '🏆', title: 'Branded Tools', desc: 'Falcon, Bellota & more'},
    {icon: '🚚', title: 'Fast Delivery', desc: 'Secure packaging'},
  ],
  categories: [
    {emoji: '🔧', name: 'Hand Tools', handle: 'hand-tools'},
    {emoji: '💧', name: 'Watering', handle: 'watering-tools'},
    {emoji: '✂️', name: 'Pruning', handle: 'pruning-tools'},
    {emoji: '⛏️', name: 'Digging', handle: 'digging-tools'},
  ],
  categoriesTitle: 'Shop by Tool Type',
  categoriesSubtitle: 'Find the right tool for every job',
  featuredSections: [
    {handle: 'falcon-1', title: '🦅 Falcon Tools', subtitle: 'Premium garden tools'},
    {handle: 'garden-sprayer', title: '💧 Watering Equipment', subtitle: 'Sprayers, cans & irrigation'},
    {handle: 'falcon-1', title: '🔧 All Garden Tools', subtitle: 'Complete tools collection'},
  ],
  tips: {
    title: 'Essential Garden Tools 🔧',
    content: 'For Beginners: Trowel, Pruner, Watering Can\nFor Terrace Gardens: Hand tools set, Sprayer\nFor Large Gardens: Spade, Rake, Wheelbarrow\nMaintenance: Clean after use, oil moving parts',
    buttonText: 'Tool Buying Guide',
    image: 'falcon.jpg',
  },
  newsletterTitle: 'DIY Garden Tips 🛠️',
  newsletterSubtitle: 'Get tool guides, maintenance tips & exclusive deals!',
};

export const ToolsScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={TOOLS_CONFIG} />
);

// ============ POTS COLLECTION ============
const POTS_CONFIG: CollectionTemplateConfig = {
  name: 'Pots & Planters',
  headerColor: '#BF360C',
  accentColor: '#FF7043',
  heroImage: 'IMG-2104.png',
  heroTitle: 'Pots, Planters & Grow Bags',
  heroSubtitle: 'Durable • UV Resistant • Multiple Sizes',
  heroTagline: 'Perfect Homes for Your Plants',
  heroButtonText: 'Shop All Pots',
  heroButtonHandle: 'planters',
  trustBadges: [
    {icon: '🛡️', title: 'UV Resistant', desc: 'Long lasting'},
    {icon: '💧', title: 'Good Drainage', desc: 'Healthy roots'},
    {icon: '♻️', title: 'Eco-Friendly', desc: 'Sustainable materials'},
    {icon: '📏', title: 'All Sizes', desc: 'Small to XXL'},
  ],
  categories: [
    {emoji: '🛍️', name: 'Grow Bags', handle: 'grow-bags-for-terrace-garden'},
    {emoji: '🪴', name: 'Plastic Pots', handle: 'plastic-pots'},
    {emoji: '🏺', name: 'Terracotta', handle: 'terracotta-pots'},
    {emoji: '🌿', name: 'Hanging', handle: 'hanging-planters'},
  ],
  categoriesTitle: 'Shop by Type',
  categoriesSubtitle: 'Find the perfect container for your plants',
  featuredSections: [
    {handle: 'grow-bags-for-terrace-garden', title: '🛍️ Grow Bags', subtitle: 'Perfect for terrace gardens'},
    {handle: 'planters', title: '🏺 All Pots & Planters', subtitle: 'Complete collection'},
  ],
  tips: {
    title: 'Choosing the Right Pot 🏺',
    content: 'Small Herbs: 6-8 inch pots\nVegetables: 12-15 inch grow bags\nFruit Trees: 18-24 inch containers\nTip: Always ensure drainage holes!',
    buttonText: 'Ask Expert',
    image: 'IMG-2104.png',
  },
  newsletterTitle: 'Container Gardening Tips 🪴',
  newsletterSubtitle: 'Learn pot selection, drainage tips & get deals!',
};

export const PotsScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={POTS_CONFIG} />
);

// ============ SPIRULINA COLLECTION ============
const SPIRULINA_CONFIG: CollectionTemplateConfig = {
  name: 'Spirulina',
  headerColor: '#0277BD',
  accentColor: '#81D4FA',
  heroImage: 'DSC_0253.JPG',
  heroTitle: 'Spirulina - Superfood',
  heroSubtitle: '65% Protein • Rich in Iron • Antioxidant Powerhouse',
  heroTagline: "Nature's Most Powerful Nutrient",
  heroButtonText: 'Shop Spirulina',
  heroButtonHandle: 'spirulina',
  trustBadges: [
    {icon: '🌿', title: '100% Pure', desc: 'No additives'},
    {icon: '💪', title: '65% Protein', desc: 'Complete amino acids'},
    {icon: '❤️', title: 'Immunity Boost', desc: 'Natural defense'},
    {icon: '🏆', title: 'Lab Tested', desc: 'Quality assured'},
  ],
  categories: [],
  categoriesTitle: '',
  categoriesSubtitle: '',
  featuredSections: [
    {handle: 'spirulina', title: '💚 Spirulina Products', subtitle: 'Premium quality spirulina'},
  ],
  tips: {
    title: 'Why Spirulina? 🧪',
    content: 'Protein: More than eggs, meat & soy\nIron: 28x more than spinach\nB12: Essential for vegans\nAntioxidants: Powerful phycocyanin\n\nTake 3-5g daily for best results!',
    buttonText: 'Health Benefits',
    image: 'DSC_0253.JPG',
  },
  newsletterTitle: 'Spirulina Tips 💚',
  newsletterSubtitle: 'Get recipes, health tips & exclusive offers!',
};

export const SpirulinaScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={SPIRULINA_CONFIG} />
);

// ============ OFFERS COLLECTION ============
const OFFERS_CONFIG: CollectionTemplateConfig = {
  name: 'Offers & Deals',
  headerColor: '#E65100',
  accentColor: '#FFD700',
  heroImage: 'IMG_2100.png',
  heroTitle: '🔥 Hot Deals & Offers',
  heroSubtitle: 'Limited Time • Exclusive Discounts • Best Prices',
  heroTagline: 'Save Big on Organic Products',
  heroButtonText: 'Shop All Deals',
  heroButtonHandle: 'daily-deals',
  trustBadges: [
    {icon: '🏷️', title: 'Best Prices', desc: 'Guaranteed savings'},
    {icon: '⏰', title: 'Limited Time', desc: 'Grab before gone'},
    {icon: '🚚', title: 'Free Shipping', desc: 'On ₹500+'},
    {icon: '💯', title: 'Up to 50% Off', desc: 'Huge discounts'},
  ],
  categories: [],
  categoriesTitle: '',
  categoriesSubtitle: '',
  featuredSections: [
    {handle: 'daily-deals', title: '⚡ Flash Sale', subtitle: "Limited time - Don't miss!"},
    {handle: 'daily-deals', title: '🔥 Daily Deals', subtitle: 'New deals every day'},
    {handle: 'daily-deals', title: '🎉 All Offers', subtitle: 'Browse all discounted products'},
  ],
  newsletterTitle: 'Get Exclusive Deals 🔔',
  newsletterSubtitle: 'Subscribe for early access to sales & special discounts!',
};

export const OffersScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={OFFERS_CONFIG} />
);

// ============ PACKAGES COLLECTION ============
const PACKAGES_CONFIG: CollectionTemplateConfig = {
  name: 'Garden Packages',
  headerColor: '#6A1B9A',
  accentColor: '#CE93D8',
  heroImage: 'IMG-2097.png',
  heroTitle: 'Garden Setup Packages',
  heroSubtitle: 'Complete Kits • DIY Friendly • Expert Support',
  heroTagline: 'Everything You Need to Start',
  heroButtonText: 'Shop Packages',
  heroButtonHandle: 'our-packages',
  trustBadges: [
    {icon: '📦', title: 'Complete Kits', desc: 'All-in-one solution'},
    {icon: '🌱', title: 'Beginner Friendly', desc: 'Easy to setup'},
    {icon: '💰', title: 'Value for Money', desc: 'Save 20%+'},
    {icon: '🎧', title: 'Expert Support', desc: 'Free guidance'},
  ],
  categories: [
    {emoji: '🏠', name: 'HDPE Packages', handle: 'hdpe-packages'},
    {emoji: '🌿', name: 'LDPE Packages', handle: 'ldpe-packages'},
    {emoji: '🔧', name: 'DIY Packages', handle: 'diy-packages'},
    {emoji: '✅', name: 'Garden Ready', handle: 'garden-ready'},
  ],
  categoriesTitle: 'Shop by Package Type',
  categoriesSubtitle: 'Choose your perfect garden setup',
  featuredSections: [
    {handle: 'our-packages', title: '📦 All Packages', subtitle: 'Complete garden solutions'},
  ],
  tips: {
    title: 'Which Package is Right? 📦',
    content: 'Terrace Garden: HDPE Package\nBalcony Garden: LDPE Package\nDIY Enthusiasts: DIY Package\nQuick Start: Garden Ready Package',
    buttonText: 'Get Recommendation',
    image: 'IMG-2097.png',
  },
  newsletterTitle: 'Garden Setup Tips 🏡',
  newsletterSubtitle: 'Get setup guides, maintenance tips & exclusive deals!',
};

export const PackagesScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={PACKAGES_CONFIG} />
);

// ============ GROW BAGS COLLECTION ============
const GROWBAGS_CONFIG: CollectionTemplateConfig = {
  name: 'Grow Bags',
  headerColor: '#1565C0',
  accentColor: '#64B5F6',
  heroImage: 'IMG-2104.png',
  heroTitle: 'HDPE & LDPE Grow Bags',
  heroSubtitle: 'UV Resistant • Durable • Multiple Sizes',
  heroTagline: 'Perfect for Terrace Gardens',
  heroButtonText: 'Shop All Grow Bags',
  heroButtonHandle: 'grow-bags-for-terrace-garden',
  trustBadges: [
    {icon: '☀️', title: 'UV Resistant', desc: 'Lasts 5+ years'},
    {icon: '💧', title: 'Great Drainage', desc: 'Healthy roots'},
    {icon: '🪶', title: 'Lightweight', desc: 'Easy to move'},
    {icon: '📏', title: 'All Sizes', desc: '6" to 24"'},
  ],
  categories: [
    {emoji: '🛍️', name: 'HDPE Bags', handle: 'hdpe-grow-bags'},
    {emoji: '🛍️', name: 'LDPE Bags', handle: 'ldpe-bags'},
  ],
  categoriesTitle: 'Shop by Type',
  categoriesSubtitle: 'HDPE for durability, LDPE for economy',
  featuredSections: [
    {handle: 'hdpe-grow-bags', title: '🛍️ HDPE Grow Bags', subtitle: 'Premium quality, UV resistant'},
    {handle: 'grow-bags-for-terrace-garden', title: '🛍️ All Grow Bags', subtitle: 'Complete collection'},
  ],
  newsletterTitle: 'Terrace Garden Tips 🏡',
  newsletterSubtitle: 'Get grow bag guides & exclusive deals!',
};

export const GrowBagsScreen = ({navigation}: any) => (
  <CollectionTemplateScreen navigation={navigation} config={GROWBAGS_CONFIG} />
);

