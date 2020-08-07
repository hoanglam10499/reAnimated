import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

const {height, width} = Dimensions.get('window');

const index = () => {
  const pan = React.useRef(new Animated.ValueXY()).current;
  const scale = React.useRef(new Animated.Value(1)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({x: 0, y: 0});
        Animated.spring(scale, {
          toValue: 1.2,
          friction: 2,
          tension: 100,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.moveY - 30 < 0 || gesture.moveY + 60 > height) {
          pan.y.setValue(0);
        }
        pan.flattenOffset();
        if (gesture.moveX > width / 2) pan.x.setValue(0);
        else pan.x.setValue(-width + 60 + 60 / 1.25);
        Animated.spring(scale, {
          toValue: 1,
          friction: 2,
          tension: 100,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [...pan.getTranslateTransform(), {scale}],
        }}
        {...panResponder.panHandlers}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'rgba(0,0,0,.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 35}}>+</Text>
        </View>
      </Animated.View>
    </View>
  );
};
export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 25,
    right: 25,
  },
});
