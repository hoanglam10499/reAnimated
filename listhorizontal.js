import React from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { interpolateColor } from "react-native-redash";
const FlastListAnim = Animated.createAnimatedComponent(FlatList);

const data = [
  { color: "black" },
  { color: "black" },
  { color: "black" },
  { color: "black" },
];
const { width } = Dimensions.get("window");
const pagingEnabled = true;
const isDisappearing = -width;
const isLeftRight = 0;
const isAppearing = width;

const index = () => {
  const x = new Animated.Value(0);
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x } } }]);
  return (
    <View style={styles.container}>
      <FlastListAnim
        {...{ onScroll }}
        data={data}
        horizontal
        bounces={false}
        pagingEnabled={pagingEnabled}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1}
        keyExtractor={(item, index) => "List-" + index}
        renderItem={({ item, index }) => {
          const position = Animated.sub(index * width, x);
          const scale = Animated.interpolate(position, {
            inputRange: [isDisappearing, isLeftRight, isAppearing],
            outputRange: [0.7, 1, 0.7],
          });
          return (
            <Animated.View
              style={{
                width,
                height: 200,
                backgroundColor: item.color,
                transform: [{ scale }],
                opacity: scale,
              }}
            />
          );
        }}
      />
      <FlastListAnim
        data={data}
        horizontal
        keyExtractor={(item, index) => "PageList-" + index}
        renderItem={({ item, index }) => {
          const widthA = Animated.interpolate(x, {
            inputRange: [
              width * (index - 1),
              width * index,
              width * (index + 1),
            ],
            outputRange: [10, 30, 10],
            extrapolate: "clamp",
          });
          const backgroundColor = interpolateColor(x, {
            inputRange: [
              width * (index - 1),
              width * index,
              width * (index + 1),
            ],
            outputRange: [
              "rgba(0,0,0,0.2)",
              "rgba(0,0,0,0.6)",
              "rgba(0,0,0,0.2)",
            ],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              style={{
                backgroundColor,
                width: widthA,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 2.5,
                marginTop: 10,
              }}
            />
          );
        }}
      />
    </View>
  );
};
export default index;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
