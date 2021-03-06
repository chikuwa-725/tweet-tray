/* eslint indent: 0 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import TwitterText from 'twitter-text';
import Styled from 'styled-components';

import * as constants from '../constants';

const StatusInputStyle = Styled.div`
  width: auto;
  user-select: auto;
  margin-top: 5px;
  margin-left: 66px;
  margin-bottom: ${constants.SPACING}px;
  background-color: transparent;

  & > textarea {
    line-height: 26px;
    outline: 0;
    border: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: auto;
    resize: none;
    overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
    font-size: ${constants.LARGE_FONT_SIZE}px;
    font-weight: normal;
    color:  ${(props) => {
      return props.theme === 'day' ? constants.BLACK : constants.WHITE;
    }};
    background-color: transparent;

    &::placeholder {
      color: ${constants.GREY};
    }
  }
`;

class StatusInput extends Component {
  static propTypes = {
    theme: PropTypes.string,
    placeholder: PropTypes.string,
    weightedStatusText: PropTypes.string,
    updateWeightedStatus: PropTypes.func.isRequired,
  }

  static defaultProps = {
    theme: 'day',
    placeholder: null,
    weightedStatusText: null,
  }

  constructor(props) {
    super(props);

    this.adjustTextarea = this.adjustTextarea.bind(this);
    this.focusTextArea = this.focusTextArea.bind(this);
    this.onTextAreaUpdate = this.onTextAreaUpdate.bind(this);
  }

  componentDidMount() {
    this.adjustTextarea({});
    this.focusTextArea({});
  }

  adjustTextarea({ target = this.el, }) {
    const textAreaRef = target;
    if (textAreaRef !== undefined && textAreaRef !== null) {
      textAreaRef.style.height = 0;
      textAreaRef.style.height = `${target.scrollHeight}px`;
    }
  }

  focusTextArea({ target = this.el, }) {
    const textAreaRef = target;

    if (textAreaRef !== undefined && textAreaRef !== null) {
      textAreaRef.focus();
    }
  }

  onTextAreaUpdate(e) {
    const { updateWeightedStatus, } = this.props;
    this.adjustTextarea(e);

    const textValue = e.target.value;
    const parsedProperties = TwitterText.parseTweet(textValue);

    const status = {
      text: textValue,
      weightedLength: parsedProperties.weightedLength,
      permillage: parsedProperties.permillage,
      valid: parsedProperties.valid,
      displayRangeStart: parsedProperties.displayRangeStart,
      displayRangeEnd: parsedProperties.displayRangeEnd,
      validDisplayRangeStart: parsedProperties.validDisplayRangeStart,
      validDisplayRangeEnd: parsedProperties.validDisplayRangeEnd,
    };

    updateWeightedStatus(status);
  }

  render() {
    const { placeholder, weightedStatusText, theme, } = this.props;
    return (
      <StatusInputStyle
        theme={theme}
      >
        <textarea
          ref={(x) => { this.el = x; }}
          className="textArea"
          autoCapitalize="sentences"
          placeholder={placeholder}
          rows={1}
          style={{
            minHeight: 58,
          }}
          onInput={this.onTextAreaUpdate}
          onKeyUp={this.onTextAreaUpdate}
          onChange={this.onTextAreaUpdate}
          value={weightedStatusText === null ? '' : weightedStatusText}
        />
      </StatusInputStyle>
    );
  }
}

export default StatusInput;

