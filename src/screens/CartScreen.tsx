import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors} from '../constants/theme';

// Sample cart items
const cartItems = [
  {
    id: '1',
    title: 'Potting Mix - Premium Soil',
    price: 299,
    quantity: 2,
  },
  {
    id: '2',
    title: 'Organic Neem Cake Powder 1kg',
    price: 199,
    quantity: 1,
  },
  {
    id: '3',
    title: 'HDPE Grow Bag 15x15 (Pack of 5)',
    price: 445,
    quantity: 1,
  },
];

const CartScreen = () => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Your Cart</Text>
        <Text style={styles.headerSubtitle}>{cartItems.length} items</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Free Shipping Banner */}
        {subtotal < 500 && (
          <View style={styles.shippingBanner}>
            <Text style={styles.shippingText}>
              🚚 Add ₹{500 - subtotal} more for FREE shipping!
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${(subtotal / 500) * 100}%`},
                ]}
              />
            </View>
          </View>
        )}

        {/* Cart Items */}
        {cartItems.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.itemImage}>
              <Text style={styles.itemImageText}>🌿</Text>
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.removeButton}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text
              style={[
                styles.summaryValue,
                shipping === 0 && styles.freeShipping,
              ]}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        {/* Promo Code */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Have a promo code?</Text>
          <View style={styles.promoInputContainer}>
            <View style={styles.promoInput}>
              <Text style={styles.promoPlaceholder}>Enter code</Text>
            </View>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Text style={styles.checkoutAmount}>₹{total}</Text>
        </TouchableOpacity>
        <Text style={styles.paymentMethods}>
          We accept: Razorpay, UPI, Cards, Net Banking
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  shippingBanner: {
    backgroundColor: colors.primaryLight,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  shippingText: {
    fontSize: 14,
    color: colors.headerPrimaryText,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  itemImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageText: {
    fontSize: 32,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: colors.text,
  },
  quantityText: {
    fontSize: 16,
    color: colors.text,
    marginHorizontal: 12,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  removeText: {
    fontSize: 16,
    color: colors.textLight,
  },
  summary: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  freeShipping: {
    color: colors.success,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.background,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  promoSection: {
    margin: 16,
    marginTop: 0,
  },
  promoTitle: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  promoInputContainer: {
    flexDirection: 'row',
  },
  promoInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginRight: 8,
  },
  promoPlaceholder: {
    color: colors.textLight,
  },
  promoButton: {
    backgroundColor: colors.headerPrimaryText,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  promoButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  checkoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSecondary,
    backgroundColor: colors.background,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  checkoutAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  paymentMethods: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default CartScreen;

