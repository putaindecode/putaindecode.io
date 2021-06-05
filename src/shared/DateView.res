let padLeft = string => ("0" ++ string)->String.sliceToEnd(~start=-2)

@react.component
let make = (~date, ()) => {
  open Date
  let date = fromString(date)
  React.string(
    Date.getUTCFullYear(date)->Int.toString ++
    "/" ++
    (Date.getUTCMonth(date) + 1)->Int.toString->padLeft ++
    "/" ++
    Date.getUTCDate(date)->Int.toString->padLeft,
  )
}
