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
  newsletter,
} from '../constants/theme';
import {
  heroImages,
  categoryImages,
  productImages,
  brandImages,
  galleryImages as galleryImgs,
  mapImages,
  logoImage,
  specialImages,
} from '../config/shopify';

const {width} = Dimensions.get('window');

// Products with images
const allProducts = {
  'organic-seeds': [
    {id: '1', title: 'Native Tomato Seeds', price: 49, compareAtPrice: 69, image: productImages['organic-seeds'][0], description: 'High-quality organic tomato seeds for your kitchen garden.'},
    {id: '2', title: 'Organic Chilli Seeds', price: 39, compareAtPrice: 59, image: productImages['organic-seeds'][1], description: 'Spicy organic chilli seeds, perfect for Indian cooking.'},
    {id: '3', title: 'Brinjal Seeds Pack', price: 45, image: productImages['organic-seeds'][2], description: 'Premium brinjal seeds for healthy harvest.'},
    {id: '4', title: 'Lady Finger Seeds', price: 35, image: productImages['organic-seeds'][3], description: 'Fresh lady finger seeds for your garden.'},
    {id: '5', title: 'Coriander Seeds', price: 29, image: productImages['organic-seeds'][4], description: 'Aromatic coriander seeds for cooking and growing.'},
  ],
  'justbrews': [
    {id: '6', title: 'Filter Coffee Powder', price: 299, image: productImages['justbrews'][0], description: 'Authentic South Indian filter coffee.'},
    {id: '7', title: 'Green Tea Premium', price: 249, image: productImages['justbrews'][1], description: 'Premium green tea leaves.'},
    {id: '8', title: 'Herbal Tea Mix', price: 199, image: productImages['justbrews'][2], description: 'Healthy herbal tea blend.'},
  ],
  'grow-bags': [
    {id: '9', title: 'HDPE Grow Bag 15x15', price: 89, image: productImages['grow-bags'][0], description: 'Large HDPE grow bag for terrace garden.'},
    {id: '10', title: 'HDPE Grow Bag 12x12', price: 69, image: productImages['grow-bags'][1], description: 'Medium HDPE grow bag.'},
    {id: '11', title: 'Grow Bag Pack of 10', price: 399, compareAtPrice: 499, image: productImages['grow-bags'][2], description: 'Value pack of 10 grow bags.'},
  ],
  'daily-deals': [
    {id: '12', title: 'Combo: Seeds + Manure', price: 599, compareAtPrice: 899, image: productImages['daily-deals'][0], description: 'Complete starter combo pack.'},
    {id: '13', title: 'Garden Starter Kit', price: 1299, compareAtPrice: 1999, image: productImages['daily-deals'][1], description: 'Everything you need to start gardening.'},
    {id: '14', title: 'Organic Manure 5kg', price: 249, compareAtPrice: 349, image: productImages['daily-deals'][2], description: 'Premium organic manure.'},
  ],
  'sea-weed-products': [
    {id: '15', title: 'Seaweed Extract 1L', price: 449, compareAtPrice: 599, image: productImages['seaweed'][0], description: 'Concentrated seaweed extract.'},
    {id: '16', title: 'Liquid Seaweed Spray', price: 299, image: productImages['seaweed'][1], description: 'Ready to use seaweed spray.'},
  ],
  'skin-and-hair-care': [
    {id: '17', title: 'Organic Aloe Vera Gel', price: 199, image: productImages['skincare'][0], description: 'Pure organic aloe vera gel.'},
    {id: '18', title: 'Herbal Hair Oil', price: 349, image: productImages['skincare'][1], description: 'Natural herbal hair oil.'},
  ],
  'live-plants': [
    {id: '19', title: 'Lemongrass Plant', price: 149, image: productImages['plants'][0], description: 'Fresh lemongrass plant.'},
    {id: '20', title: 'Tulsi Plant', price: 99, image: productImages['plants'][1], description: 'Holy basil plant.'},
    {id: '21', title: 'Curry Leaves Plant', price: 179, image: productImages['plants'][2], description: 'Fresh curry leaves plant.'},
  ],
  'biocarve': [
    {id: '22', title: 'BioCarve Tomato Seeds', price: 59, image: productImages['biocarve'][0], description: 'Premium BioCarve tomato seeds.'},
    {id: '23', title: 'BioCarve Flower Mix', price: 89, image: productImages['biocarve'][1], description: 'Beautiful flower seed mix.'},
  ],
  'organic-millets-rice': [
    {id: '24', title: 'Foxtail Millet 1kg', price: 149, image: productImages['millets'][0], description: 'Organic foxtail millet.'},
    {id: '25', title: 'Little Millet 1kg', price: 169, image: productImages['millets'][1], description: 'Nutritious little millet.'},
    {id: '26', title: 'Organic Brown Rice', price: 199, image: productImages['millets'][2], description: 'Healthy brown rice.'},
  ],
  'falcon-1': [
    {id: '27', title: 'Falcon Hand Trowel', price: 299, image: productImages['tools'][0], description: 'Premium garden hand trowel.'},
    {id: '28', title: 'Falcon Pruning Shears', price: 599, image: productImages['tools'][1], description: 'Sharp pruning shears.'},
    {id: '29', title: 'Falcon Garden Fork', price: 449, image: productImages['tools'][2], description: 'Sturdy garden fork.'},
  ],
};

// Collection images
const collectionImageMap: {[key: string]: string} = {
  'organic-manures': categoryImages.manures,
  'organic-seeds': categoryImages.seeds,
  'organic-millets-rice': categoryImages.millets,
  'falcon-1': categoryImages.tools,
  'grow-bags-for-terrace-garden': categoryImages.growBags,
  'skin-and-hair-care': categoryImages.skincare,
  'sea-weed-products': categoryImages.seaweed,
  'our-packages': categoryImages.packages,
  'potting-medium': categoryImages.potting,
  'garden-sprayer': categoryImages.sprayer,
  'live-plants': categoryImages.plants,
};

const HomeScreen = ({navigation}: any) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const navigateToProduct = (product: any) => {
    navigation.navigate('ProductDetail', {product});
  };

  const openYouTube = () => {
    Linking.openURL(specialSections.videoSection.videoUrl);
  };

  const openMaps = (address: string) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const renderProductSection = (categoryId: string, title: string, subtitle?: string) => {
    const products = allProducts[categoryId as keyof typeof allProducts] || [];
    return (
      <>
        <SectionHeader title={title} subtitle={subtitle} showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              image={product.image}
              onPress={() => navigateToProduct(product)}
              onAddToCart={() => {}}
            />
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header cartCount={3} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 1. HERO SLIDESHOW */}
        <View style={styles.sliderContainer}>
          <ImageBackground
            source={{uri: heroImages[activeSlide]}}
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

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoTitle}>🎄 Holiday Special! 🎄</Text>
          <Text style={styles.promoText}>Use code AADI15 for Flat 15% OFF!</Text>
        </View>

        {/* 2. ABOUT US */}
        <View style={styles.aboutSection}>
          <Image source={{uri: logoImage}} style={styles.aboutLogo} resizeMode="contain" />
          <Text style={styles.aboutTitle}>About Us</Text>
          <Text style={styles.aboutPrevName}>Previously known as {brand.previousName}</Text>
          <Text style={styles.aboutText}>
            Sunantha Organic Farm is an urban initiative founded by IT professionals 
            to promote organic living. We support individuals in starting kitchen gardens, 
            terrace gardens, and organic farms.
          </Text>
        </View>

        {/* Featured Collections */}
        {renderProductSection('organic-seeds', 'Native Organic Seeds')}
        {renderProductSection('justbrews', 'JustBrews', 'Coffee & Tea Powder')}
        {renderProductSection('grow-bags', 'Grow Bags')}

        {/* Collection List */}
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
              image={collectionImageMap[collection.id]}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        {/* More Collections */}
        {renderProductSection('daily-deals', 'Daily Deals')}
        {renderProductSection('sea-weed-products', 'Sea Weed Products')}

        {/* Featured Product */}
        <View style={styles.featuredProductSection}>
          <Text style={styles.featuredProductTitle}>Potting Soil</Text>
          <TouchableOpacity 
            style={styles.featuredProductCard}
            onPress={() => navigateToProduct({
              id: 'potting-soil',
              title: 'Potting Mix - Premium Quality',
              price: 299,
              compareAtPrice: 399,
              image: categoryImages.potting,
              description: 'High-quality potting mix for all your plants.',
            })}>
            <Image source={{uri: categoryImages.potting}} style={styles.featuredProductImg} resizeMode="cover" />
            <View style={styles.featuredProductInfo}>
              <Text style={styles.featuredProductName}>Potting Mix - Premium Quality</Text>
              <Text style={styles.featuredProductPrice}>₹299</Text>
              <Text style={styles.featuredProductDesc}>Perfect for terrace gardens</Text>
              <TouchableOpacity style={styles.featuredProductButton}>
                <Text style={styles.featuredProductButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {renderProductSection('skin-and-hair-care', 'Skin & Hair Care')}
        {renderProductSection('live-plants', 'Live Plants & Saplings')}
        {renderProductSection('biocarve', 'BioCarve Seeds')}
        {renderProductSection('organic-millets-rice', 'Rice and Millets')}
        {renderProductSection('falcon-1', 'Garden Tools')}

        {/* Farm Visit */}
        <View style={styles.imageWithTextSection}>
          <Image source={{uri: specialImages.farmVisit}} style={styles.imageWithTextImg} resizeMode="cover" />
          <View style={styles.imageWithTextContent}>
            <Text style={styles.imageWithTextTitle}>Farm Visit</Text>
            <Text style={styles.imageWithTextDesc} numberOfLines={4}>
              Visit our organic farm and learn traditional farming methods.
            </Text>
            <TouchableOpacity style={styles.imageWithTextButton}>
              <Text style={styles.imageWithTextButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Blog */}
        <SectionHeader title="From The Blog" showViewAll onViewAll={() => {}} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.blogContainer}>
          {[specialImages.blog1, specialImages.blog2, specialImages.blog3].map((img, i) => (
            <TouchableOpacity key={i} style={styles.blogCard}>
              <Image source={{uri: img}} style={styles.blogImage} resizeMode="cover" />
              <Text style={styles.blogTitle}>Gardening Tips #{i + 1}</Text>
              <Text style={styles.blogDate}>Dec 2024</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Gallery */}
        <SectionHeader title="Gallery" />
        <View style={styles.galleryGrid}>
          {galleryImgs.map((img, index) => (
            <TouchableOpacity key={index} style={styles.galleryItem}>
              <Image source={{uri: img}} style={styles.galleryImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Video */}
        <TouchableOpacity style={styles.videoSection} onPress={openYouTube}>
          <Text style={styles.videoPlayIcon}>▶️</Text>
          <Text style={styles.videoTitle}>Watch: Interview with Director</Text>
          <Text style={styles.videoSubtitle}>How to identify fake organic products</Text>
        </TouchableOpacity>

        {/* Spirulina */}
        <View style={[styles.imageWithTextSection, styles.imageWithTextReverse]}>
          <View style={styles.imageWithTextContent}>
            <Text style={styles.imageWithTextTitle}>Spirulina Training</Text>
            <Text style={styles.imageWithTextDesc} numberOfLines={4}>
              Learn spirulina cultivation with our expert guidance.
            </Text>
            <TouchableOpacity style={styles.imageWithTextButton}>
              <Text style={styles.imageWithTextButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <Image source={{uri: specialImages.spirulina}} style={styles.imageWithTextImg} resizeMode="cover" />
        </View>

        {/* Brands */}
        <SectionHeader title="Our Brands" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandsContainer}>
          {Object.entries(brandImages).map(([name, img]) => (
            <TouchableOpacity key={name} style={styles.brandCard}>
              <Image source={{uri: img}} style={styles.brandLogo} resizeMode="contain" />
              <Text style={styles.brandName}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Maps */}
        <View style={styles.mapSection}>
          <Image source={{uri: mapImages.chennai}} style={styles.mapImage} resizeMode="cover" />
          <View style={styles.mapInfo}>
            <Text style={styles.mapTitle}>📍 Chennai Shop</Text>
            <Text style={styles.mapAddress}>{brand.locations.chennaiShop.address}</Text>
            <TouchableOpacity style={styles.directionsButton} onPress={() => openMaps(brand.locations.chennaiShop.address)}>
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mapSection}>
          <Image source={{uri: mapImages.farm}} style={styles.mapImage} resizeMode="cover" />
          <View style={styles.mapInfo}>
            <Text style={styles.mapTitle}>📍 Our Farm</Text>
            <Text style={styles.mapAddress}>{brand.locations.farm.address}</Text>
            <TouchableOpacity style={styles.directionsButton} onPress={() => openMaps(brand.locations.farm.address)}>
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
          <Image source={{uri: logoImage}} style={styles.footerLogoImg} resizeMode="contain" />
          <Text style={styles.footerLogo}>🌿 {brand.name}</Text>
          <Text style={styles.footerContact}>📧 {brand.email} | 📞 {brand.phone}</Text>
          <View style={styles.socialLinks}>
            {['📘', '📸', '🐦'].map((icon, i) => (
              <TouchableOpacity key={i} style={styles.socialButton}>
                <Text style={styles.socialIcon}>{icon}</Text>
              </TouchableOpacity>
            ))}
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
  sliderContainer: {height: 220, position: 'relative'},
  slide: {flex: 1, justifyContent: 'flex-end'},
  slideImage: {opacity: 0.9},
  slideOverlay: {backgroundColor: 'rgba(0,0,0,0.4)', padding: 20, paddingBottom: 40},
  slideTitle: {fontSize: 28, fontWeight: 'bold', color: colors.textWhite, marginBottom: 8},
  slideSubtitle: {fontSize: 14, color: colors.textWhite, opacity: 0.9, marginBottom: 16},
  slideButton: {backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, alignSelf: 'flex-start'},
  slideButtonText: {color: colors.textWhite, fontWeight: '600'},
  pagination: {flexDirection: 'row', position: 'absolute', bottom: 16, alignSelf: 'center'},
  paginationDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 4},
  paginationDotActive: {backgroundColor: colors.textWhite, width: 24},
  promoBanner: {backgroundColor: '#c41e3a', padding: 16, alignItems: 'center'},
  promoTitle: {fontSize: 18, fontWeight: 'bold', color: colors.textWhite},
  promoText: {fontSize: 14, color: colors.textWhite, marginTop: 4},
  aboutSection: {padding: 20, alignItems: 'center'},
  aboutLogo: {width: 80, height: 80, marginBottom: 12},
  aboutTitle: {fontSize: 22, fontWeight: 'bold', color: colors.primary, marginBottom: 8},
  aboutPrevName: {fontSize: 12, color: colors.textLight, fontStyle: 'italic', marginBottom: 12},
  aboutText: {fontSize: 14, color: colors.text, lineHeight: 22, textAlign: 'center'},
  collectionsContainer: {paddingHorizontal: 16, paddingBottom: 20},
  productsContainer: {paddingHorizontal: 16, paddingBottom: 20},
  featuredProductSection: {margin: 16, backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 16},
  featuredProductTitle: {fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12},
  featuredProductCard: {flexDirection: 'row'},
  featuredProductImg: {width: 120, height: 120, borderRadius: 8},
  featuredProductInfo: {flex: 1, marginLeft: 16},
  featuredProductName: {fontSize: 16, fontWeight: '600', color: colors.text},
  featuredProductPrice: {fontSize: 20, fontWeight: 'bold', color: colors.primary, marginVertical: 4},
  featuredProductDesc: {fontSize: 12, color: colors.textLight},
  featuredProductButton: {backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start', marginTop: 8},
  featuredProductButtonText: {color: colors.textWhite, fontWeight: '600', fontSize: 12},
  imageWithTextSection: {flexDirection: 'row', margin: 16, backgroundColor: colors.backgroundSecondary, borderRadius: 12, overflow: 'hidden'},
  imageWithTextReverse: {flexDirection: 'row-reverse'},
  imageWithTextImg: {width: '40%', minHeight: 150},
  imageWithTextContent: {flex: 1, padding: 16},
  imageWithTextTitle: {fontSize: 18, fontWeight: 'bold', color: colors.headerPrimaryText, marginBottom: 8},
  imageWithTextDesc: {fontSize: 12, color: colors.headerPrimaryText, lineHeight: 18, marginBottom: 12},
  imageWithTextButton: {backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start'},
  imageWithTextButtonText: {color: colors.textWhite, fontWeight: '600', fontSize: 12},
  blogContainer: {paddingHorizontal: 16, paddingBottom: 20},
  blogCard: {width: 180, marginRight: 12, backgroundColor: colors.background, borderRadius: 8, overflow: 'hidden', elevation: 2},
  blogImage: {height: 100, width: '100%'},
  blogTitle: {fontSize: 14, fontWeight: '500', color: colors.text, padding: 12, paddingBottom: 4},
  blogDate: {fontSize: 12, color: colors.textLight, paddingHorizontal: 12, paddingBottom: 12},
  galleryGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 20},
  galleryItem: {width: (width - 36) / 3, aspectRatio: 1, margin: 2, borderRadius: 4, overflow: 'hidden'},
  galleryImage: {width: '100%', height: '100%'},
  videoSection: {margin: 16, backgroundColor: colors.headerPrimaryText, borderRadius: 12, padding: 24, alignItems: 'center'},
  videoPlayIcon: {fontSize: 48, marginBottom: 12},
  videoTitle: {fontSize: 18, fontWeight: 'bold', color: colors.textWhite, marginBottom: 4},
  videoSubtitle: {fontSize: 14, color: colors.textWhite, opacity: 0.8},
  brandsContainer: {paddingHorizontal: 16, paddingBottom: 20},
  brandCard: {alignItems: 'center', marginRight: 20},
  brandLogo: {width: 70, height: 70, borderRadius: 8, backgroundColor: colors.background, marginBottom: 8},
  brandName: {fontSize: 12, color: colors.text, fontWeight: '500'},
  mapSection: {margin: 16, backgroundColor: colors.backgroundSecondary, borderRadius: 12, overflow: 'hidden'},
  mapImage: {width: '100%', height: 100},
  mapInfo: {padding: 16},
  mapTitle: {fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 8},
  mapAddress: {fontSize: 14, color: colors.textLight, marginBottom: 12},
  directionsButton: {backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start'},
  directionsButtonText: {color: colors.textWhite, fontWeight: '600', fontSize: 14},
  newsletterSection: {backgroundColor: colors.footerBg, padding: 24, alignItems: 'center'},
  newsletterTitle: {fontSize: 20, fontWeight: 'bold', color: colors.textWhite, marginBottom: 8},
  newsletterSubtitle: {fontSize: 14, color: colors.textWhite, opacity: 0.9, marginBottom: 16, textAlign: 'center'},
  newsletterForm: {flexDirection: 'row', width: '100%'},
  newsletterInput: {flex: 1, backgroundColor: colors.textWhite, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginRight: 8},
  newsletterButton: {backgroundColor: colors.headerPrimaryText, paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center'},
  newsletterButtonText: {color: colors.textWhite, fontWeight: '600'},
  footer: {backgroundColor: colors.primary, padding: 24, alignItems: 'center'},
  footerLogoImg: {width: 60, height: 60, marginBottom: 8},
  footerLogo: {fontSize: 18, fontWeight: 'bold', color: colors.textWhite, marginBottom: 8},
  footerContact: {fontSize: 14, color: colors.textWhite, marginBottom: 16},
  socialLinks: {flexDirection: 'row', gap: 12, marginBottom: 16},
  socialButton: {width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center'},
  socialIcon: {fontSize: 20},
  footerCopyright: {fontSize: 12, color: colors.textWhite, opacity: 0.8},
});

export default HomeScreen;
