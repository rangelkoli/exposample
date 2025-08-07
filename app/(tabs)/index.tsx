import CustomMarker from "@/components/CustomMarker";
import SampleCard from "@/components/SampleCard";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <SampleCard
        title='Memory from Brooklyn'
        imageUri='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
      />
      <CustomMarker
        title='asd'
        imageSource={
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
        }
        id='1'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
});
