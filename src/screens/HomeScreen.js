import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  StatusBar,
} from 'react-native';
import ClipboardItem from '../components/ClipboardItem';

const API_URL = 'http://192.168.1.7:8080/api/clipboard';

const HomeScreen = () => {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchClipboardItems = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch clipboard items');
      console.error('Error fetching clipboard items:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClipboardItems();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchClipboardItems();
    const interval = setInterval(fetchClipboardItems, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>Universal Clipboard</Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => <ClipboardItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  error: {
    color: '#ff3b30',
    marginTop: 8,
  },
  list: {
    paddingVertical: 8,
  },
});

export default HomeScreen; 