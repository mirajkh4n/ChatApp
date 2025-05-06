import React, {useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../Utils/Icons';

const CustomInput = ({
  title,
  leftIcon,
  rightIcon,
  iconSize = 20,
  iconColor,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType,
  height = 45,
  isDropdown = false,
  isDatePicker = false,
  isTimePicker = false,
  dropdownOptions = [],
  onSelectOption,
  containerStyle,
  inputStyle,
  iconStyle,
  isDropdownClassic = false,
  ...restProps
}) => {
  const [selectedValue, setSelectedValue] = useState(value || '');

  const [isPasswordVisible, setPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, {height}]}>
        {leftIcon && (
          <Icon
            type={leftIcon.type}
            name={leftIcon.name}
            size={iconSize}
            color={iconColor}
            style={[styles.icon, iconStyle]}
          />
        )}

        <TextInput
          style={[styles.input, inputStyle]}
          
          placeholder={placeholder}
          placeholderTextColor={'black'}
          value={selectedValue} 
          onChangeText={text => {
            setSelectedValue(text);
            if (onChangeText) onChangeText(text); 
          }}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          editable={!isDropdown && !isDatePicker && !isDropdownClassic}
          multiline={false}
          {...restProps}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setPasswordVisible(!isPasswordVisible)}>
            <Icon
              type="entypo"
              name={isPasswordVisible ? 'eye' : 'eye-with-line'}
              size={iconSize}
              color={iconColor}
              style={[styles.icon, iconStyle]}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth:0.5,
    marginTop:10
  },
 
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft: 10,
    textAlignVertical: 'center',
    color: '#000',
    paddingHorizontal:10
  },
  icon: {
    margin: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default CustomInput;
