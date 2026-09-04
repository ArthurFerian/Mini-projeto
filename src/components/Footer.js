import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { clearAllGames } from '../services/storage';

export default function Footer({ onResetSuccess }) {
  // Função para confirmação e reset dos dados salvos
  const handleResetData = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Tem certeza de que deseja apagar a coleção inteira? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar Tudo',
          style: 'destructive',
          onPress: async () => {
            await clearAllGames();
            if (onResetSuccess) {
              onResetSuccess();
            }
            Alert.alert('Sucesso', 'Todos os dados foram apagados!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.footerContainer}>
      {/* 1. Redes Sociais e Links */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => Linking.openURL('https://github.com')}>
          <FontAwesome5 name="github" size={18} color="#8E8A9F" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle} onPress={() => Linking.openURL('https://discord.com')}>
          <FontAwesome5 name="discord" size={18} color="#8E8A9F" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle} onPress={() => Linking.openURL('https://twitter.com')}>
          <FontAwesome5 name="twitter" size={18} color="#8E8A9F" />
        </TouchableOpacity>
      </View>

      {/* 2. Links / Abas do Rodapé */}
      <View style={styles.linksRow}>
        <TouchableOpacity><Text style={styles.linkText}>Sobre</Text></TouchableOpacity>
        <Text style={styles.dot}>•</Text>
        <TouchableOpacity><Text style={styles.linkText}>Termos</Text></TouchableOpacity>
        <Text style={styles.dot}>•</Text>
        <TouchableOpacity><Text style={styles.linkText}>Privacidade</Text></TouchableOpacity>
        <Text style={styles.dot}>•</Text>
        <TouchableOpacity><Text style={styles.linkText}>Suporte</Text></TouchableOpacity>
      </View>

      {/* 3. Botão de Limpeza / Reset */}
      <TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
        <Ionicons name="trash-outline" size={14} color="#EF4444" style={{ marginRight: 6 }} />
        <Text style={styles.resetButtonText}>Resetar Todos os Dados</Text>
      </TouchableOpacity>

      {/* 4. Direitos Autorais */}
      <Text style={styles.copyrightText}>
        © {new Date().getFullYear()} Meu Game Log. Todos os direitos reservados.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#0D0B14',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E1A2B',
    marginTop: 20,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E1A2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  linkText: {
    color: '#8E8A9F',
    fontSize: 12,
  },
  dot: {
    color: '#3F3A52',
    marginHorizontal: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  resetButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  copyrightText: {
    color: '#524E63',
    fontSize: 11,
  },
});