import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface CustomMarkerProps {
  title?: string;
  imageSource?: string | any; // Can be a URL string or local image require()
  id: string; // Optional ID for the marker
  onPress?: (markerId: string) => void;
}

export default function CustomMarker({
  title = "Custom Location",
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
  const imageWidth = useSharedValue(50);
  const imageHeight = useSharedValue(50);
  const imageBorderRadius = useSharedValue(22);
  const textTranslateY = useSharedValue(20);

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
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: imageWidth.value,
      height: imageHeight.value,
      borderRadius: imageBorderRadius.value,
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
      cardHeight.value = withSpring(180, { damping: 20, stiffness: 150 });
      cardWidth.value = withSpring(350, { damping: 20, stiffness: 150 });
      borderRadius.value = withSpring(15, { damping: 20, stiffness: 150 });
      imageWidth.value = withSpring(330, { damping: 20, stiffness: 150 });
      imageHeight.value = withSpring(140, { damping: 20, stiffness: 150 });
      imageBorderRadius.value = withSpring(10, { damping: 20, stiffness: 150 });
      textOpacity.value = withTiming(1, { duration: 600 });
      textTranslateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      setIsExpanded(true);
    } else {
      // Collapse to image only
      textOpacity.value = withTiming(0, { duration: 300 });
      textTranslateY.value = withSpring(20, { damping: 20, stiffness: 200 });
      cardHeight.value = withSpring(64, { damping: 20, stiffness: 150 });
      cardWidth.value = withSpring(64, { damping: 20, stiffness: 150 });
      borderRadius.value = withSpring(32, { damping: 20, stiffness: 150 });
      imageWidth.value = withSpring(50, { damping: 20, stiffness: 150 });
      imageHeight.value = withSpring(50, { damping: 20, stiffness: 150 });
      imageBorderRadius.value = withSpring(22, { damping: 20, stiffness: 150 });
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
          {isExpanded && (
            <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            </Animated.View>
          )}
          <View style={styles.imageContainer}>
            <Animated.Image
              source={
                imageSource
                  ? typeof imageSource === "string"
                    ? { uri: imageSource }
                    : imageSource
                  : require("../assets/images/react-logo.png")
              }
              style={[styles.markerImage, imageAnimatedStyle]}
              resizeMode='cover'
            />
          </View>
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
    borderColor: "#ffffff",
  },
  textContainer: {
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 6,
    maxWidth: 380,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
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
