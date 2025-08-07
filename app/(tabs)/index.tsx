import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const isExpanded = useSharedValue(false);
  const [showImage, setShowImage] = useState(false);
  const height = useSharedValue(100);

  const handlePress = () => {
    const newExpandedState = !isExpanded.value;
    isExpanded.value = newExpandedState;

    // Delay hiding image to allow exit animation
    if (newExpandedState) {
      setShowImage(true);
    } else {
      setTimeout(() => setShowImage(false), 200);
    }
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(isExpanded.value ? 420 : 120, {
        damping: 18,
        stiffness: 120,
      }),
      backgroundColor: "#ffffff",
      transform: [
        {
          scale: withSpring(isExpanded.value ? 1.02 : 1, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isExpanded.value ? 1 : 0, {
        duration: isExpanded.value ? 500 : 200,
      }),
      height: withTiming(isExpanded.value ? 180 : 0, {
        duration: isExpanded.value ? 400 : 250,
      }),
      transform: [
        {
          scale: withSpring(isExpanded.value ? 1 : 0.9, {
            damping: 20,
            stiffness: 120,
          }),
        },
        {
          translateY: withSpring(isExpanded.value ? 0 : 15, {
            damping: 18,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(isExpanded.value ? -40 : 0, {
            damping: 20,
            stiffness: 120,
          }),
        },
      ],
      opacity: withTiming(isExpanded.value ? 0.95 : 1, {
        duration: isExpanded.value ? 300 : 200,
      }),
      marginBottom: withTiming(isExpanded.value ? 20 : 0, {
        duration: isExpanded.value ? 400 : 200,
      }),
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedPressable
        onPress={handlePress}
        style={[
          styles.box,
          animatedStyle,
          {
            height,
          },
        ]}
      >
        <View style={styles.contentContainer}>
          <Animated.Text
            style={[
              {
                fontSize: 22,
                fontWeight: "700",
                color: "#1a1a1a",
                textAlign: "center",
                letterSpacing: 0.5,
              },
              textAnimatedStyle,
            ]}
          >
            Memory from Brooklyn
          </Animated.Text>

          {showImage && (
            <Animated.Image
              source={{
                uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
              }}
              style={[styles.image, imageAnimatedStyle]}
              resizeMode='cover'
            />
          )}
        </View>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  box: {
    width: 320,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  image: {
    width: 270,
    height: 180,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
});
