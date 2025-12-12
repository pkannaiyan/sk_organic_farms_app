/**
 * HomeScreen - Exact replica of Shopify theme from preview
 * URL: https://xpue83h8h154o2y9-5514417.shopifypreview.com
 */

import React, {useState, useEffect, useCallback} from 'react';
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

// Shop by Category - with emojis
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
  {
    image: `${FILES_CDN}/IMG_2100.png`,
    badge: 'Farm to Your Doorstep',
    title: 'Fresh Organic Products',
    subtitle: '100% Natural • Certified Organic • Sustainable Farming',
    button: 'Shop Now',
    link: 'organic-manures',
  },
  {
    image: `${FILES_CDN}/IMG_2099.png`,
    badge: 'Grow Your Own Garden',
    title: 'Native Organic Seeds',
    subtitle: 'Vegetable, Flower, Tree, Fruit & Herbal Seeds',
    button: 'Shop Seeds',
    link: 'organic-seeds',
  },
  {
    image: `${FILES_CDN}/IMG_2101.png`,
    badge: 'We Help You Start',
    title: 'Garden Setup Services',
    subtitle: 'Shade House and Terrace Garden Setup',
    button: 'Get Started',
    link: 'our-packages',
  },
];

// Product sections
const PRODUCT_SECTIONS = [
  {handle: 'daily-deals', title: '🔥 Today\'s Deals', subtitle: 'Limited time offers - grab them fast!'},
  {handle: 'organic-seeds', title: '🌱 Organic Seeds', subtitle: 'Native & heirloom varieties'},
  {handle: 'organic-manures', title: '🌿 Organic Manure', subtitle: 'Premium quality fertilizers'},
  {handle: 'falcon-1', title: '🔧 Garden Tools', subtitle: 'Premium Falcon & Bellota tools'},
  {handle: 'organic-millets-rice', title: '🌾 Organic Millets & Rice', subtitle: 'Healthy ancient grains'},
];

// Services
const SERVICES = [
  {
    tag: 'Farm Visit🚜',
    type: 'Experience',
    title: 'Visit Our Farm 🚜',
    description: 'Experience organic farming firsthand! We welcome individuals, schools, and corporate groups to visit our farm.',
    badges: ['📍 Melkothakuppam', '👨‍👩‍👧‍👦 Groups Welcome', '🌱 Hands-on'],
    button: 'Book Farm Visit',
  },
  {
    tag: 'Spirulina Training🧪',
    type: 'Training',
    title: 'Spirulina Training 🧪',
    description: 'Complete spirulina cultivation setup with pond installation, hands-on training, and ongoing support.',
    badges: ['🎓 Certification', '🔬 Practical', '📞 Support'],
    button: 'Learn More',
  },
];

// Trust badges
const TRUST_BADGES = [
  {emoji: '🌱', title: '100% Organic', subtitle: 'Certified organic products, completely chemical-free'},
  {emoji: '🚚', title: 'Fast Delivery', subtitle: 'Same day dispatch, quick nationwide shipping'},
  {emoji: '💬', title: 'Expert Support', subtitle: 'Free gardening guidance from our experts'},
  {emoji: '💰', title: 'Best Prices', subtitle: 'Competitive prices with great value'},
];

// Customer reviews
const REVIEWS = [
  {
    text: 'Best organic seeds I\'ve ever used! My terrace garden is flourishing. The tomatoes and chillies are amazing! Highly recommend to all gardening enthusiasts.',
    name: 'Priya Shankar',
    location: 'Chennai',
    verified: true,
  },
  {
    text: 'Excellent quality manure and grow bags. My plants have never been healthier. The customer support team is very knowledgeable and helpful!',
    name: 'Rajesh Kumar',
    location: 'Bangalore',
    verified: true,
  },
  {
    text: 'The spirulina training was fantastic! Now I\'m growing my own superfood at home. Great investment and amazing support from the team!',
    name: 'Anitha Mohan',
    location: 'Coimbatore',
    verified: true,
  },
];

// Footer badges
const FOOTER_BADGES = [
  {icon: '🔒', text: '100% Secure', sub: 'SSL Encrypted'},
  {icon: '✅', text: 'Quality Assured', sub: 'Certified Organic'},
  {icon: '🚚', text: 'Fast Delivery', sub: 'Pan India Shipping'},
  {icon: '💬', text: 'Expert Support', sub: 'Gardening Help'},
  {icon: '💸', text: 'Money Back', sub: '7 Day Guarantee'},
];

// Brand logos
const BRAND_LOGOS = [
  {name: 'Falcon', image: `${FILES_CDN}/falcon.jpg`, link: 'falcon-1'},
  {name: 'SKOF', image: `${FILES_CDN}/SKOF_new_logo_tm_9b6a7846-af4e-4def-ac18-8b7165eaf2b9.jpg`, link: ''},
  {name: 'Bellota', image: `${FILES_CDN}/bellota_logo.jpg`, link: 'bellota'},
  {name: 'EPLA', image: `${FILES_CDN}/EPLA-logo_802a7aba-6c86-4917-a3f7-6d457d52659c.jpeg`, link: ''},
  {name: 'BioCarve', image: `${FILES_CDN}/biocurve.jpg`, link: 'biocarve'},
];

// Blog posts
const BLOG_POSTS = [
  {title: 'Tulasi Maadam -Sri Kanchi Temple Works', tag: 'Stone Tulasi Maadam', date: 'October 27, 2021', image: `${FILES_CDN}/DSC_0253.JPG`},
  {title: 'Controlling Pest and diseases organically', tag: 'Controlling Pest and diseases organically', date: 'October 7, 2020', image: `${FILES_CDN}/DSC_0192.JPG`},
  {title: 'Farm Visit by Kavi Bharathi Vidyalaya Students', tag: 'Organic Farm Visit', date: 'July 25, 2015', image: `${FILES_CDN}/IMG_1355.JPG`},
];

const HomeScreen = ({navigation}: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [sectionProducts, setSectionProducts] = useState<{[key: string]: ShopifyProduct[]}>({});
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  
  // Flash sale countdown
  const [countdown, setCountdown] = useState({hours: 8, mins: 45, secs: 30});

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Flash sale countdown
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

  // Auto-rotate reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % REVIEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allCollections = await fetchCollections();
      setCollections(allCollections);

      const productsMap: {[key: string]: ShopifyProduct[]} = {};
      for (const section of PRODUCT_SECTIONS) {
        const products = await fetchCollectionProducts(section.handle, 10);
        if (products.length > 0) {
          productsMap[section.handle] = products;
        }
      }
      setSectionProducts(productsMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      const allProducts = Object.values(sectionProducts).flat();
      const results = allProducts.filter(p => p.title.toLowerCase().includes(text.toLowerCase()));
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [sectionProducts]);

  const startVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('organic seeds');
      handleSearch('organic seeds');
    }, 2000);
  };

  const navigateToProduct = (product: ShopifyProduct) => {
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
  };

  const navigateToCollection = (handle: string) => {
    const collection = collections.find(c => c.handle === handle);
    if (collection) {
      navigation.navigate('CollectionDetail', {collection});
    }
  };

  // Render product card
  const renderProductCard = (product: ShopifyProduct, index: number) => {
    const price = getProductPrice(product);
    const compareAtPrice = getCompareAtPrice(product);
    const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
    const hasVariants = product.variants && product.variants.length > 1;

    return (
      <TouchableOpacity key={`${product.id}-${index}`} style={styles.productCard} onPress={() => navigateToProduct(product)}>
        <View style={styles.productImageWrap}>
          <Image source={{uri: getProductImage(product)}} style={styles.productImage} resizeMode="cover" />
          {discount > 0 && (
            <View style={styles.saleBadge}>
              <Text style={styles.saleBadgeText}>Sale</Text>
            </View>
          )}
          {hasVariants && (
            <TouchableOpacity style={styles.optionsBtn}>
              <Text style={styles.optionsBtnText}>Options</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.quickViewBtn}>
            <Text style={styles.quickViewText}>Quick View</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
          <Text style={styles.priceLabel}>Price</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>Rs. {price}</Text>
            {compareAtPrice ? <Text style={styles.comparePrice}>—Rs. {compareAtPrice}</Text> : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render product card with ADD button (Blinkit style)
  const renderProductCardAdd = (product: ShopifyProduct, index: number) => {
    const price = getProductPrice(product);
    const compareAtPrice = getCompareAtPrice(product);
    const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

    return (
      <TouchableOpacity key={`${product.id}-${index}`} style={styles.productCardAdd} onPress={() => navigateToProduct(product)}>
        <View style={styles.productImageWrapAdd}>
          <Image source={{uri: getProductImage(product)}} style={styles.productImageAdd} resizeMode="cover" />
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% off</Text>
            </View>
          )}
        </View>
        <Text style={styles.productTitleAdd} numberOfLines={2}>{product.title}</Text>
        <View style={styles.priceRowAdd}>
          {compareAtPrice && <Text style={styles.comparePriceAdd}>Rs. {compareAtPrice}</Text>}
          <Text style={styles.productPriceAdd}>Rs. {price}</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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
      {/* ========== CHRISTMAS BANNER ========== */}
      <View style={styles.christmasBanner}>
        <Text style={styles.christmasText}>
          🎄 Christmas Special! Get <Text style={styles.christmasBold}>25% OFF</Text> on all products <Text style={styles.christmasCode}>XMAS2024</Text>
        </Text>
        <TouchableOpacity>
          <Text style={styles.christmasLink}>Shop Now →</Text>
        </TouchableOpacity>
      </View>

      {/* Christmas Sale Badge */}
      <View style={styles.christmasSaleBadge}>
        <Text style={styles.christmasSaleText}>🎁 Christmas Sale Live!</Text>
        <View style={styles.christmasLights}>
          <Text style={styles.lightRed}>🔴</Text>
          <Text style={styles.lightGreen}>🟢</Text>
          <Text style={styles.lightYellow}>🟡</Text>
        </View>
      </View>

      {/* ========== HEADER ========== */}
      <View style={styles.header}>
        {/* Location Bar */}
        <View style={styles.locationBar}>
          <Text style={styles.brandTitle}>Sunantha Organic Farms</Text>
          <View style={styles.locationRight}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Deliver to <Text style={styles.locationBold}>Chennai, Tamil Nadu</Text></Text>
          </View>
        </View>

        {/* Contact Row */}
        <View style={styles.contactRow}>
          <Text style={styles.contactText}>📧 {brand.email}</Text>
          <Text style={styles.contactText}>📞 {brand.phone}</Text>
        </View>

        {/* Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navScroll}>
          <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>Seeds ▾</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>Garden ▾</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>Others ▾</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Collections')}><Text style={styles.navText}>Menu</Text></TouchableOpacity>
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setShowSearch(true)}
            />
            <TouchableOpacity style={styles.voiceSearchBtn} onPress={startVoiceSearch}>
              <Text style={styles.voiceIcon}>{isListening ? '🔴' : '🎤'}</Text>
              <Text style={styles.voiceText}>Search by voice</Text>
            </TouchableOpacity>
          </View>

          {/* Account & Cart */}
          <TouchableOpacity style={styles.accountBtn}>
            <Text style={styles.accountIcon}>👤</Text>
            <Text style={styles.accountText}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.cartIcon}>🛒</Text>
            <Text style={styles.cartText}>Cart</Text>
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>0</Text></View>
            <Text style={styles.cartAmount}>Rs. 0.00</Text>
          </TouchableOpacity>
        </View>

        {/* Predictive Search */}
        {searchResults.length > 0 && showSearch && (
          <View style={styles.searchResults}>
            {searchResults.map((p, i) => (
              <TouchableOpacity key={i} style={styles.searchItem} onPress={() => { setShowSearch(false); setSearchResults([]); navigateToProduct(p); }}>
                <Image source={{uri: getProductImage(p)}} style={styles.searchItemImg} />
                <View style={styles.searchItemInfo}>
                  <Text style={styles.searchItemTitle} numberOfLines={1}>{p.title}</Text>
                  <Text style={styles.searchItemPrice}>Rs. {getProductPrice(p)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ========== HERO SLIDESHOW ========== */}
        <View style={styles.heroSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))}>
            {HERO_SLIDES.map((slide, i) => (
              <TouchableOpacity key={i} style={styles.heroSlide} onPress={() => navigateToCollection(slide.link)}>
                <Image source={{uri: slide.image}} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroOverlay}>
                  <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>{slide.badge}</Text></View>
                  <Text style={styles.heroTitle}>{slide.title}</Text>
                  <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>
                  <TouchableOpacity style={styles.heroBtn}>
                    <Text style={styles.heroBtnText}>{slide.button}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.heroDots}>
            {HERO_SLIDES.map((_, i) => (
              <View key={i} style={[styles.heroDot, i === activeSlide && styles.heroDotActive]} />
            ))}
          </View>
        </View>

        {/* ========== FLASH SALE BANNER ========== */}
        <View style={styles.flashSale}>
          <Text style={styles.flashIcon}>⚡</Text>
          <View style={styles.flashInfo}>
            <Text style={styles.flashTitle}>Flash Sale Live!</Text>
            <Text style={styles.flashSub}>Grab deals before midnight</Text>
          </View>
          <View style={styles.flashCountdown}>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownNum}>{String(countdown.hours).padStart(2, '0')}</Text>
              <Text style={styles.countdownLabel}>Hrs</Text>
            </View>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownNum}>{String(countdown.mins).padStart(2, '0')}</Text>
              <Text style={styles.countdownLabel}>Min</Text>
            </View>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownNum}>{String(countdown.secs).padStart(2, '0')}</Text>
              <Text style={styles.countdownLabel}>Sec</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.flashBtn} onPress={() => navigateToCollection('daily-deals')}>
            <Text style={styles.flashBtnText}>Shop Deals</Text>
          </TouchableOpacity>
        </View>

        {/* ========== SHOP BY CATEGORY ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity key={i} style={styles.categoryItem} onPress={() => navigateToCollection(cat.handle)}>
                <View style={styles.categoryCircle}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ========== QUICK BADGES ========== */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickBadges}>
          {QUICK_BADGES.map((badge, i) => (
            <View key={i} style={styles.quickBadge}>
              <Text style={styles.quickBadgeIcon}>{badge.icon}</Text>
              <Text style={styles.quickBadgeTitle}>{badge.title}</Text>
              <Text style={styles.quickBadgeSub}>{badge.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ========== PRODUCT SECTIONS ========== */}
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
                  <Text style={styles.viewAll}>View All Deals</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
                {products.slice(0, 8).map((p, i) => renderProductCard(p, i))}
              </ScrollView>
            </View>
          );
        })}

        {/* ========== SERVICES SECTION ========== */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesTag}>✨ Our Services</Text>
          <Text style={styles.servicesTitle}>Our Services</Text>
          <Text style={styles.servicesSub}>Learn and experience organic farming with us</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.servicesScroll}>
            {SERVICES.map((service, i) => (
              <View key={i} style={styles.serviceCard}>
                <Text style={styles.serviceTag}>{service.tag}</Text>
                <Text style={styles.serviceType}>{service.type}</Text>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDesc}>{service.description}</Text>
                <View style={styles.serviceBadges}>
                  {service.badges.map((b, j) => (
                    <View key={j} style={styles.serviceBadge}><Text style={styles.serviceBadgeText}>{b}</Text></View>
                  ))}
                </View>
                <TouchableOpacity style={styles.serviceBtn}>
                  <Text style={styles.serviceBtnText}>{service.button}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ========== WHY SK ORGANIC FARMS ========== */}
        <View style={styles.trustSection}>
          <Text style={styles.trustPreTitle}>Why SK Organic Farms?</Text>
          <Text style={styles.trustTitle}>Trusted by 10,000+ Gardeners</Text>
          <View style={styles.trustGrid}>
            {TRUST_BADGES.map((badge, i) => (
              <View key={i} style={styles.trustBadge}>
                <Text style={styles.trustEmoji}>{badge.emoji}</Text>
                <Text style={styles.trustBadgeTitle}>{badge.title}</Text>
                <Text style={styles.trustBadgeSub}>{badge.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ========== CUSTOMER REVIEWS ========== */}
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTag}>⭐ Customer Love</Text>
          <Text style={styles.reviewsTitle}>What Our Customers Say</Text>
          <Text style={styles.reviewsSub}>Real reviews from real gardeners</Text>
          
          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>"{REVIEWS[activeReview].text}"</Text>
            <View style={styles.reviewerRow}>
              <View style={styles.reviewerAvatar}>
                <Text style={styles.reviewerInitial}>{REVIEWS[activeReview].name[0]}</Text>
              </View>
              <View>
                <Text style={styles.reviewerName}>{REVIEWS[activeReview].name}</Text>
                <Text style={styles.reviewerLocation}>{REVIEWS[activeReview].location}</Text>
              </View>
              {REVIEWS[activeReview].verified && (
                <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓ Verified Buyer</Text></View>
              )}
            </View>
          </View>

          <View style={styles.reviewStats}>
            <View style={styles.reviewStat}>
              <Text style={styles.reviewStatNum}>4.8</Text>
              <Text style={styles.reviewStatLabel}>Average Rating</Text>
            </View>
            <View style={styles.reviewStat}>
              <Text style={styles.reviewStatNum}>10K+</Text>
              <Text style={styles.reviewStatLabel}>Happy Customers</Text>
            </View>
            <View style={styles.reviewStat}>
              <Text style={styles.reviewStatNum}>98%</Text>
              <Text style={styles.reviewStatLabel}>Recommend Us</Text>
            </View>
          </View>
        </View>

        {/* ========== FOOTER TRUST BADGES ========== */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.footerBadges}>
          {FOOTER_BADGES.map((badge, i) => (
            <View key={i} style={styles.footerBadge}>
              <Text style={styles.footerBadgeIcon}>{badge.icon}</Text>
              <Text style={styles.footerBadgeText}>{badge.text}</Text>
              <Text style={styles.footerBadgeSub}>{badge.sub}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ========== BRANDS ========== */}
        <View style={styles.brandsSection}>
          <Text style={styles.brandsTitle}>Brands We Carry</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandsScroll}>
            {BRAND_LOGOS.map((brand, i) => (
              <TouchableOpacity key={i} style={styles.brandItem} onPress={() => brand.link && navigateToCollection(brand.link)}>
                <Image source={{uri: brand.image}} style={styles.brandImg} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ========== BLOG SECTION ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 Gardening Tips</Text>
            <Text style={styles.sectionSubtitle}>Learn from our experts</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.blogScroll}>
            {BLOG_POSTS.map((post, i) => (
              <TouchableOpacity key={i} style={styles.blogCard}>
                <Image source={{uri: post.image}} style={styles.blogImg} resizeMode="cover" />
                <View style={styles.blogTag}><Text style={styles.blogTagText}>{post.tag}</Text></View>
                <Text style={styles.blogDate}>{post.date}</Text>
                <Text style={styles.blogTitle}>{post.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.readMoreBtn}>
            <Text style={styles.readMoreText}>Read More</Text>
          </TouchableOpacity>
        </View>

        {/* ========== LOCATIONS ========== */}
        <View style={styles.locationsSection}>
          <Text style={styles.locationsTag}>Our Locations</Text>
          <Text style={styles.locationsTitle}>Visit Us</Text>
          <Text style={styles.locationsSub}>Find us at our store or farm</Text>

          <View style={styles.locationCard}>
            <View style={styles.locationIcon}><Text style={styles.locationIconText}>🏪</Text><Text style={styles.locationIconLabel}>Retail Store</Text></View>
            <Text style={styles.locationName}>Chennai Store</Text>
            <Text style={styles.locationCompany}>Mahathi Biotech</Text>
            <Text style={styles.locationAddress}>Kalasathamman Koil St, Ramapuram, Chennai 600089</Text>
            <Text style={styles.locationPhone}>📞 6380464748</Text>
            <Text style={styles.locationHours}>⏰ Mon - Sun: 9:00 AM - 11:00 PM</Text>
            <TouchableOpacity style={styles.directionsBtn} onPress={() => Linking.openURL('https://maps.google.com/?q=Mahathi+Biotech+Chennai')}>
              <Text style={styles.directionsBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locationCard}>
            <View style={styles.locationIcon}><Text style={styles.locationIconText}>🌾</Text><Text style={styles.locationIconLabel}>Organic Farm</Text></View>
            <Text style={styles.locationName}>Organic Farm</Text>
            <Text style={styles.locationCompany}>SK Organic Farms</Text>
            <Text style={styles.locationAddress}>Melkothakuppam, Tamil Nadu 635805</Text>
            <Text style={styles.locationPhone}>📞 6380464748</Text>
            <Text style={styles.locationHours}>⏰ By Appointment Only</Text>
            <TouchableOpacity style={styles.directionsBtn} onPress={() => Linking.openURL('https://maps.google.com/?q=SK+Organic+Farms+Melkothakuppam')}>
              <Text style={styles.directionsBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========== NEWSLETTER ========== */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>Join Our Community 🌱</Text>
          <Text style={styles.newsletterSub}>Get gardening tips, exclusive offers & 10% off your first order!</Text>
          <View style={styles.newsletterForm}>
            <TextInput 
              style={styles.newsletterInput} 
              placeholder="Enter your e-mail" 
              placeholderTextColor="#888" 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.newsletterBtn}>
              <Text style={styles.newsletterBtnText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========== FOOTER ========== */}
        <View style={styles.footer}>
          <View style={styles.footerColumns}>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>Quick links</Text>
              <Text style={styles.footerLink}>Refund Policy</Text>
              <Text style={styles.footerLink}>Terms of Service</Text>
              <Text style={styles.footerLink}>Shipping Policy</Text>
              <Text style={styles.footerLink}>Privacy policy</Text>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>Info</Text>
              <Text style={styles.footerLink}>Profile</Text>
              <Text style={styles.footerLink}>Our Locations</Text>
              <Text style={styles.footerLink}>On Media</Text>
              <Text style={styles.footerLink}>Contact Us</Text>
              <Text style={styles.footerLink}>Track Your Order</Text>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>Need Help ?</Text>
              <Text style={styles.footerText}>Sales : +91-6380464748</Text>
              <Text style={styles.footerText}>Support : +91-6380464748</Text>
              <Text style={styles.footerText}>Mail : skofarms@gmail.com</Text>
            </View>
          </View>

          <View style={styles.footerSocial}>
            <TouchableOpacity style={styles.socialIcon} onPress={() => Linking.openURL(brand.social.facebook)}><Text>📘</Text></TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}><Text>𝕏</Text></TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} onPress={() => Linking.openURL(brand.social.instagram)}><Text>📸</Text></TouchableOpacity>
          </View>

          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>We Accept</Text>
            <View style={styles.paymentIcons}>
              <View style={styles.paymentIcon}><Text style={styles.paymentText}>RuPay</Text></View>
              <View style={styles.paymentIcon}><Text style={styles.paymentText}>UPI</Text></View>
              <View style={styles.paymentIcon}><Text style={styles.paymentText}>GPay</Text></View>
              <View style={styles.paymentIcon}><Text style={styles.paymentText}>Paytm</Text></View>
              <View style={styles.paymentIcon}><Text style={styles.paymentText}>NetBanking</Text></View>
            </View>
            <Text style={styles.securedBy}>Secured by Razorpay</Text>
          </View>

          <Text style={styles.copyright}>© 2025, Sunantha Organic Farms POS and Ecommerce by Shopify</Text>
        </View>
      </ScrollView>

      {/* Voice Search Modal */}
      <Modal visible={isListening} transparent animationType="fade">
        <View style={styles.voiceModal}>
          <View style={styles.voiceModalBox}>
            <Text style={styles.voiceModalTitle}>🎤 Listening...</Text>
            <Text style={styles.voiceModalText}>Say something like "organic seeds"</Text>
            <TouchableOpacity style={styles.voiceModalBtn} onPress={() => setIsListening(false)}>
              <Text style={styles.voiceModalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f8f8'},
  content: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'},
  loadingLogo: {width: 100, height: 100, marginBottom: 16},
  loadingText: {marginTop: 12, color: '#1da362', fontSize: 14},

  // Christmas Banner
  christmasBanner: {backgroundColor: '#c41e3a', paddingVertical: 8, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'},
  christmasText: {color: '#fff', fontSize: 12, textAlign: 'center'},
  christmasBold: {fontWeight: 'bold'},
  christmasCode: {backgroundColor: '#fff', color: '#c41e3a', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 3, fontWeight: 'bold', overflow: 'hidden'},
  christmasLink: {color: '#fff', fontWeight: 'bold', marginLeft: 8, textDecorationLine: 'underline'},
  christmasSaleBadge: {backgroundColor: '#228b22', paddingVertical: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  christmasSaleText: {color: '#fff', fontWeight: 'bold', fontSize: 13},
  christmasLights: {flexDirection: 'row', marginLeft: 8},
  lightRed: {marginHorizontal: 2},
  lightGreen: {marginHorizontal: 2},
  lightYellow: {marginHorizontal: 2},

  // Header
  header: {backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8},
  locationBar: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f9f9f9'},
  brandTitle: {fontSize: 14, fontWeight: 'bold', color: '#1da362'},
  locationRight: {flexDirection: 'row', alignItems: 'center'},
  locationIcon: {marginRight: 4},
  locationText: {fontSize: 11, color: '#666'},
  locationBold: {fontWeight: 'bold', color: '#333'},
  contactRow: {flexDirection: 'row', justifyContent: 'center', paddingVertical: 4, gap: 16},
  contactText: {fontSize: 10, color: '#666'},
  navScroll: {borderBottomWidth: 1, borderBottomColor: '#eee'},
  navItem: {paddingHorizontal: 12, paddingVertical: 8},
  navText: {fontSize: 12, color: '#333', fontWeight: '500'},
  searchContainer: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 8},
  searchWrap: {flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 6, paddingHorizontal: 8},
  searchIcon: {marginRight: 6},
  searchInput: {flex: 1, paddingVertical: 8, fontSize: 12},
  voiceSearchBtn: {flexDirection: 'row', alignItems: 'center', paddingLeft: 8, borderLeftWidth: 1, borderLeftColor: '#ddd'},
  voiceIcon: {marginRight: 4},
  voiceText: {fontSize: 10, color: '#1da362'},
  accountBtn: {alignItems: 'center', marginLeft: 12},
  accountIcon: {fontSize: 18},
  accountText: {fontSize: 9, color: '#666'},
  cartBtn: {alignItems: 'center', marginLeft: 12, position: 'relative'},
  cartIcon: {fontSize: 18},
  cartText: {fontSize: 9, color: '#666'},
  cartBadge: {position: 'absolute', top: -4, right: -4, backgroundColor: '#1da362', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center'},
  cartBadgeText: {color: '#fff', fontSize: 8, fontWeight: 'bold'},
  cartAmount: {fontSize: 9, color: '#1da362', fontWeight: 'bold'},

  // Search Results
  searchResults: {position: 'absolute', top: 140, left: 12, right: 12, backgroundColor: '#fff', borderRadius: 8, elevation: 5, zIndex: 100, maxHeight: 300},
  searchItem: {flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  searchItemImg: {width: 40, height: 40, borderRadius: 4},
  searchItemInfo: {flex: 1, marginLeft: 10, justifyContent: 'center'},
  searchItemTitle: {fontSize: 12, color: '#333'},
  searchItemPrice: {fontSize: 13, color: '#1da362', fontWeight: 'bold'},

  // Hero Section
  heroSection: {height: 220, position: 'relative'},
  heroSlide: {width: width, height: 220},
  heroImage: {width: '100%', height: '100%'},
  heroOverlay: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.4)'},
  heroBadge: {backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginBottom: 4},
  heroBadgeText: {color: '#fff', fontSize: 10, fontWeight: '500'},
  heroTitle: {fontSize: 22, fontWeight: 'bold', color: '#fff'},
  heroSubtitle: {fontSize: 11, color: '#fff', marginTop: 2},
  heroBtn: {backgroundColor: '#1da362', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 10},
  heroBtnText: {color: '#fff', fontSize: 12, fontWeight: '600'},
  heroDots: {position: 'absolute', bottom: 8, alignSelf: 'center', flexDirection: 'row'},
  heroDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3},
  heroDotActive: {backgroundColor: '#fff', width: 20},

  // Flash Sale
  flashSale: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff8e1', padding: 12, marginHorizontal: 16, marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ffd54f'},
  flashIcon: {fontSize: 24, marginRight: 8},
  flashInfo: {flex: 1},
  flashTitle: {fontSize: 14, fontWeight: 'bold', color: '#333'},
  flashSub: {fontSize: 10, color: '#666'},
  flashCountdown: {flexDirection: 'row', marginRight: 8},
  countdownBox: {backgroundColor: '#333', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginHorizontal: 2, alignItems: 'center'},
  countdownNum: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
  countdownLabel: {color: '#aaa', fontSize: 8},
  flashBtn: {backgroundColor: '#1da362', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16},
  flashBtnText: {color: '#fff', fontSize: 10, fontWeight: '600'},

  // Sections
  section: {backgroundColor: '#fff', marginTop: 12, paddingVertical: 12},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 12},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  sectionSubtitle: {fontSize: 11, color: '#888', marginTop: 2},
  seeAll: {fontSize: 12, color: '#1da362', fontWeight: '500'},
  viewAll: {fontSize: 11, color: '#1da362', fontWeight: '500'},

  // Categories
  categoryScroll: {paddingHorizontal: 12},
  categoryItem: {alignItems: 'center', marginHorizontal: 8, width: 60},
  categoryCircle: {width: 50, height: 50, borderRadius: 25, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center'},
  categoryEmoji: {fontSize: 22},
  categoryName: {fontSize: 10, color: '#333', marginTop: 4, textAlign: 'center'},

  // Quick Badges
  quickBadges: {marginTop: 12, paddingHorizontal: 12},
  quickBadge: {backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginRight: 10, borderWidth: 1, borderColor: '#eee', flexDirection: 'row', alignItems: 'center'},
  quickBadgeIcon: {fontSize: 16, marginRight: 8},
  quickBadgeTitle: {fontSize: 12, fontWeight: 'bold', color: '#333'},
  quickBadgeSub: {fontSize: 10, color: '#888', marginLeft: 4},

  // Products
  productsScroll: {paddingHorizontal: 12},
  productCard: {width: 150, backgroundColor: '#fff', borderRadius: 8, marginRight: 12, borderWidth: 1, borderColor: '#eee', overflow: 'hidden'},
  productImageWrap: {width: '100%', height: 120, backgroundColor: '#f9f9f9', position: 'relative'},
  productImage: {width: '100%', height: '100%'},
  saleBadge: {position: 'absolute', top: 8, left: 8, backgroundColor: '#ff5722', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 3},
  saleBadgeText: {color: '#fff', fontSize: 9, fontWeight: 'bold'},
  optionsBtn: {position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4},
  optionsBtnText: {fontSize: 9, color: '#333'},
  quickViewBtn: {position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', paddingVertical: 6, alignItems: 'center'},
  quickViewText: {color: '#fff', fontSize: 10, fontWeight: '500'},
  productInfo: {padding: 10},
  productTitle: {fontSize: 12, color: '#333', height: 32, lineHeight: 16},
  priceLabel: {fontSize: 9, color: '#888', marginTop: 4},
  priceRow: {flexDirection: 'row', alignItems: 'center'},
  productPrice: {fontSize: 13, fontWeight: 'bold', color: '#1da362'},
  comparePrice: {fontSize: 11, color: '#999', marginLeft: 4},

  // Product Card with ADD button
  productCardAdd: {width: 130, backgroundColor: '#fff', borderRadius: 8, marginRight: 10, padding: 8, borderWidth: 1, borderColor: '#eee'},
  productImageWrapAdd: {width: '100%', height: 100, backgroundColor: '#f9f9f9', borderRadius: 6, overflow: 'hidden', position: 'relative'},
  productImageAdd: {width: '100%', height: '100%'},
  discountBadge: {position: 'absolute', top: 4, left: 4, backgroundColor: '#e53935', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2},
  discountText: {color: '#fff', fontSize: 8, fontWeight: 'bold'},
  productTitleAdd: {fontSize: 11, color: '#333', marginTop: 6, height: 28},
  priceRowAdd: {flexDirection: 'row', alignItems: 'center', marginTop: 2},
  comparePriceAdd: {fontSize: 10, color: '#999', textDecorationLine: 'line-through', marginRight: 4},
  productPriceAdd: {fontSize: 12, fontWeight: 'bold', color: '#1da362'},
  addBtn: {backgroundColor: '#fff', borderWidth: 1, borderColor: '#1da362', paddingVertical: 6, borderRadius: 6, alignItems: 'center', marginTop: 8},
  addBtnText: {color: '#1da362', fontSize: 11, fontWeight: 'bold'},

  // Services
  servicesSection: {backgroundColor: '#f0fdf4', paddingVertical: 20, marginTop: 12},
  servicesTag: {textAlign: 'center', fontSize: 12, color: '#1da362', marginBottom: 4},
  servicesTitle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#333'},
  servicesSub: {textAlign: 'center', fontSize: 12, color: '#666', marginBottom: 16},
  servicesScroll: {paddingHorizontal: 16},
  serviceCard: {width: 280, backgroundColor: '#fff', borderRadius: 12, padding: 16, marginRight: 12, borderWidth: 1, borderColor: '#e0e0e0'},
  serviceTag: {fontSize: 10, color: '#1da362', fontWeight: '600'},
  serviceType: {fontSize: 9, color: '#888', marginTop: 2},
  serviceTitle: {fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 8},
  serviceDesc: {fontSize: 11, color: '#666', lineHeight: 16, marginTop: 6},
  serviceBadges: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6},
  serviceBadge: {backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12},
  serviceBadgeText: {fontSize: 9, color: '#333'},
  serviceBtn: {backgroundColor: '#1da362', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginTop: 12},
  serviceBtnText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  // Trust Section
  trustSection: {backgroundColor: '#fff', paddingVertical: 24, marginTop: 12},
  trustPreTitle: {textAlign: 'center', fontSize: 11, color: '#888', marginBottom: 4},
  trustTitle: {textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16},
  trustGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16},
  trustBadge: {width: '50%', alignItems: 'center', paddingVertical: 12},
  trustEmoji: {fontSize: 28, marginBottom: 6},
  trustBadgeTitle: {fontSize: 13, fontWeight: 'bold', color: '#333'},
  trustBadgeSub: {fontSize: 10, color: '#666', textAlign: 'center', paddingHorizontal: 8},

  // Reviews Section
  reviewsSection: {backgroundColor: '#fefce8', paddingVertical: 24, marginTop: 12},
  reviewsTag: {textAlign: 'center', fontSize: 12, color: '#ca8a04', marginBottom: 4},
  reviewsTitle: {textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#333'},
  reviewsSub: {textAlign: 'center', fontSize: 12, color: '#666', marginBottom: 16},
  reviewCard: {backgroundColor: '#fff', marginHorizontal: 16, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e5e5'},
  reviewText: {fontSize: 13, color: '#333', fontStyle: 'italic', lineHeight: 20},
  reviewerRow: {flexDirection: 'row', alignItems: 'center', marginTop: 12},
  reviewerAvatar: {width: 36, height: 36, borderRadius: 18, backgroundColor: '#1da362', justifyContent: 'center', alignItems: 'center', marginRight: 10},
  reviewerInitial: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  reviewerName: {fontSize: 13, fontWeight: 'bold', color: '#333'},
  reviewerLocation: {fontSize: 10, color: '#888'},
  verifiedBadge: {marginLeft: 'auto', backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10},
  verifiedText: {fontSize: 9, color: '#1da362', fontWeight: '500'},
  reviewStats: {flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingHorizontal: 16},
  reviewStat: {alignItems: 'center'},
  reviewStatNum: {fontSize: 22, fontWeight: 'bold', color: '#333'},
  reviewStatLabel: {fontSize: 10, color: '#888'},

  // Footer Badges
  footerBadges: {marginTop: 12, paddingVertical: 16, backgroundColor: '#fff'},
  footerBadge: {alignItems: 'center', paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: '#eee'},
  footerBadgeIcon: {fontSize: 20, marginBottom: 4},
  footerBadgeText: {fontSize: 11, fontWeight: 'bold', color: '#333'},
  footerBadgeSub: {fontSize: 9, color: '#888'},

  // Brands
  brandsSection: {backgroundColor: '#fff', paddingVertical: 16, marginTop: 12},
  brandsTitle: {fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 12},
  brandsScroll: {paddingHorizontal: 16},
  brandItem: {width: 80, height: 60, marginRight: 12, backgroundColor: '#f9f9f9', borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center'},
  brandImg: {width: '80%', height: '80%'},

  // Blog
  blogScroll: {paddingHorizontal: 16},
  blogCard: {width: 200, backgroundColor: '#fff', borderRadius: 8, marginRight: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#eee'},
  blogImg: {width: '100%', height: 100},
  blogTag: {position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4},
  blogTagText: {color: '#fff', fontSize: 8},
  blogDate: {fontSize: 9, color: '#888', padding: 8, paddingBottom: 2},
  blogTitle: {fontSize: 12, fontWeight: '500', color: '#333', paddingHorizontal: 8, paddingBottom: 8},
  readMoreBtn: {alignSelf: 'center', marginTop: 12},
  readMoreText: {fontSize: 12, color: '#1da362', fontWeight: '500'},

  // Locations
  locationsSection: {backgroundColor: '#f8f8f8', paddingVertical: 24, marginTop: 12},
  locationsTag: {textAlign: 'center', fontSize: 10, color: '#888', marginBottom: 4},
  locationsTitle: {textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#333'},
  locationsSub: {textAlign: 'center', fontSize: 12, color: '#666', marginBottom: 16},
  locationCard: {backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e5e5'},
  locationIcon: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  locationIconText: {fontSize: 18, marginRight: 6},
  locationIconLabel: {fontSize: 10, color: '#888'},
  locationName: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  locationCompany: {fontSize: 12, fontWeight: '500', color: '#1da362', marginTop: 2},
  locationAddress: {fontSize: 11, color: '#666', marginTop: 4},
  locationPhone: {fontSize: 11, color: '#333', marginTop: 4},
  locationHours: {fontSize: 10, color: '#888', marginTop: 2},
  directionsBtn: {backgroundColor: '#1da362', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginTop: 12},
  directionsBtnText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  // Newsletter
  newsletterSection: {backgroundColor: '#1da362', paddingVertical: 24, paddingHorizontal: 16, marginTop: 12},
  newsletterTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center'},
  newsletterSub: {fontSize: 12, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 4},
  newsletterForm: {flexDirection: 'row', marginTop: 16},
  newsletterInput: {flex: 1, backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, fontSize: 12},
  newsletterBtn: {backgroundColor: '#163340', paddingHorizontal: 20, borderRadius: 6, justifyContent: 'center', marginLeft: 8},
  newsletterBtnText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  // Footer
  footer: {backgroundColor: '#163340', paddingVertical: 24, paddingHorizontal: 16},
  footerColumns: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20},
  footerCol: {flex: 1},
  footerColTitle: {fontSize: 12, fontWeight: 'bold', color: '#fff', marginBottom: 8},
  footerLink: {fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 4},
  footerText: {fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 2},
  footerSocial: {flexDirection: 'row', justifyContent: 'center', marginBottom: 16},
  socialIcon: {width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginHorizontal: 6},
  paymentSection: {alignItems: 'center', marginBottom: 16},
  paymentTitle: {fontSize: 10, color: '#888', marginBottom: 8},
  paymentIcons: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
  paymentIcon: {backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginHorizontal: 2, marginBottom: 4},
  paymentText: {fontSize: 9, color: '#333'},
  securedBy: {fontSize: 9, color: '#888', marginTop: 4},
  copyright: {fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'center'},

  // Voice Modal
  voiceModal: {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center'},
  voiceModalBox: {backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: width * 0.8},
  voiceModalTitle: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  voiceModalText: {fontSize: 12, color: '#666', marginTop: 12, textAlign: 'center'},
  voiceModalBtn: {backgroundColor: '#f0f0f0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 16},
  voiceModalBtnText: {color: '#666', fontWeight: '600'},
});

export default HomeScreen;
