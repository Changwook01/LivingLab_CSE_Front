import React from "react";
import { View, Text, StyleSheet, SafeAreaView} from "react-native";
export default function StatusBarHeader() {
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.statusBar}>
      <Text style={styles.statusText}>9:41</Text>
      <Text style={styles.statusText}>📶 📶 🔋</Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    height: 44,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});