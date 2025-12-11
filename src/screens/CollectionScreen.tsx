/**
 * Collection Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { CollectionQueries } from '../services/shopifyApi';
import { APP_CONFIG } from '../config/shopify';
import ProductCard from '../components/ProductCard';

const CollectionScreen = ({ route, navigation }: any) => {
  const { handle } = route.params;
  const [collection, setCollection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollection();
  }, [handle]);

  const loadCollection = async () => {
    try {
      const response: any = await CollectionQueries.getCollectionByHandle(handle, 50);
      if (response.collectionByHandle) {
        setCollection(response.collectionByHandle);
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={APP_CONFIG.PRIMARY_COLOR} />
      </View>
    );
  }

  const products = collection?.products?.edges?.map((e: any) => e.node) || [];

  return (
    <View style={styles.container}>
      {collection?.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{collection.description}</Text>
        </View>
      )}
      
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', {
              handle: item.handle,
              title: item.title,
            })}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products in this collection</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.BACKGROUND_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  listContent: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default CollectionScreen;

