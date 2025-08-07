import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../stores/useAppStore';

// 값이 없거나 비어있을 때 대체 텍스트를 보여주는 도우미 함수
const getDisplayText = (value, fallback = '정보 없음') =>
  value && String(value).trim() ? value : fallback;

// ❗ 추가: 영업 상태를 한글로 변환하는 함수
const getStatusText = (status) => {
  switch (status) {
    case 'OPERATING':
      return '영업중';
    case 'CLOSED':
      return '영업종료';
    case 'PREPARING':
      return '준비중';
    default:
      return '정보 없음';
  }
};

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
        <View style={styles.truckInfoContent}>
          <Text style={styles.truckName}>{getDisplayText(foodTruck?.name, '이름 없음')}</Text>
          {/* ❗ 수정: description 필드를 사용 */}
          <Text style={styles.truckDetail}>
            {getDisplayText(foodTruck?.description, '설명 없음')}
          </Text>
          {/* ❗ 수정: status 필드를 사용하고, 한글로 변환 */}
          <Text style={[styles.truckStatus, foodTruck?.status === 'OPERATING' && styles.statusOperating]}>
            상태: {getStatusText(foodTruck?.status)}
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
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  cardEdit: { fontSize: 14, color: '#3b82f6', fontWeight: '600' },
  truckInfoRow: { flexDirection: 'row', alignItems: 'center' },
  truckImage: {
    width: 70,
    height: 70,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  truckInfoContent: {
    flex: 1,
  },
  truckName: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  truckDetail: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  truckStatus: { fontSize: 13, color: '#6b7280' },
  statusOperating: {
    color: '#16a34a', // 영업중일 때 초록색
    fontWeight: 'bold',
  },
  truckTags: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  badge: {
    backgroundColor: '#eef2ff',
    color: '#4f46e5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
});