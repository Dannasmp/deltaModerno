import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  ActivityIndicator, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OXFORD_BLUE = "#002147";
const PURPLE = "#5e17eb";
const WHITE = "#FFFFFF";
const USER_KEY = '@logs_v3_delta_user';

const TOTAL_REGISTROS = 1_000_000; 
const PAGINA_SIZE = 20;            

const CIUDADES = [
  "Bogotá","Lima","Santiago","Buenos Aires","Caracas","Quito","La Paz",
  "Asunción","Montevideo","Brasilia","Ciudad de México","Guadalajara",
  "Monterrey","San José","Panamá","Managua","Tegucigalpa","San Salvador",
  "Guatemala","Havana","Medellín","Cali","Barranquilla","Cartagena",
  "Cusco","Arequipa","Córdoba","Rosario","Valparaíso","Concepción",
  "Porto Alegre","Recife","Salvador","Fortaleza","Belém","Manaus",
  "Guayaquil","Cuenca","Cochabamba","Santa Cruz","Asunción","Posadas",
  "Mendoza","Tucumán","Mar del Plata","Neuquén","Bariloche","Ushuaia",
];

const ZONAS = [
  "Norte","Sur","Este","Oeste","Centro","Alta","Baja",
  "Interior","Costera","Montaña","Fluvial","Andina",
  "Selvática","Árida","Subtropical","Glaciar","Volcánica",
];

const DIFICULTADES = ["Facil", "Moderado", "Dificil"];

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
  "Punto de muestreo hídrico con análisis fisicoquímico trimestral y registro de caudal.",
  "Zona sísmica de baja magnitud, instrumentación instalada para monitoreo continuo.",
  "Área de nidificación documentada, restricción de acceso durante temporada reproductiva.",
  "Sector minero-ambiental con pasivos identificados y plan de remediación en evaluación.",
  "Nodo de red de sensores IoT para monitoreo ambiental en tiempo real, batería activa.",
];

// ✅ Genera un registro a partir de su índice — siempre el mismo para el mismo índice
const generarRegistro = (index) => {
  // Usamos el índice como semilla para que sean consistentes
  const seed = ((index * 2654435761) >>> 0) % 9999 + 1000; // hash simple
  const ciudad = CIUDADES[index % CIUDADES.length];
  const zona = ZONAS[index % ZONAS.length];
  const desc = DESCRIPCIONES[index % DESCRIPCIONES.length];
  const dificultad = DIFICULTADES[index % DIFICULTADES.length];

  // Coordenadas pseudo-aleatorias pero consistentes por índice
  const lat = parseFloat(((((index * 127) % 18000) / 100) - 90).toFixed(4));
  const lng = parseFloat(((((index * 251) % 36000) / 100) - 180).toFixed(4));

  return {
    id: `fake-${index}`,
    title: `Zona ${zona} ${index + 1} — ${ciudad}`,
    description: desc,
    image: `https://picsum.photos/seed/${seed}/800/600`,
    difficulty: dificultad,
    coordinates: { lat, lng },
  };
};

// ─────────────────────────────────────────────────────────────

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
        <DifficultyBadge difficulty={item.difficulty} />
      </View>
      <Text style={styles.meta}>
        📍 {item.coordinates.lat.toFixed(3)}, {item.coordinates.lng.toFixed(3)}
      </Text>
      {item.date && <Text style={styles.meta}>🕒 {item.date}</Text>}
    </View>
  </View>
));

// ─────────────────────────────────────────────────────────────

const HistorialScreen = () => {
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const paginaActual = useRef(0);
  const realesRef = useRef([]);

  // Carga la siguiente página de registros falsos
  const cargarPagina = useCallback((pagina) => {
    const inicio = pagina * PAGINA_SIZE;
    const fin = Math.min(inicio + PAGINA_SIZE, TOTAL_REGISTROS);

    if (inicio >= TOTAL_REGISTROS) return [];

    return Array.from({ length: fin - inicio }, (_, i) =>
      generarRegistro(inicio + i)
    );
  }, []);

  // Carga inicial: registros reales + primera página de falsos
  useEffect(() => {
    const inicializar = async () => {
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
        }));

        realesRef.current = realesFormateados;

        const primerasPaginas = [
          ...cargarPagina(0),
          ...cargarPagina(1),
        ];
        paginaActual.current = 2;

        setRegistros([...realesFormateados, ...primerasPaginas]);
      } catch (e) {
        console.error(e);
        setRegistros(cargarPagina(0));
        paginaActual.current = 1;
      } finally {
        setIsLoading(false);
      }
    };

    inicializar();
  }, []);

  // Carga más cuando el usuario llega al final
  const cargarMas = useCallback(() => {
    if (loadingMore) return;
    if (paginaActual.current * PAGINA_SIZE >= TOTAL_REGISTROS) return;

    setLoadingMore(true);

    // setTimeout para no bloquear el hilo principal
    setTimeout(() => {
      const nuevasPagina = cargarPagina(paginaActual.current);
      paginaActual.current += 1;
      setRegistros((prev) => [...prev, ...nuevasPagina]);
      setLoadingMore(false);
    }, 50);
  }, [loadingMore, cargarPagina]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={PURPLE} />
        <Text style={styles.footerText}>Cargando más registros...</Text>
      </View>
    );
  };

  const totalMostrado = registros.length;
  const totalReal = totalMostrado - realesRef.current.length;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={PURPLE} size="large" />
        <Text style={styles.loadingText}>Inicializando DELTA...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historial DELTA</Text>
      <View style={styles.statsRow}>
        <Text style={styles.subheader}>
          {totalMostrado.toLocaleString()} cargados de {TOTAL_REGISTROS.toLocaleString()}
        </Text>
      </View>

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RegistroCard item={item} />}
        onEndReached={cargarMas}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        // ✅ Optimizaciones críticas para listas grandes
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: 320,
          offset: 320 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OXFORD_BLUE,
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: OXFORD_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: WHITE, marginTop: 12, fontSize: 14 },
  header: { color: WHITE, fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  statsRow: { marginBottom: 15 },
  subheader: { color: '#aaa', fontSize: 13 },

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
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { color: WHITE, fontSize: 12, fontWeight: '600' },
  meta: { color: '#888', fontSize: 12, marginTop: 3 },
  footer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  footerText: { color: '#aaa', fontSize: 13 },
});

export default HistorialScreen;