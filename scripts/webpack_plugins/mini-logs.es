import color from "chalk"
import logger from "../utils/logger"

const log = logger("webpack")

export default function miniLogs() {
  this.plugin("invalid", () => {
    log(color.yellow("✗ build is now INVALID"))
  })
  this.plugin("done", () => {
    log(color.green("✓ build is now VALID"))
  })
}
