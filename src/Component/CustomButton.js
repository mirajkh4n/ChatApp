import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const CustomButton = ({
  onPress,
  title,
  btnStyle,
  titleStyle,
  type,
  name,
  size,
  iconColor,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, btnStyle]}
      onPress={onPress}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    marginTop: 20,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
  },
});
