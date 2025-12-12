// Shopify Store Configuration
// Store: sk-nursery.myshopify.com (Sunantha Organic Farms)

export const SHOPIFY_CONFIG = {
  storeDomain: 'sk-nursery.myshopify.com',
  // You need to create a Storefront API token in Shopify Admin > Settings > Apps > Develop apps
  storefrontAccessToken: '', // Add your Storefront API token here
  apiVersion: '2024-01',
};

// Store URLs
export const STORE_URL = `https://${SHOPIFY_CONFIG.storeDomain}`;
export const STOREFRONT_API_URL = `${STORE_URL}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;

// CDN URL for shop images (files uploaded to Shopify)
// Format: https://cdn.shopify.com/s/files/1/{shop_id}/files/{filename}
export const CDN_BASE_URL = 'https://cdn.shopify.com/s/files/1/0695/4453/8423/files';

// Helper to get image URL from Shopify CDN
export const getShopifyImageUrl = (filename: string, size?: string): string => {
  if (!filename) return '';
  // Remove "shopify://shop_images/" prefix if present
  const cleanFilename = filename.replace('shopify://shop_images/', '');
  const sizeParam = size ? `?width=${size}` : '';
  return `${CDN_BASE_URL}/${cleanFilename}${sizeParam}`;
};

// All image URLs from the theme
export const themeImages = {
  // Hero Slideshow
  slides: [
    getShopifyImageUrl('IMG_2100.png'),
    getShopifyImageUrl('IMG_2099.png'),
    getShopifyImageUrl('IMG_2101.png'),
  ],
  
  // Collection banners
  collections: {
    organicSeeds: getShopifyImageUrl('stock-photo-the-colors-of-a-beautiful-indian-flag-are-made-of-pulses-1164063082.jpg'),
    justbrews: getShopifyImageUrl('JustBrew_logo.png'),
    growBags: getShopifyImageUrl('grow_bag.jpg'),
    organicManures: getShopifyImageUrl('IMG-2096.png'),
    organicSeedsCircle: getShopifyImageUrl('IMG-2091.png'),
    falcon: getShopifyImageUrl('falcon.jpg'),
    growBagsCircle: getShopifyImageUrl('IMG-2104.png'),
    skinHair: getShopifyImageUrl('4786E3F2-BDCD-484D-9274-66DE8A5A4834.webp'),
    seaweed: getShopifyImageUrl('SEAWEED.jpg'),
    ourPackages: getShopifyImageUrl('IMG-2097.png'),
    pottingMedium: getShopifyImageUrl('IMG-2090.png'),
    gardenSprayer: getShopifyImageUrl('3110-05.jpg'),
    livePlants: getShopifyImageUrl('LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg'),
    dailyDeals: getShopifyImageUrl('daily.png'),
    skinHairBanner: getShopifyImageUrl('3768956F-918C-42DE-9EDF-1239F6B0C815.jpg'),
    livePlantsBanner: getShopifyImageUrl('banana-tissue-plants_f17c24d9-5bfe-4c59-8076-05fc51242b40.jpg'),
    biocarve: getShopifyImageUrl('biocurve.jpg'),
    bestSeller: getShopifyImageUrl('best_seller.jpg'),
  },
  
  // Special sections
  farmVisit: getShopifyImageUrl('DSC_0253.JPG'),
  spirulina: getShopifyImageUrl('DSC_0237.JPG'),
  
  // Gallery
  gallery: [
    getShopifyImageUrl('SPIRU9.jpg'),
    getShopifyImageUrl('IMG-2097.png'),
    getShopifyImageUrl('DSC_0253.JPG'),
    getShopifyImageUrl('DSC_0192.JPG'),
    getShopifyImageUrl('IMG_1355.JPG'),
    getShopifyImageUrl('IMG-2097.png'),
  ],
  
  // Brand logos
  brands: {
    falcon: getShopifyImageUrl('falcon.jpg'),
    skof: getShopifyImageUrl('SKOF_new_logo_tm_9b6a7846-af4e-4def-ac18-8b7165eaf2b9.jpg'),
    bellota: getShopifyImageUrl('bellota_logo.jpg'),
    epla: getShopifyImageUrl('EPLA-logo_802a7aba-6c86-4917-a3f7-6d457d52659c.jpeg'),
    biocarve: getShopifyImageUrl('biocurve.jpg'),
  },
  
  // Maps
  maps: {
    chennai: getShopifyImageUrl('holding-compass-up.jpg'),
    farm: getShopifyImageUrl('open-compass-on-world-map.jpg'),
  },
  
  // Logo/Favicon
  logo: getShopifyImageUrl('LogoColorTextBelow_3223832e-681f-41c8-9347-b0f342a6384a.jpg'),
  
  // Newsletter popup
  newsletterPopup: getShopifyImageUrl('IMG-2091.png'),
};

// GraphQL query to fetch collections with products
export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
          }
          products(first: 10) {
            edges {
              node {
                id
                handle
                title
                featuredImage {
                  url
                  altText
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                compareAtPriceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to fetch products from a specific collection
export const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      description
      image {
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            featuredImage {
              url
              altText
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            availableForSale
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;
