import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const OXFORD_BLUE = "#002147";
const PURPLE = "#5e17eb";
const WHITE = "#FFFFFF";
const USER_KEY = '@logs_v3_delta_user';

const CIUDADES = [
  "Bogotá","Lima","Santiago","Buenos Aires","Caracas","Quito",
  "La Paz","Asunción","Montevideo","Brasilia","Ciudad de México",
  "Guadalajara","Monterrey","San José","Panamá","Medellín",
  "Cali","Barranquilla","Cartagena","Cusco",
];

const ZONAS = [
  "Norte","Sur","Este","Oeste","Centro","Alta","Baja",
  "Interior","Costera","Montaña","Fluvial","Andina",
];

const DESCRIPCIONES = [
  "Zona de alta biodiversidad con cobertura boscosa densa y presencia de fauna endémica registrada.",
  "Área de monitoreo climático con historial de precipitaciones y variaciones térmicas documentadas.",
  "Sector con actividad geológica moderada, suelo arcilloso y presencia de sedimentos recientes.",
  "Punto de control hidrológico sobre cuenca media, caudal variable según estación del año.",
  "Estación de observación satelital secundaria, coordenadas verificadas en campo durante misión.",
  "Zona de transición ecológica entre ecosistema húmedo y seco, alta variabilidad estacional.",
  "Perímetro de reserva natural con restricción de acceso y protocolos especiales de ingreso.",
  "Área de reforestación activa, presencia de especies nativas en proceso de recuperación.",
  "Sector urbano-periférico con indicadores de presión antrópica documentados en última campaña.",
  "Corredor biológico estratégico, monitoreo de especies migratorias en curso desde base DELTA.",
];

const DIFICULTADES = ["Facil", "Moderado", "Dificil"];

const generarFalsos = (cantidad = 20) => {
  return Array.from({ length: cantidad }, (_, i) => ({
    id: `fake-${i}`,
    title: `Zona ${ZONAS[i % ZONAS.length]} en ${CIUDADES[i % CIUDADES.length]}`,
    description: DESCRIPCIONES[i % DESCRIPCIONES.length],
    image: `https://picsum.photos/seed/${i + 100}/800/600`,
    difficulty: DIFICULTADES[i % DIFICULTADES.length],
    coordinates: {
      lat: parseFloat((((i * 127) % 18000) / 100 - 90).toFixed(4)),
      lng: parseFloat((((i * 251) % 36000) / 100 - 180).toFixed(4)),
    },
    esFalso: true,
  }));
};

const DifficultyBadge = ({ difficulty }) => {
  const color =
    difficulty === 'Dificil' ? '#c0392b' :
    difficulty === 'Moderado' ? '#e67e22' : '#27ae60';
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>🎯 {difficulty}</Text>
    </View>
  );
};

const RegistroCard = React.memo(({ item }) => (
  <View style={[styles.card, item.esFalso ? null : styles.cardReal]}>
    <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
    {!item.esFalso && (
      <View style={styles.realBadge}>
        <Text style={styles.realBadgeText}>📸 Foto tuya</Text>
      </View>
    )}
    <View style={styles.info}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.badgeRow}>
        <DifficultyBadge difficulty={item.difficulty} />
      </View>
      <Text style={styles.meta}>
        📍 {item.coordinates.lat.toFixed(3)}, {item.coordinates.lng.toFixed(3)}
      </Text>
      {item.date && <Text style={styles.meta}>🕒 {item.date}</Text>}
    </View>
  </View>
));

const HistorialScreen = () => {
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const cargarHistorial = useCallback(async () => {
    try {
      const guardado = await AsyncStorage.getItem(USER_KEY);
      const reales = guardado ? JSON.parse(guardado) : [];

      const realesFormateados = reales.map((r) => ({
        id: `real-${r.id}`,
        title: `📸 Captura — ${r.date?.split(',')[0] ?? 'Campo'}`,
        description: 'Registro fotográfico con coordenadas verificadas en campo.',
        image: r.url,
        difficulty: 'Moderado',
        coordinates: {
          lat: r.coords?.latitude ?? 0,
          lng: r.coords?.longitude ?? 0,
        },
        date: r.date,
        esFalso: false,
      }));

      setRegistros([...realesFormateados, ...generarFalsos(20)]);
    } catch (e) {
      console.error(e);
      setRegistros(generarFalsos(20));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', cargarHistorial);
    return unsubscribe;
  }, [navigation, cargarHistorial]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={PURPLE} size="large" />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  const totalFotos = registros.filter(r => !r.esFalso).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>Historial DELTA</Text>
          <Text style={styles.subheader}>
            {registros.length} registros · {totalFotos} fotos tuyas
          </Text>
        </View>
        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={() => navigation.navigate('CameraScreen')}
        >
          <Text style={styles.cameraBtnText}>📷 Cámara</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => <RegistroCard item={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: OXFORD_BLUE, paddingHorizontal: 15, paddingTop: 50 },
  loadingContainer: { flex: 1, backgroundColor: OXFORD_BLUE, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: WHITE, marginTop: 12, fontSize: 14 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  header: { color: WHITE, fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  subheader: { color: '#aaa', fontSize: 13 },
  cameraBtn: { backgroundColor: PURPLE, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  cameraBtnText: { color: WHITE, fontSize: 13, fontWeight: '600' },

  card: {
    marginBottom: 15,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  cardReal: {
    borderColor: PURPLE,
    borderWidth: 2,
  },
  realBadge: {
    position: 'absolute',
    top: 10, left: 10,
    backgroundColor: PURPLE,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  realBadgeText: { color: WHITE, fontSize: 12, fontWeight: '600' },
  image: { width: '100%', height: 180 },
  info: { padding: 12 },
  cardTitle: { color: WHITE, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  description: { color: '#bbb', fontSize: 13, lineHeight: 19, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', marginBottom: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { color: WHITE, fontSize: 12, fontWeight: '600' },
  meta: { color: '#888', fontSize: 12, marginTop: 3 },
});

export default HistorialScreen;