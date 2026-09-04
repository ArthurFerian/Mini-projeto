import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getGames, deleteGame, clearAllGames } from '../services/storage';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600';

export default function HomeScreen({ navigation }) {
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState('Coleção');

  const loadGames = async () => {
    const data = await getGames();
    setGames(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadGames();
    });
    return unsubscribe;
  }, [navigation]);

  // Função para deletar um jogo diretamente da tela
  const handleRemoveGame = async (gameToRemove) => {
    setGames((prevGames) => prevGames.filter((g) => g.title !== gameToRemove.title));
    await deleteGame(gameToRemove);
  };

  // Função para limpar todos os dados do storage
  const handleResetStorage = () => {
    Alert.alert(
      'Limpar Banco de Dados',
      'Tem certeza de que deseja apagar toda a sua coleção? Essa ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar Tudo',
          style: 'destructive',
          onPress: async () => {
            await clearAllGames();
            setGames([]);
            Alert.alert('Sucesso', 'Todos os jogos foram apagados.');
          },
        },
      ]
    );
  };

  const renderGameCard = ({ item }) => {
    const cover = item.coverUrl && item.coverUrl.trim().length > 5 ? item.coverUrl : DEFAULT_COVER;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('GameDetails', {
            game: item,
            onDelete: () => handleRemoveGame(item),
          })
        }
      >
        <Image source={{ uri: cover }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.platformBadge}><Text style={styles.badgeText}>{item.platform || 'PC'}</Text></View>
            <View style={styles.statusBadge}><Text style={styles.badgeText}>● {item.status || 'Jogando'}</Text></View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.footerCardText}>⏱ {item.hours || 0}h</Text>
            <Text style={styles.footerCardText}>★ {item.rating || 0}/5</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Componente de Rodapé (Footer)
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => Linking.openURL('https://github.com')}>
          <FontAwesome5 name="github" size={16} color="#8E8A9F" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle} onPress={() => Linking.openURL('https://discord.com')}>
          <FontAwesome5 name="discord" size={16} color="#8E8A9F" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle} onPress={() => Linking.openURL('https://twitter.com')}>
          <FontAwesome5 name="twitter" size={16} color="#8E8A9F" />
        </TouchableOpacity>
      </View>

      <View style={styles.linksRow}>
        <TouchableOpacity><Text style={styles.linkText}>Sobre</Text></TouchableOpacity>
        <Text style={styles.dot}>•</Text>
        <TouchableOpacity><Text style={styles.linkText}>Termos</Text></TouchableOpacity>
        <Text style={styles.dot}>•</Text>
        <TouchableOpacity><Text style={styles.linkText}>Privacidade</Text></TouchableOpacity>
        <Text style={styles.dot}>•</Text>
        <TouchableOpacity><Text style={styles.linkText}>Suporte</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleResetStorage}>
        <Ionicons name="trash-outline" size={14} color="#EF4444" style={{ marginRight: 6 }} />
        <Text style={styles.resetButtonText}>Resetar Todos os Dados</Text>
      </TouchableOpacity>

      <Text style={styles.copyrightText}>
        © {new Date().getFullYear()} Meu Game Log. Todos os direitos reservados.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#120F1D" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meu Game Log</Text>
          <Text style={styles.headerSubtitle}>{games.length} jogos cadastrados</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddGame')}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Lista Principal de Jogos com Rodapé embutido */}
      {games.length === 0 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.emptyContainer}>
            <Ionicons name="game-controller-outline" size={64} color="#3A3450" />
            <Text style={styles.emptyText}>Nenhum jogo encontrado.</Text>
            <Text style={styles.emptySubtext}>Toque no + acima para adicionar um novo jogo.</Text>
          </View>
          {renderFooter()}
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item, index) => String(item.id || item.title || index)}
          renderItem={renderGameCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />
      )}

      {/* Barra de Abas Inferior (Bottom Navigation Bar) */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Coleção')}>
          <Ionicons name="library" size={20} color={activeTab === 'Coleção' ? '#8A5CF5' : '#8E8A9F'} />
          <Text style={[styles.tabLabel, activeTab === 'Coleção' && styles.tabLabelActive]}>Coleção</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Estatísticas')}>
          <Ionicons name="stats-chart" size={20} color={activeTab === 'Estatísticas' ? '#8A5CF5' : '#8E8A9F'} />
          <Text style={[styles.tabLabel, activeTab === 'Estatísticas' && styles.tabLabelActive]}>Estatísticas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Explorar')}>
          <Ionicons name="compass" size={20} color={activeTab === 'Explorar' ? '#8A5CF5' : '#8E8A9F'} />
          <Text style={[styles.tabLabel, activeTab === 'Explorar' && styles.tabLabelActive]}>Explorar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Perfil')}>
          <Ionicons name="person" size={20} color={activeTab === 'Perfil' ? '#8A5CF5' : '#8E8A9F'} />
          <Text style={[styles.tabLabel, activeTab === 'Perfil' && styles.tabLabelActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120F1D' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#8E8A9F', fontSize: 12, marginTop: 2 },
  addBtn: { backgroundColor: '#8A5CF5', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 10 },
  card: { backgroundColor: '#1E1A2B', borderRadius: 12, flexDirection: 'row', marginBottom: 12, overflow: 'hidden', height: 100 },
  cardImage: { width: 90, height: '100%' },
  cardContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  badgeRow: { flexDirection: 'row', gap: 6 },
  platformBadge: { backgroundColor: 'rgba(138,92,245,0.3)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusBadge: { backgroundColor: 'rgba(16,185,129,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  footerCardText: { color: '#8E8A9F', fontSize: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  emptySubtext: { color: '#8E8A9F', fontSize: 12, marginTop: 4 },
  
  // Estilos do Rodapé
  footerContainer: { backgroundColor: '#0D0B14', paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center', borderRadius: 12, marginTop: 12, marginBottom: 10 },
  socialRow: { flexDirection: 'row', gap: 16, marginBottom: 14 },
  iconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1E1A2B', justifyContent: 'center', alignItems: 'center' },
  linksRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  linkText: { color: '#8E8A9F', fontSize: 11 },
  dot: { color: '#3F3A52', marginHorizontal: 6 },
  resetButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginBottom: 12 },
  resetButtonText: { color: '#EF4444', fontSize: 11, fontWeight: 'bold' },
  copyrightText: { color: '#524E63', fontSize: 10 },

  // Estilos da Barra de Abas Inferior
  tabBar: { flexDirection: 'row', backgroundColor: '#1A1626', borderTopWidth: 1, borderTopColor: '#2A243A', paddingVertical: 10, paddingBottom: 12 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { color: '#8E8A9F', fontSize: 10, marginTop: 4 },
  tabLabelActive: { color: '#8A5CF5', fontWeight: 'bold' },
});