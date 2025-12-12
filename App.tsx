import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import CollectionsScreen from './src/screens/CollectionsScreen';
import CartScreen from './src/screens/CartScreen';
import AccountScreen from './src/screens/AccountScreen';
import {colors} from './src/constants/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({icon, focused}: {icon: string; focused: boolean}) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
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
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => <TabIcon icon="🏠" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Collections"
          component={CollectionsScreen}
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
