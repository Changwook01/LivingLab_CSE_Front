import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { useAppStore } from "../stores/useAppStore";
import { useAuth } from "../context/AuthContext";

export default function UserMyPage() {
  const { user } = useAppStore();
  const { logout } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말로 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", style: "destructive", onPress: () => logout() },
    ]);
  };

  const onPressStub = (label) => () => {
    Alert.alert(label, "곧 연결될 예정입니다.");
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      {/* 프로필 */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileEmoji}>👤</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || "이름 없음"}</Text>
          <Text style={styles.profileEmail}>{user?.email || "이메일 없음"}</Text>
        </View>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={onPressStub("프로필 수정")}
        >
          <Text style={styles.editProfileText}>수정</Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 섹션 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>메뉴</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={onPressStub("주문내역")}
          >
            <Text style={styles.settingLabel}>주문내역</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={onPressStub("내 리뷰")}
          >
            <Text style={styles.settingLabel}>내 리뷰</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={onPressStub("포인트 & 쿠폰")}
          >
            <Text style={styles.settingLabel}>포인트 & 쿠폰</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          {/* 알림 설정 */}
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>알림설정</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#dddddd", true: "#FF6B35" }}
              thumbColor={"#ffffff"}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={onPressStub("고객지원")}
          >
            <Text style={styles.settingLabel}>고객지원</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          {/* 로그아웃 */}
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <Text style={[styles.settingLabel, { color: "#ff4d4f" }]}>로그아웃</Text>
            <Text style={[styles.settingArrow, { color: "#ff4d4f" }]}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 버전 정보 */}
      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>앱 버전 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },

  header: {
    backgroundColor: "#FF6B35",
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFEDD5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileEmoji: { fontSize: 30 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  profileEmail: { fontSize: 14, color: "#888" },
  editProfileButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
  },
  editProfileText: { fontSize: 12, color: "#666" },

  sectionContainer: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: { fontSize: 16 },
  settingArrow: { fontSize: 20, color: "#888" },

  versionInfo: { alignItems: "center", padding: 16, marginBottom: 24 },
  versionText: { color: "#888", fontSize: 12 },
});