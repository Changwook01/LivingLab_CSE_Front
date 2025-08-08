import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert, // ✅ Alert를 사용하기 위해 추가
} from "react-native";
import { useAppStore } from "../stores/useAppStore";
import { useAuth } from "../context/AuthContext"; // ✅ 로그아웃 함수를 위해 추가

const MyPageScreen = () => {
  const { user, foodTruck } = useAppStore(); // Zustand에서 정보 가져오기
  const { logout } = useAuth(); // AuthContext에서 로그아웃 함수 가져오기

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  // 로그아웃 확인창을 띄우는 함수
  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "정말로 로그아웃 하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { 
          text: "로그아웃", 
          style: "destructive",
          onPress: () => logout() // ✅ 실제 로그아웃 함수 호출
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      {/* --- 프로필 섹션 (기존과 동일) --- */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileEmoji}>👨‍🍳</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || "이름 없음"}</Text>
          <Text style={styles.profileEmail}>{user?.email || "이메일 없음"}</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>수정</Text>
        </TouchableOpacity>
      </View>

      {/* --- 내 푸드트럭 섹션 (정보 표시 부분만 수정) --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>내 푸드트럭</Text>
        <View style={styles.card}>
          <View style={styles.truckInfo}>
            <View style={styles.truckImage}>
              <Text style={styles.emojiLarge}>🚚</Text>
            </View>
            <View style={styles.truckDetails}>
              {/* ❗ 수정: foodTruck.name을 사용 */}
              <Text style={styles.truckName}>{foodTruck?.name || "푸드트럭 이름 없음"}</Text>
              {/* ❗ 수정: foodTruck.description을 사용 */}
              <Text style={styles.truckSubInfo}>
                {foodTruck?.description || "설명이 없습니다."}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>푸드트럭 정보 수정</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 설정 섹션 (기존과 동일) --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>설정</Text>
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>알림</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#dddddd", true: "#FF6B35" }}
              thumbColor={"#ffffff"}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>위치 공유</Text>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: "#dddddd", true: "#FF6B35" }}
              thumbColor={"#ffffff"}
            />
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>영업 내역</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>결제 정보</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>위생/안전 서류</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 지원 섹션 (기존과 동일) --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>지원</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>고객센터</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>자주 묻는 질문</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>이용약관</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>개인정보 처리방침</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 로그아웃 버튼 (기능 연결) --- */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      {/* --- 버전 정보 (기존과 동일) --- */}
      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>앱 버전 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default MyPageScreen;

// (스타일 코드는 기존과 동일합니다)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#FF6B35",
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
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
  profileEmoji: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
  },
  editProfileButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
  },
  editProfileText: {
    fontSize: 12,
    color: "#666",
  },
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
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
    marginBottom: 12,
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
  truckDetails: {
      flex: 1,
  },
  truckName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  truckSubInfo: {
    fontSize: 12,
    color: "#666",
  },
  secondaryButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  secondaryButtonText: {
    fontSize: 12,
    color: "white",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: {
    fontSize: 16,
  },
  settingArrow: {
    fontSize: 20,
    color: "#888",
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff6b35",
  },
  logoutText: {
    color: "#ff6b35",
    fontWeight: "500",
  },
  versionInfo: {
    alignItems: "center",
    padding: 16,
    marginBottom: 24,
  },
  versionText: {
    color: "#888",
    fontSize: 12,
  },
});