import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import StatusBarHeader from '../components/StatusBarHeader';
import LoginScreen from './LoginScreen';

// 🚀 시작 화면
const StartScreen = ({ onStart }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
    setShowLogin(true);
  };

  const handleLoginSuccess = (loginData, userType) => {
    setShowLogin(false);
    onStart(loginData, userType);
  };

  const handleBackToStart = () => {
    setShowLogin(false);
    setSelectedUserType(null);
  };

  if (showLogin) {
    return (
      <LoginScreen
        userType={selectedUserType}
        onLoginSuccess={handleLoginSuccess}
        onBack={handleBackToStart}
      />
    );
  }

  return (
    <View style={styles.startContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoEmoji}>🚚</Text>
        <Text style={styles.logoText}>푸드트럭 파인더</Text>
        <Text style={styles.logoSubtext}>맛있는 푸드트럭을 찾아보세요</Text>
      </View>

      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeTitle}>사용자 유형을 선택해주세요</Text>

        <TouchableOpacity
          style={styles.userTypeButton}
          onPress={() => handleUserTypeSelect('customer')}
        >
          <View style={styles.userTypeIconContainer}>
            <Text style={styles.userTypeIcon}>🍽️</Text>
          </View>
          <View style={styles.userTypeInfo}>
            <Text style={styles.userTypeName}>일반 사용자</Text>
            <Text style={styles.userTypeDescription}>
              푸드트럭을 찾고 주문하세요
            </Text>
          </View>
          <Text style={styles.userTypeArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userTypeButton}
          onPress={() => handleUserTypeSelect('partner')}
        >
          <View
            style={[
              styles.userTypeIconContainer,
              styles.partnerIconContainer,
            ]}
          >
            <Text style={styles.userTypeIcon}>👨‍🍳</Text>
          </View>
          <View style={styles.userTypeInfo}>
            <Text style={styles.userTypeName}>사업자</Text>
            <Text style={styles.userTypeDescription}>
              푸드트럭을 운영하고 관리하세요
            </Text>
          </View>
          <Text style={styles.userTypeArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          계정이 없으신가요? <Text style={styles.footerLink}>회원가입</Text>
        </Text>
      </View>
    </View>
  );
};

// 하단 탭 네비게이터
const Tab = createBottomTabNavigator();

const CustomerAppNavigator = ({ userData }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            홈: "home",
            검색: "magnify",
            주문내역: "clipboard-list",
            마이페이지: "account",
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4A6FFF",
        tabBarInactiveTintColor: "#888",
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="홈" 
        component={CustomerHomeScreen}
        initialParams={{ userData }}
      />
      <Tab.Screen name="검색" component={SearchScreen} />
      <Tab.Screen name="주문내역" component={OrderHistoryScreen} />
      <Tab.Screen name="마이페이지" component={CustomerMyPageScreen} />
    </Tab.Navigator>
  );
};

// 각 탭의 간단한 화면 정의
const CustomerHomeScreen = ({ route }) => {
  const userData = route?.params?.userData;
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBarHeader />
      <View style={styles.screenContainer}>
        <Text style={styles.screenTitle}>홈 화면</Text>
        <Text style={styles.welcomeText}>
          안녕하세요, {userData ? userData.name : '사용자'}님!
        </Text>
      </View>
    </View>
  );
};
const SearchScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>검색 화면</Text>
  </View>
);
const OrderHistoryScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>주문내역 화면</Text>
  </View>
);
const CustomerMyPageScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>마이페이지 화면</Text>
  </View>
);

// 스타일 정의
const styles = StyleSheet.create({
  startContainer: { flex: 1, padding: 20, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logoEmoji: { fontSize: 48 },
  logoText: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  logoSubtext: { fontSize: 14, color: "#666", marginTop: 4 },

  userTypeContainer: {},
  userTypeTitle: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  userTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  userTypeIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  partnerIconContainer: {
    backgroundColor: "#FFEDD5",
  },
  userTypeIcon: { fontSize: 20 },
  userTypeInfo: { flex: 1 },
  userTypeName: { fontWeight: "700", fontSize: 14 },
  userTypeDescription: { fontSize: 12, color: "#666" },
  userTypeArrow: { fontSize: 24, color: "#ccc" },

  footerContainer: { alignItems: "center", marginTop: 24 },
  footerText: { fontSize: 12, color: "#888" },
  footerLink: { fontWeight: "bold", color: "#4A6FFF" },

  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});

export { StartScreen, CustomerAppNavigator };