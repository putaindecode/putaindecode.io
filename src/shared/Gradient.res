@val external parseIntWithRadix: ('a, int) => int = "parseInt"

@module("md5") external md5: string => string = "default"

let fromString = string => {
  let value = string->md5->String.sliceToEnd(~start=-4)->parseIntWithRadix(16)
  let x1 = Int.fromFloat(value->Int.toFloat /. 183.0)->String.make
  let x2 = Int.fromFloat(value->Int.toFloat /. 220.0)->String.make
  `linear-gradient(to bottom right, hsl(${x1}, 100%, 35%), hsl(${x2}, 100%, 30%))`
}
