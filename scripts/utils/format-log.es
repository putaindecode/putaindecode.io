import color from "chalk"

export default (prefix, ...args) => {
  return [
    color.gray(`[${new Date().toLocaleTimeString()}]`),
    color.gray(`[${prefix}]`),
    ...args,
  ]
}
