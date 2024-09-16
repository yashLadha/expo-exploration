import { Animated, GestureResponderHandlers, StyleSheet } from "react-native";

interface CardProps {
  responseHandlers?: GestureResponderHandlers;
  color: string;
  zIndex: number;
  opacity: {
    config: Animated.InterpolationConfigType;
    animateValue: Animated.Value;
  };
  scale: {
    config: Animated.InterpolationConfigType;
    animateValue: Animated.Value;
  };
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
          opacity: props.opacity.animateValue.interpolate(props.opacity.config),
          transform: [
            { scale: props.scale.animateValue.interpolate(props.scale.config) },
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
