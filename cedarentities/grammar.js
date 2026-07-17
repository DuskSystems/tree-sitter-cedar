/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}

module.exports = grammar({
  name: 'cedarentities',

  word: $ => $.identifier,
  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    entities: $ => repeat(
      choice(
        $.namespace,
        $.instance,
      ),
    ),

    namespace: $ => seq(
      'namespace',
      $.name,
      '{',
      repeat($.instance),
      '}',
    ),

    instance: $ => seq(
      'instance',
      $.entity_reference,
      optional($.instance_parents),
      optional(seq(optional('='), $.record)),
      optional($.instance_tags),
      ';',
    ),

    instance_parents: $ => seq(
      'in',
      choice($.entity_reference, $.entity_list),
    ),

    instance_tags: $ => seq(
      'tags',
      $.record,
    ),

    entity_list: $ => seq(
      '[',
      commaSep($.entity_reference),
      optional(','),
      ']',
    ),

    entity_reference: $ => seq(
      $.identifier,
      repeat(seq('::', $.identifier)),
      '::',
      $.string,
    ),

    record: $ => seq(
      '{',
      commaSep($.record_entry),
      optional(','),
      '}',
    ),

    record_entry: $ => seq(
      choice($.identifier, $.string),
      ':',
      $._value,
    ),

    _value: $ => choice(
      $.true,
      $.false,
      $.integer,
      $.string,
      $.entity_reference,
      $.extension_call,
      $.set,
      $.record,
    ),

    set: $ => seq(
      '[',
      commaSep($._value),
      optional(','),
      ']',
    ),

    extension_call: $ => seq(
      $.name,
      '(',
      commaSep($._value),
      ')',
    ),

    name: $ => prec.right(seq(
      $.identifier,
      repeat(seq('::', $.identifier)),
    )),

    true: _ => 'true',
    false: _ => 'false',
    integer: _ => token(/[0-9]+/),

    string_content: _ => token.immediate(/[^"\\]+/),
    string: $ => seq(
      '"',
      repeat(
        choice(
          $.string_content,
          $.escape_sequence,
        ),
      ),
      optional(token.immediate('"')),
    ),

    escape_sequence: _ => token.immediate(
      seq(
        '\\',
        choice(
          /[^xu]/,
          /x[0-9a-fA-F]{2}/,
          /u\{[0-9a-fA-F]+\}/,
        ),
      ),
    ),

    identifier: _ => token(/[_a-zA-Z][_a-zA-Z0-9]*/),
    comment: _ => token(seq('//', /.*/)),
  },
});
