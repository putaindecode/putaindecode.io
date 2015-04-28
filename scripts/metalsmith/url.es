export default (options) => {
  return files => {
    Object.keys(files).forEach(filename => {
      if (!files[filename].url) {
        let url = filename
        options.forEach(replacement => {
          url = url.replace(replacement[0], replacement[1])
        })
        files[filename].url = url
      }
    })
  }
}
