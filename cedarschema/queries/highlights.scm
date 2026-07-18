(comment) @comment

(string) @string

(escape_sequence) @string.escape

[
  "namespace"
  "entity"
  "action"
  "type"
  "in"
  "appliesTo"
  "attributes"
  "tags"
  "enum"
] @keyword

(integer) @number

(decimal) @number

"-" @number

(true) @boolean

(false) @boolean

[
  "principal"
  "resource"
  "context"
] @variable

"=" @operator

"?" @punctuation.special

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
  "<"
  ">"
] @punctuation.bracket

(annotation
  "@" @punctuation.special
  (identifier) @attribute)

(entity_declaration
  (identifier_list
    (identifier) @type))

(action_declaration
  (action_name_list
    (identifier) @function))

(action_declaration
  (action_name_list
    (string) @function))

(common_type_declaration
  (identifier) @type.definition)

(attribute_declaration
  (identifier) @property)

(attribute_declaration
  (string) @property)

(attribute_entry
  (identifier) @property)

(attribute_entry
  .
  (string) @property)

(name
  (identifier) @module)

(name
  (identifier) @type .)

(qualified_name
  (identifier) @module)

(qualified_name
  (identifier) @type
  .
  (string))

(qualified_name
  (identifier) @function .)

(qualified_name
  .
  (string) @function)

(namespace
  (name
    (identifier) @module))
