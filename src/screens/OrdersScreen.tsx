/**
 * Orders Screen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_CONFIG } from '../config/shopify';

const OrdersScreen = () => {
  return (
    <View style={styles.container}>
      <Icon name="package-variant" size={80} color="#ddd" />
      <Text style={styles.title}>No Orders Yet</Text>
      <Text style={styles.subtitle}>Your order history will appear here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_CONFIG.BACKGROUND_COLOR,
    padding: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: APP_CONFIG.TEXT_COLOR,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default OrdersScreen;

