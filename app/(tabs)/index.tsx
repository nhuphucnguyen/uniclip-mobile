import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  StatusBar,
  AppState,
  AppStateStatus,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import ClipboardItem from '../../src/components/ClipboardItem';

const API_URL = 'http://192.168.1.7:8080/api/clipboard';

interface ClipboardItemType {
  id: number;
  type: 'TEXT' | 'IMAGE';
  textContent?: string;
  base64BinaryContent?: string;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
}

export default function TabOneScreen() {
  const [items, setItems] = useState<ClipboardItemType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastClipboardContent, setLastClipboardContent] = useState<string>('');

  const checkClipboard = async () => {
    try {
      const content = await Clipboard.getStringAsync();
      if (content && content !== lastClipboardContent) {
        setLastClipboardContent(content);
        // Send to server
        await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'TEXT',
            textContent: content,
          }),
        });
        // Refresh the list
        fetchClipboardItems();
      }
    } catch (err) {
      console.error('Error checking clipboard:', err);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      checkClipboard();
    }
  };

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
    checkClipboard();

    // Set up clipboard monitoring
    const clipboardInterval = setInterval(checkClipboard, 1000);
    
    // Set up app state monitoring
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Set up items refresh
    const fetchInterval = setInterval(fetchClipboardItems, 2000);

    return () => {
      clearInterval(clipboardInterval);
      clearInterval(fetchInterval);
      subscription.remove();
    };
  }, [lastClipboardContent]);

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
}

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
