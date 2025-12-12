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
} from 'react-native';
import Header from '../components/Header';
import SectionHeader from '../components/SectionHeader';
import CollectionCard from '../components/CollectionCard';
import ProductCard from '../components/ProductCard';
import {
  colors,
  brand,
  heroSlides,
  collections,
  featuredCollections,
  brands,
  specialSections,
  galleryImages,
  newsletter,
} from '../constants/theme';
import {CDN_URL} from '../config/shopify';

const {width} = Dimensions.get('window');

// Sample products - In production, these would come from Shopify API
const sampleProducts = {
  'organic-seeds': [
    {id: '1', title: 'Native Tomato Seeds', price: 49, compareAtPrice: 69, image: null},
    {id: '2', title: 'Organic Chilli Seeds', price: 39, compareAtPrice: 59, image: null},
    {id: '3', title: 'Brinjal Seeds Pack', price: 45, image: null},
    {id: '4', title: 'Lady Finger Seeds', price: 35, image: null},
    {id: '5', title: 'Coriander Seeds', price: 29, image: null},
  ],
  'justbrews': [
    {id: '6', title: 'Filter Coffee Powder', price: 299, image: null},
    {id: '7', title: 'Green Tea Premium', price: 249, image: null},
    {id: '8', title: 'Herbal Tea Mix', price: 199, image: null},
  ],
  'grow-bags-for-terrace-garden': [
    {id: '9', title: 'HDPE Grow Bag 15x15', price: 89, image: null},
    {id: '10', title: 'HDPE Grow Bag 12x12', price: 69, image: null},
    {id: '11', title: 'Grow Bag Pack of 10', price: 399, compareAtPrice: 499, image: null},
  ],
  'daily-deals': [
    {id: '12', title: 'Combo: Seeds + Manure', price: 599, compareAtPrice: 899, image: null},
    {id: '13', title: 'Garden Starter Kit', price: 1299, compareAtPrice: 1999, image: null},
    {id: '14', title: 'Organic Manure 5kg', price: 249, compareAtPrice: 349, image: null},
  ],
  'sea-weed-products': [
    {id: '15', title: 'Seaweed Extract 1L', price: 449, compareAtPrice: 599, image: null},
    {id: '16', title: 'Liquid Seaweed Spray', price: 299, image: null},
  ],
  'skin-and-hair-care': [
    {id: '17', title: 'Organic Aloe Vera Gel', price: 199, image: null},
    {id: '18', title: 'Herbal Hair Oil', price: 349, image: null},
  ],
  'live-plants': [
    {id: '19', title: 'Lemongrass Plant', price: 149, image: null},
    {id: '20', title: 'Tulsi Plant', price: 99, image: null},
    {id: '21', title: 'Curry Leaves Plant', price: 179, image: null},
  ],
  'biocarve': [
    {id: '22', title: 'BioCarve Tomato Seeds', price: 59, image: null},
    {id: '23', title: 'BioCarve Flower Mix', price: 89, image: null},
  ],
  'organic-millets-rice': [
    {id: '24', title: 'Foxtail Millet 1kg', price: 149, image: null},
    {id: '25', title: 'Little Millet 1kg', price: 169, image: null},
    {id: '26', title: 'Organic Brown Rice', price: 199, image: null},
  ],
  'falcon-1': [
    {id: '27', title: 'Falcon Hand Trowel', price: 299, image: null},
    {id: '28', title: 'Falcon Pruning Shears', price: 599, image: null},
    {id: '29', title: 'Falcon Garden Fork', price: 449, image: null},
  ],
};

const HomeScreen = ({navigation}: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 7000); // 7 seconds as per theme settings
    return () => clearInterval(timer);
  }, []);

  const openYouTube = () => {
    Linking.openURL(specialSections.videoSection.videoUrl);
  };

  const openMaps = (address: string) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Header cartCount={3} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 1. HERO SLIDESHOW */}
        <View style={styles.sliderContainer}>
          <View style={[styles.slide, {backgroundColor: colors.primary}]}>
            <Text style={styles.slideTitle}>{heroSlides[activeSlide].title}</Text>
            <Text style={styles.slideSubtitle}>{heroSlides[activeSlide].subtitle}</Text>
            <TouchableOpacity style={styles.slideButton}>
              <Text style={styles.slideButtonText}>{heroSlides[activeSlide].buttonText}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pagination}>
            {heroSlides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveSlide(index)}
                style={[
                  styles.paginationDot,
                  index === activeSlide && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* 2. ABOUT US - Rich Text */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About Us</Text>
          <Text style={styles.aboutPrevName}>Previously known as {brand.previousName}</Text>
          <Text style={styles.aboutText}>
            Sunantha Organic Farm is an urban initiative founded by IT professionals 
            to promote organic living. We support individuals in starting kitchen gardens, 
            terrace gardens, and organic farms by providing quality products, expert guidance, 
            and education on sustainable practices.
          </Text>
        </View>

        {/* 3. FEATURED COLLECTION: Native Organic Seeds */}
        <SectionHeader
          title="Native Organic Seeds"
          showViewAll
          onViewAll={() => {}}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['organic-seeds'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 4. FEATURED COLLECTION: JustBrews */}
        <SectionHeader
          title="JustBrews"
          subtitle="Coffee & Tea Powder"
          showViewAll
          onViewAll={() => {}}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['justbrews'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 5. FEATURED COLLECTION: Grow Bags */}
        <SectionHeader title="Grow Bags" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['grow-bags-for-terrace-garden'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 6. COLLECTION LIST: Our Collection */}
        <SectionHeader title="Our Collection" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionsContainer}>
          {collections.map(collection => (
            <CollectionCard
              key={collection.id}
              id={collection.id}
              name={collection.title}
              icon={collection.icon}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        {/* 7. FEATURED COLLECTION: Daily Deals */}
        <SectionHeader title="Daily Deals" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['daily-deals'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 8. FEATURED COLLECTION: Sea Weed Products */}
        <SectionHeader title="Sea Weed Products" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['sea-weed-products'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 9. FEATURED PRODUCT: Potting Soil */}
        <View style={styles.featuredProductSection}>
          <Text style={styles.featuredProductTitle}>Potting Soil</Text>
          <View style={styles.featuredProductCard}>
            <View style={styles.featuredProductImage}>
              <Text style={styles.featuredProductEmoji}>🪴</Text>
            </View>
            <View style={styles.featuredProductInfo}>
              <Text style={styles.featuredProductName}>Potting Mix - Premium Quality</Text>
              <Text style={styles.featuredProductPrice}>₹299</Text>
              <Text style={styles.featuredProductDesc}>
                High-quality potting mix for all your plants. Perfect for terrace gardens.
              </Text>
              <TouchableOpacity style={styles.featuredProductButton}>
                <Text style={styles.featuredProductButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 10. FEATURED COLLECTION: Skin & Hair Care */}
        <SectionHeader title="Skin & Hair Care" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['skin-and-hair-care'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 11. FEATURED COLLECTION: Live Plants & Saplings */}
        <SectionHeader title="Live Plants & Saplings" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['live-plants'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 12. FEATURED COLLECTION: BioCarve Seeds */}
        <SectionHeader title="BioCarve Seeds" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['biocarve'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 13. FEATURED COLLECTION: Rice and Millets */}
        <SectionHeader title="Rice and Millets" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['organic-millets-rice'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 14. FEATURED COLLECTION: Garden Tools */}
        <SectionHeader title="Garden Tools" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {sampleProducts['falcon-1'].map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 15. IMAGE WITH TEXT: Farm Visit */}
        <View style={styles.imageWithTextSection}>
          <View style={styles.imageWithTextImage}>
            <Text style={styles.imageWithTextEmoji}>🌾</Text>
          </View>
          <View style={styles.imageWithTextContent}>
            <Text style={styles.imageWithTextTitle}>{specialSections.farmVisit.title}</Text>
            <Text style={styles.imageWithTextDesc}>{specialSections.farmVisit.description}</Text>
            <TouchableOpacity style={styles.imageWithTextButton}>
              <Text style={styles.imageWithTextButtonText}>{specialSections.farmVisit.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 16. FROM THE BLOG */}
        <SectionHeader title="From The Blog" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.blogContainer}>
          {[1, 2, 3].map(i => (
            <TouchableOpacity key={i} style={styles.blogCard}>
              <View style={styles.blogImage}>
                <Text style={styles.blogEmoji}>📰</Text>
              </View>
              <Text style={styles.blogTitle}>Organic Gardening Tips #{i}</Text>
              <Text style={styles.blogDate}>Dec 2024</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 17. GALLERY */}
        <SectionHeader title="Gallery" />
        <View style={styles.galleryGrid}>
          {galleryImages.slice(0, 6).map((item, index) => (
            <TouchableOpacity key={index} style={styles.galleryItem}>
              <View style={styles.galleryImagePlaceholder}>
                <Text style={styles.galleryEmoji}>📷</Text>
              </View>
              {item.subtitle && (
                <Text style={styles.galleryCaption}>{item.subtitle}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 18. HERO VIDEO POPUP */}
        <TouchableOpacity style={styles.videoSection} onPress={openYouTube}>
          <View style={styles.videoContent}>
            <Text style={styles.videoPlayIcon}>▶️</Text>
            <Text style={styles.videoTitle}>{specialSections.videoSection.title}</Text>
            <Text style={styles.videoSubtitle}>{specialSections.videoSection.subtitle}</Text>
          </View>
        </TouchableOpacity>

        {/* 19. IMAGE WITH TEXT: Spirulina Training */}
        <View style={styles.imageWithTextSection}>
          <View style={styles.imageWithTextContent}>
            <Text style={styles.imageWithTextTitle}>{specialSections.spirulinaTraining.title}</Text>
            <Text style={styles.imageWithTextDesc}>{specialSections.spirulinaTraining.description}</Text>
            <TouchableOpacity style={styles.imageWithTextButton}>
              <Text style={styles.imageWithTextButtonText}>{specialSections.spirulinaTraining.buttonText}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imageWithTextImage}>
            <Text style={styles.imageWithTextEmoji}>🧪</Text>
          </View>
        </View>

        {/* 20. OUR BRANDS (Logo List) */}
        <SectionHeader title="Our Brands" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandsContainer}>
          {brands.map(brandItem => (
            <TouchableOpacity key={brandItem.id} style={styles.brandCard}>
              <View style={styles.brandLogo}>
                <Text style={styles.brandLogoText}>{brandItem.name[0]}</Text>
              </View>
              <Text style={styles.brandName}>{brandItem.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 21. MAP: Chennai Shop */}
        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>📍 {brand.locations.chennaiShop.name}</Text>
          <Text style={styles.mapAddress}>{brand.locations.chennaiShop.address}</Text>
          <Text style={styles.mapHours}>{brand.locations.chennaiShop.hours}</Text>
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => openMaps(brand.locations.chennaiShop.address)}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* 22. MAP: Farm & Outlet */}
        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>📍 {brand.locations.farm.name}</Text>
          <Text style={styles.mapAddress}>{brand.locations.farm.address}</Text>
          <Text style={styles.mapHours}>{brand.locations.farm.hours}</Text>
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => openMaps(brand.locations.farm.address)}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* 23. NEWSLETTER */}
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
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.newsletterButton}>
              <Text style={styles.newsletterButtonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>🌿 {brand.name}</Text>
          <Text style={styles.footerTagline}>{brand.tagline}</Text>
          
          <View style={styles.footerContact}>
            <Text style={styles.footerContactItem}>📧 {brand.email}</Text>
            <Text style={styles.footerContactItem}>📞 {brand.phone}</Text>
          </View>
          
          <View style={styles.socialLinks}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => Linking.openURL(brand.social.facebook)}>
              <Text style={styles.socialIcon}>📘</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => Linking.openURL(brand.social.instagram)}>
              <Text style={styles.socialIcon}>📸</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => Linking.openURL(brand.social.twitter)}>
              <Text style={styles.socialIcon}>🐦</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.footerCopyright}>© 2024 {brand.name}. All rights reserved</Text>
          <Text style={styles.paymentText}>We Accept: Razorpay • UPI • Cards • Net Banking</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  
  // Slideshow
  sliderContainer: {
    height: 220,
    position: 'relative',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 8,
    textAlign: 'center',
  },
  slideSubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  slideButton: {
    backgroundColor: colors.textWhite,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  slideButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.textWhite,
    width: 24,
  },
  
  // About
  aboutSection: {
    padding: 20,
    backgroundColor: colors.background,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  aboutPrevName: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  aboutText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
  },
  
  // Collections & Products
  collectionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  
  // Featured Product
  featuredProductSection: {
    margin: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  featuredProductTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  featuredProductCard: {
    flexDirection: 'row',
  },
  featuredProductImage: {
    width: 120,
    height: 120,
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredProductEmoji: {
    fontSize: 48,
  },
  featuredProductInfo: {
    flex: 1,
    marginLeft: 16,
  },
  featuredProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  featuredProductPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 4,
  },
  featuredProductDesc: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },
  featuredProductButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  featuredProductButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 12,
  },
  
  // Image with Text
  imageWithTextSection: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageWithTextImage: {
    width: '40%',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 180,
  },
  imageWithTextEmoji: {
    fontSize: 64,
  },
  imageWithTextContent: {
    flex: 1,
    padding: 16,
  },
  imageWithTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.headerPrimaryText,
    marginBottom: 8,
  },
  imageWithTextDesc: {
    fontSize: 12,
    color: colors.headerPrimaryText,
    lineHeight: 18,
    marginBottom: 12,
  },
  imageWithTextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  imageWithTextButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 12,
  },
  
  // Blog
  blogContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  blogCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  blogImage: {
    height: 100,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogEmoji: {
    fontSize: 36,
  },
  blogTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    padding: 12,
    paddingBottom: 4,
  },
  blogDate: {
    fontSize: 12,
    color: colors.textLight,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  
  // Gallery
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  galleryItem: {
    width: (width - 36) / 3,
    margin: 2,
  },
  galleryImagePlaceholder: {
    aspectRatio: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryEmoji: {
    fontSize: 24,
  },
  galleryCaption: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Video
  videoSection: {
    margin: 16,
    backgroundColor: colors.headerPrimaryText,
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoContent: {
    padding: 24,
    alignItems: 'center',
  },
  videoPlayIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 4,
  },
  videoSubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.8,
  },
  
  // Brands
  brandsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  brandCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  brandLogo: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandLogoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  brandName: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  
  // Map
  mapSection: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  mapAddress: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 4,
  },
  mapHours: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 12,
  },
  directionsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  directionsButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Newsletter
  newsletterSection: {
    backgroundColor: colors.footerBg,
    padding: 24,
    alignItems: 'center',
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 8,
    textAlign: 'center',
  },
  newsletterSubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.9,
    marginBottom: 16,
    textAlign: 'center',
  },
  newsletterForm: {
    flexDirection: 'row',
    width: '100%',
  },
  newsletterInput: {
    flex: 1,
    backgroundColor: colors.textWhite,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginRight: 8,
  },
  newsletterButton: {
    backgroundColor: colors.headerPrimaryText,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  newsletterButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  
  // Footer
  footer: {
    backgroundColor: colors.primary,
    padding: 24,
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 4,
  },
  footerTagline: {
    fontSize: 12,
    color: colors.textWhite,
    opacity: 0.9,
    marginBottom: 16,
  },
  footerContact: {
    marginBottom: 16,
  },
  footerContactItem: {
    fontSize: 14,
    color: colors.textWhite,
    marginBottom: 4,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 20,
  },
  footerCopyright: {
    fontSize: 12,
    color: colors.textWhite,
    opacity: 0.8,
    marginBottom: 4,
  },
  paymentText: {
    fontSize: 10,
    color: colors.textWhite,
    opacity: 0.7,
  },
});

export default HomeScreen;
