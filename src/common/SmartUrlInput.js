/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import type { StyleObj } from '../types';
import { autoCompleteUrl, fixRealmUrl, hasProtocol } from '../utils/url';
import RawLabel from './RawLabel';

const componentStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    opacity: 0.8,
  },
});

type Props = {
  defaultValue: string,
  placeholder: string,
  protocol: string,
  append: string,
  shortAppend: string,
  style?: StyleObj,
  onChange: (value: string) => void,
  onSubmitEditing: () => Promise<void>,
};

type State = {
  value: string,
};

export default class SmartUrlInput extends PureComponent<Props, State> {
  textInputRef: any;
  props: Props;
  state: State = {
    value: '',
  };

  static contextTypes = {
    styles: () => null,
  };

  handleChange = (value: string) => {
    this.setState({ value });

    const { append, shortAppend, protocol, onChange } = this.props;
    onChange(fixRealmUrl(autoCompleteUrl(value, protocol, append, shortAppend)));
  };

  urlPress = () => {
    this.textInputRef.focus();
  };

  render() {
    const { styles } = this.context;
    const {
      placeholder,
      protocol,
      append,
      shortAppend,
      defaultValue,
      style,
      onSubmitEditing,
    } = this.props;
    const { value } = this.state;
    const placeholderTextColor = (StyleSheet.flatten(styles.realmInput) || {}).color;
    const useFullAppend = value.indexOf('.') === -1;
    const showAnyAppend = !value.match(/.+\..+\.+./g); // at least two dots

    return (
      <View style={[componentStyles.wrapper, style]}>
        {!hasProtocol(value) && (
          <TouchableWithoutFeedback onPress={this.urlPress}>
            <RawLabel style={styles.realmInput} text={protocol} />
          </TouchableWithoutFeedback>
        )}
        <TextInput
          style={styles.realmInput}
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          returnKeyType="go"
          defaultValue={defaultValue}
          onChangeText={this.handleChange}
          blurOnSubmit={false}
          keyboardType="url"
          underlineColorAndroid="transparent"
          onSubmitEditing={onSubmitEditing}
          ref={(component: any) => {
            this.textInputRef = component;
          }}
        />
        {showAnyAppend && (
          <TouchableWithoutFeedback onPress={this.urlPress}>
            <RawLabel style={styles.realmInput} text={useFullAppend ? append : shortAppend} />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}
