import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@game_inventory:games';

export const getGames = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao ler storage:', e);
    return [];
  }
};

export const saveGame = async (game) => {
  try {
    const currentGames = await getGames();
    const gameId = game.id ? String(game.id) : String(Date.now());

    const formattedGame = {
      ...game,
      id: gameId,
      hours: Number(game.hours) || 0,
      rating: Number(game.rating) || 0,
    };

    const index = currentGames.findIndex((g) => String(g.id) === gameId);
    let updatedGames = [...currentGames];

    if (index !== -1) {
      updatedGames[index] = formattedGame;
    } else {
      updatedGames.push(formattedGame);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGames));
    return updatedGames;
  } catch (e) {
    console.error('Erro ao salvar:', e);
  }
};

// Exclusão infalível: deleta por ID ou remove o item correspondente pelo título/posição
export const deleteGame = async (targetGame) => {
  try {
    const currentGames = await getGames();
    
    // Filtra removendo por ID ou pelo Nome do Jogo caso o ID esteja corrompido
    const updatedGames = currentGames.filter((g) => {
      if (targetGame.id && g.id) {
        return String(g.id).trim() !== String(targetGame.id).trim();
      }
      return g.title !== targetGame.title;
    });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGames));
    return updatedGames;
  } catch (e) {
    console.error('Erro ao deletar:', e);
  }
};

// LIMPEZA DE EMERGÊNCIA
export const clearAllGames = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Erro ao limpar storage:', e);
  }
};