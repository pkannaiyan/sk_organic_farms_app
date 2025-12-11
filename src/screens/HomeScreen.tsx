/**
 * Home Screen
 * Features collections, featured products, and search
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CollectionQueries, ProductQueries } from '../services/shopifyApi';
import { APP_CONFIG } from '../config/shopify';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load collections
      const collectionsResponse: any = await CollectionQueries.getCollections(10);
      if (collectionsResponse.collections?.edges) {
        setCollections(collectionsResponse.collections.edges.map((e: any) => e.node));
      }

      // Load featured products
      const productsResponse: any = await ProductQueries.getProducts(10);
      if (productsResponse.products?.edges) {
        setFeaturedProducts(productsResponse.products.edges.map((e: any) => e.node));
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search', { query: searchQuery });
    }
  };

  const renderBanner = () => (
    <View style={styles.banner}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>🌿 Fresh Organic</Text>
        <Text style={styles.bannerSubtitle}>Farm to Your Doorstep</Text>
        <Text style={styles.bannerOffer}>Get 15% OFF with code: ORGANIC15</Text>
        <TouchableOpacity 
          style={styles.bannerButton}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.bannerButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Icon name="magnify" size={24} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search organic products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCollections = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.collectionsContainer}
      >
        {collections.map((collection) => (
          <TouchableOpacity
            key={collection.id}
            style={styles.collectionCard}
            onPress={() => navigation.navigate('Collection', { 
              handle: collection.handle,
              title: collection.title 
            })}
          >
            <View style={styles.collectionImageContainer}>
              {collection.image?.url ? (
                <Image
                  source={{ uri: collection.image.url }}
                  style={styles.collectionImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.collectionPlaceholder}>
                  <Icon name="leaf" size={30} color={APP_CONFIG.PRIMARY_COLOR} />
                </View>
              )}
            </View>
            <Text style={styles.collectionTitle} numberOfLines={2}>
              {collection.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFeaturedProducts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={featuredProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { 
              handle: item.handle,
              title: item.title 
            })}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsContainer}
      />
    </View>
  );

  const renderFeatures = () => (
    <View style={styles.featuresContainer}>
      <View style={styles.featureItem}>
        <Icon name="truck-delivery" size={28} color={APP_CONFIG.PRIMARY_COLOR} />
        <Text style={styles.featureText}>Free Delivery</Text>
        <Text style={styles.featureSubtext}>On orders above ₹500</Text>
      </View>
      <View style={styles.featureItem}>
        <Icon name="leaf" size={28} color={APP_CONFIG.PRIMARY_COLOR} />
        <Text style={styles.featureText}>100% Organic</Text>
        <Text style={styles.featureSubtext}>Certified products</Text>
      </View>
      <View style={styles.featureItem}>
        <Icon name="shield-check" size={28} color={APP_CONFIG.PRIMARY_COLOR} />
        <Text style={styles.featureText}>Secure Pay</Text>
        <Text style={styles.featureSubtext}>Razorpay secured</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderSearchBar()}
      {renderBanner()}
      {renderFeatures()}
      {renderCollections()}
      {renderFeaturedProducts()}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>🌱 SK Organic Farms</Text>
        <Text style={styles.footerSubtext}>Growing Healthy, Living Naturally</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.BACKGROUND_COLOR,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: APP_CONFIG.TEXT_COLOR,
  },
  banner: {
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: APP_CONFIG.PRIMARY_COLOR,
  },
  bannerContent: {
    padding: 25,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  bannerOffer: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: APP_CONFIG.ACCENT_COLOR,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 15,
    overflow: 'hidden',
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  bannerButtonText: {
    color: APP_CONFIG.PRIMARY_COLOR,
    fontWeight: 'bold',
    fontSize: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    marginTop: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: APP_CONFIG.TEXT_COLOR,
    marginTop: 8,
  },
  featureSubtext: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  section: {
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: APP_CONFIG.TEXT_COLOR,
  },
  seeAll: {
    fontSize: 14,
    color: APP_CONFIG.PRIMARY_COLOR,
    fontWeight: '600',
  },
  collectionsContainer: {
    paddingLeft: 15,
  },
  collectionCard: {
    width: 100,
    marginRight: 15,
    alignItems: 'center',
  },
  collectionImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionImage: {
    width: '100%',
    height: '100%',
  },
  collectionPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
  },
  collectionTitle: {
    fontSize: 12,
    color: APP_CONFIG.TEXT_COLOR,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  productsContainer: {
    paddingHorizontal: 10,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: APP_CONFIG.PRIMARY_COLOR,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default HomeScreen;

