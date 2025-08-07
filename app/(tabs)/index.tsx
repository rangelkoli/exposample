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
      height: withSpring(isExpanded.value ? 400 : 100, {
        damping: 15,
        stiffness: 100,
      }),
      backgroundColor: "#fff",
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isExpanded.value ? 1 : 0, {
        duration: isExpanded.value ? 600 : 200,
      }),
      height: withTiming(isExpanded.value ? 200 : 0, {
        duration: isExpanded.value ? 300 : 300,
      }),
      transform: [
        {
          translateY: withSpring(isExpanded.value ? 0 : 20, {
            damping: 15,
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
          translateY: withSpring(isExpanded.value ? -60 : 0, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
      opacity: withTiming(isExpanded.value ? 1 : 0.9, {
        duration: isExpanded.value ? 300 : 400,
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
                fontSize: 18,
                fontWeight: "bold",
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
    paddingHorizontal: 16,
  },
  box: {
    width: 300,
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 8,
  },
});
