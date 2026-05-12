import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const OXFORD_BLUE = "#002147";
const PURPLE = "#5e17eb";
const WHITE = "#FFFFFF";

export default function CameraScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [isCapturing, setIsCapturing] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const cameraStatus = await requestPermission();
            const locationStatus = await Location.requestForegroundPermissionsAsync();
            if (!cameraStatus.granted || !locationStatus.granted) {
                Alert.alert("Permisos necesarios", "La app necesita acceso a cámara y ubicación.");
            }
        })();
    }, []);

    const takePicture = async () => {
        if (!cameraRef.current || isCapturing) return;
        
        try {
            setIsCapturing(true);
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

            navigation.navigate("Home", {
                newLog: {
                    url: photo.uri,
                    coords: location.coords,
                    date: new Date().toLocaleString()
                }
            });
        } catch (e) {
            console.error("Error en captura:", e);
            Alert.alert("Error", "No se pudo capturar la imagen.");
        } finally {
            setIsCapturing(false);
        }
    };

    if (!permission?.granted) return <View style={styles.container}><Text>No hay permiso</Text></View>;

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} ref={cameraRef}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={30} color={WHITE} />
                </TouchableOpacity>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                        {isCapturing ? <ActivityIndicator color={WHITE} /> : <View style={styles.innerCircle} />}
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: OXFORD_BLUE },
    camera: { flex: 1, justifyContent: 'space-between', padding: 20 },
    backButton: { marginTop: 50, padding: 10 },
    footer: { alignItems: 'center', marginBottom: 40 },
    captureBtn: { width: 75, height: 75, borderRadius: 38, borderWidth: 4, borderColor: WHITE, justifyContent: 'center', alignItems: 'center' },
    innerCircle: { width: 55, height: 55, borderRadius: 28, backgroundColor: WHITE }
});