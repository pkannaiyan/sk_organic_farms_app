/**
 * Product List Screen
 * Shows all products with filtering options
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProductQueries } from '../services/shopifyApi';
import { APP_CONFIG } from '../config/shopify';
import ProductCard from '../components/ProductCard';

const ProductListScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response: any = await ProductQueries.getProducts(
        APP_CONFIG.PRODUCTS_PER_PAGE,
        loadMore ? cursor : undefined
      );

      if (response.products?.edges) {
        const newProducts = response.products.edges.map((e: any) => e.node);
        
        if (loadMore) {
          setProducts((prev) => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }

        setHasMore(response.products.pageInfo.hasNextPage);
        setCursor(response.products.pageInfo.endCursor);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCursor(null);
    await loadProducts();
    setRefreshing(false);
  };

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      loadProducts(true);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.resultsText}>{products.length} Products</Text>
      <TouchableOpacity style={styles.filterButton}>
        <Icon name="filter-variant" size={20} color={APP_CONFIG.PRIMARY_COLOR} />
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={APP_CONFIG.PRIMARY_COLOR} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="package-variant" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No products found</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={APP_CONFIG.PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
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
    backgroundColor: APP_CONFIG.BACKGROUND_COLOR,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#888',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultsText: {
    fontSize: 16,
    color: APP_CONFIG.TEXT_COLOR,
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: APP_CONFIG.PRIMARY_COLOR,
  },
  filterText: {
    marginLeft: 5,
    color: APP_CONFIG.PRIMARY_COLOR,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  footerLoader: {
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 15,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: APP_CONFIG.PRIMARY_COLOR,
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductListScreen;

