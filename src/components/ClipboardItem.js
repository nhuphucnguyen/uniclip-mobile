import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ClipboardItem = ({ item }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      {item.type === 'TEXT' ? (
        <Text style={styles.text}>{item.textContent}</Text>
      ) : item.type === 'IMAGE' ? (
        <Image
          source={{ uri: `data:image/png;base64,${item.base64BinaryContent}` }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : null}
      <Text style={styles.timestamp}>{formatDate(item.updatedAt)}</Text>
    </View>
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
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});

export default ClipboardItem; 