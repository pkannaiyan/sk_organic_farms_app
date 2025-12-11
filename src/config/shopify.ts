/**
 * Shopify Storefront API Configuration
 * 
 * To get your Storefront API access token:
 * 1. Go to Shopify Admin → Settings → Apps and sales channels
 * 2. Click "Develop apps" → Create an app
 * 3. Configure Storefront API scopes
 * 4. Install the app and copy the Storefront API access token
 */

export const SHOPIFY_CONFIG = {
  // Your Shopify store domain
  STORE_DOMAIN: 'sk-nursery.myshopify.com',
  
  // Storefront API access token (get from Shopify Admin)
  STOREFRONT_ACCESS_TOKEN: 'b8c503408131d95f28acb35bbf582015',
  
  // API version (use latest stable)
  API_VERSION: '2024-01',
  
  // Storefront API endpoint
  get STOREFRONT_API_URL() {
    return `https://${this.STORE_DOMAIN}/api/${this.API_VERSION}/graphql.json`;
  },
};

// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  KEY_ID: 'rzp_live_frLS2h9kgl1TGG',
  KEY_SECRET: 'YOUR_RAZORPAY_KEY_SECRET', // Keep this on server side only
  CURRENCY: 'INR',
  COMPANY_NAME: 'SK Organic Farms',
  COMPANY_LOGO: 'https://sk-nursery.myshopify.com/cdn/shop/files/logo.png',
  THEME_COLOR: '#1B5E20',
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'SK Organic Farms',
  PRIMARY_COLOR: '#1B5E20',
  SECONDARY_COLOR: '#2E7D32',
  ACCENT_COLOR: '#E65100',
  BACKGROUND_COLOR: '#FDFCFA',
  TEXT_COLOR: '#2D3B2D',
  
  // Pagination
  PRODUCTS_PER_PAGE: 20,
  
  // Cache duration (in milliseconds)
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

