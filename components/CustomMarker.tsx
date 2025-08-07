import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
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
  const cardHeight = useSharedValue(60); // Initial height for image only
  const cardWidth = useSharedValue(60);
  const textOpacity = useSharedValue(0);
  const borderRadius = useSharedValue(30);

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
      cardHeight.value = withSpring(100, { damping: 15, stiffness: 120 });
      cardWidth.value = withSpring(140, { damping: 15, stiffness: 120 });
      borderRadius.value = withSpring(12, { damping: 15, stiffness: 120 });
      textOpacity.value = withTiming(1, { duration: 400 });
      setIsExpanded(true);
    } else {
      // Collapse to image only
      textOpacity.value = withTiming(0, { duration: 200 });
      cardHeight.value = withSpring(60, { damping: 15, stiffness: 120 });
      cardWidth.value = withSpring(60, { damping: 15, stiffness: 120 });
      borderRadius.value = withSpring(30, { damping: 15, stiffness: 120 });
      setIsExpanded(false);
    }
  };

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(1.05, { damping: 10, stiffness: 300 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
      runOnJS(toggleExpansion)();
      if (onPress && id) {
        runOnJS(onPress)(id);
      }
    });

  return (
    <Animated.View style={[styles.markerContainer, animatedStyle]}>
      <GestureDetector gesture={tapGesture}>
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
      </GestureDetector>
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
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
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
  },
  textContainer: {
    alignItems: "center",
    paddingTop: 6,
    paddingHorizontal: 6,
    paddingBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    lineHeight: 14,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
    marginTop: -1,
  },
});
