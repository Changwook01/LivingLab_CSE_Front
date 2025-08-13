import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import subscriptionService from "../services/subscriptionService"; // 경로에 맞게 조정

export default function SubscriptionScreen() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 8; // 추후 로그인 사용자 ID로 교체

  const fetchSubscribed = async () => {
    try {
      const data = await subscriptionService.getSubscribedFoodTrucks(userId);
      console.log('서버에서 가져온 구독 목록:', data);
      setSubscriptions(data.filter(item => item.active)); // 🔥 핵심 수정!
    } catch (err) {
      console.error(err);
      Alert.alert("에러", "구독 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };



  const handleUnsubscribe = async (foodTruckId) => {
    try {
      await subscriptionService.unsubscribe(userId, foodTruckId);
      setSubscriptions(data.filter(item => item.active));
    } catch (err) {
      console.error(err);
      Alert.alert("에러", "구독 취소에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchSubscribed();
  }, []);

  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>구독한 푸드트럭</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF9800" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 18 }}>
          {subscriptions.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 50, color: "#aaa" }}>
              구독한 푸드트럭이 없습니다.
            </Text>
          ) : (
            subscriptions.map((truck) => (
              <View style={styles.card} key={truck.foodTruckId}>
                <View style={styles.cardIcon}>
                  <Icon name="truck" size={26} color="#FF9800" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", color: "#222" }}>{truck.foodTruckName}</Text>
                  <Text style={{ color: "#666", marginTop: 2 }}>맛집 • ★4.2</Text>
                  <Text style={{ color: "#aaa", fontSize: 11 }}>서울 어딘가 • 운영시간 미정</Text>
                </View>
                <TouchableOpacity
                  style={styles.unsubscribeBtn}
                  onPress={() => handleUnsubscribe(truck.foodTruckId)}
                >
                  <Icon name="heart-broken" size={14} color="#fff" />
                  <Text style={{ color: "#fff", marginLeft: 6 }}>구독해지</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#fff6e2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  unsubscribeBtn: {
    backgroundColor: "#FF9800",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
  },
});