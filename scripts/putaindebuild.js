import contributions from "./contributors"

contributions()
  .then(() => {
    require("./build")
  })
  .catch(err => {
    console.log(err)
  })
