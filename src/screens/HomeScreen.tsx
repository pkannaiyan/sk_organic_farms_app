/**
 * HomeScreen - Optimized for Performance
 * - Parallel API calls
 * - Memoized components
 * - Optimized images
 * - Reduced re-renders
 */

import React, {useState, useEffect, useCallback, useMemo, memo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import {colors, brand, newsletter} from '../constants/theme';
import {
  fetchCollections,
  fetchCollectionProducts,
  ShopifyCollection,
  ShopifyProduct,
  getProductImage,
  getProductPrice,
  getCompareAtPrice,
  isProductAvailable,
} from '../services/shopifyApi';

const {width} = Dimensions.get('window');
const FILES_CDN = 'https://cdn.shopify.com/s/files/1/0551/4417/files';
const LOGO_IMAGE = `${FILES_CDN}/LogoColorTextBelow_3223832e-681f-41c8-9347-b0f342a6384a.jpg`;

// Helper to get optimized image URL (smaller size)
const getOptimizedImage = (url: string, size: number = 200) => {
  if (!url) return url;
  if (url.includes('cdn.shopify.com')) {
    // Shopify image optimization
    return url.replace(/\.([^.]+)$/, `_${size}x.$1`);
  }
  return url;
};

// Category pills bar (Blinkit style)
const CATEGORY_PILLS = [
  {icon: '📋', name: 'All Products', handle: 'all', isActive: true, isOffer: false},
  {icon: '🌱', name: 'Seeds', handle: 'organic-seeds', isActive: false, isOffer: false},
  {icon: '🪴', name: 'Plants', handle: 'live-plants', isActive: false, isOffer: false},
  {icon: '🌿', name: 'Organic Manure', handle: 'organic-manures', isActive: false, isOffer: false},
  {icon: '🔧', name: 'Tools', handle: 'falcon-1', isActive: false, isOffer: false},
  {icon: '🏺', name: 'Pots', handle: 'garden-sprayer', isActive: false, isOffer: false},
  {icon: '🌾', name: 'Millets', handle: 'organic-millets-rice', isActive: false, isOffer: false},
  {icon: '💚', name: 'Spirulina', handle: 'spirulina', isActive: false, isOffer: false},
  {icon: '🏆', name: 'Brands', handle: 'brands', isActive: false, isOffer: false},
  {icon: '🛍️', name: 'Grow Bags', handle: 'grow-bags-for-terrace-garden', isActive: false, isOffer: false},
  {icon: '📦', name: 'Packages', handle: 'our-packages', isActive: false, isOffer: false},
  {icon: '🧴', name: 'Skin Care', handle: 'skin-and-hair-care', isActive: false, isOffer: false},
  {icon: '🌊', name: 'Sea Weed', handle: 'sea-weed-products', isActive: false, isOffer: false},
  {icon: '🏷️', name: 'Offers', handle: 'daily-deals', isActive: false, isOffer: true},
];

// Shop by Category
const CATEGORIES = [
  {emoji: '🌱', name: 'Seeds', handle: 'organic-seeds'},
  {emoji: '🪴', name: 'Plants', handle: 'live-plants'},
  {emoji: '🧪', name: 'Manure', handle: 'organic-manures'},
  {emoji: '🔧', name: 'Tools', handle: 'falcon-1'},
  {emoji: '🛍️', name: 'Grow Bags', handle: 'grow-bags-for-terrace-garden'},
  {emoji: '🏺', name: 'Pots', handle: 'garden-sprayer'},
  {emoji: '🌾', name: 'Millets', handle: 'organic-millets-rice'},
  {emoji: '💚', name: 'Spirulina', handle: 'spirulina'},
  {emoji: '📦', name: 'Packages', handle: 'our-packages'},
  {emoji: '🏷️', name: 'Offers', handle: 'daily-deals'},
];

// Quick badges
const QUICK_BADGES = [
  {icon: '🏷️', title: 'Daily Deals', subtitle: 'Up to 50% off'},
  {icon: '🚚', title: 'Free Delivery', subtitle: 'On orders ₹500+'},
  {icon: '🎁', title: 'Combo Offers', subtitle: 'Save on bundles'},
];

// Hero slides
const HERO_SLIDES = [
  {image: `${FILES_CDN}/IMG_2100.png`, badge: 'Farm to Your Doorstep', title: 'Fresh Organic Products', subtitle: '100% Natural • Certified Organic', button: 'Shop Now', link: 'organic-manures'},
  {image: `${FILES_CDN}/IMG_2099.png`, badge: 'Grow Your Own Garden', title: 'Native Organic Seeds', subtitle: 'Vegetable, Flower, Tree Seeds', button: 'Shop Seeds', link: 'organic-seeds'},
  {image: `${FILES_CDN}/IMG_2101.png`, badge: 'We Help You Start', title: 'Garden Setup Services', subtitle: 'Shade House & Terrace Garden', button: 'Get Started', link: 'our-packages'},
];

// Product sections - reduced to 3 for faster loading
const PRODUCT_SECTIONS = [
  {handle: 'daily-deals', title: '🔥 Today\'s Deals', subtitle: 'Limited time offers'},
  {handle: 'organic-seeds', title: '🌱 Organic Seeds', subtitle: 'Native varieties'},
  {handle: 'organic-manures', title: '🌿 Organic Manure', subtitle: 'Premium quality'},
];

// Trust badges
const TRUST_BADGES = [
  {emoji: '🌱', title: '100% Organic', subtitle: 'Chemical-free products'},
  {emoji: '🚚', title: 'Fast Delivery', subtitle: 'Same day dispatch'},
  {emoji: '💬', title: 'Expert Support', subtitle: 'Free guidance'},
  {emoji: '💰', title: 'Best Prices', subtitle: 'Great value'},
];

// Brand logos
const BRAND_LOGOS = [
  {name: 'Falcon', image: `${FILES_CDN}/falcon.jpg`, link: 'falcon-1'},
  {name: 'SKOF', image: `${FILES_CDN}/SKOF_new_logo_tm_9b6a7846-af4e-4def-ac18-8b7165eaf2b9.jpg`, link: ''},
  {name: 'Bellota', image: `${FILES_CDN}/bellota_logo.jpg`, link: 'bellota'},
  {name: 'BioCarve', image: `${FILES_CDN}/biocurve.jpg`, link: 'biocarve'},
];

// ========== MEMOIZED COMPONENTS ==========

// Memoized Product Card
const ProductCard = memo(({product, onPress}: {product: ShopifyProduct; onPress: () => void}) => {
  const price = getProductPrice(product);
  const compareAtPrice = getCompareAtPrice(product);
  const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
  const imageUrl = getOptimizedImage(getProductImage(product), 150);

  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.productImageWrap}>
        <Image source={{uri: imageUrl}} style={styles.productImage} resizeMode="cover" />
        {discount > 0 && <View style={styles.saleBadge}><Text style={styles.saleBadgeText}>{discount}%</Text></View>}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>₹{price}</Text>
          {compareAtPrice ? <Text style={styles.comparePrice}>₹{compareAtPrice}</Text> : null}
        </View>
        <TouchableOpacity style={styles.addBtn}><Text style={styles.addBtnText}>ADD</Text></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

// Memoized Category Pill
const CategoryPill = memo(({cat, onPress}: {cat: typeof CATEGORY_PILLS[0]; onPress: () => void}) => (
  <TouchableOpacity 
    style={[styles.categoryPill, cat.isActive && styles.categoryPillActive, cat.isOffer && styles.categoryPillOffer]} 
    onPress={onPress}
    activeOpacity={0.7}>
    <Text style={[styles.categoryPillIcon, cat.isActive && styles.categoryPillIconActive, cat.isOffer && styles.categoryPillIconOffer]}>{cat.icon}</Text>
    <Text style={[styles.categoryPillText, cat.isActive && styles.categoryPillTextActive, cat.isOffer && styles.categoryPillTextOffer]} numberOfLines={1}>{cat.name}</Text>
  </TouchableOpacity>
));

// Memoized Countdown Timer (isolated to prevent full re-render)
const CountdownTimer = memo(() => {
  const [countdown, setCountdown] = useState({hours: 8, mins: 45, secs: 30});

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let {hours, mins, secs} = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; mins = 59; secs = 59; }
        return {hours, mins, secs};
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.flashCountdown}>
      <View style={styles.countdownBox}><Text style={styles.countdownNum}>{String(countdown.hours).padStart(2, '0')}</Text><Text style={styles.countdownLabel}>Hrs</Text></View>
      <View style={styles.countdownBox}><Text style={styles.countdownNum}>{String(countdown.mins).padStart(2, '0')}</Text><Text style={styles.countdownLabel}>Min</Text></View>
      <View style={styles.countdownBox}><Text style={styles.countdownNum}>{String(countdown.secs).padStart(2, '0')}</Text><Text style={styles.countdownLabel}>Sec</Text></View>
    </View>
  );
});

// ========== MAIN COMPONENT ==========

const HomeScreen = ({navigation}: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [sectionProducts, setSectionProducts] = useState<{[key: string]: ShopifyProduct[]}>({});
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Auto-rotate slides (slower interval)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Load data with PARALLEL API calls
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch collections and all products in PARALLEL
        const [allCollections, ...productResults] = await Promise.all([
          fetchCollections(),
          ...PRODUCT_SECTIONS.map(section => 
            fetchCollectionProducts(section.handle, 6) // Reduced to 6 products per section
          )
        ]);

        setCollections(allCollections);

        // Map products to sections
        const productsMap: {[key: string]: ShopifyProduct[]} = {};
        PRODUCT_SECTIONS.forEach((section, index) => {
          if (productResults[index]?.length > 0) {
            productsMap[section.handle] = productResults[index];
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
  }, []);

  // Memoized search handler
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      const allProducts = Object.values(sectionProducts).flat();
      const results = allProducts.filter(p => p.title.toLowerCase().includes(text.toLowerCase()));
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [sectionProducts]);

  // Memoized navigation handlers
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

  const navigateToCollection = useCallback((handle: string) => {
    const collection = collections.find(c => c.handle === handle);
    if (collection) {
      navigation.navigate('CollectionDetail', {collection});
    }
  }, [collections, navigation]);

  // Memoized product renderer for FlatList
  const renderProduct = useCallback(({item, index}: {item: ShopifyProduct; index: number}) => (
    <ProductCard product={item} onPress={() => navigateToProduct(item)} />
  ), [navigateToProduct]);

  const keyExtractor = useCallback((item: ShopifyProduct) => item.id.toString(), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={{uri: LOGO_IMAGE}} style={styles.loadingLogo} resizeMode="contain" />
        <ActivityIndicator size="large" color="#1da362" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Christmas Banner */}
      <View style={styles.christmasBanner}>
        <Text style={styles.christmasText}>🎄 Christmas Special! <Text style={styles.christmasBold}>25% OFF</Text> Code: <Text style={styles.christmasCode}>XMAS2024</Text></Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <Image source={{uri: LOGO_IMAGE}} style={styles.headerLogo} resizeMode="contain" />
          <View style={styles.locationRight}>
            <Text style={styles.locationText}>📍 <Text style={styles.locationBold}>Chennai</Text></Text>
          </View>
        </View>

        {/* Category Pills */}
        <View style={styles.categoryPillsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces decelerationRate="fast" contentContainerStyle={styles.categoryPillsContainer}>
            {CATEGORY_PILLS.map((cat, i) => (
              <CategoryPill key={i} cat={cat} onPress={() => cat.handle === 'all' ? navigation.navigate('Collections') : navigateToCollection(cat.handle)} />
            ))}
          </ScrollView>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrap}>
            <Text>🔍</Text>
            <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#888" value={searchQuery} onChangeText={handleSearch} />
            <TouchableOpacity onPress={() => setIsListening(true)}><Text>{isListening ? '🔴' : '🎤'}</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} removeClippedSubviews={true}>
        {/* Hero Slideshow */}
        <View style={styles.heroSection}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {HERO_SLIDES.map((slide, i) => (
              <TouchableOpacity key={i} style={styles.heroSlide} onPress={() => navigateToCollection(slide.link)} activeOpacity={0.9}>
                <Image source={{uri: slide.image}} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroOverlay}>
                  <Text style={styles.heroTitle}>{slide.title}</Text>
                  <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>
                  <View style={styles.heroBtn}><Text style={styles.heroBtnText}>{slide.button}</Text></View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.heroDots}>
            {HERO_SLIDES.map((_, i) => <View key={i} style={[styles.heroDot, i === activeSlide && styles.heroDotActive]} />)}
          </View>
        </View>

        {/* Flash Sale with isolated countdown */}
        <View style={styles.flashSale}>
          <Text style={styles.flashIcon}>⚡</Text>
          <View style={styles.flashInfo}>
            <Text style={styles.flashTitle}>Flash Sale!</Text>
            <Text style={styles.flashSub}>Grab deals now</Text>
          </View>
          <CountdownTimer />
          <TouchableOpacity style={styles.flashBtn} onPress={() => navigateToCollection('daily-deals')}>
            <Text style={styles.flashBtnText}>Shop</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Badges */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickBadges}>
          {QUICK_BADGES.map((badge, i) => (
            <View key={i} style={styles.quickBadge}>
              <Text style={styles.quickBadgeIcon}>{badge.icon}</Text>
              <Text style={styles.quickBadgeTitle}>{badge.title}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Product Sections - Using FlatList for performance */}
        {PRODUCT_SECTIONS.map((section, idx) => {
          const products = sectionProducts[section.handle];
          if (!products || products.length === 0) return null;

          return (
            <View key={idx} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <TouchableOpacity onPress={() => navigateToCollection(section.handle)}>
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
                removeClippedSubviews={true}
                initialNumToRender={3}
                maxToRenderPerBatch={4}
                windowSize={3}
              />
            </View>
          );
        })}

        {/* Trust Badges */}
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>Why Choose Us?</Text>
          <View style={styles.trustGrid}>
            {TRUST_BADGES.map((badge, i) => (
              <View key={i} style={styles.trustBadge}>
                <Text style={styles.trustEmoji}>{badge.emoji}</Text>
                <Text style={styles.trustBadgeTitle}>{badge.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Brands */}
        <View style={styles.brandsSection}>
          <Text style={styles.brandsTitle}>Brands We Carry</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandsScroll}>
            {BRAND_LOGOS.map((b, i) => (
              <TouchableOpacity key={i} style={styles.brandItem} onPress={() => b.link && navigateToCollection(b.link)}>
                <Image source={{uri: getOptimizedImage(b.image, 100)}} style={styles.brandImg} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Locations */}
        <View style={styles.locationsSection}>
          <Text style={styles.locationsTitle}>Visit Us</Text>
          <View style={styles.locationCard}>
            <Text style={styles.locationName}>🏪 Chennai Store</Text>
            <Text style={styles.locationAddress}>Ramapuram, Chennai 600089</Text>
            <TouchableOpacity style={styles.directionsBtn} onPress={() => Linking.openURL('https://maps.google.com/?q=Mahathi+Biotech+Chennai')}>
              <Text style={styles.directionsBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Newsletter */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>Join Our Community 🌱</Text>
          <View style={styles.newsletterForm}>
            <TextInput style={styles.newsletterInput} placeholder="Enter email" placeholderTextColor="#888" value={email} onChangeText={setEmail} />
            <TouchableOpacity style={styles.newsletterBtn}><Text style={styles.newsletterBtnText}>Subscribe</Text></TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Sunantha Organic Farms</Text>
          <Text style={styles.footerContact}>📧 {brand.email} | 📞 {brand.phone}</Text>
          <Text style={styles.copyright}>© 2025 Sunantha Organic Farms</Text>
        </View>
      </ScrollView>

      {/* Voice Modal */}
      <Modal visible={isListening} transparent animationType="fade">
        <TouchableOpacity style={styles.voiceModal} activeOpacity={1} onPress={() => setIsListening(false)}>
          <View style={styles.voiceModalBox}>
            <Text style={styles.voiceModalTitle}>🎤 Listening...</Text>
            <TouchableOpacity style={styles.voiceModalBtn} onPress={() => setIsListening(false)}>
              <Text style={styles.voiceModalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f8f8'},
  content: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'},
  loadingLogo: {width: 80, height: 80, marginBottom: 12},
  loadingText: {marginTop: 8, color: '#1da362', fontSize: 13},

  // Christmas Banner
  christmasBanner: {backgroundColor: '#c41e3a', paddingVertical: 6, paddingHorizontal: 12, alignItems: 'center'},
  christmasText: {color: '#fff', fontSize: 11},
  christmasBold: {fontWeight: 'bold'},
  christmasCode: {backgroundColor: '#fff', color: '#c41e3a', paddingHorizontal: 4, borderRadius: 2, fontWeight: 'bold', overflow: 'hidden'},

  // Header
  header: {backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee'},
  topBar: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6},
  headerLogo: {width: 100, height: 32},
  locationRight: {flexDirection: 'row', alignItems: 'center'},
  locationText: {fontSize: 11, color: '#666'},
  locationBold: {fontWeight: 'bold', color: '#333'},

  // Category Pills
  categoryPillsWrapper: {backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e5e5', paddingVertical: 6},
  categoryPillsContainer: {paddingHorizontal: 8},
  categoryPill: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 1.5, borderColor: '#1da362', marginRight: 6, backgroundColor: '#fff'},
  categoryPillActive: {backgroundColor: '#1da362'},
  categoryPillOffer: {backgroundColor: '#f59e0b', borderColor: '#f59e0b'},
  categoryPillIcon: {fontSize: 12, marginRight: 4, color: '#1da362'},
  categoryPillIconActive: {color: '#fff'},
  categoryPillIconOffer: {color: '#fff'},
  categoryPillText: {fontSize: 10, fontWeight: '600', color: '#1da362'},
  categoryPillTextActive: {color: '#fff'},
  categoryPillTextOffer: {color: '#fff'},

  // Search
  searchContainer: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6},
  searchWrap: {flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 8, height: 36},
  searchInput: {flex: 1, marginHorizontal: 6, fontSize: 12, padding: 0},
  cartBtn: {marginLeft: 10},
  cartIcon: {fontSize: 20},

  // Hero
  heroSection: {height: 160},
  heroSlide: {width: width, height: 160},
  heroImage: {width: '100%', height: '100%'},
  heroOverlay: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.4)'},
  heroTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  heroSubtitle: {fontSize: 10, color: '#fff', marginTop: 2},
  heroBtn: {backgroundColor: '#1da362', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, marginTop: 6},
  heroBtnText: {color: '#fff', fontSize: 10, fontWeight: '600'},
  heroDots: {position: 'absolute', bottom: 6, alignSelf: 'center', flexDirection: 'row'},
  heroDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 2},
  heroDotActive: {backgroundColor: '#fff', width: 14},

  // Flash Sale
  flashSale: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff8e1', padding: 10, marginHorizontal: 12, marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ffd54f'},
  flashIcon: {fontSize: 20, marginRight: 6},
  flashInfo: {flex: 1},
  flashTitle: {fontSize: 12, fontWeight: 'bold', color: '#333'},
  flashSub: {fontSize: 9, color: '#666'},
  flashCountdown: {flexDirection: 'row', marginRight: 6},
  countdownBox: {backgroundColor: '#333', borderRadius: 3, paddingHorizontal: 4, paddingVertical: 2, marginHorizontal: 1, alignItems: 'center'},
  countdownNum: {color: '#fff', fontSize: 10, fontWeight: 'bold'},
  countdownLabel: {color: '#aaa', fontSize: 7},
  flashBtn: {backgroundColor: '#1da362', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12},
  flashBtnText: {color: '#fff', fontSize: 9, fontWeight: '600'},

  // Quick Badges
  quickBadges: {marginTop: 8, paddingHorizontal: 8},
  quickBadge: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginRight: 8, borderWidth: 1, borderColor: '#eee'},
  quickBadgeIcon: {fontSize: 14, marginRight: 4},
  quickBadgeTitle: {fontSize: 10, fontWeight: '600', color: '#333'},

  // Sections
  section: {backgroundColor: '#fff', marginTop: 10, paddingVertical: 10},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8},
  sectionTitle: {fontSize: 14, fontWeight: 'bold', color: '#333'},
  viewAll: {fontSize: 10, color: '#1da362', fontWeight: '500'},
  productsScroll: {paddingHorizontal: 8},

  // Product Card
  productCard: {width: 120, backgroundColor: '#fff', borderRadius: 6, marginRight: 8, borderWidth: 1, borderColor: '#eee', overflow: 'hidden'},
  productImageWrap: {width: '100%', height: 90, backgroundColor: '#f9f9f9'},
  productImage: {width: '100%', height: '100%'},
  saleBadge: {position: 'absolute', top: 4, left: 4, backgroundColor: '#e53935', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2},
  saleBadgeText: {color: '#fff', fontSize: 8, fontWeight: 'bold'},
  productInfo: {padding: 6},
  productTitle: {fontSize: 10, color: '#333', height: 24, lineHeight: 12},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 2},
  productPrice: {fontSize: 11, fontWeight: 'bold', color: '#1da362'},
  comparePrice: {fontSize: 9, color: '#999', textDecorationLine: 'line-through', marginLeft: 3},
  addBtn: {backgroundColor: '#fff', borderWidth: 1, borderColor: '#1da362', paddingVertical: 4, borderRadius: 4, alignItems: 'center', marginTop: 4},
  addBtnText: {color: '#1da362', fontSize: 9, fontWeight: 'bold'},

  // Trust
  trustSection: {backgroundColor: '#fff', paddingVertical: 16, marginTop: 10},
  trustTitle: {fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 12},
  trustGrid: {flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 8},
  trustBadge: {alignItems: 'center', width: '22%'},
  trustEmoji: {fontSize: 22, marginBottom: 4},
  trustBadgeTitle: {fontSize: 9, fontWeight: '600', color: '#333', textAlign: 'center'},

  // Brands
  brandsSection: {backgroundColor: '#fff', paddingVertical: 12, marginTop: 10},
  brandsTitle: {fontSize: 13, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8},
  brandsScroll: {paddingHorizontal: 12},
  brandItem: {width: 60, height: 45, marginRight: 10, backgroundColor: '#f9f9f9', borderRadius: 6, justifyContent: 'center', alignItems: 'center'},
  brandImg: {width: '80%', height: '80%'},

  // Locations
  locationsSection: {backgroundColor: '#fff', paddingVertical: 14, marginTop: 10},
  locationsTitle: {fontSize: 13, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10},
  locationCard: {backgroundColor: '#f9f9f9', marginHorizontal: 12, padding: 12, borderRadius: 8},
  locationName: {fontSize: 13, fontWeight: 'bold', color: '#333'},
  locationAddress: {fontSize: 10, color: '#666', marginTop: 4},
  directionsBtn: {backgroundColor: '#1da362', paddingVertical: 8, borderRadius: 6, alignItems: 'center', marginTop: 10},
  directionsBtnText: {color: '#fff', fontSize: 11, fontWeight: '600'},

  // Newsletter
  newsletterSection: {backgroundColor: '#1da362', paddingVertical: 16, paddingHorizontal: 12, marginTop: 10},
  newsletterTitle: {fontSize: 14, fontWeight: 'bold', color: '#fff', textAlign: 'center'},
  newsletterForm: {flexDirection: 'row', marginTop: 10},
  newsletterInput: {flex: 1, backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, fontSize: 11},
  newsletterBtn: {backgroundColor: '#163340', paddingHorizontal: 14, borderRadius: 6, justifyContent: 'center', marginLeft: 6},
  newsletterBtnText: {color: '#fff', fontSize: 10, fontWeight: '600'},

  // Footer
  footer: {backgroundColor: '#163340', paddingVertical: 16, alignItems: 'center'},
  footerBrand: {fontSize: 13, fontWeight: 'bold', color: '#fff'},
  footerContact: {fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4},
  copyright: {fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 6},

  // Voice Modal
  voiceModal: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'},
  voiceModalBox: {backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', width: width * 0.7},
  voiceModalTitle: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  voiceModalBtn: {backgroundColor: '#f0f0f0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginTop: 12},
  voiceModalBtnText: {color: '#666', fontWeight: '600'},
});

export default HomeScreen;
