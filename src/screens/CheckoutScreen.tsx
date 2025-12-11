/**
 * Checkout Screen
 * Handles payment with Razorpay integration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RazorpayCheckout from 'react-native-razorpay';
import { APP_CONFIG, RAZORPAY_CONFIG } from '../config/shopify';
import { useStore } from '../store/useStore';

const CheckoutScreen = ({ navigation }: any) => {
  const { cartTotal, cartItems, cartCount, clearCart, user } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo].trim()) {
        Alert.alert('Missing Information', `Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    
    // Validate phone
    if (shippingInfo.phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const options = {
        description: 'SK Organic Farms Order',
        image: RAZORPAY_CONFIG.COMPANY_LOGO,
        currency: RAZORPAY_CONFIG.CURRENCY,
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: Math.round(cartTotal * 100), // Razorpay expects amount in paise
        name: RAZORPAY_CONFIG.COMPANY_NAME,
        prefill: {
          email: shippingInfo.email,
          contact: shippingInfo.phone,
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        },
        theme: { color: RAZORPAY_CONFIG.THEME_COLOR },
      };

      const data = await RazorpayCheckout.open(options);
      
      // Payment successful
      console.log('Payment Success:', data);
      
      // Clear cart and navigate to success
      clearCart();
      
      Alert.alert(
        'Order Placed! 🎉',
        `Your order has been placed successfully.\n\nPayment ID: ${data.razorpay_payment_id}`,
        [
          {
            text: 'Continue Shopping',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error: any) {
      console.log('Payment Error:', error);
      
      if (error.code === 'PAYMENT_CANCELLED') {
        Alert.alert('Payment Cancelled', 'You cancelled the payment');
      } else {
        Alert.alert('Payment Failed', error.description || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    field: string,
    placeholder: string,
    keyboardType: any = 'default'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={shippingInfo[field as keyof typeof shippingInfo]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({cartCount})</Text>
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
          </View>
        </View>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <View style={styles.formCard}>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                {renderInput('First Name', 'firstName', 'John')}
              </View>
              <View style={styles.halfInput}>
                {renderInput('Last Name', 'lastName', 'Doe')}
              </View>
            </View>
            {renderInput('Email', 'email', 'john@example.com', 'email-address')}
            {renderInput('Phone', 'phone', '9876543210', 'phone-pad')}
            {renderInput('Address', 'address', 'House No, Street, Area')}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                {renderInput('City', 'city', 'Chennai')}
              </View>
              <View style={styles.halfInput}>
                {renderInput('State', 'state', 'Tamil Nadu')}
              </View>
            </View>
            {renderInput('Pincode', 'pincode', '600001', 'number-pad')}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentOption}>
              <Icon name="radiobox-marked" size={24} color={APP_CONFIG.PRIMARY_COLOR} />
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentTitle}>Pay with Razorpay</Text>
                <Text style={styles.paymentSubtitle}>
                  UPI, Cards, Net Banking, Wallets
                </Text>
              </View>
              <Image
                source={{ uri: 'https://razorpay.com/assets/razorpay-logo.svg' }}
                style={styles.razorpayLogo}
              />
            </View>
            <View style={styles.paymentIcons}>
              <Text style={styles.paymentIconText}>💳 Cards</Text>
              <Text style={styles.paymentIconText}>📱 UPI</Text>
              <Text style={styles.paymentIconText}>🏦 NetBanking</Text>
              <Text style={styles.paymentIconText}>💰 Wallets</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="lock" size={20} color="#fff" />
              <Text style={styles.payButtonText}>Pay ₹{cartTotal.toFixed(0)}</Text>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.secureNote}>
          <Icon name="shield-check" size={14} color="#888" />
          <Text style={styles.secureNoteText}>
            Your payment is secured by Razorpay
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: APP_CONFIG.TEXT_COLOR,
    marginBottom: 15,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: APP_CONFIG.PRIMARY_COLOR,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },
  halfInput: {
    flex: 1,
    paddingHorizontal: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_CONFIG.TEXT_COLOR,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: APP_CONFIG.TEXT_COLOR,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: APP_CONFIG.TEXT_COLOR,
  },
  paymentSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  razorpayLogo: {
    width: 80,
    height: 25,
    resizeMode: 'contain',
  },
  paymentIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentIconText: {
    fontSize: 12,
    color: '#666',
    marginRight: 15,
    marginBottom: 5,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_CONFIG.PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secureNoteText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
});

export default CheckoutScreen;

