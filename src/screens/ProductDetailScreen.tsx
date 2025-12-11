/**
 * Product Detail Screen
 * Shows full product details with add to cart functionality
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { ProductQueries } from '../services/shopifyApi';
import { APP_CONFIG } from '../config/shopify';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { handle } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart, isLoading } = useStore();

  useEffect(() => {
    loadProduct();
  }, [handle]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response: any = await ProductQueries.getProductByHandle(handle);
      
      if (response.productByHandle) {
        const productData = response.productByHandle;
        setProduct(productData);
        
        // Set default variant
        if (productData.variants?.edges?.length > 0) {
          const defaultVariant = productData.variants.edges[0].node;
          setSelectedVariant(defaultVariant);
          
          // Set default options
          const defaultOptions: Record<string, string> = {};
          defaultVariant.selectedOptions?.forEach((opt: any) => {
            defaultOptions[opt.name] = opt.value;
          });
          setSelectedOptions(defaultOptions);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    
    // Find matching variant
    const variant = product.variants.edges.find((edge: any) => {
      return edge.node.selectedOptions.every(
        (opt: any) => newOptions[opt.name] === opt.value
      );
    });
    
    if (variant) {
      setSelectedVariant(variant.node);
    }
  };

  const handleAddToCart = async () => {
    if (selectedVariant && selectedVariant.availableForSale) {
      await addToCart(selectedVariant.id, quantity, {
        title: product.title,
        image: product.images.edges[0]?.node.url,
      });
      
      Toast.show({
        type: 'success',
        text1: 'Added to Cart',
        text2: `${product.title} has been added to your cart`,
        position: 'bottom',
      });
    }
  };

  const renderImages = () => {
    const images = product.images.edges.map((e: any) => e.node);
    
    return (
      <View>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.url }}
              style={styles.mainImage}
              resizeMode="contain"
            />
          )}
          keyExtractor={(item) => item.id}
        />
        
        {images.length > 1 && (
          <View style={styles.pagination}>
            {images.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderOptions = () => {
    if (!product.options || product.options.length === 0) return null;
    
    return product.options.map((option: any) => (
      <View key={option.id} style={styles.optionContainer}>
        <Text style={styles.optionTitle}>{option.name}</Text>
        <View style={styles.optionValues}>
          {option.values.map((value: string) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.optionButton,
                selectedOptions[option.name] === value && styles.optionButtonActive,
              ]}
              onPress={() => handleOptionChange(option.name, value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  selectedOptions[option.name] === value && styles.optionButtonTextActive,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ));
  };

  const renderPrice = () => {
    if (!selectedVariant) return null;
    
    const price = parseFloat(selectedVariant.price.amount);
    const compareAtPrice = selectedVariant.compareAtPrice 
      ? parseFloat(selectedVariant.compareAtPrice.amount) 
      : null;
    
    const discount = compareAtPrice 
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) 
      : 0;
    
    return (
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{price.toFixed(0)}</Text>
        {compareAtPrice && (
          <>
            <Text style={styles.comparePrice}>₹{compareAtPrice.toFixed(0)}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          </>
        )}
      </View>
    );
  };

  const renderQuantitySelector = () => (
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityLabel}>Quantity</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Icon name="minus" size={20} color={APP_CONFIG.TEXT_COLOR} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Icon name="plus" size={20} color={APP_CONFIG.TEXT_COLOR} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={APP_CONFIG.PRIMARY_COLOR} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={60} color="#ccc" />
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const isAvailable = selectedVariant?.availableForSale;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderImages()}
        
        <View style={styles.content}>
          <Text style={styles.vendor}>{product.vendor}</Text>
          <Text style={styles.title}>{product.title}</Text>
          
          {renderPrice()}
          
          <View style={styles.stockContainer}>
            <Icon 
              name={isAvailable ? "check-circle" : "close-circle"} 
              size={18} 
              color={isAvailable ? APP_CONFIG.PRIMARY_COLOR : '#e74c3c'} 
            />
            <Text style={[
              styles.stockText, 
              { color: isAvailable ? APP_CONFIG.PRIMARY_COLOR : '#e74c3c' }
            ]}>
              {isAvailable ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
          
          {renderOptions()}
          {renderQuantitySelector()}
          
          <View style={styles.divider} />
          
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          {product.tags?.length > 0 && (
            <View style={styles.tagsContainer}>
              {product.tags.slice(0, 5).map((tag: string) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            (!isAvailable || isLoading) && styles.addToCartButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={!isAvailable || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="cart-plus" size={22} color="#fff" />
              <Text style={styles.addToCartText}>
                {isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 15,
    fontSize: 18,
    color: '#888',
  },
  scrollView: {
    flex: 1,
  },
  mainImage: {
    width: width,
    height: width,
    backgroundColor: '#f5f5f5',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: APP_CONFIG.PRIMARY_COLOR,
    width: 20,
  },
  content: {
    padding: 20,
  },
  vendor: {
    fontSize: 14,
    color: APP_CONFIG.PRIMARY_COLOR,
    fontWeight: '600',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: APP_CONFIG.TEXT_COLOR,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: APP_CONFIG.PRIMARY_COLOR,
  },
  comparePrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  discountBadge: {
    backgroundColor: APP_CONFIG.ACCENT_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  optionContainer: {
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_CONFIG.TEXT_COLOR,
    marginBottom: 10,
  },
  optionValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonActive: {
    borderColor: APP_CONFIG.PRIMARY_COLOR,
    backgroundColor: APP_CONFIG.PRIMARY_COLOR + '10',
  },
  optionButtonText: {
    fontSize: 14,
    color: APP_CONFIG.TEXT_COLOR,
  },
  optionButtonTextActive: {
    color: APP_CONFIG.PRIMARY_COLOR,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_CONFIG.TEXT_COLOR,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  quantityButton: {
    padding: 12,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    color: APP_CONFIG.TEXT_COLOR,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.TEXT_COLOR,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_CONFIG.PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProductDetailScreen;

