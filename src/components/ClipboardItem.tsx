import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface ClipboardItemProps {
  item: {
    id: number;
    type: 'TEXT' | 'IMAGE';
    textContent?: string;
    base64BinaryContent?: string;
    contentHash: string;
    createdAt: string;
    updatedAt: string;
  };
}

const MAX_CLIPBOARD_SIZE = 500000; // ~500KB limit for Android clipboard

const ClipboardItem: React.FC<ClipboardItemProps> = ({ item }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleCopy = async () => {
    try {
      if (item.type === 'TEXT' && item.textContent) {
        await Clipboard.setStringAsync(item.textContent);
        // Also update the timestamp for text items
        await fetch(`http://192.168.1.7:8080/api/clipboard/${item.contentHash}/touch`, {
          method: 'PUT'
        });
        Alert.alert('Success', 'Text copied to clipboard');
      } else if (item.type === 'IMAGE') {
        // For images, just update the timestamp to move it to top
        try {
          const response = await fetch(`http://192.168.1.7:8080/api/clipboard/${item.contentHash}/touch`, {
            method: 'PUT'
          });
          
          if (response.ok) {
            Alert.alert('Success', 'Image moved to top of list');
          } else {
            Alert.alert('Error', 'Failed to update image position');
          }
        } catch (err) {
          console.error('Error updating image position:', err);
          Alert.alert('Error', 'Failed to update image position');
        }
      }
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  return (
    <TouchableOpacity onPress={handleCopy} style={styles.container}>
      <View>
        {item.type === 'TEXT' ? (
          <Text style={styles.text}>{item.textContent}</Text>
        ) : item.type === 'IMAGE' ? (
          <Image
            source={{ uri: `data:image/png;base64,${item.base64BinaryContent}` }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.timestamp}>{formatDate(item.updatedAt)}</Text>
          <Text style={styles.copyHint}>Tap to copy</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  copyHint: {
    fontSize: 12,
    color: '#007AFF',
  },
});

export default ClipboardItem; 