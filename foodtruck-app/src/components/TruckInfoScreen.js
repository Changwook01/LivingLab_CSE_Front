import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../stores/useAppStore';

const getDisplayText = (value, fallback = '정보 없음') =>
  value?.trim?.() ? value : fallback;

const TruckInfoScreen = () => {
  const foodTruck = useAppStore((state) => state.foodTruck);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>내 푸드트럭 정보</Text>
        <Text style={styles.cardEdit}>수정</Text>
      </View>

      <View style={styles.truckInfoRow}>
        <View style={styles.truckImage}>
          <Text style={{ fontSize: 28 }}>🚚</Text>
        </View>
        <View>
          <Text style={styles.truckName}>{getDisplayText(foodTruck?.name, '이름 없음')}</Text>
          <Text style={styles.truckDetail}>
            차량번호: {getDisplayText(foodTruck?.vehicleNumber)}
          </Text>
          <Text style={styles.truckDetail}>
            크기: {getDisplayText(foodTruck?.size)}
          </Text>
        </View>
      </View>

      <View style={styles.truckTags}>
        <Text style={styles.badge}>위생 인증 완료</Text>
        <Text style={[styles.badge, styles.badgeSuccess]}>영업 허가 완료</Text>
      </View>
    </View>
  );
};

export default TruckInfoScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  cardEdit: { fontSize: 14, color: '#3b82f6' },

  truckInfoRow: { flexDirection: 'row', marginBottom: 12 },
  truckImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  truckName: { fontWeight: '700' },
  truckDetail: { fontSize: 12, color: '#6b7280' },

  truckTags: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#e6f7ff',
    color: '#0088ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  badgeSuccess: {
    backgroundColor: '#e6fff0',
    color: '#00cc66',
  },
});
