// Shopify Store Configuration
// Store: sk-nursery.myshopify.com

export const SHOPIFY_CONFIG = {
  storeDomain: 'sk-nursery.myshopify.com',
  storefrontAccessToken: '', // Add your Storefront API token here
  apiVersion: '2024-01',
};

// Store URLs
export const STORE_URL = `https://${SHOPIFY_CONFIG.storeDomain}`;
export const STOREFRONT_API_URL = `${STORE_URL}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;

// CDN URL for images
export const CDN_URL = 'https://cdn.shopify.com/s/files/1/0695/4453/8423/files';

// Helper to get image URL
export const getImageUrl = (filename: string, size: string = '') => {
  const sizeParam = size ? `_${size}` : '';
  return `${CDN_URL}/${filename}${sizeParam}`;
};

