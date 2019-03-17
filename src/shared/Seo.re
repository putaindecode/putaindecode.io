open Belt;

let set = (~title=?, ~description=?, ()) => {
  let document = DomRe.Document.unsafeAsHtmlDocument(DomRe.document);
  title
  ->Option.map(title => document->(DomRe.HtmlDocument.setTitle(title)))
  ->ignore;
  description
  ->Option.flatMap(description =>
      DomRe.Document.querySelector(
        "meta[name=\"description\"]",
        DomRe.document,
      )
      ->Option.map(meta =>
          DomRe.Element.setAttribute("content", description, meta)
        )
    )
  ->ignore;
};
