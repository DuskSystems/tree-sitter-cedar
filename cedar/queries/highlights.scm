(comment) @comment

(string) @string

(escape_sequence) @string.escape

(integer) @number

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
  "?" @variable.parameter
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
    (identifier) @function))

(method_call
  (identifier) @function.method)

(field_access
  (identifier) @property)

(record_entry
  (identifier) @property)

(ref_init
  (identifier) @property)

(relation_expression
  "has"
  .
  (unary_expression
    (member_expression
      .
      (identifier) @property)))

(entity_reference
  (identifier) @type)

(type_reference
  (name
    (identifier) @type))

(scope_constraint
  "is"
  (name
    (identifier) @type))

(relation_expression
  "is"
  (name
    (identifier) @type))
