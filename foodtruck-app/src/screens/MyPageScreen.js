import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import StatusBarHeader from '../components/StatusBarHeader';

const MyPageScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  return (
    <ScrollView style={styles.container}>
      {/* 상단 네비게이션 바 */}
      <StatusBarHeader />
      {/* 프로필 영역 */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileEmoji}>👨‍🍳</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>김창업</Text>
          <Text style={styles.profileEmail}>foodtruck@example.com</Text>
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
              <Text style={styles.truckName}>맛있는 버거트럭</Text>
              <Text style={styles.truckSubInfo}>차량번호: 12가 3456</Text>
              <Text style={styles.truckSubInfo}>크기: 중형</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>푸드트럭 정보 수정</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 설정 항목 예시 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>설정</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>알림 받기</Text>
          <Text style={styles.settingValue}>
            {notificationsEnabled ? "켜짐" : "꺼짐"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>위치 공유</Text>
          <Text style={styles.settingValue}>
            {locationSharing ? "켜짐" : "꺼짐"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 기타 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>기타</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>도움말</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>문의하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingLabel}>버전 정보</Text>
          <Text style={styles.settingValue}>v1.0.0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, { marginTop: 16 }]}>
          <Text style={[styles.settingLabel, { color: "red" }]}>로그아웃</Text>
        </TouchableOpacity>
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
  profileEmoji: { fontSize: 28 },
  profileInfo: { flex: 1, marginLeft: 12 },
  profileName: { fontWeight: "700", fontSize: 16 },
  profileEmail: { color: "#666", fontSize: 12 },
  editProfileButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  editProfileText: { color: "white", fontSize: 12 },

  sectionContainer: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontWeight: "700", fontSize: 16, marginBottom: 8 },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  truckInfo: { flexDirection: "row", alignItems: "center" },
  truckImage: {
    width: 60,
    height: 60,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiLarge: { fontSize: 30 },
  truckDetails: {},
  truckName: { fontWeight: "700" },
  truckSubInfo: { fontSize: 12, color: "#666" },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF6B35",
    alignItems: "center",
  },
  secondaryButtonText: { color: "#FF6B35", fontSize: 14, fontWeight: "600" },

  settingItem: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: { fontSize: 14 },
  settingValue: { fontSize: 14, color: "#666" },
});