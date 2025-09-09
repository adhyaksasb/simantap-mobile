import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  View,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");
const boxSize = 250;

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused(); // 👈 detects if tab/screen is active

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={({ data }) => {
            try {
              const parsed = JSON.parse(data); // 👈 parse QR string to JSON

              router.push({
                pathname: "/(noTabs)/transaction",
                params: { item: JSON.stringify(parsed) },
              });
            } catch (e) {
              console.log("Invalid QR:", data);
            }
          }}
        />
      )}

      {/* Overlay mask */}
      <View style={styles.overlay}>
        <View
          style={{
            width,
            height: (height - boxSize) / 2,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        />
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: (width - boxSize) / 2,
              height: boxSize,
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          />
          <View style={styles.scanBox} />
          <View
            style={{
              width: (width - boxSize) / 2,
              height: boxSize,
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          />
        </View>
        <View
          style={{
            width,
            height: (height - boxSize) / 2,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
          }}
        >
          <Text style={styles.overlayText}>Align QR code within the box</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: { ...StyleSheet.absoluteFillObject },
  scanBox: {
    width: boxSize,
    height: boxSize,
    borderWidth: 4,
    borderColor: "#00FF00",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  overlayText: {
    marginTop: 20,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  absoluteCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
