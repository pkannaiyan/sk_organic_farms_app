import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {colors, brand} from '../constants/theme';

interface HeaderProps {
  showSearch?: boolean;
  onCartPress?: () => void;
  onMenuPress?: () => void;
  cartCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  showSearch = true,
  onCartPress,
  onMenuPress,
  cartCount = 0,
}) => {
  return (
    <View style={styles.container}>
      {/* Top bar with contact info */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>📧 {brand.email}</Text>
        <Text style={styles.topBarText}>📞 {brand.phone}</Text>
      </View>

      {/* Main header */}
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🌿</Text>
          <View>
            <Text style={styles.brandName}>Sunantha</Text>
            <Text style={styles.brandSubName}>Organic Farms</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.headerPrimaryText}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.headerPrimaryBg,
  },
  topBar: {
    backgroundColor: colors.headerSecondaryBg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  topBarText: {
    color: colors.textWhite,
    fontSize: 12,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.headerPrimaryBg,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.headerPrimaryText,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    marginRight: 8,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  brandSubName: {
    fontSize: 12,
    color: colors.headerPrimaryText,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.headerSearchBg,
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.headerPrimaryText,
    fontSize: 14,
  },
  searchButton: {
    padding: 12,
    backgroundColor: colors.primary,
  },
  searchIcon: {
    fontSize: 18,
  },
});

export default Header;

