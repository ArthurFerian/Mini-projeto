import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AddGameScreen from '../screens/AddGameScreen';
import GameDetailsScreen from '../screens/GameDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#0D0B14' },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#0D0B14' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home Game List' }} />
        <Stack.Screen name="AddGame" component={AddGameScreen} options={{ title: 'Add Game' }} />
        <Stack.Screen name="GameDetails" component={GameDetailsScreen} options={{ title: 'Game Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}