import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import MapView, { Marker } from "react-native-maps";
import CustomMarker from "../../components/CustomMarker";

export default function TabTwoScreen() {
  const mapRef = useRef<MapView>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // Sample marker data - you can expand this with real data
  const markers = [
    {
      id: "marker-1",
      coordinate: { latitude: 43.041611, longitude: -76.134768 },
      title: "Downtown Syracuse",
      description: "Beautiful downtown area with great restaurants and shops",
      imageSource: { uri: "https://picsum.photos/seed/downtown/60/60" },
    },
    {
      id: "marker-2",
      coordinate: { latitude: 43.048611, longitude: -76.140768 },
      title: "Syracuse University",
      description: "Historic university campus with stunning architecture",
      imageSource: { uri: "https://picsum.photos/seed/university/60/60" },
    },
    {
      id: "marker-3",
      coordinate: { latitude: 43.038611, longitude: -76.128768 },
      title: "Onondaga Lake Park",
      description: "Scenic park perfect for outdoor activities and relaxation",
      imageSource: { uri: "https://picsum.photos/seed/park/60/60" },
    },
  ];

  const handleMarkerPress = (
    markerId: string,
    coordinate: { latitude: number; longitude: number }
  ) => {
    // Calculate offset to center the marker nicely on screen
    const offsetLatitude = 0.005;

    mapRef.current?.animateToRegion(
      {
        latitude: coordinate.latitude + offsetLatitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      },
      1000
    );

    setSelectedMarkerId(markerId);
  };

  const handleMapPress = () => {
    setSelectedMarkerId(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType='standard'
        onPress={handleMapPress}
        initialRegion={{
          latitude: 43.041611,
          longitude: -76.134768,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker.id, marker.coordinate)}
          >
            <CustomMarker
              title={marker.title}
              imageSource={marker.imageSource}
              id={marker.id}
              onPress={(markerId) => {
                console.log("Custom marker pressed:", markerId);
                handleMarkerPress(markerId, marker.coordinate);
              }}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
