import pkg from "./package.json"

// shell has some limitation :)
const __PROD__ = JSON.parse(Boolean(process.env.__PROD__))

const variables = {
  __VERSION__: process.env.__VERSION__ || pkg.version,
  __DEV__: !__PROD__,
  __PROD__,
  __SERVER_PROTOCOL__: "http://",
  ...(
    __PROD__ ?
    {
      __SERVER_HOSTNAME__: "putaindecode.fr",
      __SERVER_HOST__: "putaindecode.fr",
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }
    :
    {
      __SERVER_HOSTNAME__: "0.0.0.0",
      __SERVER_PORT__: 4242,
      __SERVER_HOST__: "0.0.0.0:4242",
      __LR_SERVER_PORT__: 4243,
    }
  ),
}

variables.__SERVER_URL__ =
  `${variables.__SERVER_PROTOCOL__}${variables.__SERVER_HOST__}`

export default variables

// define some global var like __DEV__
export function defineGlobalVariables() {
  Object.keys(variables).forEach((k) => global[k] = variables[k])
}
