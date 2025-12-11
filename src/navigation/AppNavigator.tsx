/**
 * Main App Navigation
 * Bottom tabs with stack navigators for each section
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AccountScreen from '../screens/AccountScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OrdersScreen from '../screens/OrdersScreen';
import SearchScreen from '../screens/SearchScreen';
import CollectionScreen from '../screens/CollectionScreen';

// Store
import { useStore } from '../store/useStore';

// Config
import { APP_CONFIG } from '../config/shopify';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Cart Badge Component
const CartBadge = () => {
  const cartCount = useStore((state) => state.cartCount);
  
  if (cartCount === 0) return null;
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
    </View>
  );
};

// Home Stack
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: APP_CONFIG.PRIMARY_COLOR },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen} 
      options={{ title: 'SK Organic Farms' }}
    />
    <Stack.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen}
      options={{ title: 'Product Details' }}
    />
    <Stack.Screen 
      name="Collection" 
      component={CollectionScreen}
      options={({ route }: any) => ({ title: route.params?.title || 'Collection' })}
    />
    <Stack.Screen 
      name="Search" 
      component={SearchScreen}
      options={{ title: 'Search' }}
    />
  </Stack.Navigator>
);

// Shop Stack
const ShopStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: APP_CONFIG.PRIMARY_COLOR },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="ProductList" 
      component={ProductListScreen}
      options={{ title: 'All Products' }}
    />
    <Stack.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen}
      options={{ title: 'Product Details' }}
    />
    <Stack.Screen 
      name="Collection" 
      component={CollectionScreen}
      options={({ route }: any) => ({ title: route.params?.title || 'Collection' })}
    />
  </Stack.Navigator>
);

// Cart Stack
const CartStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: APP_CONFIG.PRIMARY_COLOR },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="CartMain" 
      component={CartScreen}
      options={{ title: 'Shopping Cart' }}
    />
    <Stack.Screen 
      name="Checkout" 
      component={CheckoutScreen}
      options={{ title: 'Checkout' }}
    />
  </Stack.Navigator>
);

// Account Stack
const AccountStack = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: APP_CONFIG.PRIMARY_COLOR },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen 
            name="AccountMain" 
            component={AccountScreen}
            options={{ title: 'My Account' }}
          />
          <Stack.Screen 
            name="Orders" 
            component={OrdersScreen}
            options={{ title: 'My Orders' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: 'Create Account' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'home';

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Shop':
                iconName = focused ? 'store' : 'store-outline';
                break;
              case 'Cart':
                iconName = focused ? 'cart' : 'cart-outline';
                break;
              case 'Account':
                iconName = focused ? 'account' : 'account-outline';
                break;
            }

            return (
              <View>
                <Icon name={iconName} size={size} color={color} />
                {route.name === 'Cart' && <CartBadge />}
              </View>
            );
          },
          tabBarActiveTintColor: APP_CONFIG.PRIMARY_COLOR,
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Shop" component={ShopStack} />
        <Tab.Screen name="Cart" component={CartStack} />
        <Tab.Screen name="Account" component={AccountStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: APP_CONFIG.ACCENT_COLOR,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default AppNavigator;

