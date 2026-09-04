import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EmptyState({ onAddPress }) {
  return (
    <View style={styles.containerCenter}>
      <View style={styles.emptyIconBox}>
        <Text style={styles.emptyIcon}>🎮</Text>
      </View>
      <Text style={styles.emptyTitle}>Sua coleção está vazia!</Text>
      <Text style={styles.emptySub}>
        Nenhum jogo cadastrado ainda. Comece adicionando seus títulos favoritos e construa seu cofre definitivo.
      </Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={onAddPress}>
        <Text style={styles.primaryBtnText}>+ Cadastrar Primeiro Jogo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    backgroundColor: '#0D0B14',
    justify: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A1625',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySub: { color: '#888', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  primaryBtn: { backgroundColor: '#8A2BE2', padding: 16, borderRadius: 8, width: '100%', alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});