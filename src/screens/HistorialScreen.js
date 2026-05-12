import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OXFORD_BLUE = "#002147";
const PURPLE = "#5e17eb";
const WHITE = "#FFFFFF";
const USER_KEY = '@logs_v3_delta_user';

// ✅ 500 registros falsos basados en la estructura del JSON que tienes
const FAKE_ADVENTURES = [
  { id: "529536ca-8d40-4d65-b918-a6ef54da9005", title: "bidet en North Maud", description: "Concedo spiritus ratione cauda. Somnus una tyrannus dignissimos sumo reprehenderit magni temperantia.", image: "https://picsum.photos/seed/m8IMuUC/800/600?grayscale&blur=10", difficulty: "Facil", coordinates: { lat: -68.679, lng: 166.0792 } },
  { id: "af709bfa-329f-49cf-887b-5c922e70ab73", title: "moment en Lefflerbury", description: "Necessitatibus celer amoveo deficio magnam cohaero minus deserunt.", image: "https://picsum.photos/seed/9DvRxX8/800/600?blur=8", difficulty: "Facil", coordinates: { lat: -71.7156, lng: 18.223 } },
  { id: "1654de98-a689-4ce7-bc74-830b184cc2a6", title: "derby en Cierracester", description: "Id comburo ratione vito vulnus. Attonbitus sollicito viriliter voluntarius.", image: "https://picsum.photos/seed/RHaxPX/800/600?blur=7", difficulty: "Moderado", coordinates: { lat: 67.4865, lng: 95.5538 } },
  { id: "b0bda203-23ad-45f2-bf03-a643f3548a08", title: "insolence en North Isac", description: "Addo solvo urbs aeternus charisma corporis cuius stillicidium.", image: "https://picsum.photos/seed/DmbxXUE/800/600?blur=5", difficulty: "Dificil", coordinates: { lat: 17.9278, lng: -128.0113 } },
  { id: "f8312e53-734f-4894-acc5-5ef17afb4b20", title: "stall en Binghamton", description: "Cuius curis conicio. Admitto dolorum corona vilicus volup voro vivo.", image: "https://picsum.photos/seed/IZzx5RtQ/800/600", difficulty: "Moderado", coordinates: { lat: 28.6239, lng: 44.1683 } },
  // Los 495 restantes se generan automáticamente abajo
];

// ✅ Genera registros adicionales hasta completar 500
const generarFaltantes = (existentes) => {
  const total = 500;
  const ciudades = ["Bogotá", "Lima", "Santiago", "Buenos Aires", "Caracas", "Quito", "La Paz", "Asunción", "Montevideo", "Brasilia", "Ciudad de México", "Guadalajara", "Monterrey", "San José", "Panamá", "Managua", "Tegucigalpa", "San Salvador", "Guatemala", "Havana"];
  const zonas = ["Norte", "Sur", "Este", "Oeste", "Centro", "Alta", "Baja", "Interior", "Costera", "Montaña"];
  const dificultades = ["Facil", "Moderado", "Dificil"];
  const descripciones = [
    "Zona de alta biodiversidad con cobertura boscosa densa y presencia de fauna endémica.",
    "Área de monitoreo climático con registro histórico de precipitaciones y temperatura.",
    "Sector con actividad geológica moderada, suelo arcilloso y presencia de sedimentos.",
    "Punto de control hidrológico sobre cuenca media, caudal variable según estación.",
    "Estación de observación satelital secundaria, coordenadas verificadas en campo.",
    "Zona de transición ecológica entre ecosistema húmedo y seco, alta variabilidad.",
    "Perímetro de reserva natural con restricción de acceso y protocolos especiales.",
    "Área de reforestación activa, presencia de especies nativas en recuperación.",
    "Sector urbano-periférico con indicadores de presión antrópica documentados.",
    "Corredor biológico estratégico, monitoreo de especies migratorias en curso.",
  ];

  const extras = [];
  for (let i = existentes.length; i < total; i++) {
    const seed = Math.floor(Math.random() * 9000) + 1000;
    const ciudad = ciudades[i % ciudades.length];
    const zona = zonas[i % zonas.length];
    const desc = descripciones[i % descripciones.length];
    extras.push({
      id: `fake-${i}`,
      title: `Zona ${zona} en ${ciudad}`,
      description: desc,
      image: `https://picsum.photos/seed/${seed}/800/600`,
      difficulty: dificultades[i % dificultades.length],
      coordinates: {
        lat: parseFloat((Math.random() * 180 - 90).toFixed(4)),
        lng: parseFloat((Math.random() * 360 - 180).toFixed(4)),
      },
    });
  }
  return [...existentes, ...extras];
};

const TODOS_LOS_REGISTROS = generarFaltantes(FAKE_ADVENTURES); // 500 en total

const HistorialScreen = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const guardado = await AsyncStorage.getItem(USER_KEY);
        const reales = guardado ? JSON.parse(guardado) : [];

        // Combina registros reales (fotos capturadas) + 500 falsos
        // Los reales van primero
        const combinados = [
          ...reales.map(r => ({
            id: r.id?.toString(),
            title: `Captura del ${r.date?.split(',')[0] ?? 'campo'}`,
            description: `Registro fotográfico con coordenadas verificadas en campo.`,
            image: r.url,
            difficulty: "Moderado",
            coordinates: {
              lat: r.coords?.latitude ?? 0,
              lng: r.coords?.longitude ?? 0,
            },
            date: r.date,
          })),
          ...TODOS_LOS_REGISTROS,
        ];

        setLogs(combinados);
      } catch (e) {
        console.error(e);
        setLogs(TODOS_LOS_REGISTROS);
      } finally {
        setIsLoading(false);
      }
    };

    cargarHistorial();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.badgeRow}>
          <View style={[
            styles.badge,
            item.difficulty === 'Dificil' && { backgroundColor: '#c0392b' },
            item.difficulty === 'Moderado' && { backgroundColor: '#e67e22' },
            item.difficulty === 'Facil' && { backgroundColor: '#27ae60' },
          ]}>
            <Text style={styles.badgeText}>🎯 {item.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.meta}>
          📍 {item.coordinates.lat.toFixed(3)}, {item.coordinates.lng.toFixed(3)}
        </Text>

        {item.date && (
          <Text style={styles.meta}>🕒 {item.date}</Text>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={PURPLE} size="large" />
        <Text style={{ color: WHITE, marginTop: 12 }}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historial DELTA</Text>
      <Text style={styles.subheader}>{logs.length} registros encontrados</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
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
  header: { color: WHITE, fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  subheader: { color: '#aaa', fontSize: 13, marginBottom: 15 },

  card: {
    marginBottom: 15,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },

  image: { width: '100%', height: 180 },

  info: { padding: 12 },

  cardTitle: { color: WHITE, fontSize: 16, fontWeight: 'bold', marginBottom: 6 },

  description: { color: '#bbb', fontSize: 13, lineHeight: 19, marginBottom: 8 },

  badgeRow: { flexDirection: 'row', marginBottom: 6 },

  badge: {
    backgroundColor: PURPLE,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  badgeText: { color: WHITE, fontSize: 12, fontWeight: '600' },

  meta: { color: '#888', fontSize: 12, marginTop: 3 },
});

export default HistorialScreen;