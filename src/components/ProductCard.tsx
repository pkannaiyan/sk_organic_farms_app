import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../constants/theme';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  inStock?: boolean;
  onPress?: () => void;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  compareAtPrice,
  image,
  inStock = true,
  onPress,
  onAddToCart,
}) => {
  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{uri: image}} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🌿</Text>
          </View>
        )}
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}
        {!inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{price}</Text>
          {compareAtPrice && compareAtPrice > price && (
            <Text style={styles.compareAtPrice}>₹{compareAtPrice}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.addButton, !inStock && styles.addButtonDisabled]}
          onPress={onAddToCart}
          disabled={!inStock}>
          <Text style={styles.addButtonText}>
            {inStock ? 'Add to Cart' : 'Notify Me'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: colors.backgroundSecondary,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
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
  outOfStockBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
  },
  outOfStockText: {
    color: colors.textWhite,
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 8,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  compareAtPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: colors.buttonBg,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  addButtonText: {
    color: colors.buttonText,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductCard;
