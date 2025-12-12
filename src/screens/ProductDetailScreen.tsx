import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {colors, brand} from '../constants/theme';

const {width} = Dimensions.get('window');

interface Variant {
  id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  available: boolean;
}

interface ProductDetailScreenProps {
  route?: {
    params?: {
      product?: {
        id: string;
        title: string;
        price: number;
        compareAtPrice?: number;
        image?: string;
        description?: string;
        images?: string[];
        variants?: Variant[];
        inStock?: boolean;
      };
    };
  };
  navigation?: any;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const product = route?.params?.product || {
    id: '1',
    title: 'Sample Product',
    price: 299,
    compareAtPrice: 399,
    image: 'https://picsum.photos/seed/product/400/400',
    description: 'This is a sample product description.',
    images: [],
    variants: [],
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const images = product.images?.length
    ? product.images
    : [product.image || 'https://picsum.photos/seed/product/400/400'];

  const currentPrice = selectedVariant 
    ? parseFloat(selectedVariant.price) 
    : product.price;
  
  const currentComparePrice = selectedVariant?.compare_at_price 
    ? parseFloat(selectedVariant.compare_at_price) 
    : product.compareAtPrice;

  const discount = currentComparePrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : 0;

  const isAvailable = selectedVariant ? selectedVariant.available : product.inStock !== false;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const hasVariants = product.variants && product.variants.length > 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartIcon}>🛒</Text>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
            renderItem={({item}) => (
              <Image source={{uri: item}} style={styles.mainImage} resizeMode="cover" />
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          {discount > 0 ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          ) : null}
          {/* Image pagination */}
          <View style={styles.imagePagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imagePaginationDot,
                  index === selectedImageIndex && styles.imagePaginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Thumbnail Images */}
        {images.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContainer}>
            {images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnail,
                  index === selectedImageIndex && styles.thumbnailActive,
                ]}>
                <Image source={{uri: img}} style={styles.thumbnailImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>₹{currentPrice}</Text>
            {currentComparePrice && currentComparePrice > currentPrice ? (
              <>
                <Text style={styles.compareAtPrice}>₹{currentComparePrice}</Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>
                    Save ₹{Math.round(currentComparePrice - currentPrice)}
                  </Text>
                </View>
              </>
            ) : null}
          </View>

          <Text style={styles.taxInfo}>Inclusive of all taxes</Text>

          {/* Variant Selector */}
          {hasVariants ? (
            <View style={styles.variantSection}>
              <Text style={styles.variantLabel}>Select Option:</Text>
              <View style={styles.variantOptions}>
                {product.variants?.map((variant) => (
                  <TouchableOpacity
                    key={variant.id}
                    style={[
                      styles.variantOption,
                      selectedVariant?.id === variant.id && styles.variantOptionSelected,
                      !variant.available && styles.variantOptionDisabled,
                    ]}
                    onPress={() => variant.available && setSelectedVariant(variant)}
                    disabled={!variant.available}>
                    <Text
                      style={[
                        styles.variantOptionText,
                        selectedVariant?.id === variant.id && styles.variantOptionTextSelected,
                        !variant.available && styles.variantOptionTextDisabled,
                      ]}>
                      {variant.title}
                    </Text>
                    {!variant.available ? (
                      <Text style={styles.outOfStockLabel}>Out of Stock</Text>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          {/* Stock Status */}
          <View style={styles.stockStatus}>
            {isAvailable ? (
              <View style={styles.inStockBadge}>
                <Text style={styles.inStockText}>✓ In Stock</Text>
              </View>
            ) : (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>✕ Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart & Buy Now */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.addToCartButton, !isAvailable && styles.buttonDisabled]}
              disabled={!isAvailable}>
              <Text style={styles.addToCartText}>
                {isAvailable ? '🛒 Add to Cart' : 'Notify Me'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buyNowButton, !isAvailable && styles.buttonDisabled]}
              disabled={!isAvailable}>
              <Text style={styles.buyNowText}>
                {isAvailable ? '⚡ Buy Now' : 'Out of Stock'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>📝 Description</Text>
            <Text style={styles.description}>
              {product.description ||
                `${product.title} is a premium quality organic product from Sunantha Organic Farms.\n\n• 100% Organic\n• Chemical-free\n• Sustainably sourced\n• Expert guidance available\n\nContact us at ${brand.phone} for any queries.`}
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>✨ Why Choose Us?</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🌱</Text>
                <View>
                  <Text style={styles.featureTitle}>100% Organic</Text>
                  <Text style={styles.featureDesc}>No chemicals used</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🚚</Text>
                <View>
                  <Text style={styles.featureTitle}>Free Delivery</Text>
                  <Text style={styles.featureDesc}>Orders above ₹500</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💯</Text>
                <View>
                  <Text style={styles.featureTitle}>Quality Assured</Text>
                  <Text style={styles.featureDesc}>Handpicked products</Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📞</Text>
                <View>
                  <Text style={styles.featureTitle}>Expert Support</Text>
                  <Text style={styles.featureDesc}>Call {brand.phone}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>💳 We Accept</Text>
            <View style={styles.paymentIcons}>
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentEmoji}>💳</Text>
                <Text style={styles.paymentLabel}>Cards</Text>
              </View>
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentEmoji}>📱</Text>
                <Text style={styles.paymentLabel}>UPI</Text>
              </View>
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentEmoji}>🏦</Text>
                <Text style={styles.paymentLabel}>Net Banking</Text>
              </View>
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentEmoji}>🔄</Text>
                <Text style={styles.paymentLabel}>Razorpay</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>Total:</Text>
          <Text style={styles.bottomPriceValue}>₹{Math.round(currentPrice * quantity)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.bottomBuyButton, !isAvailable && styles.buttonDisabled]}
          disabled={!isAvailable}>
          <Text style={styles.bottomBuyText}>
            {isAvailable ? '🛒 Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  
  // Header
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.primary},
  backButton: {padding: 8},
  backButtonText: {color: colors.textWhite, fontSize: 16, fontWeight: '500'},
  cartButton: {padding: 8, position: 'relative'},
  cartIcon: {fontSize: 24},
  cartBadge: {position: 'absolute', top: 0, right: 0, backgroundColor: '#c41e3a', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center'},
  cartBadgeText: {color: colors.textWhite, fontSize: 10, fontWeight: 'bold'},
  
  // Image Gallery
  imageGallery: {width: width, height: width * 0.9, position: 'relative', backgroundColor: '#f9f9f9'},
  mainImage: {width: width, height: width * 0.9},
  discountBadge: {position: 'absolute', top: 16, left: 16, backgroundColor: '#c41e3a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4},
  discountText: {color: colors.textWhite, fontSize: 14, fontWeight: 'bold'},
  imagePagination: {position: 'absolute', bottom: 16, alignSelf: 'center', flexDirection: 'row'},
  imagePaginationDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.3)', marginHorizontal: 3},
  imagePaginationDotActive: {backgroundColor: colors.primary, width: 20},
  
  // Thumbnails
  thumbnailContainer: {paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff'},
  thumbnail: {width: 60, height: 60, marginRight: 8, borderRadius: 8, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden'},
  thumbnailActive: {borderColor: colors.primary},
  thumbnailImage: {width: '100%', height: '100%'},
  
  // Product Info
  productInfo: {padding: 16, backgroundColor: '#fff'},
  productTitle: {fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 12},
  
  // Price
  priceSection: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4},
  price: {fontSize: 28, fontWeight: 'bold', color: colors.primary},
  compareAtPrice: {fontSize: 18, color: colors.textLight, textDecorationLine: 'line-through', marginLeft: 12},
  savingsBadge: {backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginLeft: 12},
  savingsText: {color: colors.success, fontSize: 12, fontWeight: '600'},
  taxInfo: {fontSize: 12, color: colors.textLight, marginBottom: 16},
  
  // Variants
  variantSection: {marginBottom: 16},
  variantLabel: {fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10},
  variantOptions: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  variantOption: {paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff'},
  variantOptionSelected: {borderColor: colors.primary, backgroundColor: '#e8f5e9'},
  variantOptionDisabled: {backgroundColor: '#f5f5f5', borderColor: '#eee'},
  variantOptionText: {fontSize: 13, color: colors.text, fontWeight: '500'},
  variantOptionTextSelected: {color: colors.primary},
  variantOptionTextDisabled: {color: '#bbb'},
  outOfStockLabel: {fontSize: 9, color: '#c41e3a', marginTop: 2},
  
  // Stock Status
  stockStatus: {marginBottom: 16},
  inStockBadge: {backgroundColor: '#e8f5e9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start'},
  inStockText: {color: colors.success, fontSize: 13, fontWeight: '600'},
  outOfStockBadge: {backgroundColor: '#ffebee', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start'},
  outOfStockText: {color: '#c41e3a', fontSize: 13, fontWeight: '600'},
  
  // Quantity
  quantitySection: {flexDirection: 'row', alignItems: 'center', marginBottom: 20},
  quantityLabel: {fontSize: 14, color: colors.text, marginRight: 16, fontWeight: '500'},
  quantitySelector: {flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8},
  quantityButton: {width: 44, height: 44, justifyContent: 'center', alignItems: 'center'},
  quantityButtonText: {fontSize: 24, color: colors.primary},
  quantityValue: {fontSize: 18, fontWeight: '600', color: colors.text, minWidth: 40, textAlign: 'center'},
  
  // Buttons
  buttonContainer: {flexDirection: 'row', gap: 12, marginBottom: 24},
  addToCartButton: {flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: colors.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center'},
  addToCartText: {color: colors.primary, fontSize: 15, fontWeight: '600'},
  buyNowButton: {flex: 1, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center'},
  buyNowText: {color: colors.textWhite, fontSize: 15, fontWeight: '600'},
  buttonDisabled: {backgroundColor: '#ddd', borderColor: '#ddd'},
  
  // Description
  descriptionSection: {marginBottom: 24},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 12},
  description: {fontSize: 14, color: colors.textLight, lineHeight: 22},
  
  // Features
  featuresSection: {marginBottom: 24},
  featuresList: {gap: 10},
  featureItem: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8},
  featureIcon: {fontSize: 24, marginRight: 12},
  featureTitle: {fontSize: 14, fontWeight: '600', color: colors.text},
  featureDesc: {fontSize: 12, color: colors.textLight},
  
  // Payment
  paymentSection: {marginBottom: 100},
  paymentIcons: {flexDirection: 'row', justifyContent: 'space-around'},
  paymentIcon: {alignItems: 'center'},
  paymentEmoji: {fontSize: 28, marginBottom: 4},
  paymentLabel: {fontSize: 11, color: colors.textLight},
  
  // Bottom Bar
  bottomBar: {position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#eee', elevation: 5},
  bottomPrice: {flex: 1},
  bottomPriceLabel: {fontSize: 12, color: colors.textLight},
  bottomPriceValue: {fontSize: 20, fontWeight: 'bold', color: colors.primary},
  bottomBuyButton: {backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8},
  bottomBuyText: {color: colors.textWhite, fontSize: 15, fontWeight: '600'},
});

export default ProductDetailScreen;
