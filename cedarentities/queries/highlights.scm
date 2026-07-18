(comment) @comment

(string) @string

(escape_sequence) @string.escape

(integer) @number

(decimal) @number

"-" @number

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

(annotation
  "@" @punctuation.special
  (identifier) @attribute)

(extension_call
  (name
    (identifier) @function.builtin))

(record_entry
  (identifier) @property)

(entity_reference
  (identifier) @type)

(namespace
  (name
    (identifier) @module))
