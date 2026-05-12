import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Fingerprint } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      // Verifica si el dispositivo tiene hardware biométrico
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      // 1. Verificar si el usuario tiene huellas o rostro registrados
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!isEnrolled) {
        return Alert.alert(
          'No hay registros',
          'Por favor, configura tu autenticación biométrica en los ajustes de tu dispositivo.'
        );
      }

      // 2. Intentar autenticar
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación Biométrica',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      });

      if (result.success) {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al intentar autenticar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      
      {isBiometricSupported && (
        <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
          <Fingerprint color="#FFFFFF" size={32} />
          <Text style={styles.text}>Ingresar con Biometría</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#001A33' },
  title: { color: '#FFFFFF', fontSize: 24, marginBottom: 20 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5e17eb', padding: 15, borderRadius: 15 },
  text: { color: '#FFFFFF', marginLeft: 10, fontWeight: 'bold' }
});

export default LoginScreen;