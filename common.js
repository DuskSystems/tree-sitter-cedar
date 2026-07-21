/// <reference path="./dsl.d.ts" />
// @ts-check

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}

const common = {
  name: $ => prec.right(seq(
    $.identifier,
    repeat(seq('::', $.identifier)),
  )),

  true: _ => 'true',
  false: _ => 'false',

  integer: _ => token(/[0-9]+/),
  decimal: _ => token(/[0-9]+\.[0-9]+/),

  _number: $ => choice(
    $.integer,
    $.decimal,
    seq('-', choice($.integer, $.decimal)),
  ),

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

  string_content: _ => token.immediate(/[^"\\]+/),

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

  annotation: $ => seq(
    '@',
    optional($._name_identifier),
    optional(seq('(', optional($.string), optional(')'))),
  ),

  _name_identifier: $ => choice(
    $.identifier,
    $._keyword_identifier,
  ),

  identifier: _ => token(/[_a-zA-Z][_a-zA-Z0-9]*/),
  comment: _ => token(seq('//', /.*/)),
};

const keywords = {
  namespace: $ => seq(
    repeat($.annotation),
    'namespace',
    optional($._any_name),
    optional(prec.right(seq('{', repeat(choice($.namespace, $._namespace_member)), optional('}')))),
  ),

  _any_name: $ => choice(
    $.name,
    alias($._keyword_name, $.name),
  ),

  _keyword_name: $ => prec.right(seq(
    $._keyword_identifier,
    repeat(seq('::', $.identifier)),
  )),
};

const literals = {
  _literal: $ => choice(
    $.true,
    $.false,
    $._number,
    $.string,
  ),
};

const types = {
  type_reference: $ => choice(
    prec.right(seq($.name, optional(seq('<', commaSep($.type_reference), optional('>'))))),
    $.record_type,
  ),

  record_type: $ => seq(
    '{',
    commaSep($.attribute_declaration),
    optional(','),
    optional('}'),
  ),

  attribute_declaration: $ => seq(
    repeat($.annotation),
    choice($._name_identifier, $.string),
    optional('?'),
    ':',
    optional($._any_type_reference),
  ),
};

export { commaSep, commaSep1, common, keywords, literals, types };
