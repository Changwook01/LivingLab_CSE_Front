import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform, TouchableOpacity, Alert, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://192.168.45.152:8080';

const SearchTruck = () => {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [operatingTrucks, setOperatingTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('위치 정보를 불러오는 중...');
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isTruckListVisible, setIsTruckListVisible] = useState(true); // 목록 보임/숨김 상태
  const [showNoTruckMessage, setShowNoTruckMessage] = useState(true); // 트럭 없음 메시지 표시 상태

  useEffect(() => {
    (async () => {
      try {
        console.log('🔍 위치 권한 요청 시작...');
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('📱 위치 권한 상태:', status);
        
        if (status !== 'granted') {
          console.log('❌ 위치 권한 거부됨');
          setErrorMsg('위치 정보 접근 권한이 거부되었습니다.');
          setLoading(false);
          return;
        }

        console.log('📍 현재 위치 가져오기 시작...');
        setStatusMessage('현재 위치를 확인하는 중...');
        
        // 위치 서비스 활성화 확인
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        console.log('📍 위치 서비스 활성화 상태:', isLocationEnabled);
        
        if (!isLocationEnabled) {
          console.log('❌ 위치 서비스 비활성화됨');
          setErrorMsg('위치 서비스가 비활성화되어 있습니다. 설정에서 위치 서비스를 활성화해주세요.');
          setLoading(false);
          return;
        }
        
        // 위치 가져오기 옵션 설정
        const locationOptions = {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 10,
          maximumAge: 60000, // 1분 이내의 캐시된 위치 허용
        };
        
        // 타임아웃 설정 (30초)
        const locationPromise = Location.getCurrentPositionAsync(locationOptions);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('위치 정보 가져오기 시간 초과')), 30000)
        );
        
        let location = await Promise.race([locationPromise, timeoutPromise]);
        console.log('✅ 위치 정보 획득:', location.coords);
        
        const { latitude, longitude } = location.coords;
        
        const currentUserLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        };
        
        console.log('🗺️ 지도 영역 설정:', currentUserLocation);
        setRegion(currentUserLocation);
        setUserLocation({ latitude, longitude });
        setMapRegion(currentUserLocation);

        // 초기 로드 시 자동 트럭 검색 비활성화
        console.log('📍 현재 위치 설정 완료 - 새로고침 버튼으로 트럭을 찾으세요');
        setIsInitialLoad(false);
        setLoading(false);

      } catch (error) {
        console.error('❌ 위치 정보 가져오기 실패:', error);
        
        // 기본 위치로 폴백 (서울 시청)
        console.log('🔄 기본 위치(서울 시청)로 설정');
        const defaultLocation = {
          latitude: 37.5665,
          longitude: 126.9780,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        };
        
        setRegion(defaultLocation);
        setUserLocation({ latitude: defaultLocation.latitude, longitude: defaultLocation.longitude });
        setMapRegion(defaultLocation);
        setIsInitialLoad(false);
        setLoading(false);
        
        setErrorMsg(`위치 정보를 가져오는 데 실패했습니다. 기본 위치(서울 시청)로 설정됩니다. ${error.message}`);
      }
    })();
  }, []);

  const fetchOperatingTrucks = async (latitude, longitude, latitudeDelta, longitudeDelta) => {
    setStatusMessage('현재 지도 영역의 영업 중인 트럭을 검색하는 중...');
    setLoading(true);
    setOperatingTrucks([]);

    try {
      // 지도 영역의 경계 계산
      const minLat = latitude - latitudeDelta;
      const maxLat = latitude + latitudeDelta;
      const minLon = longitude - longitudeDelta;
      const maxLon = longitude + longitudeDelta;
      
      const url = `${API_BASE_URL}/api/food-trucks/operating?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLon}&maxLon=${maxLon}`;
      
      console.log('🔍 [영업 중인 트럭 검색 시작]');
      console.log(`📍 지도 중심: ${latitude}, ${longitude}`);
      console.log(`📐 영역 범위: ${latitudeDelta} x ${longitudeDelta}`);
      console.log(`🌐 요청 URL: ${url}`);
      console.log(`📱 플랫폼: ${Platform.OS}`);
      console.log(`🔗 API_BASE_URL: ${API_BASE_URL}`);
      
      const response = await fetch(url);
      
      console.log(`📡 응답 상태: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('====== 프론트엔드: 서버로부터 받은 트럭 데이터 ======');
      console.log(JSON.stringify(data, null, 2));
      console.log(`==================== ${data.length}개 수신 ====================`);

      // 상태 업데이트를 확실히 하기 위해 새로운 배열로 설정
      const trucksData = [...data];
      setOperatingTrucks(trucksData);
      
      // 새로운 데이터가 로드되면 메시지 표시 상태 초기화
      setShowNoTruckMessage(true);
      
      // 트럭 데이터 로그 출력
      if (data.length > 0) {
        console.log('🚚 영업 중인 트럭 데이터 확인:');
        data.forEach((truck, index) => {
          console.log(`🚚 트럭 ${index + 1}: ${truck.name} (${truck.latitude}, ${truck.longitude})`);
        });
        
        // 강제로 리렌더링을 위한 상태 업데이트
        setTimeout(() => {
          console.log('🔄 트럭 데이터 강제 업데이트');
          setOperatingTrucks([...trucksData]);
        }, 200);
      } else {
        console.log('⚠️ 영업 중인 트럭이 없습니다.');
        setOperatingTrucks([]);
      }

    } catch (error) {
      console.error("❌ API fetch error:", error);
      console.error("❌ 에러 상세:", error.message);
      setErrorMsg('트럭 정보를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 트럭 클릭 핸들러
  const handleTruckPress = (truck) => {
    setSelectedTruck(truck);
    console.log(`🎯 트럭 클릭: ${truck.name}`);
  };

  // 트럭 정보 표시 핸들러
  const handleTruckCalloutPress = (truck) => {
    Alert.alert(
      truck.name,
      `메뉴: ${truck.menu || '정보 없음'}\n상세 정보를 확인하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => console.log(`상세 정보: ${truck.name}`) }
      ]
    );
  };

  // 지도 영역 변경 핸들러
  const handleRegionChange = (newRegion) => {
    setMapRegion(newRegion);
    console.log('🗺️ 지도 영역 변경:', newRegion);
  };

  // 지도 영역 변경 완료 핸들러 (자동 트럭 검색 비활성화)
  const handleRegionChangeComplete = (newRegion) => {
    // 자동 트럭 검색 비활성화 - 수동 새로고침만 사용
    console.log('🗺️ 지도 영역 변경 완료 (자동 트럭 검색 비활성화)');
  };

  // 두 지점 간의 거리 계산 (미터 단위)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // 지구 반지름 (미터)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  if (errorMsg) {
    return <View style={styles.container}><Text>{errorMsg}</Text></View>;
  }

  // region이 설정되지 않았으면 로딩 화면 표시
  if (!region) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>위치 정보를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={handleRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {/* 영업 중인 트럭 마커들 */}
        {operatingTrucks && operatingTrucks.length > 0 && operatingTrucks.map((truck) => (
          <Marker
            key={`truck-${truck.id}`}
            coordinate={{ latitude: truck.latitude, longitude: truck.longitude }}
            title={truck.name}
            description={truck.menu || '메뉴 정보 없음'}
            onPress={() => handleTruckPress(truck)}
            onCalloutPress={() => handleTruckCalloutPress(truck)}
          >
            <View style={styles.truckMarker}>
              <Text style={styles.truckMarkerIcon}>🚚</Text>
            </View>
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{truck.name}</Text>
                <Text style={styles.calloutMenu}>{truck.menu || '메뉴 정보 없음'}</Text>
                <TouchableOpacity 
                  style={styles.calloutButton}
                  onPress={() => handleTruckCalloutPress(truck)}
                >
                  <Text style={styles.calloutButtonText}>상세보기</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
        
        {/* 현재 사용자 위치 마커 */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="현재 위치"
            description="내 위치"
            pinColor="blue"
          />
        )}
      </MapView>
      
      {/* 트럭 검색 버튼 */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={() => {
          if (mapRegion) {
            console.log('🔄 현재 지도 영역의 트럭 검색 시작');
            setIsInitialLoad(false);
            fetchOperatingTrucks(
              mapRegion.latitude,
              mapRegion.longitude,
              mapRegion.latitudeDelta,
              mapRegion.longitudeDelta
            );
          }
        }}
      >
        <Text style={styles.refreshButtonText}>🚚 트럭 검색</Text>
      </TouchableOpacity>

      {/* 트럭 목록 오버레이 */}
      {operatingTrucks && operatingTrucks.length > 0 && (
        <View style={[styles.truckListOverlay, !isTruckListVisible && styles.truckListOverlayHidden]}>
          <View style={styles.truckListHeader}>
            <Text style={styles.truckListTitle}>영업 중인 푸드트럭</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.truckListCount}>{operatingTrucks.length}개 트럭</Text>
              <TouchableOpacity
                style={styles.truckListToggleBtn}
                onPress={() => setIsTruckListVisible((v) => !v)}
                activeOpacity={0.7}
              >
                <Text style={styles.truckListToggleBtnText}>
                  {isTruckListVisible ? '▼' : '▲'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isTruckListVisible && (
            <ScrollView style={styles.truckListScroll} showsVerticalScrollIndicator={false}>
              {operatingTrucks.map((truck, index) => (
                <TouchableOpacity
                  key={`list-${truck.id}`}
                  style={[
                    styles.truckListItem,
                    selectedTruck?.id === truck.id && styles.truckListItemSelected
                  ]}
                  onPress={() => {
                    setSelectedTruck(truck);
                    console.log(`📋 목록에서 트럭 선택: ${truck.name}`);
                  }}
                >
                  <View style={styles.truckListItemContent}>
                    <Text style={styles.truckListItemName}>{truck.name}</Text>
                    <Text style={styles.truckListItemMenu}>{truck.menu || '메뉴 정보 없음'}</Text>
                    <View style={styles.truckListItemMeta}>
                      <Text style={styles.truckListItemDistance}>
                        📍 {calculateDistance(
                          userLocation?.latitude || 0,
                          userLocation?.longitude || 0,
                          truck.latitude,
                          truck.longitude
                        ).toFixed(0)}m
                      </Text>
                      <Text style={styles.truckListItemId}>ID: {truck.id}</Text>
                    </View>
                  </View>
                  <View style={styles.truckListItemArrow}>
                    <Text style={styles.truckListItemArrowText}>▶</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* 트럭이 없을 때 메시지 오버레이 */}
      {operatingTrucks && operatingTrucks.length === 0 && !loading && !isInitialLoad && showNoTruckMessage && (
        <View style={styles.noTruckOverlay}>
          {/* X 버튼 */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              console.log('❌ 트럭 없음 메시지 닫기');
              setShowNoTruckMessage(false);
            }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.noTruckContainer}>
            <Text style={styles.noTruckIcon}>🚚</Text>
            <Text style={styles.noTruckTitle}>이 지역에 영업중인 트럭이 없습니다</Text>
            <Text style={styles.noTruckSubtitle}>다른 지역을 확인해보세요</Text>
          </View>
        </View>
      )}

      {/* 선택된 트럭 정보 오버레이 */}
      {selectedTruck && (
        <View style={styles.truckInfoOverlay}>
          {/* X 버튼 */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              console.log('❌ 트럭 정보 닫기');
              setSelectedTruck(null);
            }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.truckInfoContainer}>
            <Text style={styles.truckInfoTitle}>{selectedTruck.name}</Text>
            <Text style={styles.truckInfoMenu}>{selectedTruck.menu || '메뉴 정보 없음'}</Text>
            <TouchableOpacity 
              style={styles.truckInfoButton}
              onPress={() => handleTruckCalloutPress(selectedTruck)}
            >
              <Text style={styles.truckInfoButtonText}>상세보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>{statusMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: '600', color: '#333' },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calloutMenu: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  calloutButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  calloutButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  refreshButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  truckListOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '50%',
    zIndex: 10,
  },
  truckListOverlayHidden: {
    maxHeight: 40,
    overflow: 'hidden',
  },
  truckListToggleBtn: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff3e0',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  truckListToggleBtnText: {
    fontSize: 22,
    color: '#FF6B35',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  truckListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  truckListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  truckListCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  truckListScroll: {
    maxHeight: 300,
  },
  truckListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  truckListItemSelected: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  truckListItemContent: {
    flex: 1,
  },
  truckListItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  truckListItemMenu: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  truckListItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  truckListItemDistance: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  truckListItemId: {
    fontSize: 12,
    color: '#999',
  },
  truckListItemArrow: {
    marginLeft: 10,
  },
  truckListItemArrowText: {
    fontSize: 16,
    color: '#ccc',
  },
  truckInfoOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  truckInfoContainer: {
    alignItems: 'center',
  },
  truckInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  truckInfoMenu: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  truckInfoButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  truckInfoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  truckMarker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  truckMarkerIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  noTruckOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noTruckContainer: {
    alignItems: 'center',
  },
  noTruckIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  noTruckTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  noTruckSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchTruck; 