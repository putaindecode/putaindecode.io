export default (options) => {
  return files => {
    Object.keys(files).forEach(filename => {
      let newName = filename
      options.forEach(replacement => {
        newName = newName.replace(replacement[0], replacement[1])
      })
      if (newName !== filename) {
        files[newName] = files[filename]
        delete files[filename]
      }
    })
  }
}
