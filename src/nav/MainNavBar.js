/* @flow */
import React, { PureComponent } from 'react';
import { View } from 'react-native';

import type { Actions, Narrow } from '../types';
import connectWithActions from '../connectWithActions';
import Title from '../title/Title';
import NavButton from './NavButton';
import InfoNavButton from '../title/InfoNavButton';
import {
  getSession,
  getCanGoBack,
  getUnreadPmsTotal,
  getUnreadHuddlesTotal,
  getUnreadMentionsTotal,
  getTitleBackgroundColor,
  getTitleTextColor,
} from '../selectors';

type Props = {
  actions: Actions,
  backgroundColor: string,
  canGoBack: boolean,
  narrow: Narrow,
  textColor: string,
};

class MainNavBar extends PureComponent<Props> {
  static contextTypes = {
    styles: () => null,
  };

  props: Props;

  render() {
    const { styles } = this.context;
    const { actions, backgroundColor, canGoBack, narrow, textColor } = this.props;

    return (
      <View style={[styles.navBar, { backgroundColor }]}>
        {canGoBack && (
          <NavButton name="arrow-left" color={textColor} onPress={actions.navigateBack} />
        )}
        <Title color={textColor} narrow={narrow} />
        <InfoNavButton narrow={narrow} />
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  backgroundColor: getTitleBackgroundColor(props.narrow)(state),
  canGoBack: getCanGoBack(state),
  textColor: getTitleTextColor(props.narrow)(state),
  unreadHuddlesTotal: getUnreadHuddlesTotal(state),
  unreadMentionsTotal: getUnreadMentionsTotal(state),
  unreadPmsTotal: getUnreadPmsTotal(state),
  editMessage: getSession(state).editMessage,
}))(MainNavBar);
