import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";

export default function StatusBarHeader() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusBar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF6B35", // ✅ SafeAreaView도 색상 동일하게 설정
  },
  statusBar: {
    paddingTop: 56,                // ✅ iOS 상태바 높이
    paddingBottom: 16,           // ✅ 상태바 아래 여백
    backgroundColor: "#FF6B35", // ✅ 상단바 색상
  },
});
