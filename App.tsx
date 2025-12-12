import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text, StyleSheet} from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import CollectionsScreen from './src/screens/CollectionsScreen';
import CartScreen from './src/screens/CartScreen';
import AccountScreen from './src/screens/AccountScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CollectionDetailScreen from './src/screens/CollectionDetailScreen';

// Custom Collection Template Screens
import {
  SeedsScreen,
  ManureScreen,
  MilletsScreen,
  PlantsScreen,
  ToolsScreen,
  PotsScreen,
  SpirulinaScreen,
  OffersScreen,
  PackagesScreen,
  GrowBagsScreen,
} from './src/screens/collections';

import {colors} from './src/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({icon, focused}: {icon: string; focused: boolean}) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
);

// Home Stack Navigator with all collection template screens
const HomeStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
    {/* Custom Collection Template Screens */}
    <Stack.Screen name="SeedsCollection" component={SeedsScreen} />
    <Stack.Screen name="ManureCollection" component={ManureScreen} />
    <Stack.Screen name="MilletsCollection" component={MilletsScreen} />
    <Stack.Screen name="PlantsCollection" component={PlantsScreen} />
    <Stack.Screen name="ToolsCollection" component={ToolsScreen} />
    <Stack.Screen name="PotsCollection" component={PotsScreen} />
    <Stack.Screen name="SpirulinaCollection" component={SpirulinaScreen} />
    <Stack.Screen name="OffersCollection" component={OffersScreen} />
    <Stack.Screen name="PackagesCollection" component={PackagesScreen} />
    <Stack.Screen name="GrowBagsCollection" component={GrowBagsScreen} />
  </Stack.Navigator>
);

// Collections Stack Navigator
const CollectionsStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="CollectionsMain" component={CollectionsScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
    {/* Custom Collection Template Screens */}
    <Stack.Screen name="SeedsCollection" component={SeedsScreen} />
    <Stack.Screen name="ManureCollection" component={ManureScreen} />
    <Stack.Screen name="MilletsCollection" component={MilletsScreen} />
    <Stack.Screen name="PlantsCollection" component={PlantsScreen} />
    <Stack.Screen name="ToolsCollection" component={ToolsScreen} />
    <Stack.Screen name="PotsCollection" component={PotsScreen} />
    <Stack.Screen name="SpirulinaCollection" component={SpirulinaScreen} />
    <Stack.Screen name="OffersCollection" component={OffersScreen} />
    <Stack.Screen name="PackagesCollection" component={PackagesScreen} />
    <Stack.Screen name="GrowBagsCollection" component={GrowBagsScreen} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarLabelStyle: styles.tabLabel,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({focused}) => <TabIcon icon="🏠" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Collections"
          component={CollectionsStack}
          options={{
            tabBarIcon: ({focused}) => <TabIcon icon="📦" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarIcon: ({focused}) => <TabIcon icon="🛒" focused={focused} />,
            tabBarBadge: 3,
            tabBarBadgeStyle: styles.badge,
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarIcon: ({focused}) => <TabIcon icon="👤" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundSecondary,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  badge: {
    backgroundColor: colors.primary,
    fontSize: 10,
  },
});

export default App;
