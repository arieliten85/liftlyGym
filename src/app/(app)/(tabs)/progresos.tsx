import { StyleSheet, Text, View } from "react-native";

export default function ProgresosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Progresos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
