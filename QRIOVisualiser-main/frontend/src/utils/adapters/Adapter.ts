export default interface Adapter<I, R> {
  adapt: (adaptee: I) => R;
}
