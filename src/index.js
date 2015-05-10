import "./modules/polyfills"

import readingTime from "./modules/reading-time"

if (console && console.info) {
  console.info("Putain de console !")
}

readingTime.create()
