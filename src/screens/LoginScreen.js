import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Fingerprint } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { users } from '../data/users';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('email'); // 'email' | 'biometric'

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleEmailLogin = () => {
    setError('');
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    const user = users.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      setError('Correo o contraseña incorrectos');
      return;
    }
    navigation.navigate('Dashboard', { user });
  };

  const handleBiometricAuth = async () => {
    try {
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return Alert.alert(
          'Sin registros',
          'Configura tu autenticación biométrica en los ajustes del dispositivo.'
        );
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación Biométrica',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      });
      if (result.success) {
        if (result.success) {
  navigation.navigate('Dashboard', {
    user: {
      id: 'BIO-000',
      name: 'Usuario Biométrico',
      email: 'bio@empresa.com',
      role: 'Acceso Biométrico',
      department: 'General',
      city: 'Colombia',
      phone: 'N/A',
      age: 0,
      since: new Date().toISOString().split('T')[0],
      projects: 0,
      tasks: 0,
      rating: 5.0,
      avatarSeed: 'bio',
      bio: 'Acceso autenticado mediante biometría del dispositivo.',
    },
  });
}
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al autenticar.');
    }
  };

  const fillUser = (u) => {
    setEmail(u.email);
    setPassword(u.password);
    setError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>◆</Text>
          </View>
          <Text style={styles.headerTitle}>Portal Empresa</Text>
          <Text style={styles.headerSub}>Inicia sesión para continuar</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'email' && styles.tabActive]}
            onPress={() => setActiveTab('email')}
          >
            <Text style={[styles.tabText, activeTab === 'email' && styles.tabTextActive]}>
              Correo
            </Text>
          </TouchableOpacity>
          {isBiometricSupported && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'biometric' && styles.tabActive]}
              onPress={() => setActiveTab('biometric')}
            >
              <Text style={[styles.tabText, activeTab === 'biometric' && styles.tabTextActive]}>
                Biometría
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Email tab */}
        {activeTab === 'email' && (
          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                placeholder="correo@empresa.com"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(''); }}
                  placeholder="••••••••"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((p) => !p)}
                >
                  <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleEmailLogin}>
              <Text style={styles.primaryBtnText}>Entrar al portal →</Text>
            </TouchableOpacity>

            {/* Usuarios de prueba */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>usuarios de prueba</Text>
              <View style={styles.dividerLine} />
            </View>

            {users.map((u) => (
              <TouchableOpacity key={u.id} style={styles.userChip} onPress={() => fillUser(u)}>
                <View style={styles.chipAvatar}>
                  <Text style={styles.chipAvatarText}>
                    {u.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.chipInfo}>
                  <Text style={styles.chipName}>{u.name}</Text>
                  <Text style={styles.chipRole}>{u.role}</Text>
                </View>
                <Text style={styles.chipArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Biometric tab */}
        {activeTab === 'biometric' && (
          <View style={styles.card}>
            <View style={styles.biometricCenter}>
              <Text style={styles.biometricTitle}>Autenticación Biométrica</Text>
              <Text style={styles.biometricSub}>
                Usa tu huella dactilar o reconocimiento facial para ingresar
              </Text>
              <TouchableOpacity style={styles.biometricBtn} onPress={handleBiometricAuth}>
                <Fingerprint color="#e8d5b7" size={40} />
                <Text style={styles.biometricBtnText}>Ingresar con Biometría</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d1a' },
  scroll: { flexGrow: 1, padding: 20, paddingTop: 60 },

  header: { alignItems: 'center', marginBottom: 28 },
  logoBox: {
    width: 56, height: 56,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1, borderColor: '#2a2a4e',
  },
  logoText: { color: '#e8d5b7', fontSize: 24 },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: '600', marginBottom: 4 },
  headerSub: { color: '#8888aa', fontSize: 14 },

  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#2e2e5e' },
  tabText: { color: '#8888aa', fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: '#e8d5b7' },

  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },

  field: { marginBottom: 14 },
  label: { color: '#8888aa', fontSize: 13, marginBottom: 6, fontWeight: '500' },
  input: {
    backgroundColor: '#0d0d1a',
    borderWidth: 1,
    borderColor: '#2a2a4e',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 10 },
  eyeText: { fontSize: 18 },

  errorText: { color: '#f87171', fontSize: 13, marginBottom: 10, textAlign: 'center' },

  primaryBtn: {
    backgroundColor: '#5e17eb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#2a2a4e' },
  dividerText: { color: '#555577', fontSize: 11 },

  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0d1a',
    borderWidth: 1,
    borderColor: '#2a2a4e',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    gap: 10,
  },
  chipAvatar: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#2e2e5e',
    alignItems: 'center', justifyContent: 'center',
  },
  chipAvatarText: { color: '#e8d5b7', fontSize: 13, fontWeight: '600' },
  chipInfo: { flex: 1 },
  chipName: { color: '#ffffff', fontSize: 13, fontWeight: '500' },
  chipRole: { color: '#8888aa', fontSize: 11, marginTop: 1 },
  chipArrow: { color: '#555577', fontSize: 20 },

  biometricCenter: { alignItems: 'center', paddingVertical: 30 },
  biometricTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 10 },
  biometricSub: { color: '#8888aa', fontSize: 13, textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  biometricBtn: {
    backgroundColor: '#5e17eb',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 10,
    width: '60%',
  },
  biometricBtnText: { color: '#e8d5b7', fontSize: 14, fontWeight: '600' },
});

export default LoginScreen;