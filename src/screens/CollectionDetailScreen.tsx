import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {colors} from '../constants/theme';
import {
  fetchCollectionProducts,
  ShopifyProduct,
  getProductImage,
  getProductPrice,
  getCompareAtPrice,
  isProductAvailable,
} from '../services/shopifyApi';

const {width} = Dimensions.get('window');
const PRODUCT_WIDTH = (width - 48) / 2;

interface CollectionDetailScreenProps {
  route?: {
    params?: {
      collection?: {
        id: number | string;
        title: string;
        handle: string;
        description?: string;
        image?: {src: string} | null;
      };
    };
  };
  navigation?: any;
}

const CollectionDetailScreen: React.FC<CollectionDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const collection = route?.params?.collection || {
    id: 0,
    title: 'Collection',
    handle: 'all',
  };

  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [collection.handle]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchCollectionProducts(collection.handle, 50);
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateToProduct = (product: ShopifyProduct) => {
    if (navigation) {
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
    }
  };

  const renderProduct = ({item}: {item: ShopifyProduct}) => {
    const price = getProductPrice(item);
    const compareAtPrice = getCompareAtPrice(item);
    const hasDiscount = compareAtPrice !== null && compareAtPrice > price;
    const discount = hasDiscount
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;
    const available = isProductAvailable(item);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigateToProduct(item)}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: getProductImage(item)}}
            style={styles.productImage}
            resizeMode="cover"
          />
          {hasDiscount && discount > 0 ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          ) : null}
          {!available ? (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>Sold Out</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>₹{price}</Text>
            {hasDiscount ? (
              <Text style={styles.comparePrice}>₹{compareAtPrice}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.addButton, !available && styles.addButtonDisabled]}
            disabled={!available}>
            <Text style={styles.addButtonText}>
              {available ? 'Add to Cart' : 'Notify Me'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const productCount = products ? products.length : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {collection.title || 'Collection'}
        </Text>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      {/* Collection Banner */}
      {collection.image && collection.image.src ? (
        <Image
          source={{uri: collection.image.src}}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      ) : null}

      {/* Collection Info */}
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionTitle}>{collection.title || 'Collection'}</Text>
        {collection.description ? (
          <Text style={styles.collectionDesc}>{collection.description}</Text>
        ) : null}
        <Text style={styles.productCount}>{productCount} products</Text>
      </View>

      {/* Products Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : productCount === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>No products in this collection</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  cartButton: {
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
  },
  bannerImage: {
    width: '100%',
    height: 150,
  },
  collectionInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  collectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  collectionDesc: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  productCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
  productsGrid: {
    padding: 12,
  },
  productCard: {
    width: PRODUCT_WIDTH,
    backgroundColor: colors.background,
    borderRadius: 12,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: PRODUCT_WIDTH,
    backgroundColor: colors.backgroundSecondary,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: colors.textWhite,
    fontSize: 10,
    fontWeight: 'bold',
  },
  soldOutBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 6,
  },
  soldOutText: {
    color: colors.textWhite,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 8,
    height: 36,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  comparePrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  addButtonText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CollectionDetailScreen;
