import { Stack } from "expo-router";
import { Animated, PanResponder, StyleSheet, View } from "react-native";
import AnimatedCard from "./components/animatedCard";

// Sample data which needs to be updated from native side
// we need the number of parsed messages and their payload
import data from "../data/sample.json";
import { useState } from "react";

// Ratio to be used for scaling the cards on top of each other.
// When stacked on top of each other, the size of each card should decrease
// with next index and follow a geometric progression.
const SCALE_RATIO = 0.89;

export default function Index() {
  const cardsPan = new Animated.ValueXY();
  let replaceCardsState = false;
  const [cardsState, setCardsState] = useState(data);

  const cardReleaseHandler = () => {
    Animated.timing(cardsPan, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (replaceCardsState) {
        setCardsState((prev) => {
          return [...prev.slice(1), prev[0]];
        });
      }
    });
  };

  const cardsPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (event, gestureState) => {
      replaceCardsState = false;
      if (Math.abs(gestureState.dx) > 100) {
        replaceCardsState = true;
      }
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
        {Object.entries(cardsState).map(([k, v], index) => {
          return (
            <AnimatedCard
              key={index}
              color={v.color}
              zIndex={-index}
              scale={determineScalePos(index)}
              bottomPos={determineBottomPos(index)}
              opacity={determineOpacity(index)}
              translateX={determineTranslateX(index)}
              responseHandlers={
                index == 0 ? cardsPanResponder.panHandlers : undefined
              }
            />
          );
        })}
      </View>
    </>
  );

  function determineTranslateX(index: number): Animated.Value | undefined {
    return index == 0 ? cardsPan.x : undefined;
  }

  function determineOpacity(index: number): number {
    return 1.0 - index / 10;
  }

  function determineBottomPos(
    index: number
  ): number | `${number}%` | undefined {
    return index != 0 ? `${41 + 1.5 * index}%` : undefined;
  }

  function determineScalePos(index: number): number {
    return 1.0 * SCALE_RATIO ** index;
  }
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
