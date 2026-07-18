/// <reference path="../dsl.d.ts" />
// @ts-check

import { commaSep, common, literals } from '../common.js';

export default grammar({
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
      repeat($.annotation),
      'namespace',
      $.name,
      '{',
      repeat(choice($.namespace, $.instance)),
      '}',
    ),

    instance: $ => seq(
      repeat($.annotation),
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
      ']',
    ),

    extension_call: $ => seq(
      $.name,
      '(',
      commaSep($._value),
      ')',
    ),

    ...literals,
    ...common,
  },
});
