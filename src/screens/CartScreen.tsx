/**
 * Cart Screen
 * Shows cart items with checkout functionality
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_CONFIG } from '../config/shopify';
import { useStore } from '../store/useStore';

const CartScreen = ({ navigation }: any) => {
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, isLoading } = useStore();

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        {item.variantTitle !== 'Default Title' && (
          <Text style={styles.itemVariant}>{item.variantTitle}</Text>
        )}
        <Text style={styles.itemPrice}>₹{item.price.toFixed(0)}</Text>
        
        <View style={styles.quantityRow}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => {
                if (item.quantity > 1) {
                  updateQuantity(item.lineId, item.quantity - 1);
                } else {
                  removeFromCart(item.lineId);
                }
              }}
            >
              <Icon name="minus" size={16} color={APP_CONFIG.TEXT_COLOR} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => updateQuantity(item.lineId, item.quantity + 1)}
            >
              <Icon name="plus" size={16} color={APP_CONFIG.TEXT_COLOR} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeFromCart(item.lineId)}
          >
            <Icon name="delete-outline" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="cart-outline" size={100} color="#ddd" />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Add some organic goodness!</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Shop')}
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (cartItems.length === 0) return null;
    
    return (
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({cartCount} items)</Text>
          <Text style={styles.summaryValue}>₹{cartTotal.toFixed(0)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryFree}>FREE</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{cartTotal.toFixed(0)}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Icon name="lock" size={20} color="#fff" />
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
        
        <View style={styles.securePayment}>
          <Icon name="shield-check" size={16} color={APP_CONFIG.PRIMARY_COLOR} />
          <Text style={styles.secureText}>Secured by Razorpay</Text>
        </View>
      </View>
    );
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={APP_CONFIG.PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={APP_CONFIG.PRIMARY_COLOR} />
        </View>
      )}
      
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={cartItems.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmpty}
      />
      
      {renderFooter()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.BACKGROUND_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  list: {
    padding: 15,
  },
  emptyList: {
    flexGrow: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_CONFIG.TEXT_COLOR,
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: APP_CONFIG.PRIMARY_COLOR,
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  quantityBtn: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 15,
    color: APP_CONFIG.TEXT_COLOR,
  },
  removeBtn: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: APP_CONFIG.TEXT_COLOR,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  shopButton: {
    backgroundColor: APP_CONFIG.PRIMARY_COLOR,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_CONFIG.TEXT_COLOR,
  },
  summaryFree: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_CONFIG.PRIMARY_COLOR,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: APP_CONFIG.TEXT_COLOR,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: APP_CONFIG.PRIMARY_COLOR,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_CONFIG.PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  securePayment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  secureText: {
    fontSize: 13,
    color: APP_CONFIG.PRIMARY_COLOR,
    marginLeft: 5,
  },
});

export default CartScreen;

