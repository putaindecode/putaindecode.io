type t = Dict.t<string>

module URLSearchParams = {
  type t
  @new external parse: string => t = "URLSearchParams"
  @new external make: unit => t = "URLSearchParams"
  @send external set: (t, string, string) => unit = "set"
  @send external toString: t => string = "toString"
}

let decode = queryString => {
  let urlSearchParams = URLSearchParams.parse(queryString)
  urlSearchParams->Array.from->Dict.fromArray
}

let encode = dict => {
  let urlSearchParams = URLSearchParams.make()
  dict
  ->Dict.toArray
  ->Array.forEach(((key, value)) => {
    urlSearchParams->URLSearchParams.set(key, value)
  })
  urlSearchParams->URLSearchParams.toString
}
