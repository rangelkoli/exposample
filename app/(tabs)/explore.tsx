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
      imageSource: { uri: "https://picsum.photos/seed/downtown/60/60" },
    },
  ];

  const handleMarkerPress = (
    markerId: string,
    coordinate: { latitude: number; longitude: number }
  ) => {
    mapRef.current?.animateToRegion(
      {
        latitude: coordinate.latitude,
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
    mapRef.current?.animateToRegion(
      {
        latitude: 43.041611,
        longitude: -76.134768,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      1000
    );
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
