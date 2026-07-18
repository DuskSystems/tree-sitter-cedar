(comment) @comment

(string) @string

(escape_sequence) @string.escape

(integer) @number

(decimal) @number

(true) @boolean

(false) @boolean

[
  "permit"
  "forbid"
  "when"
  "unless"
  "advice"
  "template"
] @keyword

[
  "if"
  "then"
  "else"
] @keyword.conditional

[
  "in"
  "has"
  "like"
  "is"
] @keyword.operator

[
  "principal"
  "action"
  "resource"
  "context"
] @variable

(slot
  "?" @punctuation.special
  (identifier) @variable.parameter)

[
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "=>"
  "&&"
  "||"
  "+"
  "-"
  "*"
  "/"
  "%"
  "!"
  "="
  "&"
  "|"
] @operator

[
  ","
  ";"
  "."
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
    (identifier) @module))

(extension_call
  (name
    (identifier) @function.builtin .))

(method_call
  (identifier) @function.builtin)

(field_access
  (identifier) @property)

(record_entry
  (identifier) @property)

(record_entry
  .
  (string) @property)

(attribute_declaration
  (identifier) @property)

(attribute_declaration
  (string) @property)

(attribute_declaration
  "?" @punctuation.special)

(ref_init
  (identifier) @property)

(ref_init
  "-" @number)

(index_access
  (string) @property)

(relation_expression
  "has"
  .
  (unary_expression
    (member_expression
      .
      (identifier) @property)))

(relation_expression
  "has"
  .
  (unary_expression
    (member_expression
      .
      (string) @property)))

(entity_reference
  (identifier) @module)

(entity_reference
  (identifier) @type
  .
  (string))

(entity_reference
  (identifier) @type
  .
  (entity_record))

(type_reference
  (name
    (identifier) @module))

(type_reference
  (name
    (identifier) @type .))

(scope_constraint
  "is"
  (name
    (identifier) @module))

(scope_constraint
  "is"
  (name
    (identifier) @type .))

(relation_expression
  "is"
  (name
    (identifier) @module))

(relation_expression
  "is"
  (name
    (identifier) @type .))

(relation_expression
  "like"
  (string) @string.regexp)

(type_reference
  [
    "<"
    ">"
  ] @punctuation.bracket)
