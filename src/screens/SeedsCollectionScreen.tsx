/**
 * SeedsCollectionScreen - Replicates collection.seeds.json template
 * Custom layout for Seeds category with subcategories and featured collections
 */

import React, {useState, useEffect, useCallback, memo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {colors} from '../constants/theme';
import {
  fetchCollectionProducts,
  ShopifyProduct,
  getProductImage,
  getProductPrice,
  getCompareAtPrice,
  isProductAvailable,
} from '../services/shopifyApi';

const {width} = Dimensions.get('window');
const FILES_CDN = 'https://cdn.shopify.com/s/files/1/0551/4417/files';

// Seed categories from collection.seeds.json
const SEED_CATEGORIES = [
  {emoji: '🥬', name: 'Vegetable Seeds', handle: 'vegetable-seeds'},
  {emoji: '🌸', name: 'Flower Seeds', handle: 'flower-seeds'},
  {emoji: '🌿', name: 'Herb Seeds', handle: 'herb-seeds'},
  {emoji: '🍅', name: 'Fruit Seeds', handle: 'fruit-seeds'},
  {emoji: '🌳', name: 'Tree Seeds', handle: 'tree-seeds'},
  {emoji: '✨', name: 'Exotic Seeds', handle: 'exotic-seeds'},
];

// Trust badges from collection.seeds.json
const TRUST_BADGES = [
  {icon: '🌱', title: 'Non-GMO Seeds', desc: '100% natural varieties'},
  {icon: '🌿', title: 'High Germination', desc: '85%+ success rate'},
  {icon: '🚚', title: 'Fast Shipping', desc: 'Fresh seeds delivered'},
  {icon: '📖', title: 'Growing Guide', desc: 'Free with every order'},
];

// Featured sections
const FEATURED_SECTIONS = [
  {handle: 'vegetable-seeds', title: '🥬 Vegetable Seeds', subtitle: 'Grow fresh veggies at home'},
  {handle: 'flower-seeds', title: '🌸 Flower Seeds', subtitle: 'Add color to your garden'},
  {handle: 'herb-seeds', title: '🌿 Herb & Medicinal Seeds', subtitle: 'Fresh herbs for cooking & wellness'},
  {handle: 'tree-seeds', title: '🌳 Tree & Fruit Seeds', subtitle: 'Grow your own orchard'},
];

// Optimized image URL
const getOptimizedImage = (url: string, size: number = 200) => {
  if (!url) return url;
  if (url.includes('cdn.shopify.com') && !url.includes('_')) {
    return url.replace(/\.([^.]+)$/, `_${size}x.$1`);
  }
  return url;
};

// Product Card Component
const ProductCard = memo(({product, onPress}: {product: ShopifyProduct; onPress: () => void}) => {
  const price = getProductPrice(product);
  const compareAtPrice = getCompareAtPrice(product);
  const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.productImageWrap}>
        <Image source={{uri: getOptimizedImage(getProductImage(product), 150)}} style={styles.productImage} resizeMode="cover" />
        {discount > 0 ? <View style={styles.saleBadge}><Text style={styles.saleBadgeText}>{discount}% off</Text></View> : null}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>₹{price}</Text>
          {compareAtPrice ? <Text style={styles.comparePrice}>₹{compareAtPrice}</Text> : null}
        </View>
        <TouchableOpacity style={styles.addBtn}><Text style={styles.addBtnText}>Add</Text></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

// Main Component
const SeedsCollectionScreen = ({navigation}: any) => {
  const [sectionProducts, setSectionProducts] = useState<{[key: string]: ShopifyProduct[]}>({});
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await Promise.all(
          FEATURED_SECTIONS.map(section => fetchCollectionProducts(section.handle, 8))
        );

        const productsMap: {[key: string]: ShopifyProduct[]} = {};
        FEATURED_SECTIONS.forEach((section, index) => {
          if (results[index]?.length > 0) {
            productsMap[section.handle] = results[index];
          }
        });
        setSectionProducts(productsMap);
      } catch (error) {
        console.error('Error loading seeds data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Navigate to product
  const navigateToProduct = useCallback((product: ShopifyProduct) => {
    navigation.navigate('ProductDetail', {
      product: {
        id: product.id.toString(),
        title: product.title,
        price: getProductPrice(product),
        compareAtPrice: getCompareAtPrice(product),
        image: getProductImage(product),
        images: product.images?.map(img => img.src) || [],
        description: product.body_html?.replace(/<[^>]*>/g, '') || '',
        inStock: isProductAvailable(product),
        variants: product.variants || [],
      },
    });
  }, [navigation]);

  // Navigate to collection
  const navigateToCollection = useCallback((handle: string, title?: string) => {
    navigation.navigate('CollectionDetail', {
      collection: {
        id: handle,
        handle: handle,
        title: title || handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      }
    });
  }, [navigation]);

  // Render product
  const renderProduct = useCallback(({item}: {item: ShopifyProduct}) => (
    <ProductCard product={item} onPress={() => navigateToProduct(item)} />
  ), [navigateToProduct]);

  const keyExtractor = useCallback((item: ShopifyProduct) => item.id.toString(), []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={styles.loadingText}>Loading Seeds...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seeds Collection</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image 
            source={{uri: `${FILES_CDN}/IMG_2099.png`}} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTag}>Grow Your Own Garden</Text>
            <Text style={styles.heroTitle}>Native Organic Seeds</Text>
            <Text style={styles.heroSubtitle}>100% Non-GMO • Heirloom Varieties • High Germination Rate</Text>
            <TouchableOpacity style={styles.heroBtn} onPress={() => navigateToCollection('organic-seeds', 'All Seeds')}>
              <Text style={styles.heroBtnText}>Shop All Seeds</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBadgesSection}>
          {TRUST_BADGES.map((badge, i) => (
            <View key={i} style={styles.trustBadge}>
              <Text style={styles.trustIcon}>{badge.icon}</Text>
              <Text style={styles.trustTitle}>{badge.title}</Text>
              <Text style={styles.trustDesc}>{badge.desc}</Text>
            </View>
          ))}
        </View>

        {/* Seed Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop Seeds by Type</Text>
          <Text style={styles.sectionSubtitle}>Find the perfect seeds for your garden</Text>
          <View style={styles.categoriesGrid}>
            {SEED_CATEGORIES.map((cat, i) => (
              <TouchableOpacity 
                key={i} 
                style={styles.categoryCard}
                onPress={() => navigateToCollection(cat.handle, cat.name)}
              >
                <View style={styles.categoryIconWrap}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Sections */}
        {FEATURED_SECTIONS.map((section, idx) => {
          const products = sectionProducts[section.handle];
          if (!products || products.length === 0) return null;

          return (
            <View key={idx} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                </View>
                <TouchableOpacity onPress={() => navigateToCollection(section.handle, section.title)}>
                  <Text style={styles.viewAll}>View All →</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={products}
                renderItem={renderProduct}
                keyExtractor={keyExtractor}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsScroll}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
              />
            </View>
          );
        })}

        {/* Growing Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTag}>Expert Tips</Text>
            <Text style={styles.tipsTitle}>Seed Starting Guide 🌱</Text>
            <Text style={styles.tipsText}>
              Get the best results from your seeds:{'\n\n'}
              <Text style={styles.tipsBold}>1. Soil Preparation:</Text> Use well-draining potting mix{'\n'}
              <Text style={styles.tipsBold}>2. Watering:</Text> Keep soil moist, not soggy{'\n'}
              <Text style={styles.tipsBold}>3. Sunlight:</Text> Most seeds need 6-8 hours of light{'\n'}
              <Text style={styles.tipsBold}>4. Temperature:</Text> Maintain 20-25°C for germination
            </Text>
            <TouchableOpacity style={styles.tipsBtn}>
              <Text style={styles.tipsBtnText}>Contact Expert</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{uri: `${FILES_CDN}/IMG-2091.png`}} 
            style={styles.tipsImage} 
            resizeMode="cover"
          />
        </View>

        {/* Newsletter */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>Get Seed Growing Tips 🌱</Text>
          <Text style={styles.newsletterSubtitle}>Subscribe for seasonal planting guides & exclusive seed deals!</Text>
          <TouchableOpacity style={styles.newsletterBtn}>
            <Text style={styles.newsletterBtnText}>Subscribe Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  content: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'},
  loadingText: {marginTop: 12, color: '#1B5E20', fontSize: 14},

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1B5E20',
  },
  backButton: {padding: 4},
  backButtonText: {color: '#fff', fontSize: 16, fontWeight: '500'},
  headerTitle: {flex: 1, color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center'},
  cartButton: {padding: 4},
  cartIcon: {fontSize: 24},

  // Hero Banner
  heroBanner: {height: 200, position: 'relative'},
  heroImage: {width: '100%', height: '100%'},
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroTag: {color: '#8BC34A', fontSize: 11, fontWeight: '600'},
  heroTitle: {fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 4},
  heroSubtitle: {fontSize: 11, color: 'rgba(255,255,255,0.9)', marginTop: 4},
  heroBtn: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
  },
  heroBtnText: {color: '#fff', fontSize: 13, fontWeight: '600'},

  // Trust Badges
  trustBadgesSection: {
    flexDirection: 'row',
    backgroundColor: '#1B5E20',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  trustBadge: {flex: 1, alignItems: 'center'},
  trustIcon: {fontSize: 24, marginBottom: 4},
  trustTitle: {fontSize: 10, fontWeight: 'bold', color: '#fff', textAlign: 'center'},
  trustDesc: {fontSize: 8, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 2},

  // Categories
  categoriesSection: {backgroundColor: '#fff', paddingVertical: 20, paddingHorizontal: 16},
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 48) / 3,
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {fontSize: 28},
  categoryName: {fontSize: 11, fontWeight: '500', color: '#333', textAlign: 'center'},

  // Sections
  section: {backgroundColor: '#fff', marginTop: 8, paddingVertical: 16},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  sectionSubtitle: {fontSize: 11, color: '#888', marginTop: 2},
  viewAll: {fontSize: 12, color: '#4CAF50', fontWeight: '500'},
  productsScroll: {paddingHorizontal: 12},

  // Product Card
  productCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  productImageWrap: {width: '100%', height: 110, backgroundColor: '#f9f9f9'},
  productImage: {width: '100%', height: '100%'},
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e53935',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  saleBadgeText: {color: '#fff', fontSize: 9, fontWeight: 'bold'},
  productInfo: {padding: 10},
  productTitle: {fontSize: 12, color: '#333', height: 32, lineHeight: 16},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  productPrice: {fontSize: 14, fontWeight: 'bold', color: '#4CAF50'},
  comparePrice: {fontSize: 11, color: '#999', textDecorationLine: 'line-through', marginLeft: 6},
  addBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {color: '#4CAF50', fontSize: 11, fontWeight: 'bold'},

  // Tips Section
  tipsSection: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    marginTop: 8,
    overflow: 'hidden',
  },
  tipsContent: {flex: 1, padding: 16},
  tipsTag: {color: '#A5D6A7', fontSize: 10, fontWeight: '600'},
  tipsTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 4},
  tipsText: {fontSize: 11, color: 'rgba(255,255,255,0.9)', marginTop: 10, lineHeight: 18},
  tipsBold: {fontWeight: 'bold'},
  tipsBtn: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 12,
  },
  tipsBtnText: {color: '#2E7D32', fontSize: 12, fontWeight: '600'},
  tipsImage: {width: width * 0.4, height: 220},

  // Newsletter
  newsletterSection: {
    backgroundColor: '#1B5E20',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  newsletterTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  newsletterSubtitle: {fontSize: 12, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 4},
  newsletterBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 16,
  },
  newsletterBtnText: {color: '#1B5E20', fontSize: 14, fontWeight: 'bold'},
});

export default SeedsCollectionScreen;

