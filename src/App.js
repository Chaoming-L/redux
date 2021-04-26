import logo from "./logo.svg";
import "./App.css";
import { connect } from "./lib/react-redux";

function App({ name, count, add, minus }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>count: {count}</h1>
        <div>
          <button onClick={add} className="add">
            +
          </button>
          <button onClick={minus} className="minus">
            -
          </button>
        </div>

        <h2>saga: {name}</h2>
      </header>
    </div>
  );
}

const mapStateToProps = (state) => ({
  count: state.counter.count,
  name: state.info.name
});

const mapDispatchToProps = (dispatch) => ({
  add: () => dispatch({ type: "ADD" }),
  minus: () => dispatch({ type: "MINUS" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
