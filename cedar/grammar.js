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

  rules: {
    policy_set: $ => repeat($.policy),
    policy: $ => seq(
      repeat($.annotation),
      optional(seq($.template_declaration, repeat($.annotation))),
      $.effect,
      '(',
      optional($.scope),
      ')',
      repeat(choice($.condition, $.advice)),
      optional(';'),
    ),

    template_declaration: $ => seq('template', '(', commaSep($.slot), ')', '=>'),

    effect: _ => choice('permit', 'forbid'),

    scope: $ => seq(
      commaSep1(choice($.principal, $.action, $.resource)),
      optional(','),
    ),

    principal: $ => seq('principal', optional($._type_annotation), optional($.scope_constraint)),
    action: $ => seq('action', optional($._type_annotation), optional($.scope_constraint)),
    resource: $ => seq('resource', optional($._type_annotation), optional($.scope_constraint)),

    _type_annotation: $ => seq(':', $.type_reference),

    scope_constraint: $ => choice(
      seq('==', choice($.entity_reference, $.slot)),
      seq('in', choice($.entity_reference, $.entity_list, $.slot)),
      seq('is', $.name, optional(seq('in', choice($.entity_reference, $.slot)))),
    ),

    condition: $ => seq(
      choice('when', 'unless'),
      '{',
      optional($.expression),
      '}',
    ),

    advice: $ => seq(
      'advice',
      '{',
      optional($.expression),
      '}',
    ),

    expression: $ => choice(
      $.if_expression,
      $.or_expression,
    ),

    if_expression: $ => prec.right(0,
      seq(
        'if',
        $.expression,
        'then',
        $.expression,
        'else',
        $.expression,
      ),
    ),

    or_expression: $ => prec.left(1,
      seq(
        $.and_expression,
        repeat(
          seq(
            choice('||', '|'),
            $.and_expression,
          ),
        ),
      ),
    ),

    and_expression: $ => prec.left(2,
      seq(
        $.relation_expression,
        repeat(
          seq(
            choice('&&', '&'),
            $.relation_expression,
          ),
        ),
      ),
    ),

    relation_expression: $ => choice(
      prec.left(3, seq($._add_expression, choice('==', '!=', '<', '<=', '>', '>=', '='), $._add_expression)),
      prec.left(3, seq($._add_expression, 'has', $._add_expression)),
      prec.left(3, seq($._add_expression, 'like', $.string)),
      prec.left(3, seq($._add_expression, 'is', $.name, optional(seq('in', $._add_expression)))),
      prec.left(3, seq($._add_expression, 'in', $._add_expression)),
      $._add_expression,
    ),

    _add_expression: $ => prec.left(4,
      seq(
        $._multiply_expression,
        repeat(
          seq(
            choice('+', '-'),
            $._multiply_expression,
          ),
        ),
      ),
    ),

    _multiply_expression: $ => prec.left(5,
      seq(
        $.unary_expression,
        repeat(
          seq(
            choice('*', '/', '%'),
            $.unary_expression,
          ),
        ),
      ),
    ),

    unary_expression: $ => choice(
      prec(6, seq(choice('!', '-'), $.unary_expression)),
      $.member_expression,
    ),

    member_expression: $ => prec.left(7,
      seq(
        $._primary,
        repeat($._accessor),
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
      commaSep($.expression),
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
        commaSep($.expression),
        ')',
      ),
    ),

    parenthesized_expression: $ => seq('(', $.expression, ')'),

    set_expression: $ => seq(
      '[',
      commaSep($.expression),
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
      optional($.expression),
    ),

    entity_reference: $ => seq(
      $.identifier,
      repeat(seq('::', $.identifier)),
      '::',
      choice($.string, $.entity_record),
    ),

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

    entity_list: $ => seq(
      '[',
      commaSep($.entity_reference),
      optional(','),
      ']',
    ),

    slot: $ => seq('?', $.identifier, optional(seq(':', $.type_reference))),

    variable: _ => choice('principal', 'action', 'resource', 'context'),

    ...literals,
    ...types,
    ...common,
  },
});
