/// <reference path="../dsl.d.ts" />
// @ts-check

import { commaSep, commaSep1, common, literals, types } from '../common.js';

export default grammar({
  name: 'cedar',

  word: $ => $.identifier,
  extras: $ => [
    /\s/,
    $.comment,
  ],
  conflicts: $ => [
    [$.annotation],
    [$.record_type],
  ],

  rules: {
    policy_set: $ => repeat($.policy),
    policy: $ => seq(
      repeat($.annotation),
      optional(seq($.template_declaration, repeat($.annotation))),
      $.effect,
      optional(seq('(', optional($.scope), optional(')'))),
      repeat(choice($.condition, $.advice)),
      optional(';'),
    ),

    template_declaration: $ => seq('template', optional(seq('(', commaSep($.slot), optional(')'))), optional('=>')),

    effect: _ => choice('permit', 'forbid'),

    scope: $ => seq(
      commaSep1(choice($.principal, $.action, $.resource)),
      optional(','),
    ),

    principal: $ => seq('principal', optional($._type_annotation), optional($.scope_constraint)),
    action: $ => seq('action', optional($._type_annotation), optional($.scope_constraint)),
    resource: $ => seq('resource', optional($._type_annotation), optional($.scope_constraint)),

    _type_annotation: $ => prec.right(seq(':', optional($.type_reference))),

    scope_constraint: $ => prec.right(choice(
      seq('==', optional(choice($.entity_reference, $.slot))),
      seq('in', optional(choice($.entity_reference, $.entity_list, $.slot))),
      seq('is', optional($.name), optional(seq('in', optional(choice($.entity_reference, $.slot))))),
    )),

    condition: $ => prec.right(seq(
      choice('when', 'unless'),
      optional(seq('{', optional($._expression), optional('}'))),
    )),

    advice: $ => prec.right(seq(
      'advice',
      optional(seq('{', optional($._expression), optional('}'))),
    )),

    _expression: $ => choice(
      $.if_expression,
      $.binary_expression,
      $.is_expression,
      $.like_expression,
      $.has_expression,
      $.unary_expression,
      $.member_expression,
      $._primary,
    ),

    if_expression: $ => prec.right(0,
      seq(
        'if',
        optional($._expression),
        optional(seq('then', optional($._expression))),
        optional(seq('else', optional($._expression))),
      ),
    ),

    binary_expression: $ => choice(
      prec.left(1, seq($._expression, choice('||', '|'), $._expression)),
      prec.left(2, seq($._expression, choice('&&', '&'), $._expression)),
      prec.left(3, seq($._expression, choice('==', '!=', '<', '<=', '>', '>=', '='), $._expression)),
      prec.left(3, seq($._expression, 'in', $._expression)),
      prec.left(4, seq($._expression, choice('+', '-'), $._expression)),
      prec.left(5, seq($._expression, choice('*', '/', '%'), $._expression)),
      prec.right(1, seq($._expression, choice('||', '|'))),
      prec.right(2, seq($._expression, choice('&&', '&'))),
      prec.right(3, seq($._expression, choice('==', '!=', '<', '<=', '>', '>=', '='))),
      prec.right(3, seq($._expression, 'in')),
      prec.right(4, seq($._expression, choice('+', '-'))),
      prec.right(5, seq($._expression, choice('*', '/', '%'))),
    ),

    is_expression: $ => prec.left(3,
      seq($._expression, 'is', optional($.name), optional(seq('in', optional($._expression)))),
    ),

    like_expression: $ => prec.left(3,
      seq($._expression, 'like', optional($.string)),
    ),

    has_expression: $ => prec.left(3,
      seq($._expression, 'has', optional($._expression)),
    ),

    unary_expression: $ => prec.right(6,
      seq(choice('!', '-'), optional(choice($.unary_expression, $.member_expression, $._primary))),
    ),

    member_expression: $ => prec.left(7,
      seq(
        $._primary,
        repeat1($._accessor),
      ),
    ),

    _accessor: $ => choice(
      $.field_access,
      $.method_call,
      $.index_access,
    ),

    field_access: $ => seq('.', $.identifier),

    method_call: $ => seq(
      '.',
      $.identifier,
      '(',
      commaSep($._expression),
      ')',
    ),

    index_access: $ => seq('[', $.string, ']'),

    _primary: $ => choice(
      $.true,
      $.false,
      $.integer,
      $.decimal,
      $.string,
      $.slot,
      $.entity_reference,
      $.extension_call,
      $.parenthesized_expression,
      $.set_expression,
      $.record_expression,
      $.variable,
      $.identifier,
    ),

    extension_call: $ => prec(8,
      seq(
        $.name,
        '(',
        commaSep($._expression),
        ')',
      ),
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    set_expression: $ => seq(
      '[',
      commaSep($._expression),
      optional(','),
      ']',
    ),

    record_expression: $ => seq(
      '{',
      commaSep($.record_entry),
      optional(','),
      '}',
    ),

    record_entry: $ => seq(
      choice($.identifier, $.string),
      ':',
      optional($._expression),
    ),

    entity_reference: $ => prec.right(seq(
      $.identifier,
      repeat(seq('::', $.identifier)),
      '::',
      optional(choice($.string, $.entity_record)),
    )),

    entity_record: $ => seq(
      '{',
      commaSep($.ref_init),
      optional(','),
      '}',
    ),

    ref_init: $ => seq(
      $.identifier,
      ':',
      optional($._literal),
    ),

    entity_list: $ => prec.right(seq(
      '[',
      commaSep($.entity_reference),
      optional(','),
      optional(']'),
    )),

    slot: $ => prec.right(seq('?', optional($.identifier), optional(seq(':', optional($.type_reference))))),

    variable: _ => choice('principal', 'action', 'resource', 'context'),

    _keyword_identifier: $ => prec.dynamic(1, alias(choice('permit', 'forbid', 'template'), $.identifier)),

    _any_type_reference: $ => $.type_reference,

    ...literals,
    ...types,
    ...common,
  },
});
