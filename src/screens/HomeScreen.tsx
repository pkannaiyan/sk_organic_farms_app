import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import Header from '../components/Header';
import SectionHeader from '../components/SectionHeader';
import {colors, brand, heroSlides, specialSections, newsletter} from '../constants/theme';
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

// Featured collection handles to display
const FEATURED_HANDLES = [
  'organic-seeds',
  'organic-manure',
  'grow-bags-for-terrace-garden',
  'daily-deals',
  'sea-weed-products',
  'skin-and-hair-care',
  'live-plants-and-samplings',
  'biocarve',
  'organic-millets-rice',
  'falcon-1',
];

const HomeScreen = ({navigation}: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<{[key: string]: ShopifyProduct[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % Math.max(heroSlides.length, 1));
    }, 7000);
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
      for (const handle of FEATURED_HANDLES) {
        const products = await fetchCollectionProducts(handle, 10);
        if (products.length > 0) {
          productsMap[handle] = products;
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

  const navigateToCollection = (collection: ShopifyCollection) => {
    navigation.navigate('CollectionDetail', {collection});
  };

  const openYouTube = () => {
    Linking.openURL(specialSections.videoSection.videoUrl);
  };

  const openMaps = (address: string) => {
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  const renderProductCard = (product: ShopifyProduct) => {
    const price = getProductPrice(product);
    const compareAtPrice = getCompareAtPrice(product);
    const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

    return (
      <TouchableOpacity
        key={product.id}
        style={styles.productCard}
        onPress={() => navigateToProduct(product)}>
        <View style={styles.productImageContainer}>
          <Image
            source={{uri: getProductImage(product)}}
            style={styles.productImage}
            resizeMode="cover"
          />
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>₹{price}</Text>
            {compareAtPrice ? <Text style={styles.comparePrice}>₹{compareAtPrice}</Text> : null}
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProductSection = (handle: string, title: string) => {
    const products = featuredProducts[handle];
    if (!products || products.length === 0) {
      return null;
    }

    const collection = collections.find(c => c.handle === handle);

    return (
      <View key={handle}>
        <SectionHeader
          title={title}
          showViewAll
          onViewAll={() => {
            if (collection) {
              navigateToCollection(collection);
            }
          }}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {products.slice(0, 8).map(renderProductCard)}
        </ScrollView>
      </View>
    );
  };

  const renderCollectionCard = (collection: ShopifyCollection) => {
    return (
      <TouchableOpacity
        key={collection.id}
        style={styles.collectionCard}
        onPress={() => navigateToCollection(collection)}>
        <View style={styles.collectionImageContainer}>
          {collection.image && collection.image.src ? (
            <Image
              source={{uri: collection.image.src}}
              style={styles.collectionImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.collectionPlaceholder}>
              <Text style={styles.collectionPlaceholderText}>📦</Text>
            </View>
          )}
        </View>
        <Text style={styles.collectionName} numberOfLines={2}>{collection.title}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading store...</Text>
      </View>
    );
  }

  const currentSlide = heroSlides[activeSlide] || heroSlides[0];

  return (
    <View style={styles.container}>
      <Header cartCount={3} onMenuPress={() => navigation.navigate('Collections')} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Slideshow */}
        <View style={styles.sliderContainer}>
          <View style={styles.slideOverlay}>
            <Text style={styles.slideTitle}>{currentSlide.title}</Text>
            <Text style={styles.slideSubtitle}>{currentSlide.subtitle}</Text>
            <TouchableOpacity style={styles.slideButton}>
              <Text style={styles.slideButtonText}>{currentSlide.buttonText}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pagination}>
            {heroSlides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveSlide(index)}
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
          <Text style={styles.aboutTitle}>About Us</Text>
          <Text style={styles.aboutPrevName}>Previously: {brand.previousName}</Text>
          <Text style={styles.aboutText}>
            Sunantha Organic Farm promotes organic living with quality products, expert guidance, and sustainable practices for your garden.
          </Text>
        </View>

        {/* Featured Collections with Real Products */}
        {renderProductSection('organic-seeds', '🌱 Organic Seeds')}
        {renderProductSection('organic-manure', '🪴 Organic Manure')}
        {renderProductSection('grow-bags-for-terrace-garden', '🛍️ Grow Bags')}

        {/* All Collections */}
        {collections.length > 0 && (
          <View>
            <SectionHeader title="📦 All Collections" showViewAll onViewAll={() => navigation.navigate('Collections')} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.collectionsContainer}>
              {collections.slice(0, 15).map(renderCollectionCard)}
            </ScrollView>
          </View>
        )}

        {/* More Featured Collections */}
        {renderProductSection('daily-deals', '🏷️ Daily Deals')}
        {renderProductSection('sea-weed-products', '🌊 Sea Weed Products')}
        {renderProductSection('skin-and-hair-care', '💆 Skin & Hair Care')}
        {renderProductSection('live-plants-and-samplings', '🌿 Live Plants')}
        {renderProductSection('biocarve', '🌻 BioCarve Seeds')}
        {renderProductSection('organic-millets-rice', '🌾 Rice & Millets')}
        {renderProductSection('falcon-1', '🔧 Falcon Tools')}

        {/* Farm Visit */}
        <TouchableOpacity 
          style={styles.imageWithTextSection}
          onPress={() => Linking.openURL('tel:' + brand.phone)}>
          <View style={styles.imageWithTextContent}>
            <Text style={styles.imageWithTextTitle}>🌾 Farm Visit</Text>
            <Text style={styles.imageWithTextDesc}>
              Visit our organic farm and learn traditional farming methods. Book now!
            </Text>
            <View style={styles.imageWithTextButton}>
              <Text style={styles.imageWithTextButtonText}>Call to Book</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Video Section */}
        <TouchableOpacity style={styles.videoSection} onPress={openYouTube}>
          <Text style={styles.videoPlayIcon}>▶️</Text>
          <Text style={styles.videoTitle}>Watch: Interview with Director</Text>
          <Text style={styles.videoSubtitle}>How to identify fake organic products</Text>
        </TouchableOpacity>

        {/* Best Selling Collections */}
        {collections.length > 0 && (
          <View>
            <SectionHeader title="⭐ Best Sellers" showViewAll onViewAll={() => {
              const bestSeller = collections.find(c => c.handle === 'best-seller');
              if (bestSeller) {
                navigateToCollection(bestSeller);
              }
            }} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.collectionsContainer}>
              {collections
                .filter(c => ['best-seller', 'best-selling-products', 'combo-offer', 'bulk-sale'].includes(c.handle))
                .map(renderCollectionCard)}
            </ScrollView>
          </View>
        )}

        {/* Brands */}
        {collections.length > 0 && (
          <View>
            <SectionHeader title="🏷️ Our Brands" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.brandsContainer}>
              {collections
                .filter(c => ['falcon-1', 'bellota', 'biocarve', 'alpine'].includes(c.handle))
                .map(collection => (
                  <TouchableOpacity
                    key={collection.id}
                    style={styles.brandCard}
                    onPress={() => navigateToCollection(collection)}>
                    {collection.image && collection.image.src ? (
                      <Image source={{uri: collection.image.src}} style={styles.brandLogo} resizeMode="contain" />
                    ) : (
                      <View style={styles.brandPlaceholder}>
                        <Text style={styles.brandPlaceholderText}>{collection.title ? collection.title[0] : '?'}</Text>
                      </View>
                    )}
                    <Text style={styles.brandName}>{collection.title}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        {/* Maps */}
        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>📍 Chennai Shop</Text>
          <Text style={styles.mapAddress}>{brand.locations.chennaiShop.address}</Text>
          <TouchableOpacity 
            style={styles.directionsButton} 
            onPress={() => openMaps(brand.locations.chennaiShop.address)}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>📍 Our Farm</Text>
          <Text style={styles.mapAddress}>{brand.locations.farm.address}</Text>
          <TouchableOpacity 
            style={styles.directionsButton} 
            onPress={() => openMaps(brand.locations.farm.address)}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Newsletter */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>{newsletter.heading}</Text>
          <Text style={styles.newsletterSubtitle}>{newsletter.subheading}</Text>
          <View style={styles.newsletterForm}>
            <TextInput
              style={styles.newsletterInput}
              placeholder="Enter your email"
              placeholderTextColor={colors.textLight}
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
          <Text style={styles.footerLogo}>🌿 {brand.name}</Text>
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
          <Text style={styles.footerCopyright}>© 2024 {brand.name}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},
  loadingText: {marginTop: 12, fontSize: 16, color: colors.textLight},
  
  // Slideshow
  sliderContainer: {height: 180, position: 'relative', backgroundColor: colors.primary},
  slideOverlay: {flex: 1, backgroundColor: 'rgba(25,135,84,0.9)', padding: 20, justifyContent: 'center'},
  slideTitle: {fontSize: 24, fontWeight: 'bold', color: colors.textWhite, marginBottom: 6},
  slideSubtitle: {fontSize: 13, color: colors.textWhite, opacity: 0.9, marginBottom: 12},
  slideButton: {backgroundColor: colors.textWhite, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-start'},
  slideButtonText: {color: colors.primary, fontWeight: '600', fontSize: 13},
  pagination: {flexDirection: 'row', position: 'absolute', bottom: 12, alignSelf: 'center'},
  paginationDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3},
  paginationDotActive: {backgroundColor: colors.textWhite, width: 20},

  // Promo
  promoBanner: {backgroundColor: '#c41e3a', padding: 14, alignItems: 'center'},
  promoTitle: {fontSize: 16, fontWeight: 'bold', color: colors.textWhite},
  promoText: {fontSize: 13, color: colors.textWhite, marginTop: 2},
  
  // About
  aboutSection: {padding: 16, alignItems: 'center'},
  aboutTitle: {fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 4},
  aboutPrevName: {fontSize: 11, color: colors.textLight, fontStyle: 'italic', marginBottom: 8},
  aboutText: {fontSize: 13, color: colors.text, lineHeight: 20, textAlign: 'center'},
  
  // Products
  productsContainer: {paddingHorizontal: 12, paddingBottom: 16},
  productCard: {width: 150, backgroundColor: colors.background, borderRadius: 10, marginRight: 10, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 3, overflow: 'hidden'},
  productImageContainer: {width: '100%', height: 130, backgroundColor: colors.backgroundSecondary, position: 'relative'},
  productImage: {width: '100%', height: '100%'},
  discountBadge: {position: 'absolute', top: 6, left: 6, backgroundColor: colors.error, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3},
  discountText: {color: colors.textWhite, fontSize: 9, fontWeight: 'bold'},
  productInfo: {padding: 10},
  productTitle: {fontSize: 12, color: colors.text, fontWeight: '500', marginBottom: 6, height: 32},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  productPrice: {fontSize: 14, fontWeight: 'bold', color: colors.primary},
  comparePrice: {fontSize: 11, color: colors.textLight, textDecorationLine: 'line-through', marginLeft: 6},
  addButton: {backgroundColor: colors.primary, paddingVertical: 6, borderRadius: 5, alignItems: 'center'},
  addButtonText: {color: colors.textWhite, fontSize: 11, fontWeight: '600'},
  
  // Collections
  collectionsContainer: {paddingHorizontal: 12, paddingBottom: 16},
  collectionCard: {alignItems: 'center', width: 90, marginRight: 10},
  collectionImageContainer: {width: 70, height: 70, borderRadius: 35, overflow: 'hidden', borderWidth: 2, borderColor: colors.primary, marginBottom: 6},
  collectionImage: {width: '100%', height: '100%'},
  collectionPlaceholder: {width: '100%', height: '100%', backgroundColor: colors.backgroundSecondary, justifyContent: 'center', alignItems: 'center'},
  collectionPlaceholderText: {fontSize: 28},
  collectionName: {fontSize: 11, color: colors.text, textAlign: 'center', fontWeight: '500'},
  
  // Image with Text
  imageWithTextSection: {margin: 16, backgroundColor: colors.primary, borderRadius: 12, padding: 20},
  imageWithTextContent: {alignItems: 'center'},
  imageWithTextTitle: {fontSize: 20, fontWeight: 'bold', color: colors.textWhite, marginBottom: 8},
  imageWithTextDesc: {fontSize: 13, color: colors.textWhite, textAlign: 'center', marginBottom: 12, lineHeight: 20},
  imageWithTextButton: {backgroundColor: colors.textWhite, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 20},
  imageWithTextButtonText: {color: colors.primary, fontWeight: '600'},
  
  // Video
  videoSection: {margin: 16, backgroundColor: '#1a1a2e', borderRadius: 12, padding: 24, alignItems: 'center'},
  videoPlayIcon: {fontSize: 40, marginBottom: 10},
  videoTitle: {fontSize: 16, fontWeight: 'bold', color: colors.textWhite, marginBottom: 4},
  videoSubtitle: {fontSize: 12, color: colors.textWhite, opacity: 0.8},
  
  // Brands
  brandsContainer: {paddingHorizontal: 12, paddingBottom: 16},
  brandCard: {alignItems: 'center', marginRight: 16},
  brandLogo: {width: 60, height: 60, borderRadius: 8, backgroundColor: colors.background},
  brandPlaceholder: {width: 60, height: 60, borderRadius: 8, backgroundColor: colors.backgroundSecondary, justifyContent: 'center', alignItems: 'center'},
  brandPlaceholderText: {fontSize: 24, fontWeight: 'bold', color: colors.primary},
  brandName: {fontSize: 11, color: colors.text, marginTop: 6, fontWeight: '500'},
  
  // Map
  mapSection: {margin: 16, backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 16},
  mapTitle: {fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 6},
  mapAddress: {fontSize: 13, color: colors.textLight, marginBottom: 12, lineHeight: 20},
  directionsButton: {backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start'},
  directionsButtonText: {color: colors.textWhite, fontWeight: '600', fontSize: 13},
  
  // Newsletter
  newsletterSection: {backgroundColor: colors.footerBg, padding: 20, alignItems: 'center'},
  newsletterTitle: {fontSize: 18, fontWeight: 'bold', color: colors.textWhite, marginBottom: 6},
  newsletterSubtitle: {fontSize: 13, color: colors.textWhite, opacity: 0.9, marginBottom: 14, textAlign: 'center'},
  newsletterForm: {flexDirection: 'row', width: '100%'},
  newsletterInput: {flex: 1, backgroundColor: colors.textWhite, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8},
  newsletterButton: {backgroundColor: colors.primary, paddingHorizontal: 18, borderRadius: 6, justifyContent: 'center'},
  newsletterButtonText: {color: colors.textWhite, fontWeight: '600'},
  
  // Footer
  footer: {backgroundColor: colors.primary, padding: 20, alignItems: 'center'},
  footerLogo: {fontSize: 18, fontWeight: 'bold', color: colors.textWhite, marginBottom: 10},
  footerContact: {fontSize: 13, color: colors.textWhite, marginBottom: 4},
  socialLinks: {flexDirection: 'row', marginVertical: 14},
  socialButton: {width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5},
  socialIcon: {fontSize: 18},
  footerCopyright: {fontSize: 11, color: colors.textWhite, opacity: 0.8},
});

export default HomeScreen;
