import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ label, value }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statBox: {
    backgroundColor: '#1A1625',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#2A2438',
  },
  statLabel: { color: '#888899', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  statValue: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});