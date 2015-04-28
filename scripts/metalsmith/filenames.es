export default files => {
  Object.keys(files).forEach(filename => {
    if (!files[filename]._filename) {
      files[filename]._filename = filename
    }
  })
}
