import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function SubscriptionScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>구독한 푸드트럭</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        {/* 구독 푸드트럭 예시 */}
        <View style={styles.card}>
          <View style={styles.cardIcon}><Icon name="truck" size={26} color="#FF9800" /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", color: "#222" }}>타코야끼 천국</Text>
            <Text style={{ color: "#666", marginTop: 2 }}>일식 • ★4.2</Text>
            <Text style={{ color: "#aaa", fontSize: 11 }}>강남구 • 11:00-21:00</Text>
          </View>
          <TouchableOpacity style={styles.orderBtn}><Text style={{ color: "#fff" }}>주문</Text></TouchableOpacity>
        </View>
        {/* ...더 추가 가능 */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#212121" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 18, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  cardIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: "#fff6e2", alignItems: "center", justifyContent: "center", marginRight: 12 },
  orderBtn: { backgroundColor: "#FF9800", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginLeft: 12 }
});