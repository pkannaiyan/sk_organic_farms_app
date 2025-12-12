import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {colors, collections} from '../constants/theme';

const {width} = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const CollectionsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Collections</Text>
        <Text style={styles.headerSubtitle}>
          Explore our range of organic products
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}>
        {collections.map(collection => (
          <TouchableOpacity key={collection.id} style={styles.card}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{collection.icon}</Text>
            </View>
            <Text style={styles.name}>{collection.name}</Text>
            <Text style={styles.viewProducts}>View Products →</Text>
          </TouchableOpacity>
        ))}
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
  headerSubtitle: {
    fontSize: 14,
    color: colors.textWhite,
    opacity: 0.9,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 28,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  viewProducts: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default CollectionsScreen;

