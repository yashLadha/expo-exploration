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

  function determineZIndexPos(index: number): number {
    return -index;
  }

  function determineTranslateX(
    translationValue: Animated.Value,
    index: number
  ): Animated.Value | undefined {
    return index == 0 ? translationValue : undefined;
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

  class CardState {
    private color: string;
    private trackingIndex: number;
    private currScaleRatio: number;
    private zIndexPos: number;
    private opacityVal: number;
    private bottomPosVal?: number | `${number}%`;

    public constructor(color: string, index: number) {
      this.color = color;
      this.trackingIndex = index - 1;
      this.currScaleRatio = determineScalePos(index);
      this.zIndexPos = determineZIndexPos(index);
      this.opacityVal = determineOpacity(index);
      this.bottomPosVal = determineBottomPos(index);
    }

    get colorInfo() {
      return this.color;
    }

    get scaleRatio() {
      return this.currScaleRatio;
    }

    get nextIndex() {
      return this.trackingIndex;
    }

    get zIndex() {
      return this.zIndexPos;
    }

    get opacity() {
      return this.opacityVal;
    }

    get bottomPos() {
      return this.bottomPosVal;
    }
  }

  export default function Index() {
    const cardsPan = new Animated.ValueXY();
    const stackAnim = new Animated.Value(0);
    const [cards, setCards] = useState({
      replaceCards: false,
      cardsData: data.map((obj, index) => {
        return new CardState(obj.color, index);
      }),
    });

    const cardReleaseHandler = () => {
      Animated.timing(cardsPan, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(stackAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        stackAnim.setValue(0);
        // if (cardsState.replaceCards) {
        setCards((prev) => {
          return {
            ...prev,
            replaceCards: true,
            cardsData: [...prev.cardsData.slice(1), prev.cardsData[0]],
          };
        });
        // }
      });
    };

    const cardsPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (Math.abs(gestureState.dx) > 100) {
          // setCards((prev) => ({
          //   ...prev,
          //   replaceCards: true,
          // }));
        }
        cardsPan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: () => {
        cardReleaseHandler();
      },
    });

    function getNextScaleRatio(card: CardState): number {
      return cards.cardsData[
        (cards.cardsData.length + card.nextIndex) % cards.cardsData.length
      ].scaleRatio;
    }

    return (
      <>
        <Stack.Screen options={{ title: "Index" }} />
        <View style={styles.container}>
          {Object.entries(cards.cardsData).map(([k, v], index) => {
            return (
              <AnimatedCard
                key={index}
                color={v.colorInfo}
                zIndex={v.zIndex}
                scale={{
                  animatValue: stackAnim,
                  config: {
                    inputRange: [0, 1],
                    outputRange: [v.scaleRatio, getNextScaleRatio(v)],
                  },
                }}
                bottomPos={v.bottomPos}
                opacity={v.opacity}
                translateX={determineTranslateX(cardsPan.x, index)}
                responseHandlers={
                  index == 0 ? cardsPanResponder.panHandlers : undefined
                }
              />
            );
          })}
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
