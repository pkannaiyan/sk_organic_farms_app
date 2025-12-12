/**
 * HomeScreen - Full replica of SK Organic Farms Shopify Theme
 * All sections from: https://xpue83h8h154o2y9-5514417.shopifypreview.com
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

// Category pills (Blinkit style) - all with custom template screens from SK_Organic_Updated_Dec2025 theme
const CATEGORY_PILLS = [
  {emoji: '🌱', name: 'Seeds', handle: 'organic-seeds', color: '#1B5E20', screen: 'SeedsCollection'},
  {emoji: '🪴', name: 'Plants', handle: 'live-plants', color: '#2E7D32', screen: 'PlantsCollection'},
  {emoji: '🧪', name: 'Manure', handle: 'organic-manures', color: '#5D4037', screen: 'ManureCollection'},
  {emoji: '🔧', name: 'Tools', handle: 'falcon-1', color: '#37474F', screen: 'ToolsCollection'},
  {emoji: '🛍️', name: 'Grow Bags', handle: 'grow-bags-for-terrace-garden', color: '#1565C0', screen: 'GrowBagsCollection'},
  {emoji: '🏺', name: 'Pots', handle: 'planters', color: '#BF360C', screen: 'PotsCollection'},
  {emoji: '🌾', name: 'Millets', handle: 'organic-millets-rice', color: '#795548', screen: 'MilletsCollection'},
  {emoji: '💚', name: 'Spirulina', handle: 'spirulina', color: '#0277BD', screen: 'SpirulinaCollection'},
  {emoji: '📦', name: 'Packages', handle: 'our-packages', color: '#6A1B9A', screen: 'PackagesCollection'},
  {emoji: '🏷️', name: 'Offers', handle: 'daily-deals', color: '#E65100', screen: 'OffersCollection'},
];

// Hero slides
const HERO_SLIDES = [
  {image: `${FILES_CDN}/IMG_2100.png`, title: 'Fresh Organic Products', subtitle: '100% Natural • Certified Organic • Sustainable Farming', button: 'Shop Now'},
  {image: `${FILES_CDN}/IMG_2099.png`, title: 'Native Organic Seeds', subtitle: 'Vegetable, Flower, Tree, Fruit & Herbal Seeds', button: 'Shop Seeds'},
  {image: `${FILES_CDN}/IMG_2101.png`, title: 'Garden Setup Services', subtitle: 'Shade House and Terrace Garden Setup', button: 'Get Started'},
];

// Quick Info Bar items
const QUICK_INFO = [
  {emoji: '🏷️', title: 'Daily Deals', sub: 'Up to 50% off'},
  {emoji: '🚚', title: 'Free Delivery', sub: 'On ₹500+'},
  {emoji: '🎁', title: 'Combo Offers', sub: 'Save more'},
];

// Product sections - matching Shopify theme
const PRODUCT_SECTIONS = [
  {handle: 'daily-deals', title: "🔥 Today's Deals", subtitle: 'Limited time offers - grab them fast!'},
  {handle: 'organic-seeds', title: '🌱 Organic Seeds', subtitle: 'Native & heirloom varieties'},
  {handle: 'organic-manures', title: '🌿 Organic Manure', subtitle: 'Premium quality fertilizers'},
  {handle: 'falcon-1', title: '🔧 Garden Tools', subtitle: 'Premium Falcon & Bellota tools'},
  {handle: 'organic-millets-rice', title: '🌾 Organic Millets & Rice', subtitle: 'Healthy ancient grains'},
];

// Services section
const SERVICES = [
  {
    emoji: '🚜',
    title: 'Visit Our Farm',
    desc: 'Experience organic farming firsthand! We welcome individuals, schools, and corporate groups.',
    tags: ['📍 Melkothakuppam', '👨‍👩‍👧‍👦 Groups Welcome', '🌱 Hands-on'],
    button: 'Book Farm Visit',
    handle: 'farm-visit-payment',
  },
  {
    emoji: '🧪',
    title: 'Spirulina Training',
    desc: 'Complete spirulina cultivation setup with pond installation, training, and ongoing support.',
    tags: ['🎓 Certification', '🔬 Practical', '📞 Support'],
    button: 'Learn More',
    handle: 'training-spirulina-cultivation',
  },
];

// Trust badges - Why SK Organic Farms
const TRUST_BADGES = [
  {emoji: '🌱', title: '100% Organic', desc: 'Certified organic, chemical-free'},
  {emoji: '🚚', title: 'Fast Delivery', desc: 'Same day dispatch'},
  {emoji: '💬', title: 'Expert Support', desc: 'Free gardening guidance'},
  {emoji: '💰', title: 'Best Prices', desc: 'Competitive prices'},
];

// Customer reviews
const REVIEWS = [
  {name: 'Priya Shankar', location: 'Chennai', text: "Best organic seeds I've ever used! My terrace garden is flourishing.", rating: 5},
  {name: 'Rajesh Kumar', location: 'Bangalore', text: 'Excellent quality manure and grow bags. My plants have never been healthier.', rating: 5},
  {name: 'Anitha Mohan', location: 'Coimbatore', text: 'The spirulina training was fantastic! Now I\'m growing my own superfood.', rating: 5},
];

// Brands
const BRANDS = [
  {name: 'Falcon', image: `${FILES_CDN}/falcon.jpg`},
  {name: 'SKOF', image: `${FILES_CDN}/SKOF_new_logo_tm_9b6a7846-af4e-4def-ac18-8b7165eaf2b9.jpg`},
  {name: 'Bellota', image: `${FILES_CDN}/bellota_logo.jpg`},
  {name: 'BioCarve', image: `${FILES_CDN}/biocurve.jpg`},
];

// Blog posts
const BLOG_POSTS = [
  {title: 'Tulasi Maadam - Sri Kanchi Temple Works', date: 'Oct 27, 2021', image: `${FILES_CDN}/tulasi.jpg`},
  {title: 'Controlling Pest and diseases organically', date: 'Oct 7, 2020', image: `${FILES_CDN}/pest.jpg`},
  {title: 'Farm Visit by Kavi Bharathi Vidyalaya Students', date: 'Jul 25, 2015', image: `${FILES_CDN}/farm.jpg`},
];

// Bottom trust bar
const BOTTOM_TRUST = [
  {emoji: '🔒', title: 'SSL Secure'},
  {emoji: '✅', title: 'Quality Assured'},
  {emoji: '🚚', title: 'Fast Delivery'},
  {emoji: '💬', title: 'Expert Support'},
  {emoji: '💰', title: 'Money Back'},
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

// Countdown Timer Component
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

// Main Component
const HomeScreen = ({navigation}: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activePill, setActivePill] = useState(-1);
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [allCollections, ...productResults] = await Promise.all([
          fetchCollections(),
          ...PRODUCT_SECTIONS.map(section => fetchCollectionProducts(section.handle, 8))
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

  // Navigate to collection
  const navigateToCollection = useCallback((handle: string, title?: string) => {
    const collection = collections.find(c => c.handle === handle);
    if (collection) {
      navigation.navigate('CollectionDetail', {collection});
    } else {
      navigation.navigate('CollectionDetail', {
        collection: {
          id: handle,
          handle: handle,
          title: title || handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        }
      });
    }
  }, [collections, navigation]);

  // Handle category pill press - use custom screen if available
  const handlePillPress = useCallback((index: number, pill: typeof CATEGORY_PILLS[0]) => {
    setActivePill(index);
    // If pill has a custom screen, navigate to it
    if (pill.screen) {
      navigation.navigate(pill.screen);
    } else {
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
      {/* Christmas Announcement Banner */}
      <View style={styles.christmasBanner}>
        <Text style={styles.christmasText}>
          <Text>🎄 Christmas Special! Get </Text>
          <Text style={styles.christmasBold}>25% OFF</Text>
          <Text> on all products </Text>
          <Text style={styles.christmasCode}>XMAS2024</Text>
          <Text> Shop Now →</Text>
        </Text>
      </View>

      {/* Blinkit-Style Header */}
      <View style={styles.header}>
        {/* Location Bar - Green Top Strip */}
        <View style={styles.topBar}>
          <View style={styles.locationRight}>
            <Text style={styles.locationText}>📍</Text>
            <View>
              <Text style={styles.deliverTo}>Deliver to</Text>
              <Text style={styles.locationBold}>Chennai, Tamil Nadu ▼</Text>
            </View>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>📧 skofarms@gmail.com</Text>
            <Text style={styles.contactItem}>📞 +91 6380464748</Text>
          </View>
        </View>

        {/* Main Header with Logo and Search */}
        <View style={styles.mainHeader}>
          <Image source={{uri: LOGO_IMAGE}} style={styles.headerLogo} resizeMode="contain" />
          <View style={styles.searchContainer}>
            <View style={styles.searchWrap}>
              <Text style={styles.searchIconText}>🔍</Text>
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search for seeds, plants, tools..." 
                placeholderTextColor="#999" 
                value={searchQuery} 
                onChangeText={setSearchQuery} 
              />
              <TouchableOpacity onPress={() => setIsListening(true)} style={styles.voiceBtn}>
                <Text style={styles.voiceIcon}>{isListening ? '🔴' : '🎤'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartIconText}>🛒</Text>
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>0</Text></View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Slideshow */}
        <View style={styles.heroSection}>
          <FlatList
            horizontal
            pagingEnabled
            data={HERO_SLIDES}
            keyExtractor={(_, index) => `slide-${index}`}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({item}) => (
              <View style={styles.heroSlide}>
                <Image source={{uri: item.image}} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroOverlay}>
                  <Text style={styles.heroTag}>Farm to Your Doorstep</Text>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
                  <TouchableOpacity style={styles.heroBtn}>
                    <Text style={styles.heroBtnText}>{item.button}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.heroDots}>
            {HERO_SLIDES.map((_, i) => (
              <View key={i} style={[styles.heroDot, i === activeSlide && styles.heroDotActive]} />
            ))}
          </View>
        </View>

        {/* Flash Sale Banner */}
        <View style={styles.flashSale}>
          <View style={styles.flashLeft}>
            <Text style={styles.flashIcon}>⚡</Text>
            <View>
              <Text style={styles.flashTitle}>Flash Sale Live!</Text>
              <Text style={styles.flashSub}>Grab deals before midnight</Text>
            </View>
          </View>
          <CountdownTimer />
          <TouchableOpacity style={styles.flashBtn} onPress={() => navigateToCollection('daily-deals')}>
            <Text style={styles.flashBtnText}>Shop Deals</Text>
          </TouchableOpacity>
        </View>

        {/* Blinkit-Style Category Pills */}
        <View style={styles.categorySection}>
          <FlatList
            horizontal
            data={CATEGORY_PILLS}
            keyExtractor={(_, i) => `cat-${i}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryPillsContent}
            renderItem={({item, index}) => {
              const isActive = index === activePill;
              const isOffer = item.name === 'Offers';
              return (
                <TouchableOpacity
                  style={[
                    styles.categoryPill,
                    isActive && styles.categoryPillActive,
                    isOffer && !isActive && styles.categoryPillOffer,
                  ]}
                  onPress={() => handlePillPress(index, item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryEmojiWrap}>
                    <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                  </View>
                  <Text style={[
                    styles.categoryPillText,
                    isActive && styles.categoryPillTextActive,
                    isOffer && !isActive && styles.categoryPillTextOffer,
                  ]}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Quick Info Bar */}
        <View style={styles.quickInfoBar}>
          {QUICK_INFO.map((info, i) => (
            <View key={i} style={styles.quickInfoItem}>
              <Text style={styles.quickInfoEmoji}>{info.emoji}</Text>
              <Text style={styles.quickInfoTitle}>{info.title}</Text>
              <Text style={styles.quickInfoSub}>{info.sub}</Text>
            </View>
          ))}
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

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesSectionTitle}>✨ Our Services</Text>
          <Text style={styles.servicesSectionSub}>Learn and experience organic farming with us</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((service, i) => (
              <TouchableOpacity key={i} style={styles.serviceCard} onPress={() => navigateToCollection(service.handle)}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceEmoji}>{service.emoji}</Text>
                  <View style={styles.serviceTypeBadge}><Text style={styles.serviceTypeText}>{i === 0 ? 'Experience' : 'Training'}</Text></View>
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDesc} numberOfLines={3}>{service.desc}</Text>
                <View style={styles.serviceTags}>
                  {service.tags.map((tag, j) => (
                    <Text key={j} style={styles.serviceTag}>{tag}</Text>
                  ))}
                </View>
                <TouchableOpacity style={styles.serviceBtn}>
                  <Text style={styles.serviceBtnText}>{service.button}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Why SK Organic Farms */}
        <View style={styles.whySection}>
          <Text style={styles.whySectionTitle}>Why SK Organic Farms?</Text>
          <Text style={styles.whySectionSub}>Trusted by 10,000+ Gardeners</Text>
          <View style={styles.trustGrid}>
            {TRUST_BADGES.map((badge, i) => (
              <View key={i} style={styles.trustBadge}>
                <Text style={styles.trustEmoji}>{badge.emoji}</Text>
                <Text style={styles.trustTitle}>{badge.title}</Text>
                <Text style={styles.trustDesc}>{badge.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Reviews */}
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsSectionTitle}>⭐ Customer Love</Text>
          <Text style={styles.reviewsSectionSub}>Real reviews from real gardeners</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsScroll}>
            {REVIEWS.map((review, i) => (
              <View key={i} style={styles.reviewCard}>
                <Text style={styles.reviewText}>"{review.text}"</Text>
                <View style={styles.reviewAuthor}>
                  <View style={styles.reviewAvatar}><Text style={styles.reviewAvatarText}>{review.name[0]}</Text></View>
                  <View>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewLocation}>{review.location}</Text>
                  </View>
                  <Text style={styles.reviewVerified}>✓ Verified Buyer</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.reviewStats}>
            <View style={styles.reviewStat}><Text style={styles.reviewStatNum}>4.8</Text><Text style={styles.reviewStatLabel}>Average Rating</Text></View>
            <View style={styles.reviewStat}><Text style={styles.reviewStatNum}>10K+</Text><Text style={styles.reviewStatLabel}>Happy Customers</Text></View>
            <View style={styles.reviewStat}><Text style={styles.reviewStatNum}>98%</Text><Text style={styles.reviewStatLabel}>Recommend Us</Text></View>
          </View>
        </View>

        {/* Bottom Trust Bar */}
        <View style={styles.bottomTrustBar}>
          {BOTTOM_TRUST.map((item, i) => (
            <View key={i} style={styles.bottomTrustItem}>
              <Text style={styles.bottomTrustEmoji}>{item.emoji}</Text>
              <Text style={styles.bottomTrustText}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* Brands Section */}
        <View style={styles.brandsSection}>
          <Text style={styles.brandsSectionTitle}>Brands We Carry</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandsScroll}>
            {BRANDS.map((brand, i) => (
              <View key={i} style={styles.brandCard}>
                <Image source={{uri: brand.image}} style={styles.brandImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Blog Section */}
        <View style={styles.blogSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>📚 Gardening Tips</Text>
              <Text style={styles.sectionSubtitle}>Learn from our experts</Text>
            </View>
            <TouchableOpacity><Text style={styles.viewAll}>Read More</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.blogScroll}>
            {BLOG_POSTS.map((post, i) => (
              <View key={i} style={styles.blogCard}>
                <View style={styles.blogImagePlaceholder}>
                  <Text style={styles.blogImageEmoji}>📖</Text>
                </View>
                <Text style={styles.blogDate}>{post.date}</Text>
                <Text style={styles.blogTitle} numberOfLines={2}>{post.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Locations */}
        <View style={styles.locationsSection}>
          <Text style={styles.locationsSectionTitle}>Our Locations</Text>
          <Text style={styles.locationsSectionSub}>Visit Us</Text>
          <View style={styles.locationsGrid}>
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}><Text style={styles.locationIconText}>🏪</Text></View>
              <Text style={styles.locationName}>Retail Store</Text>
              <Text style={styles.locationTitle}>Chennai Store</Text>
              <Text style={styles.locationAddress}>Mahathi Biotech{'\n'}Kalasathamman Koil St, Ramapuram{'\n'}Chennai 600089</Text>
              <Text style={styles.locationPhone}>6380464748</Text>
              <Text style={styles.locationHours}>Mon - Sun: 9:00 AM - 11:00 PM</Text>
              <TouchableOpacity style={styles.directionsBtn} onPress={() => Linking.openURL('https://maps.google.com/?q=Mahathi+Biotech+Ramapuram+Chennai')}>
                <Text style={styles.directionsBtnText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}><Text style={styles.locationIconText}>🌿</Text></View>
              <Text style={styles.locationName}>Organic Farm</Text>
              <Text style={styles.locationTitle}>Organic Farm</Text>
              <Text style={styles.locationAddress}>SK Organic Farms{'\n'}Melkothakuppam{'\n'}Tamil Nadu 635805</Text>
              <Text style={styles.locationPhone}>6380464748</Text>
              <Text style={styles.locationHours}>By Appointment Only</Text>
              <TouchableOpacity style={styles.directionsBtn} onPress={() => Linking.openURL('https://maps.google.com/?q=SK+Organic+Farms+Melkothakuppam')}>
                <Text style={styles.directionsBtnText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Newsletter */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>Join Our Community 🌱</Text>
          <Text style={styles.newsletterSub}>Get gardening tips, exclusive offers & 10% off your first order!</Text>
          <View style={styles.newsletterForm}>
            <TextInput style={styles.newsletterInput} placeholder="Enter your e-mail" placeholderTextColor="#888" value={email} onChangeText={setEmail} />
            <TouchableOpacity style={styles.newsletterBtn}>
              <Text style={styles.newsletterBtnText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Image source={{uri: LOGO_IMAGE}} style={styles.footerLogo} resizeMode="contain" />
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Refund Policy</Text>
            <Text style={styles.footerLink}>Terms of Service</Text>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </View>
          <View style={styles.footerContact}>
            <Text style={styles.footerContactText}>Sales: +91-6380464748</Text>
            <Text style={styles.footerContactText}>Mail: skofarms@gmail.com</Text>
          </View>
          <View style={styles.footerSocial}>
            <Text style={styles.footerSocialIcon}>📘</Text>
            <Text style={styles.footerSocialIcon}>📸</Text>
            <Text style={styles.footerSocialIcon}>🐦</Text>
          </View>
          <Text style={styles.footerPayment}>We Accept: RuPay • UPI • GPay • Paytm • NetBanking</Text>
          <Text style={styles.copyright}>© 2025, Sunantha Organic Farms</Text>
        </View>
      </ScrollView>

      {/* Voice Modal */}
      <Modal visible={isListening} transparent animationType="fade">
        <TouchableOpacity style={styles.voiceModal} activeOpacity={1} onPress={() => setIsListening(false)}>
          <View style={styles.voiceModalBox}>
            <Text style={styles.voiceModalIcon}>🎤</Text>
            <Text style={styles.voiceModalTitle}>Search by voice</Text>
            <Text style={styles.voiceModalSub}>Listening...</Text>
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
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  content: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'},
  loadingLogo: {width: 100, height: 100, marginBottom: 16},
  loadingText: {marginTop: 12, color: '#1da362', fontSize: 14},

  // Christmas Banner
  christmasBanner: {backgroundColor: '#c41e3a', paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center'},
  christmasText: {color: '#fff', fontSize: 12, textAlign: 'center'},
  christmasBold: {fontWeight: 'bold'},
  christmasCode: {backgroundColor: '#fff', color: '#c41e3a', paddingHorizontal: 6, paddingVertical: 2, fontWeight: 'bold', borderRadius: 4, overflow: 'hidden'},

  // Blinkit-Style Header
  header: {backgroundColor: '#fff'},
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1B5E20',
    borderBottomWidth: 3,
    borderBottomColor: '#8BC34A',
  },
  locationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  locationText: {fontSize: 16, marginRight: 8},
  deliverTo: {fontSize: 9, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5},
  locationBold: {fontWeight: '600', color: '#fff', fontSize: 12},
  contactInfo: {flexDirection: 'row', alignItems: 'center'},
  contactItem: {color: '#fff', fontSize: 11, fontWeight: '600', marginLeft: 16},
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fdf8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLogo: {width: 80, height: 50},

  // Blinkit-Style Search Bar
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: '#81C784',
    borderRadius: 30,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIconText: {fontSize: 16},
  searchInput: {flex: 1, marginHorizontal: 10, fontSize: 14, color: '#333'},
  voiceBtn: {
    padding: 6,
    backgroundColor: '#c8e6c9',
    borderRadius: 8,
  },
  voiceIcon: {fontSize: 16},
  cartBtn: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  cartIconText: {fontSize: 22},
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#2E7D32',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {color: '#fff', fontSize: 10, fontWeight: '700'},

  // Hero
  heroSection: {height: 200},
  heroSlide: {width: width, height: 200},
  heroImage: {width: '100%', height: '100%'},
  heroOverlay: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.45)'},
  heroTag: {color: '#8bd4b2', fontSize: 10, fontWeight: '600', marginBottom: 4},
  heroTitle: {fontSize: 22, fontWeight: 'bold', color: '#fff'},
  heroSubtitle: {fontSize: 11, color: 'rgba(255,255,255,0.9)', marginTop: 4},
  heroBtn: {backgroundColor: '#1da362', alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, marginTop: 10},
  heroBtnText: {color: '#fff', fontSize: 12, fontWeight: '600'},
  heroDots: {position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row'},
  heroDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3},
  heroDotActive: {backgroundColor: '#fff', width: 24},

  // Flash Sale
  flashSale: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff8e1', padding: 12, marginHorizontal: 12, marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ffd54f'},
  flashLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
  flashIcon: {fontSize: 28, marginRight: 10},
  flashTitle: {fontSize: 14, fontWeight: 'bold', color: '#333'},
  flashSub: {fontSize: 10, color: '#666'},
  flashCountdown: {flexDirection: 'row', marginRight: 12},
  countdownBox: {backgroundColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginHorizontal: 2, alignItems: 'center'},
  countdownNum: {color: '#fff', fontSize: 14, fontWeight: 'bold'},
  countdownLabel: {color: 'rgba(255,255,255,0.7)', fontSize: 8},
  flashBtn: {backgroundColor: '#1da362', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20},
  flashBtnText: {color: '#fff', fontSize: 11, fontWeight: '600'},

  // Blinkit-Style Category Pills Bar
  categorySection: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#81C784',
  },
  categoryPillsContent: {paddingHorizontal: 12},
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#81C784',
    borderRadius: 25,
    marginRight: 10,
    shadowColor: '#2E7D32',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryPillActive: {
    backgroundColor: '#1B5E20',
    borderColor: '#1B5E20',
  },
  categoryPillOffer: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  categoryEmojiWrap: {marginRight: 6},
  categoryEmoji: {fontSize: 18},
  categoryPillText: {fontSize: 13, color: '#2E7D32', fontWeight: '600'},
  categoryPillTextActive: {color: '#fff'},
  categoryPillTextOffer: {color: '#fff'},

  // Quick Info Bar
  quickInfoBar: {flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 8, marginTop: 2},
  quickInfoItem: {flex: 1, alignItems: 'center'},
  quickInfoEmoji: {fontSize: 20, marginBottom: 4},
  quickInfoTitle: {fontSize: 11, fontWeight: 'bold', color: '#333'},
  quickInfoSub: {fontSize: 9, color: '#888'},

  // Sections
  section: {backgroundColor: '#fff', marginTop: 8, paddingVertical: 16},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 12, marginBottom: 12},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  sectionSubtitle: {fontSize: 11, color: '#888', marginTop: 2},
  viewAll: {fontSize: 12, color: '#1da362', fontWeight: '500'},
  productsScroll: {paddingHorizontal: 8},

  // Product Card
  productCard: {width: 140, backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 4, borderWidth: 1, borderColor: '#eee', overflow: 'hidden'},
  productImageWrap: {width: '100%', height: 110, backgroundColor: '#f9f9f9'},
  productImage: {width: '100%', height: '100%'},
  saleBadge: {position: 'absolute', top: 8, left: 8, backgroundColor: '#e53935', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4},
  saleBadgeText: {color: '#fff', fontSize: 9, fontWeight: 'bold'},
  productInfo: {padding: 10},
  productTitle: {fontSize: 12, color: '#333', height: 32, lineHeight: 16},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  productPrice: {fontSize: 14, fontWeight: 'bold', color: '#1da362'},
  comparePrice: {fontSize: 11, color: '#999', textDecorationLine: 'line-through', marginLeft: 6},
  addBtn: {backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#1da362', paddingVertical: 6, borderRadius: 6, alignItems: 'center', marginTop: 8},
  addBtnText: {color: '#1da362', fontSize: 11, fontWeight: 'bold'},

  // Services Section
  servicesSection: {backgroundColor: '#f8fff8', paddingVertical: 20, marginTop: 8},
  servicesSectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center'},
  servicesSectionSub: {fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4, marginBottom: 16},
  servicesGrid: {flexDirection: 'row', paddingHorizontal: 12},
  serviceCard: {flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginHorizontal: 4, borderWidth: 1, borderColor: '#e0e0e0'},
  serviceHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10},
  serviceEmoji: {fontSize: 32},
  serviceTypeBadge: {backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12},
  serviceTypeText: {fontSize: 9, color: '#1da362', fontWeight: '600'},
  serviceTitle: {fontSize: 14, fontWeight: 'bold', color: '#333'},
  serviceDesc: {fontSize: 10, color: '#666', marginTop: 6, lineHeight: 14},
  serviceTags: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  serviceTag: {fontSize: 9, color: '#555', marginRight: 8, marginBottom: 4},
  serviceBtn: {backgroundColor: '#1da362', paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginTop: 10},
  serviceBtnText: {color: '#fff', fontSize: 11, fontWeight: '600'},

  // Why Section
  whySection: {backgroundColor: '#fff', paddingVertical: 24, marginTop: 8},
  whySectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center'},
  whySectionSub: {fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4, marginBottom: 20},
  trustGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12},
  trustBadge: {width: '50%', alignItems: 'center', paddingVertical: 12},
  trustEmoji: {fontSize: 32, marginBottom: 8},
  trustTitle: {fontSize: 13, fontWeight: 'bold', color: '#333'},
  trustDesc: {fontSize: 10, color: '#888', textAlign: 'center', marginTop: 2},

  // Reviews Section
  reviewsSection: {backgroundColor: '#fff', paddingVertical: 20, marginTop: 8},
  reviewsSectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center'},
  reviewsSectionSub: {fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4, marginBottom: 16},
  reviewsScroll: {paddingHorizontal: 12},
  reviewCard: {width: 280, backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginRight: 12},
  reviewText: {fontSize: 13, color: '#333', fontStyle: 'italic', lineHeight: 20},
  reviewAuthor: {flexDirection: 'row', alignItems: 'center', marginTop: 12},
  reviewAvatar: {width: 36, height: 36, borderRadius: 18, backgroundColor: '#1da362', justifyContent: 'center', alignItems: 'center', marginRight: 10},
  reviewAvatarText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  reviewName: {fontSize: 12, fontWeight: 'bold', color: '#333'},
  reviewLocation: {fontSize: 10, color: '#888'},
  reviewVerified: {fontSize: 9, color: '#1da362', marginLeft: 'auto'},
  reviewStats: {flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, marginTop: 8, borderTopWidth: 1, borderTopColor: '#eee'},
  reviewStat: {alignItems: 'center'},
  reviewStatNum: {fontSize: 20, fontWeight: 'bold', color: '#1da362'},
  reviewStatLabel: {fontSize: 10, color: '#888', marginTop: 2},

  // Bottom Trust Bar
  bottomTrustBar: {flexDirection: 'row', backgroundColor: '#f5f5f5', paddingVertical: 12},
  bottomTrustItem: {flex: 1, alignItems: 'center'},
  bottomTrustEmoji: {fontSize: 18},
  bottomTrustText: {fontSize: 8, color: '#666', marginTop: 4, textAlign: 'center'},

  // Brands Section
  brandsSection: {backgroundColor: '#fff', paddingVertical: 20, marginTop: 8},
  brandsSectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 16},
  brandsScroll: {paddingHorizontal: 12},
  brandCard: {width: 80, height: 50, backgroundColor: '#f9f9f9', borderRadius: 8, marginRight: 12, justifyContent: 'center', alignItems: 'center', padding: 8},
  brandImage: {width: '100%', height: '100%'},

  // Blog Section
  blogSection: {backgroundColor: '#fff', paddingVertical: 16, marginTop: 8},
  blogScroll: {paddingHorizontal: 8},
  blogCard: {width: 180, backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 4, borderWidth: 1, borderColor: '#eee', overflow: 'hidden'},
  blogImagePlaceholder: {width: '100%', height: 100, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center'},
  blogImageEmoji: {fontSize: 32},
  blogDate: {fontSize: 10, color: '#888', paddingHorizontal: 10, paddingTop: 10},
  blogTitle: {fontSize: 12, fontWeight: '600', color: '#333', paddingHorizontal: 10, paddingVertical: 8},

  // Locations Section
  locationsSection: {backgroundColor: '#fff', paddingVertical: 20, marginTop: 8},
  locationsSectionTitle: {fontSize: 12, color: '#1da362', textAlign: 'center', fontWeight: '600'},
  locationsSectionSub: {fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 16},
  locationsGrid: {paddingHorizontal: 12},
  locationCard: {backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginBottom: 12},
  locationIcon: {marginBottom: 8},
  locationIconText: {fontSize: 24},
  locationName: {fontSize: 10, color: '#1da362', fontWeight: '600'},
  locationTitle: {fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 2},
  locationAddress: {fontSize: 11, color: '#666', marginTop: 8, lineHeight: 16},
  locationPhone: {fontSize: 12, color: '#333', fontWeight: '500', marginTop: 8},
  locationHours: {fontSize: 10, color: '#888', marginTop: 4},
  directionsBtn: {backgroundColor: '#1da362', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 12},
  directionsBtnText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  // Newsletter
  newsletterSection: {backgroundColor: '#1da362', paddingVertical: 24, paddingHorizontal: 16, marginTop: 8},
  newsletterTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center'},
  newsletterSub: {fontSize: 12, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 4},
  newsletterForm: {flexDirection: 'row', marginTop: 16},
  newsletterInput: {flex: 1, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14},
  newsletterBtn: {backgroundColor: '#163340', paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center', marginLeft: 8},
  newsletterBtnText: {color: '#fff', fontSize: 13, fontWeight: '600'},

  // Footer
  footer: {backgroundColor: '#163340', paddingVertical: 24, alignItems: 'center'},
  footerLogo: {width: 100, height: 50, marginBottom: 16},
  footerLinks: {flexDirection: 'row', marginBottom: 16},
  footerLink: {color: 'rgba(255,255,255,0.7)', fontSize: 11, marginHorizontal: 10},
  footerContact: {marginBottom: 12},
  footerContactText: {color: 'rgba(255,255,255,0.8)', fontSize: 11, textAlign: 'center'},
  footerSocial: {flexDirection: 'row', marginBottom: 16},
  footerSocialIcon: {fontSize: 22, marginHorizontal: 10},
  footerPayment: {color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 12},
  copyright: {color: 'rgba(255,255,255,0.5)', fontSize: 10},

  // Voice Modal
  voiceModal: {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center'},
  voiceModalBox: {backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center', width: width * 0.8},
  voiceModalIcon: {fontSize: 48, marginBottom: 12},
  voiceModalTitle: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  voiceModalSub: {fontSize: 14, color: '#666', marginTop: 4},
  voiceModalBtn: {backgroundColor: '#f0f0f0', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 20},
  voiceModalBtnText: {color: '#666', fontWeight: '600'},
});

export default HomeScreen;
