/// <reference path="../dsl.d.ts" />
// @ts-check

import { commaSep, common, keywords, literals } from '../common.js';

export default grammar({
  name: 'cedarentities',

  word: $ => $.identifier,
  extras: $ => [
    /\s/,
    $.comment,
  ],
  conflicts: $ => [
    [$.entity_list],
    [$.annotation],
    [$.namespace],
    [$.instance],
    [$.instance_tags, $._keyword_identifier],
    [$.record],
    [$.set],
  ],

  rules: {
    entities: $ => repeat(
      choice(
        $.namespace,
        $.instance,
      ),
    ),

    _namespace_member: $ => $.instance,

    instance: $ => seq(
      repeat($.annotation),
      'instance',
      optional($._any_reference),
      optional($.instance_parents),
      optional(choice(seq('=', optional($.record)), $.record)),
      optional($.instance_tags),
      optional(';'),
    ),

    instance_parents: $ => prec.right(seq(
      'in',
      optional(choice($.entity_reference, $.entity_list)),
    )),

    instance_tags: $ => seq(
      'tags',
      $.record,
    ),

    entity_list: $ => seq(
      '[',
      commaSep($._any_reference),
      optional(','),
      optional(']'),
    ),

    entity_reference: $ => prec.right(seq(
      $.identifier,
      repeat(seq('::', $.identifier)),
      optional(seq('::', optional($.string))),
    )),

    record: $ => seq(
      '{',
      commaSep($.record_entry),
      optional(','),
      optional('}'),
    ),

    record_entry: $ => seq(
      choice($._name_identifier, $.string),
      ':',
      optional($._value),
    ),

    _value: $ => choice(
      $._literal,
      $.entity_reference,
      $.extension_call,
      $.set,
      $.record,
    ),

    set: $ => seq(
      '[',
      commaSep($._value),
      optional(','),
      optional(']'),
    ),

    extension_call: $ => seq(
      $.name,
      '(',
      commaSep($._value),
      ')',
    ),

    _keyword_identifier: $ => prec.dynamic(1, alias(choice('namespace', 'instance', 'tags'), $.identifier)),

    _any_reference: $ => choice(
      $.entity_reference,
      alias($._keyword_reference, $.entity_reference),
    ),

    _keyword_reference: $ => prec.right(seq(
      $._keyword_identifier,
      repeat(seq('::', $.identifier)),
      optional(seq('::', optional($.string))),
    )),

    ...keywords,
    ...literals,
    ...common,
  },
});
