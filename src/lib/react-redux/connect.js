import React from "react";

const connect = (mapStateToProps, mapDispatchToProps) => (WrapComponent) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.store = context.store;

      this.state = mapStateToProps(this.store.getState());
      this.mapDispatchToProps = mapDispatchToProps(this.store.dispatch);
    }

    componentDidMount() {
      this.unsubscribe = this.store.subscribe(() => {
        // TODO 这里可以做浅比较再setState
        this.setState(mapDispatchToProps(this.store.getState()));
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return (
        <WrapComponent
          {...this.state}
          {...this.props}
          {...this.mapDispatchToProps}
        />
      );
    }
  };
};

export default connect;
