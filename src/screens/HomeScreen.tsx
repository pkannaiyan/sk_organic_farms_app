/**
 * HomeScreen - Optimized with Blinkit-style category pills
 * Fixed: Scroll, Navigation, Performance
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
  Linking,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import {colors, brand} from '../constants/theme';
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

// Category pills with images (Blinkit style)
const CATEGORY_PILLS = [
  {image: `${FILES_CDN}/all-products-icon.png`, name: 'All Products', handle: 'all-products', type: 'all', color: '#1da362'},
  {image: `${FILES_CDN}/IMG-2091.png`, name: 'Seeds', handle: 'organic-seeds', type: 'collection', color: '#4caf50'},
  {image: `${FILES_CDN}/LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg`, name: 'Plants', handle: 'live-plants', type: 'collection', color: '#8bc34a'},
  {image: `${FILES_CDN}/IMG-2090.png`, name: 'Manure', handle: 'organic-manures', type: 'collection', color: '#795548'},
  {image: `${FILES_CDN}/falcon.jpg`, name: 'Tools', handle: 'falcon-1', type: 'collection', color: '#607d8b'},
  {image: `${FILES_CDN}/3110-05.jpg`, name: 'Pots', handle: 'planters', type: 'collection', color: '#ff9800'},
  {image: `${FILES_CDN}/best_seller.jpg`, name: 'Millets', handle: 'organic-millets-rice', type: 'collection', color: '#ffc107'},
  {image: `${FILES_CDN}/spirulina-powder.jpg`, name: 'Spirulina', handle: 'spirulina', type: 'collection', color: '#009688'},
  {image: `${FILES_CDN}/IMG-2104.png`, name: 'Grow Bags', handle: 'grow-bags-for-terrace-garden', type: 'collection', color: '#3f51b5'},
  {image: `${FILES_CDN}/IMG-2097.png`, name: 'Packages', handle: 'our-packages', type: 'collection', color: '#9c27b0'},
  {image: `${FILES_CDN}/4786E3F2-BDCD-484D-9274-66DE8A5A4834.webp`, name: 'Skin Care', handle: 'skin-and-hair-care', type: 'collection', color: '#e91e63'},
  {image: `${FILES_CDN}/SEAWEED.jpg`, name: 'Sea Weed', handle: 'sea-weed-products', type: 'collection', color: '#00bcd4'},
  {image: `${FILES_CDN}/biocurve.jpg`, name: 'Brands', handle: 'brands', type: 'brands', color: '#673ab7'},
  {image: `${FILES_CDN}/daily.png`, name: 'Offers', handle: 'daily-deals', type: 'offer', color: '#f44336'},
];

// Hero slides
const HERO_SLIDES = [
  {image: `${FILES_CDN}/IMG_2100.png`, title: 'Fresh Organic Products', subtitle: '100% Natural • Certified Organic', button: 'Shop Now', link: 'organic-manures'},
  {image: `${FILES_CDN}/IMG_2099.png`, title: 'Native Organic Seeds', subtitle: 'Vegetable, Flower & Herb Seeds', button: 'Shop Seeds', link: 'organic-seeds'},
  {image: `${FILES_CDN}/IMG_2101.png`, title: 'Garden Setup Services', subtitle: 'Shade House & Terrace Garden', button: 'Get Started', link: 'our-packages'},
];

// Product sections
const PRODUCT_SECTIONS = [
  {handle: 'daily-deals', title: '🔥 Today\'s Deals', subtitle: 'Limited time offers'},
  {handle: 'organic-seeds', title: '🌱 Organic Seeds', subtitle: 'Native varieties'},
  {handle: 'organic-manures', title: '🌿 Organic Manure', subtitle: 'Premium quality'},
];

// Trust badges
const TRUST_BADGES = [
  {emoji: '🌱', title: '100% Organic'},
  {emoji: '🚚', title: 'Fast Delivery'},
  {emoji: '💬', title: 'Expert Support'},
  {emoji: '💰', title: 'Best Prices'},
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

// Countdown Timer Component (isolated)
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
      <View style={styles.countdownBox}><Text style={styles.countdownNum}>{String(countdown.hours).padStart(2, '0')}</Text></View>
      <Text style={styles.countdownSep}>:</Text>
      <View style={styles.countdownBox}><Text style={styles.countdownNum}>{String(countdown.mins).padStart(2, '0')}</Text></View>
      <Text style={styles.countdownSep}>:</Text>
      <View style={styles.countdownBox}><Text style={styles.countdownNum}>{String(countdown.secs).padStart(2, '0')}</Text></View>
    </View>
  );
});

// Main Component
const HomeScreen = ({navigation}: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePill, setActivePill] = useState(0);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [sectionProducts, setSectionProducts] = useState<{[key: string]: ShopifyProduct[]}>({});
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Load data with parallel API calls
  useEffect(() => {
    const loadData = async () => {
      try {
        const [allCollections, ...productResults] = await Promise.all([
          fetchCollections(),
          ...PRODUCT_SECTIONS.map(section => fetchCollectionProducts(section.handle, 6))
        ]);

        setCollections(allCollections);
        
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

  // Navigate to collection - always navigate even if not pre-loaded
  const navigateToCollection = useCallback((handle: string, title?: string) => {
    const collection = collections.find(c => c.handle === handle);
    if (collection) {
      navigation.navigate('CollectionDetail', {collection});
    } else {
      // Create a minimal collection object to navigate
      navigation.navigate('CollectionDetail', {
        collection: {
          id: handle,
          handle: handle,
          title: title || handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        }
      });
    }
  }, [collections, navigation]);

  // Handle category pill press - navigate to respective collection
  const handlePillPress = useCallback((index: number, pill: typeof CATEGORY_PILLS[0]) => {
    setActivePill(index);
    
    if (pill.type === 'all') {
      navigation.navigate('Collections');
    } else if (pill.type === 'brands') {
      navigation.navigate('Collections');
    } else {
      // Navigate to collection with handle and name
      navigateToCollection(pill.handle, pill.name);
    }
  }, [navigation, navigateToCollection]);

  // Render product
  const renderProduct = useCallback(({item}: {item: ShopifyProduct}) => (
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
        <Text style={styles.christmasText}>
          <Text>🎄 Christmas Special! </Text>
          <Text style={styles.christmasBold}>25% OFF</Text>
          <Text> Code: </Text>
          <Text style={styles.christmasCode}>XMAS2024</Text>
        </Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        {/* Logo and Location Row */}
        <View style={styles.topBar}>
          <Image source={{uri: LOGO_IMAGE}} style={styles.headerLogo} resizeMode="contain" />
          <View style={styles.locationRight}>
            <Text style={styles.locationText}>
              <Text>📍 </Text>
              <Text style={styles.locationBold}>Chennai</Text>
            </Text>
          </View>
        </View>

        {/* Category Pills - Blinkit Style with Images */}
        <View style={styles.categoryPillsContainer}>
          <FlatList
            horizontal={true}
            data={CATEGORY_PILLS}
            keyExtractor={(item, index) => `pill-${index}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryPillsContent}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  index === activePill && styles.categoryPillActive,
                  item.type === 'offer' && styles.categoryPillOffer,
                ]}
                onPress={() => handlePillPress(index, item)}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryPillImageWrap, {backgroundColor: item.color + '20'}]}>
                  <Image 
                    source={{uri: item.image}} 
                    style={styles.categoryPillImage} 
                    resizeMode="cover"
                  />
                </View>
                <Text 
                  style={[
                    styles.categoryPillText,
                    index === activePill && styles.categoryPillTextActive,
                    item.type === 'offer' && styles.categoryPillTextOffer,
                  ]} 
                  numberOfLines={1}
                >{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchIconText}>🔍</Text>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search products..." 
              placeholderTextColor="#888" 
              value={searchQuery} 
              onChangeText={setSearchQuery} 
            />
            <TouchableOpacity onPress={() => setIsListening(true)} style={styles.voiceBtn}>
              <Text style={styles.voiceIcon}>{isListening ? '🔴' : '🎤'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartIconText}>🛒</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Slideshow */}
        <View style={styles.heroSection}>
          <FlatList
            horizontal={true}
            pagingEnabled={true}
            data={HERO_SLIDES}
            keyExtractor={(item, index) => `slide-${index}`}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({item}) => (
              <TouchableOpacity style={styles.heroSlide} onPress={() => navigateToCollection(item.link)} activeOpacity={0.9}>
                <Image source={{uri: item.image}} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroOverlay}>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
                  <View style={styles.heroBtn}>
                    <Text style={styles.heroBtnText}>{item.button}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={styles.heroDots}>
            {HERO_SLIDES.map((_, i) => (
              <View key={i} style={[styles.heroDot, i === activeSlide && styles.heroDotActive]} />
            ))}
          </View>
        </View>

        {/* Flash Sale */}
        <View style={styles.flashSale}>
          <Text style={styles.flashIcon}>⚡</Text>
          <View style={styles.flashInfo}>
            <Text style={styles.flashTitle}>Flash Sale!</Text>
            <Text style={styles.flashSub}>Ends soon</Text>
          </View>
          <CountdownTimer />
          <TouchableOpacity style={styles.flashBtn} onPress={() => navigateToCollection('daily-deals')}>
            <Text style={styles.flashBtnText}>Shop</Text>
          </TouchableOpacity>
        </View>

        {/* Product Sections */}
        {PRODUCT_SECTIONS.map((section, idx) => {
          const products = sectionProducts[section.handle];
          if (!products || products.length === 0) return null;

          return (
            <View key={idx} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
                </View>
                <TouchableOpacity onPress={() => navigateToCollection(section.handle)}>
                  <Text style={styles.viewAll}>View All →</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal={true}
                data={products}
                renderItem={renderProduct}
                keyExtractor={keyExtractor}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsScroll}
                initialNumToRender={3}
                maxToRenderPerBatch={4}
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
            <TouchableOpacity style={styles.newsletterBtn}>
              <Text style={styles.newsletterBtnText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Sunantha Organic Farms</Text>
          <Text style={styles.footerContact}>📧 {brand.email}</Text>
          <Text style={styles.footerContact}>📞 {brand.phone}</Text>
          <Text style={styles.copyright}>© 2025 Sunantha Organic Farms</Text>
        </View>
      </ScrollView>

      {/* Voice Modal */}
      <Modal visible={isListening} transparent={true} animationType="fade">
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
  christmasBanner: {backgroundColor: '#c41e3a', paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center'},
  christmasText: {color: '#fff', fontSize: 12},
  christmasBold: {fontWeight: 'bold'},
  christmasCode: {backgroundColor: '#fff', color: '#c41e3a', paddingHorizontal: 4, fontWeight: 'bold'},

  // Header
  header: {backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e5e5'},
  topBar: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8},
  headerLogo: {width: 100, height: 35},
  locationRight: {flexDirection: 'row', alignItems: 'center'},
  locationText: {fontSize: 12, color: '#666'},
  locationBold: {fontWeight: 'bold', color: '#333'},

  // Category Pills - Blinkit Style with circular images
  categoryPillsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 10,
  },
  categoryPillsContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 14,
    paddingVertical: 4,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    marginHorizontal: 4,
    backgroundColor: '#fff',
    height: 42,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryPillActive: {
    backgroundColor: '#e8f5e9',
    borderColor: '#1da362',
  },
  categoryPillOffer: {
    backgroundColor: '#fff3e0',
    borderColor: '#f59e0b',
  },
  categoryPillImageWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPillImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  categoryPillTextActive: {
    color: '#1da362',
  },
  categoryPillTextOffer: {
    color: '#f57c00',
  },

  // Search
  searchContainer: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8},
  searchWrap: {flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10, height: 40},
  searchIconText: {fontSize: 16},
  searchInput: {flex: 1, marginHorizontal: 8, fontSize: 13, padding: 0, color: '#333'},
  voiceBtn: {padding: 4},
  voiceIcon: {fontSize: 16},
  cartBtn: {marginLeft: 12, padding: 4},
  cartIconText: {fontSize: 22},

  // Hero
  heroSection: {height: 180},
  heroSlide: {width: width, height: 180},
  heroImage: {width: '100%', height: '100%'},
  heroOverlay: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.4)'},
  heroTitle: {fontSize: 20, fontWeight: 'bold', color: '#fff'},
  heroSubtitle: {fontSize: 11, color: '#fff', marginTop: 2},
  heroBtn: {backgroundColor: '#1da362', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginTop: 8},
  heroBtnText: {color: '#fff', fontSize: 11, fontWeight: '600'},
  heroDots: {position: 'absolute', bottom: 8, alignSelf: 'center', flexDirection: 'row'},
  heroDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3},
  heroDotActive: {backgroundColor: '#fff', width: 20},

  // Flash Sale
  flashSale: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff8e1', padding: 12, marginHorizontal: 12, marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ffd54f'},
  flashIcon: {fontSize: 24, marginRight: 8},
  flashInfo: {flex: 1},
  flashTitle: {fontSize: 14, fontWeight: 'bold', color: '#333'},
  flashSub: {fontSize: 10, color: '#666'},
  flashCountdown: {flexDirection: 'row', alignItems: 'center', marginRight: 10},
  countdownBox: {backgroundColor: '#333', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 4},
  countdownNum: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
  countdownSep: {color: '#333', fontSize: 14, fontWeight: 'bold', marginHorizontal: 2},
  flashBtn: {backgroundColor: '#1da362', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16},
  flashBtnText: {color: '#fff', fontSize: 11, fontWeight: '600'},

  // Sections
  section: {backgroundColor: '#fff', marginTop: 12, paddingVertical: 12},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 12, marginBottom: 10},
  sectionTitle: {fontSize: 15, fontWeight: 'bold', color: '#333'},
  sectionSubtitle: {fontSize: 11, color: '#888', marginTop: 2},
  viewAll: {fontSize: 11, color: '#1da362', fontWeight: '500'},
  productsScroll: {paddingHorizontal: 8},

  // Product Card
  productCard: {width: 130, backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 4, borderWidth: 1, borderColor: '#eee', overflow: 'hidden'},
  productImageWrap: {width: '100%', height: 100, backgroundColor: '#f9f9f9'},
  productImage: {width: '100%', height: '100%'},
  saleBadge: {position: 'absolute', top: 6, left: 6, backgroundColor: '#e53935', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3},
  saleBadgeText: {color: '#fff', fontSize: 9, fontWeight: 'bold'},
  productInfo: {padding: 8},
  productTitle: {fontSize: 11, color: '#333', height: 28, lineHeight: 14},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  productPrice: {fontSize: 13, fontWeight: 'bold', color: '#1da362'},
  comparePrice: {fontSize: 10, color: '#999', textDecorationLine: 'line-through', marginLeft: 4},
  addBtn: {backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#1da362', paddingVertical: 5, borderRadius: 6, alignItems: 'center', marginTop: 6},
  addBtnText: {color: '#1da362', fontSize: 10, fontWeight: 'bold'},

  // Trust
  trustSection: {backgroundColor: '#fff', paddingVertical: 20, marginTop: 12},
  trustTitle: {fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 14},
  trustGrid: {flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 8},
  trustBadge: {alignItems: 'center', width: '22%'},
  trustEmoji: {fontSize: 26, marginBottom: 6},
  trustBadgeTitle: {fontSize: 10, fontWeight: '600', color: '#333', textAlign: 'center'},

  // Locations
  locationsSection: {backgroundColor: '#fff', paddingVertical: 16, marginTop: 12},
  locationsTitle: {fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 12},
  locationCard: {backgroundColor: '#f9f9f9', marginHorizontal: 12, padding: 14, borderRadius: 10},
  locationName: {fontSize: 14, fontWeight: 'bold', color: '#333'},
  locationAddress: {fontSize: 11, color: '#666', marginTop: 4},
  directionsBtn: {backgroundColor: '#1da362', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 12},
  directionsBtnText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  // Newsletter
  newsletterSection: {backgroundColor: '#1da362', paddingVertical: 20, paddingHorizontal: 12, marginTop: 12},
  newsletterTitle: {fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center'},
  newsletterForm: {flexDirection: 'row', marginTop: 12},
  newsletterInput: {flex: 1, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13},
  newsletterBtn: {backgroundColor: '#163340', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center', marginLeft: 8},
  newsletterBtnText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  // Footer
  footer: {backgroundColor: '#163340', paddingVertical: 20, alignItems: 'center'},
  footerBrand: {fontSize: 14, fontWeight: 'bold', color: '#fff'},
  footerContact: {fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4},
  copyright: {fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 8},

  // Voice Modal
  voiceModal: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'},
  voiceModalBox: {backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: width * 0.75},
  voiceModalTitle: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  voiceModalBtn: {backgroundColor: '#f0f0f0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 16},
  voiceModalBtnText: {color: '#666', fontWeight: '600'},
});

export default HomeScreen;
