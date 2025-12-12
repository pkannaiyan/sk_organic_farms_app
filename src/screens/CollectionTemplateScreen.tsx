/**
 * CollectionTemplateScreen - Reusable template for custom collection screens
 * Matches Shopify collection templates: seeds, manure, millets, plants, tools, pots, spirulina, offers
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

// Template Configuration Types
interface Category {
  emoji: string;
  name: string;
  handle: string;
}

interface TrustBadge {
  icon: string;
  title: string;
  desc: string;
}

interface FeaturedSection {
  handle: string;
  title: string;
  subtitle: string;
}

interface TipsSection {
  tag?: string;
  title: string;
  content: string;
  buttonText: string;
  image: string;
}

export interface CollectionTemplateConfig {
  name: string;
  headerColor: string;
  accentColor: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroButtonText: string;
  heroButtonHandle: string;
  trustBadges: TrustBadge[];
  categories: Category[];
  categoriesTitle: string;
  categoriesSubtitle: string;
  featuredSections: FeaturedSection[];
  tips?: TipsSection;
  newsletterTitle: string;
  newsletterSubtitle: string;
}

// Optimized image URL
const getOptimizedImage = (url: string, size: number = 200) => {
  if (!url) return url;
  if (url.includes('cdn.shopify.com') && !url.includes('_')) {
    return url.replace(/\.([^.]+)$/, `_${size}x.$1`);
  }
  return url;
};

// Product Card Component
const ProductCard = memo(({product, onPress, accentColor}: {product: ShopifyProduct; onPress: () => void; accentColor: string}) => {
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
          <Text style={[styles.productPrice, {color: accentColor}]}>₹{price}</Text>
          {compareAtPrice ? <Text style={styles.comparePrice}>₹{compareAtPrice}</Text> : null}
        </View>
        <TouchableOpacity style={[styles.addBtn, {borderColor: accentColor}]}>
          <Text style={[styles.addBtnText, {color: accentColor}]}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

// Main Component
const CollectionTemplateScreen = ({navigation, config}: {navigation: any; config: CollectionTemplateConfig}) => {
  const [sectionProducts, setSectionProducts] = useState<{[key: string]: ShopifyProduct[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await Promise.all(
          config.featuredSections.map(section => fetchCollectionProducts(section.handle, 8))
        );
        const productsMap: {[key: string]: ShopifyProduct[]} = {};
        config.featuredSections.forEach((section, index) => {
          if (results[index]?.length > 0) {
            productsMap[section.handle] = results[index];
          }
        });
        setSectionProducts(productsMap);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [config.featuredSections]);

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

  const navigateToCollection = useCallback((handle: string, title?: string) => {
    navigation.navigate('CollectionDetail', {
      collection: {id: handle, handle, title: title || handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    });
  }, [navigation]);

  const renderProduct = useCallback(({item}: {item: ShopifyProduct}) => (
    <ProductCard product={item} onPress={() => navigateToProduct(item)} accentColor={config.accentColor} />
  ), [navigateToProduct, config.accentColor]);

  const keyExtractor = useCallback((item: ShopifyProduct) => item.id.toString(), []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={config.headerColor} />
        <Text style={[styles.loadingText, {color: config.headerColor}]}>Loading {config.name}...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: config.headerColor}]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.name}</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image source={{uri: `${FILES_CDN}/${config.heroImage}`}} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <Text style={[styles.heroTag, {color: config.accentColor}]}>{config.heroTagline}</Text>
            <Text style={styles.heroTitle}>{config.heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{config.heroSubtitle}</Text>
            <TouchableOpacity style={[styles.heroBtn, {backgroundColor: config.accentColor}]} onPress={() => navigateToCollection(config.heroButtonHandle)}>
              <Text style={styles.heroBtnText}>{config.heroButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={[styles.trustBadgesSection, {backgroundColor: config.headerColor}]}>
          {config.trustBadges.map((badge, i) => (
            <View key={i} style={styles.trustBadge}>
              <Text style={styles.trustIcon}>{badge.icon}</Text>
              <Text style={styles.trustTitle}>{badge.title}</Text>
              <Text style={styles.trustDesc}>{badge.desc}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        {config.categories.length > 0 ? (
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>{config.categoriesTitle}</Text>
            <Text style={styles.sectionSubtitle}>{config.categoriesSubtitle}</Text>
            <View style={styles.categoriesGrid}>
              {config.categories.map((cat, i) => (
                <TouchableOpacity key={i} style={styles.categoryCard} onPress={() => navigateToCollection(cat.handle, cat.name)}>
                  <View style={[styles.categoryIconWrap, {backgroundColor: config.accentColor + '20'}]}>
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        {/* Featured Sections */}
        {config.featuredSections.map((section, idx) => {
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
                  <Text style={[styles.viewAll, {color: config.accentColor}]}>View All →</Text>
                </TouchableOpacity>
              </View>
              <FlatList horizontal data={products} renderItem={renderProduct} keyExtractor={keyExtractor} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll} initialNumToRender={4} maxToRenderPerBatch={4} />
            </View>
          );
        })}

        {/* Tips Section */}
        {config.tips ? (
          <View style={[styles.tipsSection, {backgroundColor: config.headerColor}]}>
            <View style={styles.tipsContent}>
              {config.tips.tag ? <Text style={[styles.tipsTag, {color: config.accentColor}]}>{config.tips.tag}</Text> : null}
              <Text style={styles.tipsTitle}>{config.tips.title}</Text>
              <Text style={styles.tipsText}>{config.tips.content}</Text>
              <TouchableOpacity style={styles.tipsBtn}>
                <Text style={[styles.tipsBtnText, {color: config.headerColor}]}>{config.tips.buttonText}</Text>
              </TouchableOpacity>
            </View>
            <Image source={{uri: `${FILES_CDN}/${config.tips.image}`}} style={styles.tipsImage} resizeMode="cover" />
          </View>
        ) : null}

        {/* Newsletter */}
        <View style={[styles.newsletterSection, {backgroundColor: config.headerColor}]}>
          <Text style={styles.newsletterTitle}>{config.newsletterTitle}</Text>
          <Text style={styles.newsletterSubtitle}>{config.newsletterSubtitle}</Text>
          <TouchableOpacity style={styles.newsletterBtn}>
            <Text style={[styles.newsletterBtnText, {color: config.headerColor}]}>Subscribe Now</Text>
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
  loadingText: {marginTop: 12, fontSize: 14},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12},
  backButton: {padding: 4},
  backButtonText: {color: '#fff', fontSize: 16, fontWeight: '500'},
  headerTitle: {flex: 1, color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center'},
  cartButton: {padding: 4},
  cartIcon: {fontSize: 24},
  heroBanner: {height: 200, position: 'relative'},
  heroImage: {width: '100%', height: '100%'},
  heroOverlay: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.5)'},
  heroTag: {fontSize: 11, fontWeight: '600'},
  heroTitle: {fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 4},
  heroSubtitle: {fontSize: 11, color: 'rgba(255,255,255,0.9)', marginTop: 4},
  heroBtn: {alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 12},
  heroBtnText: {color: '#fff', fontSize: 13, fontWeight: '600'},
  trustBadgesSection: {flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 8},
  trustBadge: {flex: 1, alignItems: 'center'},
  trustIcon: {fontSize: 24, marginBottom: 4},
  trustTitle: {fontSize: 10, fontWeight: 'bold', color: '#fff', textAlign: 'center'},
  trustDesc: {fontSize: 8, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 2},
  categoriesSection: {backgroundColor: '#fff', paddingVertical: 20, paddingHorizontal: 16},
  categoriesGrid: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, justifyContent: 'space-between'},
  categoryCard: {width: (width - 48) / 4, alignItems: 'center', marginBottom: 16},
  categoryIconWrap: {width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 6},
  categoryEmoji: {fontSize: 24},
  categoryName: {fontSize: 10, fontWeight: '500', color: '#333', textAlign: 'center'},
  section: {backgroundColor: '#fff', marginTop: 8, paddingVertical: 16},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 12},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  sectionSubtitle: {fontSize: 11, color: '#888', marginTop: 2},
  viewAll: {fontSize: 12, fontWeight: '500'},
  productsScroll: {paddingHorizontal: 12},
  productCard: {width: 140, backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 4, borderWidth: 1, borderColor: '#eee', overflow: 'hidden'},
  productImageWrap: {width: '100%', height: 110, backgroundColor: '#f9f9f9'},
  productImage: {width: '100%', height: '100%'},
  saleBadge: {position: 'absolute', top: 8, left: 8, backgroundColor: '#e53935', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4},
  saleBadgeText: {color: '#fff', fontSize: 9, fontWeight: 'bold'},
  productInfo: {padding: 10},
  productTitle: {fontSize: 12, color: '#333', height: 32, lineHeight: 16},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  productPrice: {fontSize: 14, fontWeight: 'bold'},
  comparePrice: {fontSize: 11, color: '#999', textDecorationLine: 'line-through', marginLeft: 6},
  addBtn: {backgroundColor: '#fff', borderWidth: 1.5, paddingVertical: 6, borderRadius: 6, alignItems: 'center', marginTop: 8},
  addBtnText: {fontSize: 11, fontWeight: 'bold'},
  tipsSection: {flexDirection: 'row', marginTop: 8, overflow: 'hidden'},
  tipsContent: {flex: 1, padding: 16},
  tipsTag: {fontSize: 10, fontWeight: '600'},
  tipsTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 4},
  tipsText: {fontSize: 11, color: 'rgba(255,255,255,0.9)', marginTop: 10, lineHeight: 18},
  tipsBtn: {backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, marginTop: 12},
  tipsBtnText: {fontSize: 12, fontWeight: '600'},
  tipsImage: {width: width * 0.4, height: 220},
  newsletterSection: {paddingVertical: 24, paddingHorizontal: 16, alignItems: 'center', marginTop: 8},
  newsletterTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  newsletterSubtitle: {fontSize: 12, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 4},
  newsletterBtn: {backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, marginTop: 16},
  newsletterBtnText: {fontSize: 14, fontWeight: 'bold'},
});

export default CollectionTemplateScreen;

