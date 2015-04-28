export default () => {
  return (files, metadata, cb) => {
    Object.keys(files)
      .filter((file) => file.match(/^posts\/.*\.md$/))
      .forEach((file) => {
        if (files[file].template === undefined) {files[file].template = "Post"}
        if (files[file].collection === undefined) {files[file].collection = "posts"}
        if (files[file].comments === undefined) {files[file].comments = true}
      })
    cb()
  }
}
