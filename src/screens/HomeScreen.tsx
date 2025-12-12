/**
 * HomeScreen - Exact replica of Shopify theme layout
 * Section order from sk_organic_farms_theme/templates/index.json
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

// ========== SECTION 1: SLIDESHOW ==========
const HERO_SLIDES = [
  {image: `${FILES_CDN}/IMG_2100.png`, title: 'Garden Setup', subtitle: 'Shade House and Vegetable & Herbal Garden Setup', button: 'View All Products', link: 'hdpe-grow-bags'},
  {image: `${FILES_CDN}/IMG_2099.png`, title: 'Native Organic Seeds', subtitle: 'Vegetable, Flower, Tree, Fruit & Herbal Seeds', button: 'View all products', link: 'seeds'},
  {image: `${FILES_CDN}/IMG_2101.png`, title: 'Garden Tools', subtitle: 'Shade House and Vegetable & Herbal Garden Setup', button: 'View all products', link: 'garden-tools-1'},
];

// ========== SECTION 7: COLLECTION LIST (Our Collection) ==========
const COLLECTION_LIST = [
  {handle: 'organic-manures', title: 'Organic Manures', image: `${FILES_CDN}/IMG-2096.png`},
  {handle: 'organic-seeds', title: 'Organic Seeds', image: `${FILES_CDN}/IMG-2091.png`},
  {handle: 'organic-millets-rice', title: 'Millets & Rice', image: null},
  {handle: 'falcon-1', title: 'Garden Tools', image: `${FILES_CDN}/falcon.jpg`},
  {handle: 'grow-bags-for-terrace-garden', title: 'Grow Bags', image: `${FILES_CDN}/IMG-2104.png`},
  {handle: 'skin-and-hair-care', title: 'Skin & Hair', image: `${FILES_CDN}/4786E3F2-BDCD-484D-9274-66DE8A5A4834.webp`},
  {handle: 'sea-weed-products', title: 'Sea Weed', image: `${FILES_CDN}/SEAWEED.jpg`},
  {handle: 'our-packages', title: 'Our Packages', image: `${FILES_CDN}/IMG-2097.png`},
  {handle: 'potting-medium', title: 'Potting Medium', image: `${FILES_CDN}/IMG-2090.png`},
  {handle: 'garden-sprayer', title: 'Garden Sprayer', image: `${FILES_CDN}/3110-05.jpg`},
  {handle: 'live-plants', title: 'Live Plants', image: `${FILES_CDN}/LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg`},
];

// ========== FEATURED COLLECTIONS (exact order from theme) ==========
const FEATURED_COLLECTIONS = [
  {handle: 'organic-seeds', title: 'Native Organic Seeds', banner: `${FILES_CDN}/stock-photo-the-colors-of-a-beautiful-indian-flag-are-made-of-pulses-1164063082.jpg`},
  {handle: 'justbrews', title: 'JustBrews', subtitle: 'Coffee & Tea Powder', banner: `${FILES_CDN}/JustBrew_logo.png`},
  {handle: 'grow-bags-for-terrace-garden', title: 'Grow Bags', banner: `${FILES_CDN}/grow_bag.jpg`},
  {handle: 'daily-deals', title: 'Daily Deals', banner: `${FILES_CDN}/daily.png`},
  {handle: 'sea-weed-products', title: 'Sea Weed Products', banner: `${FILES_CDN}/SEAWEED.jpg`},
  {handle: 'skin-and-hair-care', title: 'Skin & Hair Care', banner: `${FILES_CDN}/3768956F-918C-42DE-9EDF-1239F6B0C815.jpg`},
  {handle: 'live-plants', title: 'Live Plants & Saplings', banner: `${FILES_CDN}/banana-tissue-plants_f17c24d9-5bfe-4c59-8076-05fc51242b40.jpg`},
  {handle: 'biocarve', title: 'BioCarve Seeds', banner: `${FILES_CDN}/biocurve.jpg`},
  {handle: 'organic-millets-rice', title: 'Rice and Millets', banner: `${FILES_CDN}/best_seller.jpg`},
  {handle: 'falcon-1', title: 'Garden Tools', banner: `${FILES_CDN}/falcon.jpg`},
];

// ========== SECTION 22: LOGO LIST (Our Brands) ==========
const BRAND_LOGOS = [
  {name: 'Falcon', image: `${FILES_CDN}/falcon.jpg`, link: 'falcon-1'},
  {name: 'SKOF', image: `${FILES_CDN}/SKOF_new_logo_tm_9b6a7846-af4e-4def-ac18-8b7165eaf2b9.jpg`, link: ''},
  {name: 'Bellota', image: `${FILES_CDN}/bellota_logo.jpg`, link: 'bellota'},
  {name: 'EPLA', image: `${FILES_CDN}/EPLA-logo_802a7aba-6c86-4917-a3f7-6d457d52659c.jpeg`, link: ''},
  {name: 'BioCarve', image: `${FILES_CDN}/biocurve.jpg`, link: 'biocarve'},
];

// ========== SECTION 19: GALLERY ==========
const GALLERY_IMAGES = [
  {image: `${FILES_CDN}/SPIRU9.jpg`, subtitle: 'Spirulina Class room training'},
  {image: `${FILES_CDN}/IMG-2097.png`, subtitle: ''},
  {image: `${FILES_CDN}/DSC_0253.JPG`, subtitle: ''},
  {image: `${FILES_CDN}/DSC_0192.JPG`, subtitle: ''},
  {image: `${FILES_CDN}/IMG_1355.JPG`, subtitle: 'Our Ambur Nursery'},
  {image: `${FILES_CDN}/IMG-2097.png`, subtitle: ''},
];

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000); // 7 seconds as per theme config
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
      for (const fc of FEATURED_COLLECTIONS) {
        const products = await fetchCollectionProducts(fc.handle, 20);
        if (products.length > 0) {
          productsMap[fc.handle] = products;
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
      const allProducts = Object.values(featuredProducts).flat();
      const results = allProducts.filter(p => p.title.toLowerCase().includes(text.toLowerCase()));
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [featuredProducts]);

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

  // ========== RENDER PRODUCT CARD ==========
  const renderProductCard = (product: ShopifyProduct, index: number) => {
    const price = getProductPrice(product);
    const compareAtPrice = getCompareAtPrice(product);
    const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

    return (
      <TouchableOpacity key={`${product.id}-${index}`} style={styles.productCard} onPress={() => navigateToProduct(product)}>
        <View style={styles.productImageWrap}>
          <Image source={{uri: getProductImage(product)}} style={styles.productImage} resizeMode="cover" />
          {discount > 0 ? <View style={styles.discountBadge}><Text style={styles.discountText}>{discount}% OFF</Text></View> : null}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>₹{price}</Text>
            {compareAtPrice ? <Text style={styles.comparePrice}>₹{compareAtPrice}</Text> : null}
          </View>
          <TouchableOpacity style={styles.addButton}><Text style={styles.addButtonText}>ADD</Text></TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // ========== RENDER FEATURED COLLECTION SECTION ==========
  const renderFeaturedCollection = (config: typeof FEATURED_COLLECTIONS[0], index: number) => {
    const products = featuredProducts[config.handle];
    if (!products || products.length === 0) return null;

    return (
      <View key={`fc-${index}`} style={styles.section}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{config.title}</Text>
            {config.subtitle ? <Text style={styles.sectionSubtitle}>{config.subtitle}</Text> : null}
          </View>
          <TouchableOpacity onPress={() => navigateToCollection(config.handle)}>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>
        
        {/* Products with Banner */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
          {/* Banner Card */}
          <TouchableOpacity style={styles.bannerCard} onPress={() => navigateToCollection(config.handle)}>
            <Image source={{uri: config.banner}} style={styles.bannerImage} resizeMode="cover" />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>{config.title}</Text>
              <Text style={styles.bannerShopAll}>Shop All</Text>
            </View>
          </TouchableOpacity>
          
          {/* Product Cards */}
          {products.slice(0, 8).map((p, i) => renderProductCard(p, i))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={{uri: LOGO_IMAGE}} style={styles.loadingLogo} resizeMode="contain" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ========== HEADER ========== */}
      <View style={styles.header}>
        {/* Contact Bar */}
        <View style={styles.contactBar}>
          <Text style={styles.contactText}>📧 {brand.email}</Text>
          <Text style={styles.contactText}>📞 {brand.phone}</Text>
        </View>
        
        {/* Main Header */}
        <View style={styles.headerMain}>
          <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          
          <View style={styles.logoWrap}>
            <Image source={{uri: LOGO_IMAGE}} style={styles.logoImg} resizeMode="contain" />
            <View>
              <Text style={styles.brandName}>Sunantha</Text>
              <Text style={styles.brandSub}>Organic Farms</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.cartBtn}>
            <Text style={styles.cartIcon}>🛒</Text>
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>3</Text></View>
          </TouchableOpacity>
        </View>
        
        {/* Search Bar with Voice */}
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setShowSearch(true)}
          />
          <TouchableOpacity style={styles.voiceBtn} onPress={startVoiceSearch}>
            <Text>{isListening ? '🔴' : '🎤'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchBtn}>
            <Text>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Predictive Search Results */}
        {searchResults.length > 0 && showSearch ? (
          <View style={styles.searchResults}>
            {searchResults.map((p, i) => (
              <TouchableOpacity key={i} style={styles.searchItem} onPress={() => { setShowSearch(false); setSearchResults([]); navigateToProduct(p); }}>
                <Image source={{uri: getProductImage(p)}} style={styles.searchItemImg} />
                <View style={styles.searchItemInfo}>
                  <Text style={styles.searchItemTitle} numberOfLines={1}>{p.title}</Text>
                  <Text style={styles.searchItemPrice}>₹{getProductPrice(p)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ========== SECTION 1: SLIDESHOW ========== */}
        <View style={styles.slideshow}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))}>
            {HERO_SLIDES.map((slide, i) => (
              <TouchableOpacity key={i} style={styles.slide} onPress={() => navigateToCollection(slide.link)}>
                <Image source={{uri: slide.image}} style={styles.slideImg} resizeMode="cover" />
                <View style={styles.slideContent}>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
                  <View style={styles.slideBtn}><Text style={styles.slideBtnText}>{slide.button}</Text></View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {HERO_SLIDES.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setActiveSlide(i)}>
                <View style={[styles.dot, i === activeSlide && styles.dotActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ========== SECTION 3: RICH TEXT (About Us) ========== */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About Us</Text>
          <Text style={styles.aboutPrev}>Previously known as SK Organic Farms</Text>
          <Text style={styles.aboutText}>
            Sunantha Organic Farm is an urban initiative founded by IT professionals to promote organic living. 
            We support individuals in starting kitchen gardens, terrace gardens, and organic farms by providing 
            quality products, expert guidance, and education on sustainable practices.
          </Text>
        </View>

        {/* ========== SECTIONS 4-6: First 3 Featured Collections ========== */}
        {FEATURED_COLLECTIONS.slice(0, 3).map((fc, i) => renderFeaturedCollection(fc, i))}

        {/* ========== SECTION 7: COLLECTION LIST (Our Collection - Circular Icons) ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Collection</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.collectionList}>
            {COLLECTION_LIST.map((col, i) => (
              <TouchableOpacity key={i} style={styles.collectionItem} onPress={() => navigateToCollection(col.handle)}>
                <View style={styles.collectionCircle}>
                  {col.image ? (
                    <Image source={{uri: col.image}} style={styles.collectionImg} resizeMode="cover" />
                  ) : (
                    <Text style={styles.collectionEmoji}>📦</Text>
                  )}
                </View>
                <Text style={styles.collectionName} numberOfLines={2}>{col.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ========== SECTIONS 8-9: Daily Deals, Sea Weed ========== */}
        {FEATURED_COLLECTIONS.slice(3, 5).map((fc, i) => renderFeaturedCollection(fc, i + 3))}

        {/* ========== SECTION 10: FEATURED PRODUCT (Potting Soil) ========== */}
        <View style={styles.featuredProduct}>
          <Text style={styles.fpTitle}>Potting Soil</Text>
          <View style={styles.fpCard}>
            <Image source={{uri: `${FILES_CDN}/IMG-2090.png`}} style={styles.fpImage} resizeMode="cover" />
            <View style={styles.fpInfo}>
              <Text style={styles.fpName}>Potting Mix - Premium Quality</Text>
              <Text style={styles.fpPrice}>₹299</Text>
              <Text style={styles.fpDesc}>High-quality potting mix for all your plants.</Text>
              <TouchableOpacity style={styles.fpBtn}><Text style={styles.fpBtnText}>View Product</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ========== SECTION 11: Skin & Hair Care ========== */}
        {renderFeaturedCollection(FEATURED_COLLECTIONS[5], 5)}

        {/* ========== SECTION 12: FEATURED PRODUCT (Terrace Garden Setup) ========== */}
        <View style={styles.featuredProduct}>
          <Text style={styles.fpTitle}>Featured Product</Text>
          <View style={styles.fpCard}>
            <Image source={{uri: `${FILES_CDN}/IMG-2097.png`}} style={styles.fpImage} resizeMode="cover" />
            <View style={styles.fpInfo}>
              <Text style={styles.fpName}>Terrace/Kitchen Garden Setup</Text>
              <Text style={styles.fpPrice}>₹4,999</Text>
              <Text style={styles.fpDesc}>Complete shade house and garden setup.</Text>
              <TouchableOpacity style={styles.fpBtn}><Text style={styles.fpBtnText}>View Product</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ========== SECTIONS 13-16: Live Plants, BioCarve, Rice, Tools ========== */}
        {FEATURED_COLLECTIONS.slice(6, 10).map((fc, i) => renderFeaturedCollection(fc, i + 6))}

        {/* ========== SECTION 17: IMAGE WITH TEXT (Farm Visit) ========== */}
        <View style={styles.imageWithText}>
          <Image source={{uri: `${FILES_CDN}/DSC_0253.JPG`}} style={styles.iwtImage} resizeMode="cover" />
          <View style={styles.iwtContent}>
            <Text style={styles.iwtTitle}>Farm Visit</Text>
            <Text style={styles.iwtText}>
              Visiting a live farm can be a wonderful family activity, educational experience and entertainment. 
              We encourage individuals and groups to visit our farm and learn our traditional and natural way of farming.
            </Text>
            <TouchableOpacity style={styles.iwtBtn} onPress={() => Linking.openURL('tel:' + brand.phone)}>
              <Text style={styles.iwtBtnText}>Pay Here</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========== SECTION 18: FEATURED BLOG ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>From The Blog</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View All →</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.blogScroll}>
            {[1, 2, 3, 4].map(i => (
              <TouchableOpacity key={i} style={styles.blogCard}>
                <Image source={{uri: `${FILES_CDN}/DSC_0253.JPG`}} style={styles.blogImg} resizeMode="cover" />
                <Text style={styles.blogTitle}>Organic Gardening Tips #{i}</Text>
                <Text style={styles.blogDate}>December 2024</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ========== SECTION 19: POPUP GALLERY ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gallery</Text>
          </View>
          <View style={styles.galleryGrid}>
            {GALLERY_IMAGES.map((g, i) => (
              <TouchableOpacity key={i} style={styles.galleryItem}>
                <Image source={{uri: g.image}} style={styles.galleryImg} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ========== SECTION 20: HERO VIDEO POPUP ========== */}
        <TouchableOpacity style={styles.videoSection} onPress={() => Linking.openURL('https://www.youtube.com/watch?v=4eyA_sqPCzY')}>
          <View style={styles.videoPlay}><Text style={styles.videoPlayIcon}>▶</Text></View>
          <Text style={styles.videoTitle}>Interview SOF Director</Text>
          <Text style={styles.videoSubtitle}>How to identify fake organic products</Text>
        </TouchableOpacity>

        {/* ========== SECTION 21: IMAGE WITH TEXT (Spirulina) ========== */}
        <View style={[styles.imageWithText, styles.imageWithTextReverse]}>
          <View style={styles.iwtContent}>
            <Text style={styles.iwtTitle}>Spirulina Setup & Training</Text>
            <Text style={styles.iwtText}>
              We at Sunantha Organic Farms have developed a world class solution for spirulina cultivation. 
              By employing the best and advanced technology, we provide high quality products and support.
            </Text>
            <TouchableOpacity style={styles.iwtBtn}>
              <Text style={styles.iwtBtnText}>Pay Here</Text>
            </TouchableOpacity>
          </View>
          <Image source={{uri: `${FILES_CDN}/DSC_0237.JPG`}} style={styles.iwtImage} resizeMode="cover" />
        </View>

        {/* ========== SECTION 22: LOGO LIST (Our Brands) ========== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Brands</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandsScroll}>
            {BRAND_LOGOS.map((b, i) => (
              <TouchableOpacity key={i} style={styles.brandItem} onPress={() => b.link && navigateToCollection(b.link)}>
                <Image source={{uri: b.image}} style={styles.brandImg} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ========== SECTION 23: MAP (Chennai Shop) ========== */}
        <View style={styles.mapSection}>
          <Image source={{uri: `${FILES_CDN}/holding-compass-up.jpg`}} style={styles.mapImg} resizeMode="cover" />
          <View style={styles.mapContent}>
            <Text style={styles.mapTitle}>Chennai Shop</Text>
            <Text style={styles.mapAddress}>
              Kalasathamman Koil St, Moogambigai Nagar, Ramapuram, Chennai, Tamil Nadu 600089
            </Text>
            <Text style={styles.mapHours}>Mon - Sun, 9am - 11pm</Text>
            <TouchableOpacity style={styles.mapBtn} onPress={() => Linking.openURL('https://maps.google.com/?q=Mahathi+Biotech+Chennai')}>
              <Text style={styles.mapBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========== SECTION 24: MAP (Farm) ========== */}
        <View style={styles.mapSection}>
          <Image source={{uri: `${FILES_CDN}/open-compass-on-world-map.jpg`}} style={styles.mapImg} resizeMode="cover" />
          <View style={styles.mapContent}>
            <Text style={styles.mapTitle}>Our Farm & Outlet</Text>
            <Text style={styles.mapAddress}>
              SK Organic Farms, Road, Melkothakuppam, Tamil Nadu 635805
            </Text>
            <Text style={styles.mapHours}>Mon - Sun, 9am - 11pm</Text>
            <TouchableOpacity style={styles.mapBtn} onPress={() => Linking.openURL('https://maps.google.com/?q=SK+Organic+Farms+Melkothakuppam')}>
              <Text style={styles.mapBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========== SECTION 25: NEWSLETTER ========== */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>{newsletter.heading}</Text>
          <Text style={styles.newsletterSub}>{newsletter.subheading}</Text>
          <View style={styles.newsletterForm}>
            <TextInput style={styles.newsletterInput} placeholder="Enter your email" placeholderTextColor="#888" value={email} onChangeText={setEmail} />
            <TouchableOpacity style={styles.newsletterBtn}><Text style={styles.newsletterBtnText}>Subscribe</Text></TouchableOpacity>
          </View>
        </View>

        {/* ========== FOOTER ========== */}
        <View style={styles.footer}>
          <Image source={{uri: LOGO_IMAGE}} style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerBrand}>Sunantha Organic Farms</Text>
          <Text style={styles.footerContact}>📧 {brand.email}</Text>
          <Text style={styles.footerContact}>📞 {brand.phone}</Text>
          <View style={styles.footerSocial}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL(brand.social.facebook)}><Text>📘</Text></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL(brand.social.instagram)}><Text>📸</Text></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL(brand.social.youtube)}><Text>📺</Text></TouchableOpacity>
          </View>
          <Text style={styles.footerCopyright}>© 2024 Sunantha Organic Farms</Text>
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
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  content: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'},
  loadingLogo: {width: 100, height: 100, marginBottom: 16},
  loadingText: {marginTop: 12, color: colors.primary, fontSize: 14},

  // Header
  header: {backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee'},
  contactBar: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6, backgroundColor: colors.primary},
  contactText: {color: '#fff', fontSize: 11},
  headerMain: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10},
  menuIcon: {fontSize: 24, color: colors.primary},
  logoWrap: {flexDirection: 'row', alignItems: 'center'},
  logoImg: {width: 36, height: 36, marginRight: 8},
  brandName: {fontSize: 15, fontWeight: 'bold', color: colors.primary},
  brandSub: {fontSize: 10, color: '#666'},
  cartBtn: {position: 'relative'},
  cartIcon: {fontSize: 22},
  cartBadge: {position: 'absolute', top: -4, right: -4, backgroundColor: colors.error, borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center'},
  cartBadgeText: {color: '#fff', fontSize: 9, fontWeight: 'bold'},
  searchWrap: {flexDirection: 'row', marginHorizontal: 12, marginBottom: 10, backgroundColor: '#f0f0f0', borderRadius: 8, overflow: 'hidden'},
  searchInput: {flex: 1, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13},
  voiceBtn: {padding: 8},
  searchBtn: {padding: 8, backgroundColor: colors.primary},
  searchResults: {position: 'absolute', top: 120, left: 12, right: 12, backgroundColor: '#fff', borderRadius: 8, elevation: 5, zIndex: 100, maxHeight: 300},
  searchItem: {flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0'},
  searchItemImg: {width: 40, height: 40, borderRadius: 4},
  searchItemInfo: {flex: 1, marginLeft: 10, justifyContent: 'center'},
  searchItemTitle: {fontSize: 12, color: '#333'},
  searchItemPrice: {fontSize: 13, color: colors.primary, fontWeight: 'bold'},

  // Slideshow
  slideshow: {height: 200, position: 'relative'},
  slide: {width: width, height: 200},
  slideImg: {width: '100%', height: '100%'},
  slideContent: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.4)'},
  slideTitle: {fontSize: 20, fontWeight: 'bold', color: '#fff'},
  slideSubtitle: {fontSize: 12, color: '#fff', marginTop: 2},
  slideBtn: {backgroundColor: colors.primary, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginTop: 8},
  slideBtnText: {color: '#fff', fontSize: 11, fontWeight: '600'},
  pagination: {position: 'absolute', bottom: 8, alignSelf: 'center', flexDirection: 'row'},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3},
  dotActive: {backgroundColor: '#fff', width: 20},

  // About Section
  aboutSection: {backgroundColor: '#fff', padding: 20, alignItems: 'center'},
  aboutTitle: {fontSize: 20, fontWeight: 'bold', color: colors.primary},
  aboutPrev: {fontSize: 11, color: '#888', fontStyle: 'italic', marginTop: 2},
  aboutText: {fontSize: 13, color: '#555', lineHeight: 20, textAlign: 'center', marginTop: 10},

  // Section
  section: {backgroundColor: '#fff', marginTop: 8},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10},
  sectionTitle: {fontSize: 17, fontWeight: 'bold', color: '#333'},
  sectionSubtitle: {fontSize: 11, color: '#888'},
  viewAll: {fontSize: 12, color: colors.primary, fontWeight: '500'},

  // Products Scroll
  productsScroll: {paddingHorizontal: 12, paddingBottom: 16},
  bannerCard: {width: 130, height: 170, borderRadius: 8, overflow: 'hidden', marginRight: 10},
  bannerImage: {width: '100%', height: '100%'},
  bannerOverlay: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)'},
  bannerTitle: {fontSize: 12, fontWeight: 'bold', color: '#fff'},
  bannerShopAll: {fontSize: 10, color: '#fff'},

  // Product Card
  productCard: {width: 120, backgroundColor: '#fff', borderRadius: 8, marginRight: 10, borderWidth: 1, borderColor: '#eee', overflow: 'hidden'},
  productImageWrap: {width: '100%', height: 90, backgroundColor: '#f9f9f9'},
  productImage: {width: '100%', height: '100%'},
  discountBadge: {position: 'absolute', top: 4, left: 4, backgroundColor: colors.error, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 2},
  discountText: {color: '#fff', fontSize: 8, fontWeight: 'bold'},
  productInfo: {padding: 8},
  productTitle: {fontSize: 11, color: '#333', height: 26},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 2},
  productPrice: {fontSize: 12, fontWeight: 'bold', color: colors.primary},
  comparePrice: {fontSize: 9, color: '#999', textDecorationLine: 'line-through', marginLeft: 4},
  addButton: {backgroundColor: '#fff', borderWidth: 1, borderColor: colors.primary, paddingVertical: 4, borderRadius: 4, alignItems: 'center', marginTop: 6},
  addButtonText: {color: colors.primary, fontSize: 10, fontWeight: 'bold'},

  // Collection List (Circular)
  collectionList: {paddingHorizontal: 12, paddingBottom: 16},
  collectionItem: {alignItems: 'center', width: 70, marginRight: 8},
  collectionCircle: {width: 56, height: 56, borderRadius: 28, overflow: 'hidden', borderWidth: 2, borderColor: colors.primary, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center'},
  collectionImg: {width: '100%', height: '100%'},
  collectionEmoji: {fontSize: 24},
  collectionName: {fontSize: 9, color: '#333', textAlign: 'center', marginTop: 4},

  // Featured Product
  featuredProduct: {backgroundColor: '#fff', marginTop: 8, padding: 16},
  fpTitle: {fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 12},
  fpCard: {flexDirection: 'row'},
  fpImage: {width: 120, height: 120, borderRadius: 8},
  fpInfo: {flex: 1, marginLeft: 12, justifyContent: 'center'},
  fpName: {fontSize: 14, fontWeight: '600', color: '#333'},
  fpPrice: {fontSize: 18, fontWeight: 'bold', color: colors.primary, marginTop: 4},
  fpDesc: {fontSize: 11, color: '#666', marginTop: 4},
  fpBtn: {backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start', marginTop: 8},
  fpBtnText: {color: '#fff', fontSize: 11, fontWeight: '600'},

  // Image with Text
  imageWithText: {flexDirection: 'row', backgroundColor: '#fff', marginTop: 8},
  imageWithTextReverse: {flexDirection: 'row-reverse'},
  iwtImage: {width: '40%', minHeight: 180},
  iwtContent: {flex: 1, padding: 16, justifyContent: 'center'},
  iwtTitle: {fontSize: 16, fontWeight: 'bold', color: '#163340'},
  iwtText: {fontSize: 11, color: '#163340', lineHeight: 16, marginTop: 8},
  iwtBtn: {backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6, alignSelf: 'flex-start', marginTop: 12},
  iwtBtnText: {color: '#fff', fontSize: 11, fontWeight: '600'},

  // Blog
  blogScroll: {paddingHorizontal: 12, paddingBottom: 16},
  blogCard: {width: 160, backgroundColor: '#fff', borderRadius: 8, marginRight: 10, overflow: 'hidden', elevation: 1},
  blogImg: {width: '100%', height: 90},
  blogTitle: {fontSize: 12, fontWeight: '500', color: '#333', padding: 8, paddingBottom: 2},
  blogDate: {fontSize: 10, color: '#888', paddingHorizontal: 8, paddingBottom: 8},

  // Gallery
  galleryGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, paddingBottom: 12},
  galleryItem: {width: (width - 28) / 3, aspectRatio: 1, margin: 2, borderRadius: 4, overflow: 'hidden'},
  galleryImg: {width: '100%', height: '100%'},

  // Video Section
  videoSection: {marginHorizontal: 16, marginTop: 8, backgroundColor: '#163340', borderRadius: 12, padding: 24, alignItems: 'center'},
  videoPlay: {width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12},
  videoPlayIcon: {fontSize: 20, color: '#fff'},
  videoTitle: {fontSize: 15, fontWeight: 'bold', color: '#fff'},
  videoSubtitle: {fontSize: 11, color: '#fff', opacity: 0.8, marginTop: 4},

  // Brands
  brandsScroll: {paddingHorizontal: 12, paddingBottom: 16},
  brandItem: {width: 80, height: 80, marginRight: 12, backgroundColor: '#f9f9f9', borderRadius: 8, overflow: 'hidden'},
  brandImg: {width: '100%', height: '100%'},

  // Map Section
  mapSection: {backgroundColor: '#fff', marginTop: 8},
  mapImg: {width: '100%', height: 120},
  mapContent: {padding: 16},
  mapTitle: {fontSize: 15, fontWeight: 'bold', color: '#333'},
  mapAddress: {fontSize: 12, color: '#666', lineHeight: 18, marginTop: 4},
  mapHours: {fontSize: 11, color: '#888', marginTop: 4},
  mapBtn: {backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6, alignSelf: 'flex-start', marginTop: 10},
  mapBtnText: {color: '#fff', fontSize: 11, fontWeight: '600'},

  // Newsletter
  newsletterSection: {backgroundColor: '#1da362', padding: 20, alignItems: 'center', marginTop: 8},
  newsletterTitle: {fontSize: 17, fontWeight: 'bold', color: '#fff'},
  newsletterSub: {fontSize: 11, color: '#fff', opacity: 0.9, marginTop: 4, textAlign: 'center'},
  newsletterForm: {flexDirection: 'row', width: '100%', marginTop: 14},
  newsletterInput: {flex: 1, backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8},
  newsletterBtn: {backgroundColor: '#163340', paddingHorizontal: 16, borderRadius: 6, justifyContent: 'center'},
  newsletterBtnText: {color: '#fff', fontWeight: '600', fontSize: 12},

  // Footer
  footer: {backgroundColor: colors.primary, padding: 20, alignItems: 'center'},
  footerLogo: {width: 50, height: 50, marginBottom: 8},
  footerBrand: {fontSize: 15, fontWeight: 'bold', color: '#fff', marginBottom: 8},
  footerContact: {fontSize: 12, color: '#fff', marginBottom: 2},
  footerSocial: {flexDirection: 'row', marginVertical: 12},
  socialBtn: {width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginHorizontal: 4},
  footerCopyright: {fontSize: 10, color: '#fff', opacity: 0.8},

  // Voice Modal
  voiceModal: {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center'},
  voiceModalBox: {backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', width: width * 0.8},
  voiceModalTitle: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  voiceModalText: {fontSize: 12, color: '#666', marginTop: 12, textAlign: 'center'},
  voiceModalBtn: {backgroundColor: '#f0f0f0', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 16},
  voiceModalBtnText: {color: '#666', fontWeight: '600'},
});

export default HomeScreen;
