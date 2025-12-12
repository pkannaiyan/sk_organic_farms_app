import React, {useState, useEffect, useRef} from 'react';
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
  FlatList,
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

const {width} = Dimensions.get('window');

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

// Collection list with images from theme
const COLLECTION_LIST = [
  {handle: 'organic-manures', title: 'Organic Manures', image: `${FILES_CDN}/IMG-2096.png`},
  {handle: 'organic-seeds', title: 'Organic Seeds', image: `${FILES_CDN}/IMG-2091.png`},
  {handle: 'organic-millets-rice', title: 'Millets & Rice', image: `${FILES_CDN}/best_seller.jpg`},
  {handle: 'falcon-1', title: 'Garden Tools', image: `${FILES_CDN}/falcon.jpg`},
  {handle: 'grow-bags-for-terrace-garden', title: 'Grow Bags', image: `${FILES_CDN}/IMG-2104.png`},
  {handle: 'skin-and-hair-care', title: 'Skin & Hair', image: `${FILES_CDN}/4786E3F2-BDCD-484D-9274-66DE8A5A4834.webp`},
  {handle: 'sea-weed-products', title: 'Sea Weed', image: `${FILES_CDN}/SEAWEED.jpg`},
  {handle: 'our-packages', title: 'Our Packages', image: `${FILES_CDN}/IMG-2097.png`},
  {handle: 'potting-medium', title: 'Potting Medium', image: `${FILES_CDN}/IMG-2090.png`},
  {handle: 'garden-sprayer', title: 'Sprayer', image: `${FILES_CDN}/3110-05.jpg`},
  {handle: 'live-plants', title: 'Live Plants', image: `${FILES_CDN}/LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg`},
];

// Featured collection configs from theme
const FEATURED_SECTIONS = [
  {handle: 'organic-seeds', title: 'Native Organic Seeds', image: `${FILES_CDN}/stock-photo-the-colors-of-a-beautiful-indian-flag-are-made-of-pulses-1164063082.jpg`},
  {handle: 'justbrews', title: 'JustBrews', subtitle: 'Coffee & Tea Powder', image: `${FILES_CDN}/JustBrew_logo.png`},
  {handle: 'grow-bags-for-terrace-garden', title: 'Grow Bags', image: `${FILES_CDN}/grow_bag.jpg`},
  {handle: 'daily-deals', title: 'Daily Deals', image: `${FILES_CDN}/daily.png`},
  {handle: 'sea-weed-products', title: 'Sea Weed Products', image: `${FILES_CDN}/SEAWEED.jpg`},
  {handle: 'skin-and-hair-care', title: 'Skin & Hair Care', image: `${FILES_CDN}/3768956F-918C-42DE-9EDF-1239F6B0C815.jpg`},
  {handle: 'live-plants', title: 'Live Plants & Saplings', image: `${FILES_CDN}/banana-tissue-plants_f17c24d9-5bfe-4c59-8076-05fc51242b40.jpg`},
  {handle: 'biocarve', title: 'BioCarve Seeds', image: `${FILES_CDN}/biocurve.jpg`},
  {handle: 'organic-millets-rice', title: 'Rice and Millets', image: `${FILES_CDN}/best_seller.jpg`},
  {handle: 'falcon-1', title: 'Garden Tools', image: `${FILES_CDN}/falcon.jpg`},
];

// Brand logos from theme
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
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<{[key: string]: ShopifyProduct[]}>({});
  const [loading, setLoading] = useState(true);
  const slideRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextSlide = (activeSlide + 1) % HERO_SLIDES.length;
      setActiveSlide(nextSlide);
      slideRef.current?.scrollToIndex({index: nextSlide, animated: true});
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide]);

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
      {/* Blinkit-style Header */}
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
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.contactBar}>
          <Text style={styles.contactText}>📧 {brand.email}</Text>
          <Text style={styles.contactText}>📞 {brand.phone}</Text>
        </View>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Slideshow with Real Images */}
        <View style={styles.sliderContainer}>
          <FlatList
            ref={slideRef}
            data={HERO_SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveSlide(index);
            }}
            renderItem={({item}) => (
              <TouchableOpacity 
                style={styles.slideItem}
                onPress={() => navigateToCollection(item.link)}>
                <Image source={{uri: item.image}} style={styles.slideImage} resizeMode="cover" />
                <View style={styles.slideOverlay}>
                  <Text style={styles.slideTitle}>{item.title}</Text>
                  <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                  <View style={styles.slideButton}>
                    <Text style={styles.slideButtonText}>{item.buttonText}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          <View style={styles.pagination}>
            {HERO_SLIDES.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, index === activeSlide && styles.paginationDotActive]}
              />
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoTitle}>🎄 Holiday Special! 🎄</Text>
          <Text style={styles.promoText}>Use code AADI15 for Flat 15% OFF!</Text>
        </View>

        {/* About Us */}
        <View style={styles.aboutSection}>
          <Image source={{uri: LOGO_IMAGE}} style={styles.aboutLogo} resizeMode="contain" />
          <Text style={styles.aboutTitle}>About Us</Text>
          <Text style={styles.aboutPrevName}>Previously known as SK Organic Farms</Text>
          <Text style={styles.aboutText}>
            Sunantha Organic Farm is an urban initiative founded by IT professionals to promote organic living. 
            We support individuals in starting kitchen gardens, terrace gardens, and organic farms.
          </Text>
        </View>

        {/* Blinkit-style Collection Categories (Circular) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Collection</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Collections')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {COLLECTION_LIST.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.categoryItem}
              onPress={() => navigateToCollection(item.handle)}>
              <View style={styles.categoryImageContainer}>
                <Image source={{uri: item.image}} style={styles.categoryImage} resizeMode="cover" />
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Collection Sections with Products */}
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
                {/* Banner Image */}
                <TouchableOpacity 
                  style={styles.bannerCard}
                  onPress={() => navigateToCollection(section.handle)}>
                  <Image source={{uri: section.image}} style={styles.bannerImage} resizeMode="cover" />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>{section.title}</Text>
                    <Text style={styles.bannerSubtitle}>Shop All</Text>
                  </View>
                </TouchableOpacity>

                {/* Products */}
                {products.slice(0, 6).map((product) => {
                  const price = getProductPrice(product);
                  const compareAtPrice = getCompareAtPrice(product);
                  const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productCard}
                      onPress={() => navigateToProduct(product)}>
                      <View style={styles.productImageContainer}>
                        <Image source={{uri: getProductImage(product)}} style={styles.productImage} resizeMode="cover" />
                        {discount > 0 ? (
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{discount}% OFF</Text>
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
                })}
              </ScrollView>
            </View>
          );
        })}

        {/* Farm Visit Section */}
        <TouchableOpacity 
          style={styles.farmVisitSection}
          onPress={() => Linking.openURL('tel:' + brand.phone)}>
          <Image source={{uri: `${FILES_CDN}/DSC_0253.JPG`}} style={styles.farmVisitImage} resizeMode="cover" />
          <View style={styles.farmVisitContent}>
            <Text style={styles.farmVisitTitle}>Farm Visit</Text>
            <Text style={styles.farmVisitDesc}>
              Visit our organic farm and learn traditional farming methods with your family!
            </Text>
            <View style={styles.farmVisitButton}>
              <Text style={styles.farmVisitButtonText}>Book Now - Pay Here</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Gallery */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gallery</Text>
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
          <Text style={styles.videoPlayIcon}>▶️</Text>
          <Text style={styles.videoTitle}>Interview SOF Director</Text>
          <Text style={styles.videoSubtitle}>How to identify fake organic products</Text>
        </TouchableOpacity>

        {/* Spirulina Training */}
        <View style={styles.spirulinaSection}>
          <Image source={{uri: `${FILES_CDN}/DSC_0237.JPG`}} style={styles.spirulinaImage} resizeMode="cover" />
          <View style={styles.spirulinaContent}>
            <Text style={styles.spirulinaTitle}>Spirulina Setup & Training</Text>
            <Text style={styles.spirulinaDesc}>
              World class solution for spirulina cultivation with advanced technology and expert support.
            </Text>
            <TouchableOpacity style={styles.spirulinaButton}>
              <Text style={styles.spirulinaButtonText}>Pay Here</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Brand Logos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Brands</Text>
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
            <Text style={styles.mapTitle}>📍 Our Farm & Outlet</Text>
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
          <Text style={styles.newsletterTitle}>{newsletter.heading}</Text>
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
          <Text style={styles.footerCopyright}>© 2024 Sunantha Organic Farms. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  content: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'},
  loadingLogo: {width: 120, height: 120, marginBottom: 20},
  loadingText: {marginTop: 16, fontSize: 16, color: colors.primary, fontWeight: '500'},
  
  // Header - Blinkit style
  header: {backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee'},
  headerTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10},
  menuIcon: {fontSize: 24, color: colors.primary},
  headerLogo: {flexDirection: 'row', alignItems: 'center'},
  logoImage: {width: 40, height: 40, marginRight: 8},
  brandName: {fontSize: 16, fontWeight: 'bold', color: colors.primary},
  brandSubName: {fontSize: 11, color: '#666'},
  cartButton: {position: 'relative', padding: 4},
  cartIcon: {fontSize: 24},
  cartBadge: {position: 'absolute', top: -2, right: -2, backgroundColor: colors.primary, borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center'},
  cartBadgeText: {color: '#fff', fontSize: 10, fontWeight: 'bold'},
  contactBar: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6, backgroundColor: colors.primary},
  contactText: {color: '#fff', fontSize: 11},
  searchBar: {flexDirection: 'row', marginHorizontal: 12, marginVertical: 10, backgroundColor: '#f0f0f0', borderRadius: 8, overflow: 'hidden'},
  searchInput: {flex: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#333'},
  searchButton: {padding: 10, backgroundColor: colors.primary},
  searchIcon: {fontSize: 16},

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
  promoBanner: {backgroundColor: '#c41e3a', padding: 12, alignItems: 'center'},
  promoTitle: {fontSize: 15, fontWeight: 'bold', color: '#fff'},
  promoText: {fontSize: 12, color: '#fff', marginTop: 2},
  
  // About
  aboutSection: {padding: 16, backgroundColor: '#fff', marginTop: 8, alignItems: 'center'},
  aboutLogo: {width: 80, height: 80, marginBottom: 10},
  aboutTitle: {fontSize: 20, fontWeight: 'bold', color: colors.primary},
  aboutPrevName: {fontSize: 11, color: '#888', fontStyle: 'italic', marginTop: 2},
  aboutText: {fontSize: 13, color: '#555', lineHeight: 20, textAlign: 'center', marginTop: 8},

  // Section Header
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, backgroundColor: '#fff'},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  sectionSubtitle: {fontSize: 12, color: '#888'},
  viewAllText: {fontSize: 13, color: colors.primary, fontWeight: '500'},

  // Categories (Blinkit circular style)
  categoriesContainer: {paddingHorizontal: 12, paddingBottom: 16, backgroundColor: '#fff'},
  categoryItem: {alignItems: 'center', width: 75, marginRight: 8},
  categoryImageContainer: {width: 60, height: 60, borderRadius: 30, overflow: 'hidden', borderWidth: 2, borderColor: colors.primary, backgroundColor: '#f5f5f5'},
  categoryImage: {width: '100%', height: '100%'},
  categoryName: {fontSize: 10, color: '#333', textAlign: 'center', marginTop: 4, fontWeight: '500'},

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
  discountBadge: {position: 'absolute', top: 4, left: 4, backgroundColor: colors.error, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3},
  discountText: {color: '#fff', fontSize: 8, fontWeight: 'bold'},
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
  videoPlayIcon: {fontSize: 40, marginBottom: 10},
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
  footerBrand: {fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 8},
  footerContact: {fontSize: 12, color: '#fff', marginBottom: 2},
  socialLinks: {flexDirection: 'row', marginVertical: 14},
  socialButton: {width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5},
  socialIcon: {fontSize: 18},
  footerCopyright: {fontSize: 10, color: '#fff', opacity: 0.8},
});

export default HomeScreen;
