/**
 * SK Organic Farms - React Native App
 * Main Entry Point
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { useStore } from './src/store/useStore';
import { APP_CONFIG } from './src/config/shopify';

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const App = () => {
  const initializeCart = useStore((state) => state.initializeCart);

  useEffect(() => {
    // Initialize cart when app loads
    initializeCart();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={APP_CONFIG.PRIMARY_COLOR}
      />
      <AppNavigator />
      <Toast />
    </GestureHandlerRootView>
  );
};

export default App;

