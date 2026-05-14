import { useRoute, useNavigation } from '@react-navigation/native';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { calcDaysSince, fmtDate } from '../data/users';

const StatCard = ({ label, value, sub, color }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
  </View>
);

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoKey}>{label}</Text>
    <Text style={styles.infoVal} numberOfLines={1}>{value}</Text>
  </View>
);

const NavButton = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={[styles.navBtn, { borderColor: color }]} onPress={onPress}>
    <Text style={styles.navBtnIcon}>{icon}</Text>
    <Text style={[styles.navBtnLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const DashboardScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user: u } = route.params;

  const initials = u.name.split(' ').slice(0, 2).map((n) => n[0]).join('');
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/png?seed=${encodeURIComponent(u.name)}&size=200`;
  const days = u.since ? calcDaysSince(u.since).toLocaleString('es-CO') : '—';

  return (
    <View style={styles.root}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <View style={styles.topbarLogo}>
            <Text style={styles.topbarLogoText}>◆</Text>
          </View>
          <Text style={styles.topbarTitle}>Portal Empresa</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.logoutText}>Salir →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Saludo */}
        <View style={styles.greetRow}>
          <View>
            <Text style={styles.greetTitle}>Bienvenido, {u.name.split(' ')[0]} 👋</Text>
            <Text style={styles.greetSub}>Resumen de tu actividad</Text>
          </View>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>En línea</Text>
          </View>
        </View>

        {/* Navegación rápida */}
        <View style={styles.navSection}>
          <Text style={styles.sectionTitle}>ACCESOS RÁPIDOS</Text>
          <View style={styles.navGrid}>
            <NavButton
              icon="🏠"
              label="Inicio"
              color="#60a5fa"
              onPress={() => navigation.navigate('Home')}
            />
            <NavButton
              icon="📷"
              label="Cámara"
              color="#a78bfa"
              onPress={() => navigation.navigate('CameraScreen')}
            />
            <NavButton
              icon="📋"
              label="Historial"
              color="#4ade80"
              onPress={() => navigation.navigate('Historial')}
            />
          </View>
        </View>

        {/* Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <Image
                  source={{ uri: avatarUrl }}
                   style={styles.avatar}
                  resizeMode="cover"/>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{u.name}</Text>
              <Text style={styles.profileRole}>{u.role}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.idBadge}>
                  <Text style={styles.idBadgeText}>{u.id}</Text>
                </View>
                <View style={styles.deptBadge}>
                  <Text style={styles.deptBadgeText}>{u.department}</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.profileBio}>{u.bio}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaTag}>📍 {u.city}</Text>
            <Text style={styles.metaTag}>📅 Desde {u.since ? fmtDate(u.since) : '—'}</Text>
            <Text style={styles.metaTag}>📞 {u.phone}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Proyectos" value={u.projects} sub="activos" color="#e8d5b7" />
          <StatCard label="Tareas" value={u.tasks} sub="completadas" color="#4ade80" />
          <StatCard label="Calificación" value={`${u.rating} ★`} sub="de 5.0" color="#fbbf24" />
          <StatCard label="Días" value={days} sub="en empresa" color="#60a5fa" />
        </View>

        {/* Info personal */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>INFORMACIÓN PERSONAL</Text>
          <InfoRow icon="👤" label="Nombre" value={u.name} />
          <InfoRow icon="📧" label="Correo" value={u.email} />
          <InfoRow icon="📞" label="Teléfono" value={u.phone} />
          <InfoRow icon="🎂" label="Edad" value={u.age ? `${u.age} años` : '—'} />
          <InfoRow icon="📍" label="Ciudad" value={u.city} />
        </View>

        {/* Info laboral */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>INFORMACIÓN LABORAL</Text>
          <InfoRow icon="💼" label="Cargo" value={u.role} />
          <InfoRow icon="🏢" label="Depto" value={u.department} />
          <InfoRow icon="🪪" label="ID" value={u.id} />
          <InfoRow icon="📅" label="Ingreso" value={u.since ? fmtDate(u.since) : '—'} />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d0d1a' },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
  },
  topbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topbarLogo: {
    width: 32, height: 32,
    backgroundColor: '#2e2e5e',
    borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  topbarLogoText: { color: '#e8d5b7', fontSize: 14 },
  topbarTitle: { color: '#e8d5b7', fontSize: 15, fontWeight: '600' },
  logoutBtn: {
    backgroundColor: '#2e2e5e',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: { color: '#8888aa', fontSize: 13 },

  scroll: { padding: 16, paddingBottom: 40 },

  greetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetTitle: { color: '#ffffff', fontSize: 20, fontWeight: '600', marginBottom: 3 },
  greetSub: { color: '#8888aa', fontSize: 13 },
  onlineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#0d2a1a',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4ade80' },
  onlineText: { color: '#4ade80', fontSize: 12, fontWeight: '500' },

  // Nav rápida
  navSection: { marginBottom: 14 },
  sectionTitle: {
    color: '#555577', fontSize: 11, fontWeight: '600',
    letterSpacing: 0.8, marginBottom: 10,
  },
  navGrid: { flexDirection: 'row', gap: 10 },
  navBtn: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  navBtnIcon: { fontSize: 24 },
  navBtnLabel: { fontSize: 12, fontWeight: '600' },

  profileCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a4e',
    marginBottom: 14,
    borderTopWidth: 3,
    borderTopColor: '#5e17eb',
  },
  profileTop: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  avatar: {
    width: 72, height: 72,
    borderRadius: 36,
    backgroundColor: '#2e2e5e',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#5e17eb',
  },
  avatarText: { color: '#e8d5b7', fontSize: 22, fontWeight: '700' },
  profileInfo: { flex: 1, justifyContent: 'center' },
  profileName: { color: '#ffffff', fontSize: 17, fontWeight: '600', marginBottom: 3 },
  profileRole: { color: '#8888aa', fontSize: 13, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  idBadge: {
    backgroundColor: '#0d0d1a',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6,
  },
  idBadgeText: { color: '#8888aa', fontSize: 11, fontFamily: 'monospace' },
  deptBadge: {
    backgroundColor: '#1e3a5f',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6,
  },
  deptBadgeText: { color: '#60a5fa', fontSize: 11, fontWeight: '500' },
  profileBio: { color: '#8888aa', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaTag: {
    color: '#8888aa', fontSize: 12,
    backgroundColor: '#0d0d1a',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1, borderColor: '#2a2a4e',
    overflow: 'hidden',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  statLabel: { color: '#555577', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  statValue: { fontSize: 26, fontWeight: '700', marginBottom: 3 },
  statSub: { color: '#555577', fontSize: 11 },

  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a4e',
    marginBottom: 14,
  },
  infoCardTitle: {
    color: '#555577', fontSize: 11, fontWeight: '600',
    letterSpacing: 0.8, marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e3a',
    gap: 10,
  },
  infoIcon: { fontSize: 15, width: 22, textAlign: 'center' },
  infoKey: { color: '#8888aa', fontSize: 12, width: 80 },
  infoVal: { color: '#ffffff', fontSize: 13, fontWeight: '500', flex: 1 },
});

export default DashboardScreen;