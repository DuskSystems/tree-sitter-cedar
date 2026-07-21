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
      optional(seq('{', optional($.expression), optional('}'))),
    )),

    advice: $ => prec.right(seq(
      'advice',
      optional(seq('{', optional($.expression), optional('}'))),
    )),

    expression: $ => choice(
      $.if_expression,
      $.or_expression,
    ),

    if_expression: $ => prec.right(0,
      seq(
        'if',
        optional($.expression),
        optional(seq('then', optional($.expression))),
        optional(seq('else', optional($.expression))),
      ),
    ),

    or_expression: $ => prec.left(1,
      seq(
        $.and_expression,
        repeat(
          seq(
            choice('||', '|'),
            optional($.and_expression),
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
            optional($.relation_expression),
          ),
        ),
      ),
    ),

    relation_expression: $ => choice(
      prec.left(3, seq($._add_expression, choice('==', '!=', '<', '<=', '>', '>=', '='), optional($._add_expression))),
      prec.left(3, seq($._add_expression, 'has', optional($._add_expression))),
      prec.left(3, seq($._add_expression, 'like', optional($.string))),
      prec.left(3, seq($._add_expression, 'is', optional($.name), optional(seq('in', optional($._add_expression))))),
      prec.left(3, seq($._add_expression, 'in', optional($._add_expression))),
      $._add_expression,
    ),

    _add_expression: $ => prec.left(4,
      seq(
        $._multiply_expression,
        repeat(
          seq(
            choice('+', '-'),
            optional($._multiply_expression),
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
            optional($.unary_expression),
          ),
        ),
      ),
    ),

    unary_expression: $ => choice(
      prec.right(6, seq(choice('!', '-'), optional($.unary_expression))),
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

    ...literals,
    ...types,
    ...common,
  },
});
