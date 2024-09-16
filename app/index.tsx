import { Stack } from "expo-router";
import {
  Animated,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import AnimatedCard from "./components/animatedCard";

const colors = ["#5C6BC0", "#009688", "#F44336"];

export default function Index() {
  const cardsPan = new Animated.ValueXY();

  const cardReleaseHandler = () => {
    Animated.timing(cardsPan, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const cardsPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (event, gestureState) => {
      cardsPan.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: () => {
      cardReleaseHandler();
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: "Index" }} />
      <View style={styles.container}>
        <AnimatedCard
          color={colors[2]}
          zIndex={1}
          scale={0.8}
          bottomPos={"49%"}
          opacity={0.3}
        />
        <AnimatedCard
          color={colors[1]}
          zIndex={2}
          scale={0.9}
          bottomPos={"45%"}
          opacity={0.6}
        />
        <AnimatedCard
          responseHandlers={{ ...cardsPanResponder.panHandlers }}
          color={colors[0]}
          translateX={cardsPan.x}
          zIndex={3}
          scale={1.0}
          opacity={1.0}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardRow: {
    width: "80%",
    height: 200,
    borderRadius: 10,
    position: "absolute",
  },
});
