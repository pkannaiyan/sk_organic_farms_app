import React from 'react';
import {View, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {colors, brand} from '../constants/theme';

const menuItems = [
  {icon: '📦', title: 'My Orders', subtitle: 'Track your orders'},
  {icon: '📍', title: 'Addresses', subtitle: 'Manage delivery addresses'},
  {icon: '💳', title: 'Payment Methods', subtitle: 'Cards and UPI'},
  {icon: '❤️', title: 'Wishlist', subtitle: 'Your favorite products'},
  {icon: '🔔', title: 'Notifications', subtitle: 'Offers and updates'},
  {icon: '🎁', title: 'Refer & Earn', subtitle: 'Get ₹100 for each referral'},
  {icon: '❓', title: 'Help & Support', subtitle: 'FAQs and contact us'},
  {icon: '📜', title: 'About Us', subtitle: 'Know our story'},
];

const AccountScreen = () => {
  const isLoggedIn = false;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile / Login */}
        <View style={styles.profileSection}>
          {isLoggedIn ? (
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View>
                <Text style={styles.userName}>John Doe</Text>
                <Text style={styles.userEmail}>john@example.com</Text>
              </View>
            </View>
          ) : (
            <View style={styles.loginPrompt}>
              <Text style={styles.loginTitle}>Welcome to {brand.name}</Text>
              <Text style={styles.loginSubtitle}>
                Sign in to track orders, save addresses, and get personalized
                recommendations
              </Text>
              <View style={styles.authButtons}>
                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signupButton}>
                  <Text style={styles.signupButtonText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹0</Text>
            <Text style={styles.statLabel}>Wallet</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Us */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <View style={styles.contactOptions}>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText}>Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactIcon}>💬</Text>
              <Text style={styles.contactText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactIcon}>📧</Text>
              <Text style={styles.contactText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>🌿 {brand.name}</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalDivider}>•</Text>
            <TouchableOpacity>
              <Text style={styles.legalLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  loginPrompt: {
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  signupButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  menuContainer: {
    marginTop: 20,
    backgroundColor: colors.background,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: colors.textLight,
  },
  contactSection: {
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    marginTop: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  contactButton: {
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    color: colors.text,
  },
  appInfo: {
    padding: 24,
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  appVersion: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  legalLinks: {
    flexDirection: 'row',
    marginTop: 16,
  },
  legalLink: {
    fontSize: 12,
    color: colors.primary,
  },
  legalDivider: {
    fontSize: 12,
    color: colors.textLight,
    marginHorizontal: 8,
  },
});

export default AccountScreen;

