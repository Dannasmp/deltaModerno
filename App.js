import 'react-native-gesture-handler'; // Obligatorio para evitar errores de navegación
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa tus pantallas
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import HistorialScreen from './src/screens/HistorialScreen'; // 🔥 NUEVO

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        
        {/* 🔥 REGISTRO DEL HISTORIAL */}
        <Stack.Screen name="Historial" component={HistorialScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}