export default function compose(...func) {
  if (func.length === 1) {
    return func[0];
  }
  return func.reduce((a, b) => (...args) => a(b(...args)));
}
