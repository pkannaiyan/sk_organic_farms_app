/**
 * Shopify Storefront API Service
 * Handles all communication with Shopify's GraphQL API
 */

import axios from 'axios';
import { SHOPIFY_CONFIG } from '../config/shopify';

// Create axios instance for Shopify API
const shopifyClient = axios.create({
  baseURL: SHOPIFY_CONFIG.STOREFRONT_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.STOREFRONT_ACCESS_TOKEN,
  },
});

// GraphQL query executor
async function executeQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
  try {
    const response = await shopifyClient.post('', {
      query,
      variables,
    });
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}

// ============================================
// PRODUCT QUERIES
// ============================================

export const ProductQueries = {
  // Get all products with pagination
  getProducts: async (first: number = 20, cursor?: string) => {
    const query = `
      query getProducts($first: Int!, $cursor: String) {
        products(first: $first, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              productType
              vendor
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
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
              images(first: 5) {
                edges {
                  node {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    quantityAvailable
                    selectedOptions {
                      name
                      value
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
              availableForSale
            }
          }
        }
      }
    `;
    return executeQuery(query, { first, cursor });
  },

  // Get single product by handle
  getProductByHandle: async (handle: string) => {
    const query = `
      query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          productType
          vendor
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
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
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                }
              }
            }
          }
          options {
            id
            name
            values
          }
          availableForSale
        }
      }
    `;
    return executeQuery(query, { handle });
  },

  // Search products
  searchProducts: async (searchQuery: string, first: number = 20) => {
    const query = `
      query searchProducts($query: String!, $first: Int!) {
        products(first: $first, query: $query) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              availableForSale
            }
          }
        }
      }
    `;
    return executeQuery(query, { query: searchQuery, first });
  },
};

// ============================================
// COLLECTION QUERIES
// ============================================

export const CollectionQueries = {
  // Get all collections
  getCollections: async (first: number = 20) => {
    const query = `
      query getCollections($first: Int!) {
        collections(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              image {
                url
                altText
              }
              productsCount {
                count
              }
            }
          }
        }
      }
    `;
    return executeQuery(query, { first });
  },

  // Get collection by handle with products
  getCollectionByHandle: async (handle: string, productsFirst: number = 20) => {
    const query = `
      query getCollectionByHandle($handle: String!, $productsFirst: Int!) {
        collectionByHandle(handle: $handle) {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: $productsFirst) {
            edges {
              node {
                id
                title
                handle
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
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                availableForSale
              }
            }
          }
        }
      }
    `;
    return executeQuery(query, { handle, productsFirst });
  },
};

// ============================================
// CART MUTATIONS
// ============================================

export const CartMutations = {
  // Create a new cart
  createCart: async () => {
    const query = `
      mutation cartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        handle
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    return executeQuery(query);
  },

  // Add items to cart
  addToCart: async (cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) => {
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        handle
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    return executeQuery(query, { cartId, lines });
  },

  // Update cart line quantity
  updateCartLine: async (cartId: string, lineId: string, quantity: number) => {
    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        handle
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    return executeQuery(query, { cartId, lines: [{ id: lineId, quantity }] });
  },

  // Remove item from cart
  removeFromCart: async (cartId: string, lineIds: string[]) => {
    const query = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        handle
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
              subtotalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    return executeQuery(query, { cartId, lineIds });
  },
};

// ============================================
// CUSTOMER QUERIES & MUTATIONS
// ============================================

export const CustomerMutations = {
  // Create customer account
  createCustomer: async (email: string, password: string, firstName: string, lastName: string) => {
    const query = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;
    return executeQuery(query, {
      input: { email, password, firstName, lastName },
    });
  },

  // Customer login
  createAccessToken: async (email: string, password: string) => {
    const query = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;
    return executeQuery(query, {
      input: { email, password },
    });
  },

  // Get customer details
  getCustomer: async (accessToken: string) => {
    const query = `
      query getCustomer($accessToken: String!) {
        customer(customerAccessToken: $accessToken) {
          id
          email
          firstName
          lastName
          phone
          defaultAddress {
            id
            address1
            address2
            city
            province
            country
            zip
            phone
          }
          orders(first: 10) {
            edges {
              node {
                id
                orderNumber
                processedAt
                financialStatus
                fulfillmentStatus
                totalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 10) {
                  edges {
                    node {
                      title
                      quantity
                      variant {
                        image {
                          url
                        }
                        price {
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
      }
    `;
    return executeQuery(query, { accessToken });
  },
};

export default {
  ProductQueries,
  CollectionQueries,
  CartMutations,
  CustomerMutations,
};

