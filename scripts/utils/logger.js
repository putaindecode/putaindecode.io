import formatLog from "./format-log"

export default (prefix) => {
  return (...args) => console.log(...formatLog(prefix, ...args))
}
