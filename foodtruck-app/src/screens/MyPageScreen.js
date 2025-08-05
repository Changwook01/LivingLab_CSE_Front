import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import StatusBarHeader from "../components/StatusBarHeader";
import { useAppStore } from "../stores/useAppStore";

const MyPageScreen = () => {
  const { user, foodTruck } = useAppStore();

  return (
    <ScrollView style={styles.container}>
      <StatusBarHeader />

      {/* 프로필 영역 */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileEmoji}>👨‍🍳</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>수정</Text>
        </TouchableOpacity>
      </View>

      {/* 푸드트럭 정보 영역 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>내 푸드트럭</Text>
        <View style={styles.card}>
          <View style={styles.truckInfo}>
            <View style={styles.truckImage}>
              <Text style={styles.emojiLarge}>🚚</Text>
            </View>
            <View style={styles.truckDetails}>
              <Text style={styles.truckName}>{foodTruck?.name}</Text>
              <Text style={styles.truckSubInfo}>{foodTruck?.description}</Text>
              <Text style={styles.truckSubInfo}>상태: {foodTruck?.status}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImageContainer: {
    backgroundColor: "#eee",
    borderRadius: 40,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  profileEmoji: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontWeight: "700",
    fontSize: 16,
  },
  profileEmail: {
    color: "#666",
    fontSize: 12,
  },
  editProfileButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  editProfileText: {
    color: "white",
    fontSize: 12,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  truckInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  truckImage: {
    width: 60,
    height: 60,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiLarge: {
    fontSize: 30,
  },
  truckDetails: {},
  truckName: {
    fontWeight: "700",
  },
  truckSubInfo: {
    fontSize: 12,
    color: "#666",
  },
});
