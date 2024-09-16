import { Animated, GestureResponderHandlers, StyleSheet } from "react-native";

interface CardProps {
  responseHandlers?: GestureResponderHandlers;
  color: string;
  zIndex: number;
  opacity: number;
  scale: number;
  bottomPos?: number | `${number}%`;
  translateX?: Animated.Value;
}

export default function AnimatedCard(props: CardProps) {
  return (
    <Animated.View
      {...props.responseHandlers}
      style={[
        styles.cardRow,
        {
          zIndex: props.zIndex,
          backgroundColor: props.color,
          bottom: props.bottomPos,
          opacity: props.opacity,
          transform: [
            { scale: props.scale },
            { translateX: props.translateX || 1.0 },
          ],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cardRow: {
    width: "80%",
    height: 200,
    borderRadius: 10,
    position: "absolute",
  },
});
