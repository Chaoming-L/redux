import logo from "./logo.svg";
import "./App.css";
import { connect } from "./lib/react-redux";

function App({ info, count, add, minus, fetch }) {
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
        <br />
        <br />
        <br />
        <h2>
          <button onClick={fetch} className="btn">
            fetch
          </button>
          {info.loading ? (
            <img src={logo} className="loading" alt="logo" />
          ) : (
            <span className="name">{info.name}</span>
          )}
        </h2>
      </header>
    </div>
  );
}

const mapStateToProps = (state) => ({
  count: state.counter.count,
  info: state.info,
});

const mapDispatchToProps = (dispatch) => ({
  add: () => dispatch({ type: "ADD" }),
  minus: () => dispatch({ type: "MINUS" }),
  fetch: () => dispatch({ type: "FETCH" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
