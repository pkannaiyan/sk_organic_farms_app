import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {colors} from '../constants/theme';
import {fetchCollections, ShopifyCollection} from '../services/shopifyApi';

interface CollectionsScreenProps {
  navigation?: any;
}

const CollectionsScreen: React.FC<CollectionsScreenProps> = ({navigation}) => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = collections.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCollections(filtered);
    } else {
      setFilteredCollections(collections);
    }
  }, [searchQuery, collections]);

  const loadCollections = async () => {
    setLoading(true);
    const data = await fetchCollections();
    // Sort by products count (most products first)
    const sorted = data.sort((a, b) => b.products_count - a.products_count);
    setCollections(sorted);
    setFilteredCollections(sorted);
    setLoading(false);
  };

  const navigateToCollection = (collection: ShopifyCollection) => {
    navigation.navigate('CollectionDetail', {collection});
  };

  const renderCollection = ({item}: {item: ShopifyCollection}) => (
    <TouchableOpacity
      style={styles.collectionCard}
      onPress={() => navigateToCollection(item)}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={{uri: item.image.src}}
            style={styles.collectionImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📦</Text>
          </View>
        )}
      </View>
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.productCount}>
          {item.products_count} products
        </Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📦 All Collections</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search collections..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredCollections.length} collections found
        </Text>
      </View>

      {/* Collections List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading collections...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCollections}
          renderItem={renderCollection}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No collections found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundSecondary,
  },
  statsText: {
    fontSize: 12,
    color: colors.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textLight,
  },
  listContainer: {
    padding: 16,
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  collectionImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 28,
  },
  collectionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  productCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  arrow: {
    fontSize: 20,
    color: colors.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
});

export default CollectionsScreen;
