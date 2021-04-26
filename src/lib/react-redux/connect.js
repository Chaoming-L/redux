import React from "react";
import PropTypes from "prop-types";

const connect = (mapStateToProps, mapDispatchToProps) => (WrapComponent) => {
  return class extends React.Component {
    static contextTypes = {
      store: PropTypes.shape({
        subscribe: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
        getState: PropTypes.func.isRequired,
      }).isRequired,
    };

    constructor(props, context) {
      super(props, context);
      this.store = context.store;

      this.state = mapStateToProps(this.store.getState());
      this.mapDispatchToProps = mapDispatchToProps(this.store.dispatch);
    }

    componentDidMount() {
      this.unsubscribe = this.store.subscribe(() => {
        this.setState(mapStateToProps(this.store.getState()));
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
