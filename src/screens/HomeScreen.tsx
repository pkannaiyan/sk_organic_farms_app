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
  ImageBackground,
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
  specialSections,
  galleryImages,
  newsletter,
} from '../constants/theme';
import {themeImages, CDN_BASE_URL} from '../config/shopify';

const {width} = Dimensions.get('window');

// Helper to get CDN image URL
const getCdnImage = (filename: string) => `${CDN_BASE_URL}/${filename}`;

// Sample products - In production, these would come from Shopify API
const sampleProducts = {
  'organic-seeds': [
    {id: '1', title: 'Native Tomato Seeds', price: 49, compareAtPrice: 69, image: getCdnImage('IMG-2091.png')},
    {id: '2', title: 'Organic Chilli Seeds', price: 39, compareAtPrice: 59, image: getCdnImage('IMG-2091.png')},
    {id: '3', title: 'Brinjal Seeds Pack', price: 45, image: getCdnImage('IMG-2091.png')},
    {id: '4', title: 'Lady Finger Seeds', price: 35, image: getCdnImage('IMG-2091.png')},
    {id: '5', title: 'Coriander Seeds', price: 29, image: getCdnImage('IMG-2091.png')},
  ],
  'justbrews': [
    {id: '6', title: 'Filter Coffee Powder', price: 299, image: getCdnImage('JustBrew_logo.png')},
    {id: '7', title: 'Green Tea Premium', price: 249, image: getCdnImage('JustBrew_logo.png')},
    {id: '8', title: 'Herbal Tea Mix', price: 199, image: getCdnImage('JustBrew_logo.png')},
  ],
  'grow-bags-for-terrace-garden': [
    {id: '9', title: 'HDPE Grow Bag 15x15', price: 89, image: getCdnImage('grow_bag.jpg')},
    {id: '10', title: 'HDPE Grow Bag 12x12', price: 69, image: getCdnImage('grow_bag.jpg')},
    {id: '11', title: 'Grow Bag Pack of 10', price: 399, compareAtPrice: 499, image: getCdnImage('IMG-2104.png')},
  ],
  'daily-deals': [
    {id: '12', title: 'Combo: Seeds + Manure', price: 599, compareAtPrice: 899, image: getCdnImage('daily.png')},
    {id: '13', title: 'Garden Starter Kit', price: 1299, compareAtPrice: 1999, image: getCdnImage('IMG-2097.png')},
    {id: '14', title: 'Organic Manure 5kg', price: 249, compareAtPrice: 349, image: getCdnImage('IMG-2096.png')},
  ],
  'sea-weed-products': [
    {id: '15', title: 'Seaweed Extract 1L', price: 449, compareAtPrice: 599, image: getCdnImage('SEAWEED.jpg')},
    {id: '16', title: 'Liquid Seaweed Spray', price: 299, image: getCdnImage('SEAWEED.jpg')},
  ],
  'skin-and-hair-care': [
    {id: '17', title: 'Organic Aloe Vera Gel', price: 199, image: getCdnImage('4786E3F2-BDCD-484D-9274-66DE8A5A4834.webp')},
    {id: '18', title: 'Herbal Hair Oil', price: 349, image: getCdnImage('4786E3F2-BDCD-484D-9274-66DE8A5A4834.webp')},
  ],
  'live-plants': [
    {id: '19', title: 'Lemongrass Plant', price: 149, image: getCdnImage('LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg')},
    {id: '20', title: 'Tulsi Plant', price: 99, image: getCdnImage('LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg')},
    {id: '21', title: 'Curry Leaves Plant', price: 179, image: getCdnImage('LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg')},
  ],
  'biocarve': [
    {id: '22', title: 'BioCarve Tomato Seeds', price: 59, image: getCdnImage('biocurve.jpg')},
    {id: '23', title: 'BioCarve Flower Mix', price: 89, image: getCdnImage('biocurve.jpg')},
  ],
  'organic-millets-rice': [
    {id: '24', title: 'Foxtail Millet 1kg', price: 149, image: getCdnImage('best_seller.jpg')},
    {id: '25', title: 'Little Millet 1kg', price: 169, image: getCdnImage('best_seller.jpg')},
    {id: '26', title: 'Organic Brown Rice', price: 199, image: getCdnImage('best_seller.jpg')},
  ],
  'falcon-1': [
    {id: '27', title: 'Falcon Hand Trowel', price: 299, image: getCdnImage('falcon.jpg')},
    {id: '28', title: 'Falcon Pruning Shears', price: 599, image: getCdnImage('falcon.jpg')},
    {id: '29', title: 'Falcon Garden Fork', price: 449, image: getCdnImage('falcon.jpg')},
  ],
};

// Collection images mapping
const collectionImages: {[key: string]: string} = {
  'organic-manures': getCdnImage('IMG-2096.png'),
  'organic-seeds': getCdnImage('IMG-2091.png'),
  'organic-millets-rice': getCdnImage('best_seller.jpg'),
  'falcon-1': getCdnImage('falcon.jpg'),
  'grow-bags-for-terrace-garden': getCdnImage('IMG-2104.png'),
  'skin-and-hair-care': getCdnImage('4786E3F2-BDCD-484D-9274-66DE8A5A4834.webp'),
  'sea-weed-products': getCdnImage('SEAWEED.jpg'),
  'our-packages': getCdnImage('IMG-2097.png'),
  'potting-medium': getCdnImage('IMG-2090.png'),
  'garden-sprayer': getCdnImage('3110-05.jpg'),
  'live-plants': getCdnImage('LemonGrass_e7758c23-de7a-4c5d-8689-dd59209ba9f5.jpg'),
};

const HomeScreen = ({navigation}: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');

  // Hero slide images
  const slideImages = [
    getCdnImage('IMG_2100.png'),
    getCdnImage('IMG_2099.png'),
    getCdnImage('IMG_2101.png'),
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 7000);
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
        
        {/* 1. HERO SLIDESHOW with actual images */}
        <View style={styles.sliderContainer}>
          <ImageBackground
            source={{uri: slideImages[activeSlide]}}
            style={styles.slide}
            imageStyle={styles.slideImage}>
            <View style={styles.slideOverlay}>
              <Text style={styles.slideTitle}>{heroSlides[activeSlide].title}</Text>
              <Text style={styles.slideSubtitle}>{heroSlides[activeSlide].subtitle}</Text>
              <TouchableOpacity style={styles.slideButton}>
                <Text style={styles.slideButtonText}>{heroSlides[activeSlide].buttonText}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
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

        {/* Promo Banner - Christmas/Holiday Theme */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoTitle}>🎄 Holiday Special! 🎄</Text>
          <Text style={styles.promoText}>
            Use code AADI15 for Flat 15% OFF on all orders!
          </Text>
        </View>

        {/* 2. ABOUT US */}
        <View style={styles.aboutSection}>
          <Image 
            source={{uri: themeImages.logo}}
            style={styles.aboutLogo}
            resizeMode="contain"
          />
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
        <SectionHeader title="Native Organic Seeds" showViewAll onViewAll={() => {}} />
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
              image={product.image}
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
              image={product.image}
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
              image={product.image}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 6. COLLECTION LIST: Our Collection with actual images */}
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
              image={collectionImages[collection.id]}
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
              image={product.image}
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
              image={product.image}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 9. FEATURED PRODUCT: Potting Soil with image */}
        <View style={styles.featuredProductSection}>
          <Text style={styles.featuredProductTitle}>Potting Soil</Text>
          <View style={styles.featuredProductCard}>
            <Image
              source={{uri: getCdnImage('IMG-2090.png')}}
              style={styles.featuredProductImg}
              resizeMode="cover"
            />
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
              image={product.image}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 11. FEATURED COLLECTION: Live Plants */}
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
              image={product.image}
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
              image={product.image}
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
              image={product.image}
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
              image={product.image}
              onPress={() => {}}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>

        {/* 15. IMAGE WITH TEXT: Farm Visit */}
        <View style={styles.imageWithTextSection}>
          <Image
            source={{uri: getCdnImage('DSC_0253.JPG')}}
            style={styles.imageWithTextImg}
            resizeMode="cover"
          />
          <View style={styles.imageWithTextContent}>
            <Text style={styles.imageWithTextTitle}>{specialSections.farmVisit.title}</Text>
            <Text style={styles.imageWithTextDesc} numberOfLines={5}>
              {specialSections.farmVisit.description}
            </Text>
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
              <Image
                source={{uri: getCdnImage('DSC_0253.JPG')}}
                style={styles.blogImage}
                resizeMode="cover"
              />
              <Text style={styles.blogTitle}>Organic Gardening Tips #{i}</Text>
              <Text style={styles.blogDate}>Dec 2024</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 17. GALLERY with actual images */}
        <SectionHeader title="Gallery" />
        <View style={styles.galleryGrid}>
          {[
            'SPIRU9.jpg',
            'IMG-2097.png',
            'DSC_0253.JPG',
            'DSC_0192.JPG',
            'IMG_1355.JPG',
            'IMG-2097.png',
          ].map((img, index) => (
            <TouchableOpacity key={index} style={styles.galleryItem}>
              <Image
                source={{uri: getCdnImage(img)}}
                style={styles.galleryImage}
                resizeMode="cover"
              />
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
        <View style={[styles.imageWithTextSection, styles.imageWithTextReverse]}>
          <View style={styles.imageWithTextContent}>
            <Text style={styles.imageWithTextTitle}>{specialSections.spirulinaTraining.title}</Text>
            <Text style={styles.imageWithTextDesc} numberOfLines={5}>
              {specialSections.spirulinaTraining.description}
            </Text>
            <TouchableOpacity style={styles.imageWithTextButton}>
              <Text style={styles.imageWithTextButtonText}>{specialSections.spirulinaTraining.buttonText}</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{uri: getCdnImage('DSC_0237.JPG')}}
            style={styles.imageWithTextImg}
            resizeMode="cover"
          />
        </View>

        {/* 20. OUR BRANDS with actual logos */}
        <SectionHeader title="Our Brands" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandsContainer}>
          {[
            {name: 'Falcon', image: 'falcon.jpg'},
            {name: 'SKOF', image: 'SKOF_new_logo_tm_9b6a7846-af4e-4def-ac18-8b7165eaf2b9.jpg'},
            {name: 'Bellota', image: 'bellota_logo.jpg'},
            {name: 'EPLA', image: 'EPLA-logo_802a7aba-6c86-4917-a3f7-6d457d52659c.jpeg'},
            {name: 'BioCarve', image: 'biocurve.jpg'},
          ].map((brandItem, index) => (
            <TouchableOpacity key={index} style={styles.brandCard}>
              <Image
                source={{uri: getCdnImage(brandItem.image)}}
                style={styles.brandLogo}
                resizeMode="contain"
              />
              <Text style={styles.brandName}>{brandItem.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 21. MAP: Chennai Shop */}
        <View style={styles.mapSection}>
          <Image
            source={{uri: getCdnImage('holding-compass-up.jpg')}}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <View style={styles.mapInfo}>
            <Text style={styles.mapTitle}>📍 {brand.locations.chennaiShop.name}</Text>
            <Text style={styles.mapAddress}>{brand.locations.chennaiShop.address}</Text>
            <Text style={styles.mapHours}>{brand.locations.chennaiShop.hours}</Text>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={() => openMaps(brand.locations.chennaiShop.address)}>
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 22. MAP: Farm & Outlet */}
        <View style={styles.mapSection}>
          <Image
            source={{uri: getCdnImage('open-compass-on-world-map.jpg')}}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <View style={styles.mapInfo}>
            <Text style={styles.mapTitle}>📍 {brand.locations.farm.name}</Text>
            <Text style={styles.mapAddress}>{brand.locations.farm.address}</Text>
            <Text style={styles.mapHours}>{brand.locations.farm.hours}</Text>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={() => openMaps(brand.locations.farm.address)}>
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
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
          <Image 
            source={{uri: themeImages.logo}}
            style={styles.footerLogoImg}
            resizeMode="contain"
          />
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
    justifyContent: 'flex-end',
  },
  slideImage: {
    opacity: 0.9,
  },
  slideOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    paddingBottom: 40,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.9,
    marginBottom: 16,
  },
  slideButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  slideButtonText: {
    color: colors.textWhite,
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

  // Promo Banner
  promoBanner: {
    backgroundColor: '#c41e3a', // Christmas red
    padding: 16,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  promoText: {
    fontSize: 14,
    color: colors.textWhite,
    marginTop: 4,
  },
  
  // About
  aboutSection: {
    padding: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  aboutLogo: {
    width: 100,
    height: 100,
    marginBottom: 16,
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
  featuredProductImg: {
    width: 120,
    height: 120,
    borderRadius: 8,
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
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageWithTextReverse: {
    flexDirection: 'row-reverse',
  },
  imageWithTextImg: {
    width: '40%',
    minHeight: 180,
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
    width: '100%',
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
    aspectRatio: 1,
    margin: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
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
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  
  // Map
  mapSection: {
    margin: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: 120,
  },
  mapInfo: {
    padding: 16,
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
  footerLogoImg: {
    width: 80,
    height: 80,
    marginBottom: 12,
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
