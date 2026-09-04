import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

export default function GameCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: item.coverUrl || 'https://via.placeholder.com/150' }}
        style={styles.cardImage}
      />
      <Text style={styles.cardStatus}>{item.status?.toUpperCase()}</Text>
      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.cardPlatform}>{item.platform}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 0.5,
    backgroundColor: '#1A1625',
    margin: 6,
    borderRadius: 8,
    padding: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#2A2438',
  },
  cardImage: { width: '100%', height: 130, borderRadius: 6, marginBottom: 8 },
  cardStatus: { color: '#A020F0', fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  cardPlatform: { color: '#888', fontSize: 11 },
});