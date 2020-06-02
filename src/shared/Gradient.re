[@bs.val] external parseIntWithRadix: ('a, int) => int = "parseInt";

let fromString = string => {
  let value =
    string
    ->Digest.string
    ->Digest.to_hex
    ->Js.String.sliceToEnd(~from=-4, _)
    ->parseIntWithRadix(16);
  let value = int_of_float(value->float_of_int /. 183.0);
  "linear-gradient(to bottom, hsl("
  ++ value->Js.String.make
  ++ ", 100%, 0%), hsl("
  ++ value->Js.String.make
  ++ ", 100%, 0%))";
};
