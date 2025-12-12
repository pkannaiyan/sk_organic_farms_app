// Shopify JSON API Service
// Uses the public JSON API (no authentication needed)

const STORE_URL = 'https://sk-nursery.myshopify.com';

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  images: {
    id: number;
    src: string;
    alt?: string;
  }[];
  variants: {
    id: number;
    title: string;
    price: string;
    compare_at_price: string | null;
    available: boolean;
  }[];
}

export interface ShopifyCollection {
  id: number;
  title: string;
  handle: string;
  description: string;
  image: {
    id: number;
    src: string;
    alt?: string;
  } | null;
  products_count: number;
}

// Fetch all collections
export const fetchCollections = async (): Promise<ShopifyCollection[]> => {
  try {
    const response = await fetch(`${STORE_URL}/collections.json`);
    const data = await response.json();
    return data.collections || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};

// Fetch products from a specific collection
export const fetchCollectionProducts = async (
  handle: string,
  limit = 20,
): Promise<ShopifyProduct[]> => {
  try {
    const response = await fetch(
      `${STORE_URL}/collections/${handle}/products.json?limit=${limit}`,
    );
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching collection products:', error);
    return [];
  }
};

// Fetch all products
export const fetchProducts = async (limit = 20): Promise<ShopifyProduct[]> => {
  try {
    const response = await fetch(`${STORE_URL}/products.json?limit=${limit}`);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch a single product by handle
export const fetchProduct = async (
  handle: string,
): Promise<ShopifyProduct | null> => {
  try {
    const response = await fetch(`${STORE_URL}/products/${handle}.json`);
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Featured collections from the theme
export const FEATURED_COLLECTIONS = [
  'organic-seeds',
  'organic-manure',
  'grow-bags-for-terrace-garden',
  'falcon-1',
  'daily-deals',
  'sea-weed-products',
  'skin-and-hair-care',
  'live-plants-and-samplings',
  'biocarve',
  'organic-millets-rice',
  'food-products',
  'best-seller',
];

// Get product image URL (with fallback)
export const getProductImage = (product: ShopifyProduct): string => {
  if (product.images && product.images.length > 0) {
    return product.images[0].src;
  }
  return 'https://cdn.shopify.com/s/files/1/0551/4417/files/placeholder.png';
};

// Get product price
export const getProductPrice = (product: ShopifyProduct): number => {
  if (product.variants && product.variants.length > 0) {
    return parseFloat(product.variants[0].price);
  }
  return 0;
};

// Get compare at price
export const getCompareAtPrice = (product: ShopifyProduct): number | undefined => {
  if (product.variants && product.variants.length > 0 && product.variants[0].compare_at_price) {
    return parseFloat(product.variants[0].compare_at_price);
  }
  return undefined;
};

// Check if product is available
export const isProductAvailable = (product: ShopifyProduct): boolean => {
  if (product.variants && product.variants.length > 0) {
    return product.variants.some(v => v.available);
  }
  return false;
};

