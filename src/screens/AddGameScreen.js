import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { saveGame } from '../services/storage';

export default function AddGameScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('PlayStation 5');
  const [status, setStatus] = useState('Jogando');
  const [hours, setHours] = useState('');
  const [rating, setRating] = useState('5');
  const [coverUrl, setCoverUrl] = useState('');

  const PLATFORMS = [
    { id: 'PS5', label: 'PS5', icon: 'microsoft-xbox-controller', lib: MaterialCommunityIcons },
    { id: 'Xbox', label: 'Xbox', icon: 'microsoft-xbox', lib: MaterialCommunityIcons },
    { id: 'Switch', label: 'Switch', icon: 'nintendo-switch', lib: MaterialCommunityIcons },
    { id: 'PC', label: 'PC', icon: 'desktop-outline', lib: Ionicons },
    { id: 'PS4', label: 'PS4', icon: 'gamepad-variant-outline', lib: MaterialCommunityIcons },
    { id: 'Outros', label: 'Outros', icon: 'game-controller-outline', lib: Ionicons },
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Informe o nome do jogo.');
      return;
    }

    if (coverUrl.trim() !== '') {
      const urlPattern = /^(http|https):\/\/[^ "]+$/;
      if (!urlPattern.test(coverUrl.trim())) {
        Alert.alert('URL Inválida', 'Informe uma URL válida começando com http:// ou https://');
        return;
      }
    }

    await saveGame({
      title: title.trim(),
      platform,
      status,
      hours: hours.replace(/[^0-9]/g, '') || '0',
      rating: rating || '5',
      coverUrl: coverUrl.trim()
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.fieldLabel}>NOME DO JOGO *</Text>
      <TextInput
        style={styles.darkInput}
        placeholder="Ex: Elden Ring"
        placeholderTextColor="#524E63"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.fieldLabel}>SELECIONE A PLATAFORMA</Text>
      <View style={styles.gridContainer}>
        {PLATFORMS.map((item) => {
          const IconComponent = item.lib;
          const isSelected = platform === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.platformCard, isSelected && styles.platformCardActive]}
              onPress={() => setPlatform(item.id)}
            >
              <IconComponent
                name={item.icon}
                size={18}
                color={isSelected ? '#FFF' : '#8E8A9F'}
                style={{ marginBottom: 4 }}
              />
              <Text style={[styles.platformText, isSelected && styles.platformTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.fieldLabel}>STATUS DE PROGRESSO</Text>
      <View style={styles.gridContainer}>
        {[
          { id: 'Quero Jogar', label: 'Quero Jogar', icon: 'bookmark-outline' },
          { id: 'Jogando', label: 'Jogando', icon: 'play-circle-outline' },
          { id: 'Zerado', label: 'Zerado', icon: 'trophy-outline' },
          { id: 'Abandonado', label: 'Abandonado', icon: 'close-circle-outline' },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.statusBox, status === item.id && styles.statusBoxActive]}
            onPress={() => setStatus(item.id)}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={status === item.id ? '#FFF' : '#8E8A9F'}
              style={{ marginBottom: 4 }}
            />
            <Text style={[styles.statusBoxText, status === item.id && styles.statusBoxTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.rowInputs}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.fieldLabel}>HORAS (APENAS NÚMEROS)</Text>
          <TextInput
            style={styles.darkInput}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#524E63"
            value={hours}
            onChangeText={(t) => setHours(t.replace(/[^0-9]/g, ''))}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.fieldLabel}>SUA NOTA</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(String(star))}>
                <FontAwesome
                  name="star"
                  size={18}
                  color={star <= Number(rating) ? '#F59E0B' : '#3F3A52'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.fieldLabel}>URL DA CAPA (OPCIONAL)</Text>
      <TextInput
        style={styles.darkInput}
        placeholder="https://..."
        placeholderTextColor="#524E63"
        value={coverUrl}
        onChangeText={setCoverUrl}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="archive-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.saveBtnText}>Salvar no Inventário</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelBtnText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120F1D', padding: 16 },
  fieldLabel: { color: '#8E8A9F', fontSize: 10, fontWeight: 'bold', marginTop: 14, marginBottom: 6 },
  darkInput: { backgroundColor: '#1E1A2B', borderRadius: 8, color: '#FFF', paddingHorizontal: 14, height: 46, fontSize: 14 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  platformCard: { width: '31%', backgroundColor: '#1E1A2B', height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginVertical: 4 },
  platformCardActive: { backgroundColor: '#8A5CF5' },
  platformText: { color: '#8E8A9F', fontSize: 11, fontWeight: '600' },
  platformTextActive: { color: '#FFF' },
  statusBox: { width: '48%', backgroundColor: '#1E1A2B', height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginVertical: 4 },
  statusBoxActive: { backgroundColor: '#8A5CF5' },
  statusBoxText: { color: '#8E8A9F', fontSize: 11, fontWeight: '600' },
  statusBoxTextActive: { color: '#FFF' },
  rowInputs: { flexDirection: 'row', alignItems: 'center' },
  starsRow: { backgroundColor: '#1E1A2B', height: 46, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 6 },
  saveBtn: { backgroundColor: '#8A5CF5', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24, flexDirection: 'row' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  cancelBtn: { height: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  cancelBtnText: { color: '#8E8A9F', fontSize: 14 }
});