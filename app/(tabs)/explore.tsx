import { useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import MapView, { Marker } from "react-native-maps";
import CustomMarker from "../../components/CustomMarker";

export default function TabTwoScreen() {
  const mapRef = useRef<MapView>(null);
  const [selectedMarker, setSelectedMarker] = useState<{
    latitude: number;
    longitude: number;
    title: string;
  } | null>(null);

  // Animated values for the callout
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  // Animated values for the marker
  const markerScale = useSharedValue(1);
  const markerImageScale = useSharedValue(1);

  const { height } = Dimensions.get("window");

  const animateCalloutIn = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
  };

  const animateCalloutOut = () => {
    scale.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(20, { duration: 200 });
  };

  const animateMarkerIn = () => {
    markerScale.value = withSpring(1.2, {
      damping: 12,
      stiffness: 200,
    });
    markerImageScale.value = withSpring(1.3, {
      damping: 12,
      stiffness: 200,
    });
  };

  const animateMarkerOut = () => {
    markerScale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
    markerImageScale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handleMarkerPress = (coordinate: {
    latitude: number;
    longitude: number;
    title: string;
  }) => {
    // Calculate the offset to position marker at bottom third of screen
    const offsetLatitude = (0.01 * 2) / 4; // Adjust this value to fine-tune positioning

    mapRef.current?.animateToRegion(
      {
        latitude: coordinate.latitude + offsetLatitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );

    setSelectedMarker(coordinate);

    // Animate the marker first
    animateMarkerIn();

    // Animate the callout in after a short delay
    setTimeout(() => {
      animateCalloutIn();
    }, 300); // Reduced delay to let marker animation complete first
  };

  const handleMapPress = () => {
    animateCalloutOut();
    animateMarkerOut();
    setTimeout(() => {
      setSelectedMarker(null);
    }, 200); // Wait for animation to complete
  };

  // Animated styles
  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value * 0.5 }],
    };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value * 1.1 }],
    };
  });

  // Animated styles for the marker
  const animatedMarkerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: markerScale.value }],
    };
  });

  const animatedMarkerImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: markerImageScale.value }],
    };
  });

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
      >
        <Marker
          coordinate={{ latitude: 43.041611, longitude: -76.134768 }}
          title='Marker Title'
          onPress={() =>
            handleMarkerPress({
              latitude: 43.041611,
              longitude: -76.134768,
              title: "Marker Title",
            })
          }
          opacity={1}
          calloutAnchor={{ x: 0, y: -10 }}
          calloutOffset={{ x: 0, y: 10 }}
        >
          <CustomMarker
            title='Custom Location'
            description='This is a custom marker with animations'
            imageSource={{ uri: "https://picsum.photos/60/60" }}
            id='marker-1'
            onPress={(markerId) => {
              console.log("Custom marker pressed:", markerId);
              handleMarkerPress({
                latitude: 43.041611,
                longitude: -76.134768,
                title: "Custom Location",
              });
            }}
          />
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  card: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  calloutContainer: {
    width: 280,
    minHeight: 200,
  },
  calloutCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  calloutImage: {
    width: "100%",
    height: 150,
  },
  calloutContent: {
    padding: 16,
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  calloutDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
