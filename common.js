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

  identifier: _ => token(/[_a-zA-Z][_a-zA-Z0-9]*/),
  comment: _ => token(seq('//', /.*/)),
};

const annotation = $ => seq(
  '@',
  $.identifier,
  optional(seq('(', $.string, ')')),
);

export { commaSep, commaSep1, common, annotation };
