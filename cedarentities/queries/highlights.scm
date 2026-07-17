(comment) @comment

(string) @string

(escape_sequence) @string.escape

(integer) @number

(true) @boolean

(false) @boolean

[
  "namespace"
  "instance"
  "in"
  "tags"
] @keyword

"=" @operator

[
  ","
  ";"
  ":"
  "::"
] @punctuation.delimiter

[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

(extension_call
  (name
    (identifier) @function))

(record_entry
  (identifier) @property)

(entity_reference
  (identifier) @type)

(namespace
  (name
    (identifier) @module))
