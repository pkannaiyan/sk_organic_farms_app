import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Header from '../components/Header';
import SectionHeader from '../components/SectionHeader';
import CollectionCard from '../components/CollectionCard';
import ProductCard from '../components/ProductCard';
import {colors, collections, brand} from '../constants/theme';

const {width} = Dimensions.get('window');

// Sample products data
const featuredProducts = [
  {id: '1', title: 'Potting Mix - Premium Soil', price: 299, compareAtPrice: 399},
  {id: '2', title: 'Organic Neem Cake Powder', price: 199, compareAtPrice: 249},
  {id: '3', title: 'Vermicompost 5kg Pack', price: 349},
  {id: '4', title: 'Native Tomato Seeds', price: 49, compareAtPrice: 69},
  {id: '5', title: 'HDPE Grow Bag 15x15', price: 89},
];

const dailyDeals = [
  {id: '6', title: 'Organic Manure Combo Pack', price: 599, compareAtPrice: 899},
  {id: '7', title: 'Kitchen Garden Starter Kit', price: 1299, compareAtPrice: 1999},
  {id: '8', title: 'Seaweed Extract 1L', price: 449, compareAtPrice: 599},
];

const slides = [
  {
    title: 'Garden Setup',
    subtitle: 'Shade House and Vegetable & Herbal Garden Setup',
    buttonText: 'View All Products',
    bg: colors.primary,
  },
  {
    title: 'Native Organic Seeds',
    subtitle: 'Vegetable, Flower, Tree, Fruit & Herbal Seeds',
    buttonText: 'Shop Now',
    bg: colors.primaryDark,
  },
  {
    title: 'Garden Tools',
    subtitle: 'Premium quality tools for your garden',
    buttonText: 'Explore',
    bg: '#2d5a27',
  },
];

const HomeScreen = () => {
  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Header cartCount={3} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Slider */}
        <View style={styles.sliderContainer}>
          <View style={[styles.slide, {backgroundColor: slides[activeSlide].bg}]}>
            <Text style={styles.slideTitle}>{slides[activeSlide].title}</Text>
            <Text style={styles.slideSubtitle}>{slides[activeSlide].subtitle}</Text>
            <TouchableOpacity style={styles.slideButton}>
              <Text style={styles.slideButtonText}>{slides[activeSlide].buttonText}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeSlide && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* About Us */}
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

        {/* Collections */}
        <SectionHeader title="Our Collection" showViewAll onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionsContainer}>
          {collections.map(collection => (
            <CollectionCard
              key={collection.id}
              id={collection.id}
              name={collection.name}
              icon={collection.icon}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        {/* Featured Products */}
        <SectionHeader
          title="Native Organic Seeds"
          showViewAll
          onViewAll={() => {}}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {featuredProducts.map(product => (
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

        {/* Daily Deals */}
        <SectionHeader
          title="Daily Deals"
          subtitle="Limited time offers"
          showViewAll
          onViewAll={() => {}}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}>
          {dailyDeals.map(product => (
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

        {/* Farm Visit Banner */}
        <View style={styles.bannerSection}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>🌾 Farm Visit</Text>
            <Text style={styles.bannerText}>
              Visit our organic farm in Melkothakuppam and learn traditional farming methods. 
              We welcome schools, colleges, and corporate groups.
            </Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Services */}
        <SectionHeader title="Our Services" />
        <View style={styles.servicesGrid}>
          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🏡</Text>
            <Text style={styles.serviceTitle}>Garden Setup</Text>
            <Text style={styles.serviceDesc}>Complete terrace garden setup</Text>
          </View>
          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🌿</Text>
            <Text style={styles.serviceTitle}>Spirulina Training</Text>
            <Text style={styles.serviceDesc}>Learn spirulina cultivation</Text>
          </View>
          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>📚</Text>
            <Text style={styles.serviceTitle}>Expert Guidance</Text>
            <Text style={styles.serviceDesc}>Get help from professionals</Text>
          </View>
          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🚚</Text>
            <Text style={styles.serviceTitle}>Free Delivery</Text>
            <Text style={styles.serviceDesc}>On orders above ₹500</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>📧 {brand.email}</Text>
            <Text style={styles.contactItem}>📞 {brand.phone}</Text>
          </View>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>📘</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>📸</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>🐦</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>🌿 {brand.name}</Text>
          <Text style={styles.footerTagline}>{brand.tagline}</Text>
          <Text style={styles.footerCopyright}>© 2024 All rights reserved</Text>
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
  sliderContainer: {
    height: 200,
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
  collectionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bannerSection: {
    margin: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerContent: {
    padding: 20,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.headerPrimaryText,
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: colors.headerPrimaryText,
    lineHeight: 20,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  serviceCard: {
    width: (width - 44) / 2,
    backgroundColor: colors.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  contactSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 20,
  },
  footer: {
    backgroundColor: colors.footerBg,
    padding: 24,
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.footerText,
    marginBottom: 4,
  },
  footerTagline: {
    fontSize: 12,
    color: colors.footerText,
    opacity: 0.8,
    marginBottom: 8,
  },
  footerCopyright: {
    fontSize: 10,
    color: colors.footerText,
    opacity: 0.6,
  },
});

export default HomeScreen;

