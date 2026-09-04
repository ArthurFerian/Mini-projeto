import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { deleteGame, saveGame } from '../services/storage';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600';

export default function GameDetailsScreen({ route, navigation }) {
  const { game } = route.params || {};

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(game?.title || '');
  const [platform, setPlatform] = useState(game?.platform || 'PS5');
  const [status, setStatus] = useState(game?.status || 'Jogando');
  const [hours, setHours] = useState(String(game?.hours || '0'));
  const [rating, setRating] = useState(String(game?.rating || '5'));
  const [coverUrl, setCoverUrl] = useState(game?.coverUrl || '');
  const [notes, setNotes] = useState(game?.notes || '');

  const PLATFORMS = ['PS5', 'Xbox', 'Switch', 'PC', 'PS4', 'Outros'];

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'O título não pode ficar vazio.');
      return;
    }

    await saveGame({
      ...game,
      title: title.trim(),
      platform,
      status,
      hours,
      rating,
      coverUrl: coverUrl.trim(),
      notes: notes.trim(),
    });

    setIsEditing(false);
    Alert.alert('Sucesso', 'Jogo atualizado!');
  };

  const handleDelete = async () => {
    Alert.alert('Confirmar Exclusão', `Deseja apagar "${title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir Definitivamente',
        style: 'destructive',
        onPress: async () => {
          // Passa o objeto game completo para garantir que ache por ID ou por Título
          await deleteGame(game);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: coverUrl && coverUrl.trim().length > 5 ? coverUrl : DEFAULT_COVER }}
          style={styles.heroBanner}
        />
        <View style={styles.heroOverlay} />

        <TouchableOpacity style={styles.editToggleBtn} onPress={() => setIsEditing(!isEditing)}>
          <Ionicons name={isEditing ? 'close-outline' : 'create-outline'} size={22} color="#FFF" />
        </TouchableOpacity>

        {!isEditing && (
          <View style={styles.heroInfo}>
            <Text style={styles.heroTitle}>{title}</Text>
            <View style={styles.tagRow}>
              <View style={styles.tagPlatform}>
                <Text style={styles.tagText}>{platform}</Text>
              </View>
              <View style={styles.tagStatus}>
                <Text style={styles.tagText}>● {status}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {isEditing ? (
        <View style={styles.editForm}>
          <Text style={styles.fieldLabel}>NOME DO JOGO</Text>
          <TextInput style={styles.darkInput} value={title} onChangeText={setTitle} />

          <Text style={styles.fieldLabel}>PLATAFORMA</Text>
          <View style={styles.gridRow}>
            {PLATFORMS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.miniChip, platform === p && styles.chipActive]}
                onPress={() => setPlatform(p)}
              >
                <Text style={[styles.chipText, platform === p && styles.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>STATUS</Text>
          <View style={styles.gridRow}>
            {['Quero Jogar', 'Jogando', 'Zerado', 'Abandonado'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.miniChip, status === s && styles.chipActive]}
                onPress={() => setStatus(s)}
              >
                <Text style={[styles.chipText, status === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 0.48 }}>
              <Text style={styles.fieldLabel}>HORAS</Text>
              <TextInput
                style={styles.darkInput}
                keyboardType="numeric"
                value={hours}
                onChangeText={(t) => setHours(t.replace(/[^0-9]/g, ''))}
              />
            </View>
            <View style={{ flex: 0.48 }}>
              <Text style={styles.fieldLabel}>NOTA</Text>
              <TextInput
                style={styles.darkInput}
                keyboardType="numeric"
                value={rating}
                onChangeText={setRating}
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>URL DA CAPA</Text>
          <TextInput
            style={styles.darkInput}
            value={coverUrl}
            onChangeText={setCoverUrl}
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
            <Ionicons name="save-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.saveBtnText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>SUA NOTA</Text>
              <Text style={styles.metaValue}>{rating} / 5.0</Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>TEMPO DE JOGO</Text>
              <Text style={styles.metaValBig}>{hours} hrs</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Anotações</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Anotações..."
            placeholderTextColor="#524E63"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
            <Ionicons name="save-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.saveBtnText}>Salvar Anotações</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
        <Text style={styles.deleteBtnText}>Excluir Jogo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120F1D', padding: 16 },
  heroContainer: { height: 200, borderRadius: 14, overflow: 'hidden', position: 'relative', marginBottom: 16 },
  heroBanner: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18,15,29,0.5)' },
  heroInfo: { position: 'absolute', bottom: 12, left: 12, right: 12 },
  heroTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  editToggleBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(30,26,43,0.8)', padding: 8, borderRadius: 20 },
  tagRow: { flexDirection: 'row', marginTop: 4 },
  tagPlatform: { backgroundColor: 'rgba(138,92,245,0.4)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  tagStatus: { backgroundColor: 'rgba(16,185,129,0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  metaBox: { flex: 0.48, backgroundColor: '#1E1A2B', padding: 12, borderRadius: 10, alignItems: 'center' },
  metaLabel: { color: '#8E8A9F', fontSize: 9, fontWeight: 'bold' },
  metaValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  metaValBig: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  notesInput: { backgroundColor: '#1E1A2B', borderRadius: 10, color: '#FFF', padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 16 },
  editForm: { marginBottom: 16 },
  fieldLabel: { color: '#8E8A9F', fontSize: 10, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  darkInput: { backgroundColor: '#1E1A2B', borderRadius: 8, color: '#FFF', paddingHorizontal: 12, height: 42, fontSize: 13 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  miniChip: { backgroundColor: '#1E1A2B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  chipActive: { backgroundColor: '#8A5CF5' },
  chipText: { color: '#8E8A9F', fontSize: 11 },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#8A5CF5', paddingVertical: 14, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  deleteBtn: { backgroundColor: '#3A1018', paddingVertical: 14, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 40 },
  deleteBtnText: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 }
});