import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://192.168.45.78:8080'; // ◀️ 본인 IP 주소로 수정!

const INITIAL_REGION = {
  latitude: 37.5665,
  longitude: 126.9780,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen = () => {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [userLocation, setUserLocation] = useState(null);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('위치 정보를 불러오는 중...');
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

        // 초기 로드 시 자동 구역 로드 비활성화
        console.log('📍 현재 위치 설정 완료 - 수동 새로고침으로 구역을 로드하세요');
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

  const fetchZonesInRegion = async (latitude, longitude, latitudeDelta, longitudeDelta) => {
    setStatusMessage('현재 지도 영역의 허가구역을 검색하는 중...');
    setLoading(true);
    setZones([]);

    try {
      // 지도 영역의 경계 계산
      const minLat = latitude - latitudeDelta;
      const maxLat = latitude + latitudeDelta;
      const minLon = longitude - longitudeDelta;
      const maxLon = longitude + longitudeDelta;
      
      const url = `${API_BASE_URL}/api/zones/region?minLat=${minLat}&maxLat=${maxLat}&minLon=${minLon}&maxLon=${maxLon}`;
      
      // ✅✅ 더 자세한 로그 추가 ✅✅
      console.log('🔍 [지도 영역 검색 시작]');
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
      
      // ✅✅ 백엔드로부터 받은 데이터를 터미널에 로그로 출력합니다. ✅✅
      console.log('====== 프론트엔드: 서버로부터 받은 데이터 ======');
      console.log(JSON.stringify(data, null, 2)); // JSON을 예쁘게 출력
      console.log(`==================== ${data.length}개 수신 ====================`);

      setZones(data);
      
      // 마커 데이터 로그 출력
      if (data.length > 0) {
        console.log('🗺️ 구역 데이터 확인:');
        data.forEach((zone, index) => {
          console.log(`📍 구역 ${index + 1}: ${zone.name} (${zone.latitude}, ${zone.longitude})`);
        });
      } else {
        console.log('⚠️ 구역 데이터가 없습니다.');
      }

    } catch (error) {
      console.error("❌ API fetch error:", error);
      console.error("❌ 에러 상세:", error.message);
      setErrorMsg('데이터를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 마커 클릭 핸들러
  const handleMarkerPress = (zone) => {
    setSelectedZone(zone);
    console.log(`🎯 마커 클릭: ${zone.name}`);
  };

  // 마커 정보 표시 핸들러
  const handleMarkerCalloutPress = (zone) => {
    Alert.alert(
      zone.name,
      `주소: ${zone.address}\n상세 정보를 확인하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => console.log(`상세 정보: ${zone.name}`) }
      ]
    );
  };

  // 지도 영역 변경 핸들러
  const handleRegionChange = (newRegion) => {
    setMapRegion(newRegion);
    console.log('🗺️ 지도 영역 변경:', newRegion);
  };

  // 지도 영역 변경 완료 핸들러 (자동 새로고침 비활성화)
  const handleRegionChangeComplete = (newRegion) => {
    // 자동 새로고침 비활성화 - 수동 새로고침만 사용
    console.log('🗺️ 지도 영역 변경 완료 (자동 새로고침 비활성화)');
  };
  
  if (errorMsg) {
    return <View style={styles.container}><Text>{errorMsg}</Text></View>;
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
        {/* 허가구역 원형 구역들 */}
        {zones.map((zone) => (
          <Circle
            key={zone.id.toString()}
            center={{ latitude: zone.latitude, longitude: zone.longitude }}
            radius={selectedZone?.id === zone.id ? 150 : 100} // 선택된 구역은 더 크게
            fillColor={selectedZone?.id === zone.id ? "rgba(255, 107, 53, 0.3)" : "rgba(255, 165, 0, 0.2)"}
            strokeColor={selectedZone?.id === zone.id ? "#FF6B35" : "#FFA500"}
            strokeWidth={selectedZone?.id === zone.id ? 3 : 2}
            onPress={() => handleMarkerPress(zone)}
          />
        ))}
        
        {/* 허가구역 중심점 (투명한 클릭 영역) */}
        {zones.map((zone) => (
          <Marker
            key={`marker-${zone.id.toString()}`}
            coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
            title={zone.name}
            description={zone.address}
            onPress={() => handleMarkerPress(zone)}
            onCalloutPress={() => handleMarkerCalloutPress(zone)}
            opacity={0} // 투명하게 만들어서 보이지 않게
          >
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{zone.name}</Text>
                <Text style={styles.calloutAddress}>{zone.address}</Text>
                <TouchableOpacity 
                  style={styles.calloutButton}
                  onPress={() => handleMarkerCalloutPress(zone)}
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
      
      {/* 구역 로드 버튼 */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={() => {
          if (mapRegion) {
            console.log('🔄 현재 지도 영역의 구역 로드 시작');
            setIsInitialLoad(false);
            fetchZonesInRegion(
              mapRegion.latitude,
              mapRegion.longitude,
              mapRegion.latitudeDelta,
              mapRegion.longitudeDelta
            );
          }
        }}
      >
        <Text style={styles.refreshButtonText}>🗺️ 구역 로드</Text>
      </TouchableOpacity>

      {/* 선택된 구역 정보 오버레이 */}
      {selectedZone && (
        <View style={styles.zoneInfoOverlay}>
          <View style={styles.zoneInfoContainer}>
            <Text style={styles.zoneInfoTitle}>{selectedZone.name}</Text>
            <Text style={styles.zoneInfoAddress}>{selectedZone.address}</Text>
            <TouchableOpacity 
              style={styles.zoneInfoButton}
              onPress={() => handleMarkerCalloutPress(selectedZone)}
            >
              <Text style={styles.zoneInfoButtonText}>상세보기</Text>
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
  calloutAddress: {
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
  zoneInfoOverlay: {
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
  zoneInfoContainer: {
    alignItems: 'center',
  },
  zoneInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  zoneInfoAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  zoneInfoButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  zoneInfoButtonText: {
    color: 'white',
    fontSize: 14,
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
});

export default MapScreen;