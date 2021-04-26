import React from "react";
export default class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
  }

  getChildContext() {
    return {
      store: this.store,
    };
  }

  render() {
    return this.props.children;
  }
}
