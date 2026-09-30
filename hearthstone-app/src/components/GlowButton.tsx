import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Svg, { Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const PAD = 5; // room around the button so the glow isn't clipped

type Props = Omit<PressableProps, "style"> & {
  radius?: number;
  style?: StyleProp<ViewStyle>; // outer box: size, background, border
  contentStyle?: StyleProp<ViewStyle>; // inner layout: padding, row/column
  children: React.ReactNode;
};

/**
 * On hover (web/desktop) or while pressed (phones) a white light runs around
 * the edge of the button, with a soft white glow behind it.
 */
export default function GlowButton({
  radius = 16,
  style,
  contentStyle,
  children,
  onHoverIn,
  onHoverOut,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(false);
  const flags = useRef({ hover: false, press: false }).current;
  const fade = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  const update = () => setActive(flags.hover || flags.press);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: active ? 1 : 0,
      duration: active ? 220 : 400,
      useNativeDriver: false,
    }).start();

    if (!active) return;
    sweep.setValue(0);
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [active, fade, sweep]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  const { w, h } = size;
  const r = Math.min(radius, w / 2, h / 2);
  const perimeter = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;
  const seg = perimeter * 0.3;
  const dash = `${seg} ${Math.max(perimeter - seg, 1)}`;
  const offset = sweep.interpolate({ inputRange: [0, 1], outputRange: [0, -perimeter] });
  const shadowOpacity = fade.interpolate({ inputRange: [0, 1], outputRange: [0, 0.7] });

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        { borderRadius: radius },
        style,
        {
          shadowColor: "#FFFFFF",
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 16,
          shadowOpacity,
        },
      ]}
    >
      <Pressable
        {...rest}
        onHoverIn={(e) => {
          flags.hover = true;
          update();
          onHoverIn?.(e);
        }}
        onHoverOut={(e) => {
          flags.hover = false;
          update();
          onHoverOut?.(e);
        }}
        onPressIn={(e) => {
          flags.press = true;
          update();
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          // let the light finish a moment on touch screens
          setTimeout(() => {
            flags.press = false;
            update();
          }, 500);
          onPressOut?.(e);
        }}
        style={[{ flexGrow: 1, borderRadius: radius }, contentStyle]}
      >
        {children}
      </Pressable>

      {w > 0 && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -PAD,
            left: -PAD,
            opacity: fade,
          }}
        >
          <Svg width={w + PAD * 2} height={h + PAD * 2}>
            {/* faint full outline */}
            <Rect
              x={PAD} y={PAD} width={w} height={h} rx={r}
              stroke="#fff" strokeOpacity={0.45} strokeWidth={1.5} fill="none"
            />
            {/* wide soft glow */}
            <AnimatedRect
              x={PAD} y={PAD} width={w} height={h} rx={r}
              stroke="#fff" strokeOpacity={0.3} strokeWidth={7} fill="none"
              strokeLinecap="round"
              strokeDasharray={dash} strokeDashoffset={offset}
            />
            {/* bright travelling edge */}
            <AnimatedRect
              x={PAD} y={PAD} width={w} height={h} rx={r}
              stroke="#fff" strokeWidth={2.5} fill="none"
              strokeLinecap="round"
              strokeDasharray={dash} strokeDashoffset={offset}
            />
          </Svg>
        </Animated.View>
      )}
    </Animated.View>
  );
}