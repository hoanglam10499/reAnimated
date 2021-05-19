import React from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { Keyboard, LayoutAnimation, View, UIManager } from "react-native";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const SHOW_LISTENER =
  Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";

const HIDE_LISTENER =
  Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";

export default ({
  disabled = false,
  onToggle = () => {},
  topSpacing = 0,
  style,
}) => {
  const [space, setSpace] = React.useState(0);

  React.useEffect(() => {
    const listeners = [
      Keyboard.addListener(SHOW_LISTENER, showSpace),
      Keyboard.addListener(HIDE_LISTENER, hideSpace),
    ];
    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, []);

  const showSpace = React.useCallback((e) => {
    if (!e.endCoordinates) return;

    let animationConfig = defaultAnimation;
    if (Platform.OS === "ios") {
      animationConfig = LayoutAnimation.create(
        e.duration,
        LayoutAnimation.Types[e.easing],
        LayoutAnimation.Properties.opacity
      );
    }
    LayoutAnimation.configureNext(animationConfig);
    const HEIGHT_WINDOW = Dimensions.get("window").height;
    const keyboardSpace = HEIGHT_WINDOW - e.endCoordinates.screenY + topSpacing;
    setSpace(keyboardSpace);

    onToggle(true, disabled ? 0 : keyboardSpace);
  }, []);

  const hideSpace = React.useCallback((e) => {
    let animationConfig = defaultAnimation;
    if (Platform.OS === "ios") {
      animationConfig = LayoutAnimation.create(
        e.duration,
        LayoutAnimation.Types[e.easing],
        LayoutAnimation.Properties.opacity
      );
    }
    LayoutAnimation.configureNext(animationConfig);

    setSpace(0);
    onToggle(false, 0);
  }, []);

  return (
    <View style={[styles.container, { height: disabled ? 0 : space }, style]} />
  );
};

const styles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const defaultAnimation = {
  duration: 500,
  create: {
    duration: 300,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 200,
  },
};
