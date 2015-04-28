import fs from "fs"
import path from "path"
import yaml from "js-yaml"

export default yaml.safeLoad(
  fs.readFileSync(path.join(__dirname, "index.yml"), "utf8")
)
