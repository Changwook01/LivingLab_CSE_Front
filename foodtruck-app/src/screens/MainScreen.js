import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, SafeAreaView, Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const truckList = [
  { name: "타코야끼 천국", top: "33%", left: "25%", color: "#FF9800", status: "영업중", category: "일식", rating: 4.2, reviews: 127 },
  { name: "붕어빵 마을", top: "50%", left: "60%", color: "#E53935", status: "영업종료", category: "한식", rating: 4.5, reviews: 81 },
  { name: "커피 트럭", top: "67%", left: "67%", color: "#8B4513", status: "영업중", category: "음료", rating: 4.7, reviews: 57 },
  { name: "햄버거 킹덤", top: "25%", left: "80%", color: "#43A047", status: "영업중", category: "양식", rating: 4.1, reviews: 95 },
];

const categoryList = ["전체", "한식", "양식", "일식", "중식", "디저트", "음료"];

export default function MainScreen() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleShowTruck = (truck) => setSelectedTruck(truck);
  const handleHideTruck = () => setSelectedTruck(null);
  const handleSubscribe = () => setIsSubscribed(!isSubscribed);

  const callTruck = () => Alert.alert("전화 연결", "010-1234-5678");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚚 푸드트럭 파인더</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="search" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="bell" size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      {/* 검색/필터 */}
      <View style={styles.searchBox}>
        <View style={styles.inputContainer}>
          <Icon name="search" size={14} color="#aaa" style={{ marginLeft: 9, marginRight: 4 }} />
          <Text style={styles.inputFake}>푸드트럭 또는 음식 검색...</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Icon name="filter" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* 카테고리 필터 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
        {categoryList.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.categoryBtn, c === activeCategory && styles.categoryActive]}
            onPress={() => setActiveCategory(c)}
          >
            <Text style={{
              color: c === activeCategory ? "#fff" : "#666",
              fontWeight: "bold"
            }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* 지도영역 */}
      <View style={styles.mapContainer}>
        {/* 가상 도로 */}
        <View style={[styles.road, { top: "25%" }]} />
        <View style={[styles.road, { top: "50%" }]} />
        <View style={[styles.road, { top: "75%" }]} />
        <View style={[styles.roadV, { left: "25%" }]} />
        <View style={[styles.roadV, { left: "50%" }]} />
        <View style={[styles.roadV, { left: "75%" }]} />
        {/* 마커들 */}
        {truckList
          .filter((t) => activeCategory === "전체" || t.category === activeCategory)
          .map((truck) => (
            <TouchableOpacity
              key={truck.name}
              style={[
                styles.truckMarker,
                { top: truck.top, left: truck.left }
              ]}
              onPress={() => handleShowTruck(truck)}
            >
              <View style={[styles.truckIcon, { backgroundColor: truck.color }]}>
                <Icon name="truck" size={22} color="#fff" />
              </View>
              <Text style={styles.truckLabel}>{truck.name}</Text>
            </TouchableOpacity>
          ))}
        {/* 내 위치 버튼 */}
        <TouchableOpacity style={styles.locationBtn}>
          <Icon name="location-arrow" size={22} color="#2196f3" />
        </TouchableOpacity>
      </View>
      {/* 바텀시트 (모달) */}
      <Modal visible={!!selectedTruck} transparent animationType="slide">
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheet}>
            {/* 드래그 핸들 */}
            <View style={styles.dragHandle} />
            <ScrollView>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
                <View style={styles.detailTruckIcon}>
                  <Icon name="truck" size={28} color="#FF9800" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#222" }}>
                      {selectedTruck?.name}
                    </Text>
                    <View style={styles.verifiedBadge}>
                      <Icon name="check-circle" size={14} color="#fff" />
                      <Text style={{ fontSize: 12, color: "#fff", marginLeft: 4 }}>위생인증</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 13, color: "#666", marginTop: 3 }}>
                    ★ {selectedTruck?.rating} ({selectedTruck?.reviews}) · {selectedTruck?.category}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 4 }}>
                    <Text style={selectedTruck?.status === "영업중" ? styles.openBadge : styles.closedBadge}>
                      {selectedTruck?.status}
                    </Text>
                    <Text style={{ color: "#888", fontSize: 12, marginLeft: 8 }}>11:00 - 21:00</Text>
                  </View>
                </View>
              </View>
              {/* 구독/전화 */}
              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <TouchableOpacity
                  style={[styles.subscribeBtn, isSubscribed && styles.subscribeActive]}
                  onPress={handleSubscribe}
                >
                  <Icon name="heart" size={18} color="#fff" />
                  <Text style={{ color: "#fff", marginLeft: 8 }}>
                    {isSubscribed ? "구독중" : "구독하기"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.callBtn} onPress={callTruck}>
                  <Icon name="phone" size={16} color="#444" />
                  <Text style={{ marginLeft: 8, color: "#444" }}>전화하기</Text>
                </TouchableOpacity>
              </View>
              {/* 메뉴 예시 */}
              <Text style={styles.menuTitle}>메뉴</Text>
              <View style={styles.menuBox}>
                <Text style={styles.menuName}>타코야끼 (6개)</Text>
                <Text style={styles.menuDesc}>부드러운 문어가 들어간 타코야끼</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <Text style={styles.menuPrice}>5,000원</Text>
                  <TouchableOpacity style={styles.menuOrderBtn}>
                    <Text style={{ color: "#fff" }}>주문</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* 리뷰 예시 */}
              <Text style={styles.menuTitle}>리뷰</Text>
              <View style={styles.reviewBox}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.reviewAvatar}><Text style={{ color: "#fff" }}>김</Text></View>
                  <Text style={styles.reviewUser}>김**</Text>
                  <Text style={styles.reviewStar}>★★★★★</Text>
                  <Text style={styles.reviewDate}>2024.01.15</Text>
                </View>
                <Text style={styles.reviewText}>정말 맛있어요! 문어가 신선하고 소스도 완벽합니다.</Text>
              </View>
              {/* 닫기 */}
              <TouchableOpacity style={styles.closeBtn} onPress={handleHideTruck}>
                <Text style={{ color: "#444" }}>닫기</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// 스타일 정의(생략, 위 예시 코드 styles 참조)
const styles = StyleSheet.create({
    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      padding: 16, backgroundColor: '#fff', elevation: 1
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121' },
    headerIcon: { padding: 8, marginLeft: 6, backgroundColor: '#f6f6f6', borderRadius: 999 },
  
    searchBox: {
      flexDirection: 'row', alignItems: 'center', padding: 12,
      backgroundColor: '#fff', borderBottomColor: '#eee', borderBottomWidth: 1
    },
    inputContainer: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      backgroundColor: '#f5f5f5', borderRadius: 8, paddingVertical: 6
    },
    inputFake: { color: '#aaa', fontSize: 14, paddingLeft: 2 },
    filterBtn: { marginLeft: 8, backgroundColor: '#FF9800', padding: 10, borderRadius: 8 },
  
    categoryBtn: {
      paddingHorizontal: 17, paddingVertical: 7, backgroundColor: '#eee',
      borderRadius: 20, marginHorizontal: 4, marginVertical: 6
    },
    categoryActive: { backgroundColor: '#FF9800' },
  
    mapContainer: {
      flex: 1, backgroundColor: '#e3f2fd', borderRadius: 12,
      margin: 12, position: 'relative', overflow: 'hidden', minHeight: 280
    },
    road: {
      position: 'absolute', left: 0, right: 0, height: 3,
      backgroundColor: '#bbb', opacity: 0.25
    },
    roadV: {
      position: 'absolute', top: 0, bottom: 0, width: 3,
      backgroundColor: '#bbb', opacity: 0.25
    },
    truckMarker: {
      position: 'absolute', alignItems: 'center',
      transform: [{ translateX: -25 }, { translateY: -18 }], zIndex: 10
    },
    truckIcon: {
      backgroundColor: '#FF9800', padding: 10, borderRadius: 999, elevation: 2
    },
    truckLabel: {
      backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4,
      borderRadius: 6, fontSize: 12, marginTop: 3, color: '#222', fontWeight: '500', elevation: 1
    },
    locationBtn: {
      position: 'absolute', bottom: 24, right: 16, backgroundColor: '#fff',
      padding: 15, borderRadius: 999, elevation: 5
    },
  
    // 바텀시트(트럭상세) 예시
    bottomSheetOverlay: {
      flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.25)'
    },
    bottomSheet: {
      backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
      padding: 20, minHeight: 420, elevation: 15
    },
    dragHandle: {
      width: 40, height: 5, backgroundColor: '#ccc',
      borderRadius: 5, alignSelf: 'center', marginBottom: 12
    },
    detailTruckIcon: {
      width: 60, height: 60, borderRadius: 18, backgroundColor: '#fff5e1',
      alignItems: 'center', justifyContent: 'center', marginRight: 6
    },
    verifiedBadge: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50',
      borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, marginLeft: 8
    },
    openBadge: {
      backgroundColor: '#e0f8e6', color: '#388e3c', fontSize: 12,
      paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8
    },
    closedBadge: {
      backgroundColor: '#eee', color: '#888', fontSize: 12,
      paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8
    },
    subscribeBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', backgroundColor: '#FF9800',
      paddingVertical: 13, borderRadius: 14, marginRight: 8
    },
    subscribeActive: {
      backgroundColor: '#4CAF50'
    },
    callBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center',
      justifyContent: 'center', backgroundColor: '#eee',
      paddingVertical: 13, borderRadius: 14
    },
    menuTitle: { fontSize: 17, fontWeight: 'bold', color: '#222', marginBottom: 7, marginTop: 18 },
    menuBox: {
      backgroundColor: '#fff4e1', borderRadius: 12, padding: 12, marginBottom: 12
    },
    menuName: { fontWeight: 'bold', fontSize: 15, color: '#333' },
    menuDesc: { fontSize: 12, color: '#555', marginTop: 2 },
    menuPrice: { fontSize: 15, color: '#FF9800', fontWeight: 'bold', marginRight: 10 },
    menuOrderBtn: { backgroundColor: '#FF9800', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 12, marginLeft: 10 },
  
    reviewBox: { backgroundColor: '#f7f7f7', borderRadius: 10, padding: 10, marginVertical: 7 },
    reviewAvatar: { width: 28, height: 28, borderRadius: 16, backgroundColor: '#2196f3', alignItems: 'center', justifyContent: 'center', marginRight: 7 },
    reviewUser: { fontWeight: 'bold', marginRight: 6, fontSize: 13 },
    reviewStar: { color: '#FFD600', fontSize: 13, marginRight: 7 },
    reviewDate: { fontSize: 12, color: '#999' },
    reviewText: { marginTop: 4, color: '#333', fontSize: 13 },
    closeBtn: { marginTop: 12, backgroundColor: '#f2f2f2', borderRadius: 8, alignItems: 'center', padding: 13 },
  
    // 하단 탭바
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      backgroundColor: '#fff',
    },
    tabItem: { alignItems: 'center' },
    tabLabel: { fontSize: 12, color: '#999', marginTop: 4 },
    tabLabelActive: { color: '#FF6B35', fontWeight: 'bold' },
  });