import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface CustomMarkerProps {
  title?: string;
  description?: string;
  imageSource?: any;
  id: string; // Optional ID for the marker
  onPress?: (markerId: string) => void;
}

export default function CustomMarker({
  title = "Custom Location",
  description = "Marker description",
  imageSource,
  id,
  onPress,
}: CustomMarkerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const cardHeight = useSharedValue(64); // Initial height for image only
  const cardWidth = useSharedValue(64);
  const textOpacity = useSharedValue(0);
  const borderRadius = useSharedValue(32);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: cardHeight.value,
      width: cardWidth.value,
      borderRadius: borderRadius.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  React.useEffect(() => {
    // Animate the marker on mount with a small delay to ensure proper positioning
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });
    }, 100);
  }, []);

  const toggleExpansion = () => {
    if (!isExpanded) {
      // Expand to card - expand upward to maintain bottom anchor
      cardHeight.value = withSpring(110, { damping: 20, stiffness: 150 });
      cardWidth.value = withSpring(150, { damping: 20, stiffness: 150 });
      borderRadius.value = withSpring(15, { damping: 20, stiffness: 150 });
      textOpacity.value = withTiming(1, { duration: 500 });
      setIsExpanded(true);
    } else {
      // Collapse to image only
      textOpacity.value = withTiming(0, { duration: 250 });
      cardHeight.value = withSpring(64, { damping: 20, stiffness: 150 });
      cardWidth.value = withSpring(64, { damping: 20, stiffness: 150 });
      borderRadius.value = withSpring(32, { damping: 20, stiffness: 150 });
      setIsExpanded(false);
    }
  };

  const handlePress = () => {
    toggleExpansion();
    if (onPress && id) {
      onPress(id);
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View style={[styles.markerContainer, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          <View style={styles.imageContainer}>
            <Image
              source={imageSource || require("../assets/images/react-logo.png")}
              style={styles.markerImage}
              resizeMode='contain'
            />
          </View>
          {isExpanded && (
            <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </Pressable>
      {isExpanded && <View style={styles.pointer} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderColor: "#ffffff",
  },
  textContainer: {
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 6,
    maxWidth: 120,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 3,
  },
  description: {
    fontSize: 11,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 15,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
    marginTop: -2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
});
