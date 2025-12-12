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
  Animated,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {colors, brand, specialSections, newsletter} from '../constants/theme';
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

const {width, height} = Dimensions.get('window');

// Shopify Files CDN Base URL
const FILES_CDN = 'https://cdn.shopify.com/s/files/1/0551/4417/files';

// Hero slides from theme
const HERO_SLIDES = [
  {
    image: `${FILES_CDN}/IMG_2100.png`,
    title: 'Garden Setup',
    subtitle: 'Shade House and Vegetable & Herbal Garden Setup',
    buttonText: 'View All Products',
    link: 'hdpe-grow-bags',
  },
  {
    image: `${FILES_CDN}/IMG_2099.png`,
    title: 'Native Organic Seeds',
    subtitle: 'Vegetable, Flower, Tree, Fruit & Herbal Seeds',
    buttonText: 'View all products',
    link: 'seeds',
  },
  {
    image: `${FILES_CDN}/IMG_2101.png`,
    title: 'Garden Tools',
    subtitle: 'Shade House and Vegetable & Herbal Garden Setup',
    buttonText: 'View all products',
    link: 'garden-tools-1',
  },
];

// Blinkit-style collection categories with images
const BLINKIT_CATEGORIES = [
  {handle: 'organic-manures', title: 'Organic Manures', image: `${FILES_CDN}/IMG-2096.png`, emoji: '🌱'},
  {handle: 'organic-seeds', title: 'Organic Seeds', image: `${FILES_CDN}/IMG-2091.png`, emoji: '🌾'},
  {handle: 'organic-millets-rice', title: 'Millets & Rice', image: `${FILES_CDN}/best_seller.jpg`, emoji: '🍚'},
  {handle: 'falcon-1', title: 'Garden Tools', image: `${FILES_CDN}/falcon.jpg`, emoji: '🔧'},
  {handle: 'grow-bags-for-terrace-garden', title: 'Grow Bags', image: `${FILES_CDN}/IMG-2104.png`, emoji: '🛍️'},
  {handle: 'skin-and-hair-care', title: 'Skin & Hair', image: `${FILES_CDN}/4786E3F2-BDCD-484D-9274-66DE8A5A4834.webp`, emoji: '✨'},
  {handle: 'sea-weed-products', title: 'Sea Weed', image: `${FILES_CDN}/SEAWEED.jpg`, emoji: '🌊'},
  {handle: 'our-packages', title: 'Our Packages', image: `${FILES_CDN}/IMG-2097.png`, emoji: '📦'},
  {handle: 'potting-medium', title: 'Potting Soil', image: `${FILES_CDN}/IMG-2090.png`, emoji: '🪴'},
  {handle: 'garden-sprayer', title: 'Sprayers', image: `${FILES_CDN}/3110-05.jpg`, emoji: '💦'},
  {handle: 'live-plants', title: 'Live Plants', image: `${FILES_CDN}/LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg`, emoji: '🌺'},
  {handle: 'biocarve', title: 'BioCarve', image: `${FILES_CDN}/biocurve.jpg`, emoji: '🌻'},
];

// Featured collection configs
const FEATURED_SECTIONS = [
  {handle: 'organic-seeds', title: 'Native Organic Seeds', image: `${FILES_CDN}/stock-photo-the-colors-of-a-beautiful-indian-flag-are-made-of-pulses-1164063082.jpg`},
  {handle: 'justbrews', title: 'JustBrews', subtitle: 'Coffee & Tea', image: `${FILES_CDN}/JustBrew_logo.png`},
  {handle: 'grow-bags-for-terrace-garden', title: 'Grow Bags', image: `${FILES_CDN}/grow_bag.jpg`},
  {handle: 'daily-deals', title: 'Daily Deals', image: `${FILES_CDN}/daily.png`},
  {handle: 'sea-weed-products', title: 'Sea Weed Products', image: `${FILES_CDN}/SEAWEED.jpg`},
  {handle: 'skin-and-hair-care', title: 'Skin & Hair Care', image: `${FILES_CDN}/3768956F-918C-42DE-9EDF-1239F6B0C815.jpg`},
  {handle: 'live-plants', title: 'Live Plants', image: `${FILES_CDN}/banana-tissue-plants_f17c24d9-5bfe-4c59-8076-05fc51242b40.jpg`},
  {handle: 'biocarve', title: 'BioCarve Seeds', image: `${FILES_CDN}/biocurve.jpg`},
  {handle: 'organic-millets-rice', title: 'Rice & Millets', image: `${FILES_CDN}/best_seller.jpg`},
  {handle: 'falcon-1', title: 'Garden Tools', image: `${FILES_CDN}/falcon.jpg`},
];

// Brand logos
const BRAND_LOGOS = [
  {name: 'Falcon', image: `${FILES_CDN}/falcon.jpg`, link: 'falcon-1'},
  {name: 'SKOF', image: `${FILES_CDN}/SKOF_new_logo_tm_9b6a7846-af4e-4def-ac18-8b7165eaf2b9.jpg`, link: ''},
  {name: 'Bellota', image: `${FILES_CDN}/bellota_logo.jpg`, link: 'bellota'},
  {name: 'EPLA', image: `${FILES_CDN}/EPLA-logo_802a7aba-6c86-4917-a3f7-6d457d52659c.jpeg`, link: ''},
  {name: 'BioCarve', image: `${FILES_CDN}/biocurve.jpg`, link: 'biocarve'},
];

// Gallery images
const GALLERY_IMAGES = [
  `${FILES_CDN}/SPIRU9.jpg`,
  `${FILES_CDN}/IMG-2097.png`,
  `${FILES_CDN}/DSC_0253.JPG`,
  `${FILES_CDN}/DSC_0192.JPG`,
  `${FILES_CDN}/IMG_1355.JPG`,
  `${FILES_CDN}/IMG-2097.png`,
];

// Logo
const LOGO_IMAGE = `${FILES_CDN}/LogoColorTextBelow_3223832e-681f-41c8-9347-b0f342a6384a.jpg`;

const HomeScreen = ({navigation}: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<{[key: string]: ShopifyProduct[]}>({});
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<ShopifyProduct[]>([]);
  const [cartCount, setCartCount] = useState(3);
  
  // Christmas snow animation
  const snowflakes = Array.from({length: 20}, (_, i) => ({
    id: i,
    left: Math.random() * width,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 8 + Math.random() * 12,
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allCollections = await fetchCollections();
      setCollections(allCollections);

      const productsMap: {[key: string]: ShopifyProduct[]} = {};
      for (const section of FEATURED_SECTIONS) {
        const products = await fetchCollectionProducts(section.handle, 10);
        if (products.length > 0) {
          productsMap[section.handle] = products;
        }
      }
      setFeaturedProducts(productsMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      // Filter products for predictive search
      const allProducts = Object.values(featuredProducts).flat();
      const results = allProducts.filter(p => 
        p.title.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [featuredProducts]);

  const startVoiceSearch = async () => {
    setIsListening(true);
    // Voice search would use @react-native-voice/voice
    // For now, show visual feedback
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('organic seeds'); // Simulated voice result
      handleSearch('organic seeds');
    }, 2000);
  };

  const navigateToProduct = (product: ShopifyProduct) => {
    // Add to recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
    
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={{uri: LOGO_IMAGE}} style={styles.loadingLogo} resizeMode="contain" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Sunantha Organic Farms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Christmas Snow Effect */}
      <View style={styles.snowContainer} pointerEvents="none">
        {snowflakes.map(flake => (
          <Animated.Text
            key={flake.id}
            style={[
              styles.snowflake,
              {
                left: flake.left,
                fontSize: flake.size,
                animationDelay: `${flake.delay}s`,
                animationDuration: `${flake.duration}s`,
              },
            ]}>
            ❄️
          </Animated.Text>
        ))}
      </View>

      {/* Announcement Bar - Christmas Theme */}
      <View style={styles.announcementBar}>
        <Text style={styles.announcementText}>
          🎄 Christmas Sale! Use code XMAS25 for 25% OFF 🎅
        </Text>
      </View>

      {/* Header with Voice Search */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.headerLogo}>
            <Image source={{uri: LOGO_IMAGE}} style={styles.logoImage} resizeMode="contain" />
            <View>
              <Text style={styles.brandName}>Sunantha</Text>
              <Text style={styles.brandSubName}>Organic Farms</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cartIcon}>🛒</Text>
            {cartCount > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
        
        {/* Contact Bar */}
        <View style={styles.contactBar}>
          <Text style={styles.contactText}>📧 {brand.email}</Text>
          <Text style={styles.contactText}>📞 {brand.phone}</Text>
        </View>
        
        {/* Search Bar with Voice Search */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for seeds, tools, plants..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setShowSearch(true)}
          />
          {/* Voice Search Button */}
          <TouchableOpacity 
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
            onPress={startVoiceSearch}>
            <Text style={styles.voiceIcon}>{isListening ? '🔴' : '🎤'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Predictive Search Results */}
        {searchResults.length > 0 && showSearch ? (
          <View style={styles.searchResults}>
            {searchResults.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.searchResultItem}
                onPress={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                  setSearchResults([]);
                  navigateToProduct(product);
                }}>
                <Image source={{uri: getProductImage(product)}} style={styles.searchResultImage} />
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultTitle} numberOfLines={1}>{product.title}</Text>
                  <Text style={styles.searchResultPrice}>₹{getProductPrice(product)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Slideshow */}
        <View style={styles.sliderContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveSlide(index);
            }}>
            {HERO_SLIDES.map((slide, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.slideItem}
                activeOpacity={0.9}
                onPress={() => navigateToCollection(slide.link)}>
                <Image source={{uri: slide.image}} style={styles.slideImage} resizeMode="cover" />
                <View style={styles.slideOverlay}>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
                  <View style={styles.slideButton}>
                    <Text style={styles.slideButtonText}>{slide.buttonText}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {HERO_SLIDES.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, index === activeSlide && styles.paginationDotActive]}
              />
            ))}
          </View>
        </View>

        {/* Holiday Promo Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoEmoji}>🎄</Text>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Holiday Special!</Text>
            <Text style={styles.promoText}>Use code AADI15 for 15% OFF</Text>
          </View>
          <Text style={styles.promoEmoji}>🎅</Text>
        </View>

        {/* Blinkit-style Category Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
            <Text style={styles.viewAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryGrid}>
          {BLINKIT_CATEGORIES.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryGridItem}
              onPress={() => navigateToCollection(cat.handle)}>
              <View style={styles.categoryImageWrapper}>
                <Image source={{uri: cat.image}} style={styles.categoryGridImage} resizeMode="cover" />
              </View>
              <Text style={styles.categoryGridName} numberOfLines={2}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* About Us */}
        <View style={styles.aboutSection}>
          <Image source={{uri: LOGO_IMAGE}} style={styles.aboutLogo} resizeMode="contain" />
          <Text style={styles.aboutTitle}>About Us</Text>
          <Text style={styles.aboutPrevName}>Previously known as SK Organic Farms</Text>
          <Text style={styles.aboutText}>
            Sunantha Organic Farm promotes organic living with quality products, expert guidance, and sustainable practices.
          </Text>
        </View>

        {/* Recently Viewed (Browsing History) */}
        {recentlyViewed.length > 0 ? (
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🕐 Recently Viewed</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsRow}>
              {recentlyViewed.map((product) => renderProductCard(product, navigateToProduct))}
            </ScrollView>
          </View>
        ) : null}

        {/* Featured Collection Sections */}
        {FEATURED_SECTIONS.map((section) => {
          const products = featuredProducts[section.handle];
          if (!products || products.length === 0) return null;

          return (
            <View key={section.handle} style={styles.featuredSection}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.subtitle ? <Text style={styles.sectionSubtitle}>{section.subtitle}</Text> : null}
                </View>
                <TouchableOpacity onPress={() => navigateToCollection(section.handle)}>
                  <Text style={styles.viewAllText}>View All →</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsRow}>
                {/* Collection Banner */}
                <TouchableOpacity 
                  style={styles.bannerCard}
                  onPress={() => navigateToCollection(section.handle)}>
                  <Image source={{uri: section.image}} style={styles.bannerImage} resizeMode="cover" />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>{section.title}</Text>
                    <Text style={styles.bannerSubtitle}>Shop All →</Text>
                  </View>
                </TouchableOpacity>

                {/* Products */}
                {products.slice(0, 6).map((product) => renderProductCard(product, navigateToProduct))}
              </ScrollView>
            </View>
          );
        })}

        {/* Farm Visit */}
        <TouchableOpacity 
          style={styles.farmVisitSection}
          onPress={() => Linking.openURL('tel:' + brand.phone)}>
          <Image source={{uri: `${FILES_CDN}/DSC_0253.JPG`}} style={styles.farmVisitImage} resizeMode="cover" />
          <View style={styles.farmVisitContent}>
            <Text style={styles.farmVisitTitle}>🌾 Farm Visit</Text>
            <Text style={styles.farmVisitDesc}>
              Visit our organic farm and learn traditional farming methods!
            </Text>
            <View style={styles.farmVisitButton}>
              <Text style={styles.farmVisitButtonText}>Book Now</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Gallery */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📸 Gallery</Text>
        </View>
        <View style={styles.galleryGrid}>
          {GALLERY_IMAGES.map((img, index) => (
            <TouchableOpacity key={index} style={styles.galleryItem}>
              <Image source={{uri: img}} style={styles.galleryImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Video Section */}
        <TouchableOpacity 
          style={styles.videoSection} 
          onPress={() => Linking.openURL(specialSections.videoSection.videoUrl)}>
          <View style={styles.videoPlayButton}>
            <Text style={styles.videoPlayIcon}>▶</Text>
          </View>
          <Text style={styles.videoTitle}>Interview SOF Director</Text>
          <Text style={styles.videoSubtitle}>How to identify fake organic products</Text>
        </TouchableOpacity>

        {/* Spirulina Training */}
        <View style={styles.spirulinaSection}>
          <Image source={{uri: `${FILES_CDN}/DSC_0237.JPG`}} style={styles.spirulinaImage} resizeMode="cover" />
          <View style={styles.spirulinaContent}>
            <Text style={styles.spirulinaTitle}>🌿 Spirulina Training</Text>
            <Text style={styles.spirulinaDesc}>
              World class solution for spirulina cultivation with expert support.
            </Text>
            <TouchableOpacity style={styles.spirulinaButton}>
              <Text style={styles.spirulinaButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Brands */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏷️ Our Brands</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandsContainer}>
          {BRAND_LOGOS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.brandCard}
              onPress={() => item.link && navigateToCollection(item.link)}>
              <Image source={{uri: item.image}} style={styles.brandLogo} resizeMode="contain" />
              <Text style={styles.brandName2}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Maps */}
        <View style={styles.mapSection}>
          <Image source={{uri: `${FILES_CDN}/holding-compass-up.jpg`}} style={styles.mapImage} resizeMode="cover" />
          <View style={styles.mapInfo}>
            <Text style={styles.mapTitle}>📍 Chennai Shop</Text>
            <Text style={styles.mapAddress}>{brand.locations.chennaiShop.address}</Text>
            <TouchableOpacity 
              style={styles.directionsButton} 
              onPress={() => Linking.openURL(`https://maps.google.com/?q=Mahathi+Biotech+Chennai`)}>
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mapSection}>
          <Image source={{uri: `${FILES_CDN}/open-compass-on-world-map.jpg`}} style={styles.mapImage} resizeMode="cover" />
          <View style={styles.mapInfo}>
            <Text style={styles.mapTitle}>📍 Our Farm</Text>
            <Text style={styles.mapAddress}>{brand.locations.farm.address}</Text>
            <TouchableOpacity 
              style={styles.directionsButton} 
              onPress={() => Linking.openURL(`https://maps.google.com/?q=SK+Organic+Farms+Melkothakuppam`)}>
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Newsletter */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>📬 {newsletter.heading}</Text>
          <Text style={styles.newsletterSubtitle}>{newsletter.subheading}</Text>
          <View style={styles.newsletterForm}>
            <TextInput
              style={styles.newsletterInput}
              placeholder="Enter your email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.newsletterButton}>
              <Text style={styles.newsletterButtonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Image source={{uri: LOGO_IMAGE}} style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerBrand}>Sunantha Organic Farms</Text>
          <Text style={styles.footerTagline}>Promoting Organic Living 🌿</Text>
          <Text style={styles.footerContact}>📧 {brand.email}</Text>
          <Text style={styles.footerContact}>📞 {brand.phone}</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(brand.social.facebook)}>
              <Text style={styles.socialIcon}>📘</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(brand.social.instagram)}>
              <Text style={styles.socialIcon}>📸</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(brand.social.youtube)}>
              <Text style={styles.socialIcon}>📺</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerPayment}>We Accept: Razorpay • UPI • Cards • Net Banking</Text>
          <Text style={styles.footerCopyright}>© 2024 Sunantha Organic Farms. All rights reserved.</Text>
        </View>
      </ScrollView>

      {/* Voice Search Modal */}
      <Modal visible={isListening} transparent animationType="fade">
        <View style={styles.voiceModal}>
          <View style={styles.voiceModalContent}>
            <Text style={styles.voiceModalTitle}>🎤 Listening...</Text>
            <View style={styles.voiceWaves}>
              <View style={[styles.voiceWave, {height: 20}]} />
              <View style={[styles.voiceWave, {height: 35}]} />
              <View style={[styles.voiceWave, {height: 50}]} />
              <View style={[styles.voiceWave, {height: 35}]} />
              <View style={[styles.voiceWave, {height: 20}]} />
            </View>
            <Text style={styles.voiceModalText}>Say something like "organic seeds" or "grow bags"</Text>
            <TouchableOpacity style={styles.voiceModalButton} onPress={() => setIsListening(false)}>
              <Text style={styles.voiceModalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Product Card Component
const renderProductCard = (product: ShopifyProduct, onPress: (p: ShopifyProduct) => void) => {
  const price = getProductPrice(product);
  const compareAtPrice = getCompareAtPrice(product);
  const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;
  const hasVariants = product.variants && product.variants.length > 1;

  return (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => onPress(product)}>
      <View style={styles.productImageContainer}>
        <Image source={{uri: getProductImage(product)}} style={styles.productImage} resizeMode="cover" />
        {discount > 0 ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        ) : null}
        {hasVariants ? (
          <View style={styles.variantBadge}>
            <Text style={styles.variantText}>{product.variants?.length} options</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>₹{price}</Text>
          {compareAtPrice ? <Text style={styles.comparePrice}>₹{compareAtPrice}</Text> : null}
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  content: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'},
  loadingLogo: {width: 120, height: 120, marginBottom: 20},
  loadingText: {marginTop: 16, fontSize: 16, color: colors.primary, fontWeight: '500'},

  // Snow Effect
  snowContainer: {position: 'absolute', top: 0, left: 0, right: 0, height: 200, zIndex: 100, overflow: 'hidden'},
  snowflake: {position: 'absolute', top: -20, color: '#fff', opacity: 0.8},

  // Announcement Bar
  announcementBar: {backgroundColor: '#c41e3a', paddingVertical: 8, paddingHorizontal: 16},
  announcementText: {color: '#fff', fontSize: 13, textAlign: 'center', fontWeight: '600'},
  
  // Header
  header: {backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee'},
  headerTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10},
  menuIcon: {fontSize: 24, color: colors.primary},
  headerLogo: {flexDirection: 'row', alignItems: 'center'},
  logoImage: {width: 40, height: 40, marginRight: 8},
  brandName: {fontSize: 16, fontWeight: 'bold', color: colors.primary},
  brandSubName: {fontSize: 11, color: '#666'},
  cartButton: {position: 'relative', padding: 4},
  cartIcon: {fontSize: 24},
  cartBadge: {position: 'absolute', top: -2, right: -2, backgroundColor: '#c41e3a', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center'},
  cartBadgeText: {color: '#fff', fontSize: 10, fontWeight: 'bold'},
  contactBar: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6, backgroundColor: colors.primary},
  contactText: {color: '#fff', fontSize: 11},
  
  // Search Bar with Voice
  searchBar: {flexDirection: 'row', marginHorizontal: 12, marginVertical: 10, backgroundColor: '#f0f0f0', borderRadius: 8, overflow: 'hidden'},
  searchInput: {flex: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#333'},
  voiceButton: {padding: 10, justifyContent: 'center', alignItems: 'center'},
  voiceButtonActive: {backgroundColor: '#ffe0e0'},
  voiceIcon: {fontSize: 18},
  searchButton: {padding: 10, backgroundColor: colors.primary},
  searchIcon: {fontSize: 16},

  // Search Results
  searchResults: {position: 'absolute', top: 130, left: 12, right: 12, backgroundColor: '#fff', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4, maxHeight: 300, zIndex: 1000},
  searchResultItem: {flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  searchResultImage: {width: 50, height: 50, borderRadius: 6},
  searchResultInfo: {flex: 1, marginLeft: 10, justifyContent: 'center'},
  searchResultTitle: {fontSize: 13, color: '#333', fontWeight: '500'},
  searchResultPrice: {fontSize: 14, color: colors.primary, fontWeight: 'bold', marginTop: 2},

  // Hero Slideshow
  sliderContainer: {height: 200, position: 'relative'},
  slideItem: {width: width, height: 200},
  slideImage: {width: '100%', height: '100%'},
  slideOverlay: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.4)'},
  slideTitle: {fontSize: 22, fontWeight: 'bold', color: '#fff'},
  slideSubtitle: {fontSize: 13, color: '#fff', marginTop: 4},
  slideButton: {backgroundColor: colors.primary, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 10},
  slideButtonText: {color: '#fff', fontWeight: '600', fontSize: 12},
  pagination: {position: 'absolute', bottom: 8, alignSelf: 'center', flexDirection: 'row'},
  paginationDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3},
  paginationDotActive: {backgroundColor: '#fff', width: 20},

  // Promo Banner
  promoBanner: {flexDirection: 'row', backgroundColor: '#c41e3a', padding: 12, alignItems: 'center', justifyContent: 'center'},
  promoEmoji: {fontSize: 24},
  promoContent: {marginHorizontal: 12, alignItems: 'center'},
  promoTitle: {fontSize: 15, fontWeight: 'bold', color: '#fff'},
  promoText: {fontSize: 12, color: '#fff'},

  // Category Grid (Blinkit style)
  categoryGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, backgroundColor: '#fff', paddingBottom: 12},
  categoryGridItem: {width: (width - 16) / 4, alignItems: 'center', paddingVertical: 10},
  categoryImageWrapper: {width: 60, height: 60, borderRadius: 30, overflow: 'hidden', borderWidth: 2, borderColor: colors.primary, backgroundColor: '#f9f9f9'},
  categoryGridImage: {width: '100%', height: '100%'},
  categoryGridName: {fontSize: 10, color: '#333', textAlign: 'center', marginTop: 4, fontWeight: '500', paddingHorizontal: 2},

  // Section Header
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, backgroundColor: '#fff'},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  sectionSubtitle: {fontSize: 12, color: '#888'},
  viewAllText: {fontSize: 13, color: colors.primary, fontWeight: '500'},

  // About
  aboutSection: {padding: 16, backgroundColor: '#fff', marginTop: 8, alignItems: 'center'},
  aboutLogo: {width: 80, height: 80, marginBottom: 10},
  aboutTitle: {fontSize: 20, fontWeight: 'bold', color: colors.primary},
  aboutPrevName: {fontSize: 11, color: '#888', fontStyle: 'italic', marginTop: 2},
  aboutText: {fontSize: 13, color: '#555', lineHeight: 20, textAlign: 'center', marginTop: 8},

  // Featured Section
  featuredSection: {marginTop: 8, backgroundColor: '#fff'},
  productsRow: {paddingHorizontal: 12, paddingBottom: 12},
  
  // Banner Card
  bannerCard: {width: 140, height: 180, borderRadius: 10, overflow: 'hidden', marginRight: 10, position: 'relative'},
  bannerImage: {width: '100%', height: '100%'},
  bannerOverlay: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)'},
  bannerTitle: {fontSize: 13, fontWeight: 'bold', color: '#fff'},
  bannerSubtitle: {fontSize: 10, color: '#fff'},

  // Product Card
  productCard: {width: 130, backgroundColor: '#fff', borderRadius: 10, marginRight: 10, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 3, overflow: 'hidden', borderWidth: 1, borderColor: '#eee'},
  productImageContainer: {width: '100%', height: 100, backgroundColor: '#f9f9f9', position: 'relative'},
  productImage: {width: '100%', height: '100%'},
  discountBadge: {position: 'absolute', top: 4, left: 4, backgroundColor: '#c41e3a', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3},
  discountText: {color: '#fff', fontSize: 8, fontWeight: 'bold'},
  variantBadge: {position: 'absolute', bottom: 4, right: 4, backgroundColor: colors.primary, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3},
  variantText: {color: '#fff', fontSize: 8},
  productInfo: {padding: 8},
  productTitle: {fontSize: 11, color: '#333', fontWeight: '500', height: 28},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  productPrice: {fontSize: 13, fontWeight: 'bold', color: colors.primary},
  comparePrice: {fontSize: 10, color: '#999', textDecorationLine: 'line-through', marginLeft: 4},
  addButton: {backgroundColor: '#fff', borderWidth: 1, borderColor: colors.primary, paddingVertical: 5, borderRadius: 4, alignItems: 'center', marginTop: 6},
  addButtonText: {color: colors.primary, fontSize: 11, fontWeight: 'bold'},

  // Farm Visit
  farmVisitSection: {marginTop: 8, backgroundColor: '#fff', flexDirection: 'row', padding: 12},
  farmVisitImage: {width: 120, height: 120, borderRadius: 8},
  farmVisitContent: {flex: 1, marginLeft: 12, justifyContent: 'center'},
  farmVisitTitle: {fontSize: 18, fontWeight: 'bold', color: colors.primary},
  farmVisitDesc: {fontSize: 12, color: '#666', marginTop: 4, lineHeight: 18},
  farmVisitButton: {backgroundColor: colors.primary, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, marginTop: 10},
  farmVisitButtonText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  // Gallery
  galleryGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, backgroundColor: '#fff', paddingBottom: 12},
  galleryItem: {width: (width - 28) / 3, aspectRatio: 1, margin: 2, borderRadius: 6, overflow: 'hidden'},
  galleryImage: {width: '100%', height: '100%'},

  // Video
  videoSection: {margin: 12, backgroundColor: '#1a1a2e', borderRadius: 12, padding: 24, alignItems: 'center'},
  videoPlayButton: {width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12},
  videoPlayIcon: {fontSize: 24, color: '#fff'},
  videoTitle: {fontSize: 16, fontWeight: 'bold', color: '#fff'},
  videoSubtitle: {fontSize: 12, color: '#fff', opacity: 0.8, marginTop: 4},

  // Spirulina
  spirulinaSection: {backgroundColor: '#fff', flexDirection: 'row', padding: 12, marginTop: 8},
  spirulinaImage: {width: 100, height: 100, borderRadius: 8},
  spirulinaContent: {flex: 1, marginLeft: 12, justifyContent: 'center'},
  spirulinaTitle: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  spirulinaDesc: {fontSize: 11, color: '#666', marginTop: 4, lineHeight: 16},
  spirulinaButton: {backgroundColor: colors.primary, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginTop: 8},
  spirulinaButtonText: {color: '#fff', fontSize: 11, fontWeight: '600'},

  // Brands
  brandsContainer: {paddingHorizontal: 12, paddingBottom: 16, backgroundColor: '#fff'},
  brandCard: {alignItems: 'center', marginRight: 16},
  brandLogo: {width: 70, height: 70, borderRadius: 8, backgroundColor: '#f5f5f5'},
  brandName2: {fontSize: 11, color: '#333', marginTop: 4, fontWeight: '500'},

  // Map
  mapSection: {marginTop: 8, backgroundColor: '#fff', overflow: 'hidden'},
  mapImage: {width: '100%', height: 120},
  mapInfo: {padding: 14},
  mapTitle: {fontSize: 15, fontWeight: 'bold', color: '#333'},
  mapAddress: {fontSize: 12, color: '#666', marginTop: 4, lineHeight: 18},
  directionsButton: {backgroundColor: colors.primary, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6, marginTop: 10},
  directionsButtonText: {color: '#fff', fontSize: 12, fontWeight: '600'},

  // Newsletter
  newsletterSection: {backgroundColor: '#1da362', padding: 20, marginTop: 8, alignItems: 'center'},
  newsletterTitle: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  newsletterSubtitle: {fontSize: 12, color: '#fff', opacity: 0.9, marginTop: 4, textAlign: 'center'},
  newsletterForm: {flexDirection: 'row', width: '100%', marginTop: 14},
  newsletterInput: {flex: 1, backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8},
  newsletterButton: {backgroundColor: '#163340', paddingHorizontal: 18, borderRadius: 6, justifyContent: 'center'},
  newsletterButtonText: {color: '#fff', fontWeight: '600'},

  // Footer
  footer: {backgroundColor: colors.primary, padding: 20, alignItems: 'center'},
  footerLogo: {width: 60, height: 60, marginBottom: 8},
  footerBrand: {fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 2},
  footerTagline: {fontSize: 12, color: '#fff', opacity: 0.9, marginBottom: 8},
  footerContact: {fontSize: 12, color: '#fff', marginBottom: 2},
  socialLinks: {flexDirection: 'row', marginVertical: 14},
  socialButton: {width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5},
  socialIcon: {fontSize: 18},
  footerPayment: {fontSize: 10, color: '#fff', opacity: 0.8, marginBottom: 4},
  footerCopyright: {fontSize: 10, color: '#fff', opacity: 0.7},

  // Voice Modal
  voiceModal: {flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center'},
  voiceModalContent: {backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: width * 0.8},
  voiceModalTitle: {fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16},
  voiceWaves: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, marginBottom: 16},
  voiceWave: {width: 6, backgroundColor: colors.primary, borderRadius: 3, marginHorizontal: 3},
  voiceModalText: {fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 16},
  voiceModalButton: {backgroundColor: '#f0f0f0', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8},
  voiceModalButtonText: {color: '#666', fontWeight: '600'},
});

export default HomeScreen;
