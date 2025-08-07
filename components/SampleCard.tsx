import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SampleCardProps {
  title: string;
  imageUri?: string;
}

export default function SampleCard({ title, imageUri }: SampleCardProps) {
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
      height: withSpring(isExpanded.value ? 320 : 100, {
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
      height: withTiming(isExpanded.value ? 150 : 0, {
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
          translateY: withSpring(isExpanded.value ? -30 : 0, {
            damping: 20,
            stiffness: 120,
          }),
        },
      ],
      opacity: withTiming(isExpanded.value ? 0.95 : 1, {
        duration: isExpanded.value ? 300 : 200,
      }),
      marginBottom: withTiming(isExpanded.value ? 8 : 0, {
        duration: isExpanded.value ? 400 : 200,
      }),
    };
  });

  return (
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
        <Animated.Text style={[styles.title, textAnimatedStyle]}>
          {title}
        </Animated.Text>

        {showImage && (
          <Animated.Image
            source={{ uri: imageUri }}
            style={[styles.image, imageAnimatedStyle]}
            resizeMode='cover'
          />
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
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
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  image: {
    width: 270,
    height: 150,
    borderRadius: 16,
    marginTop: 0,
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
