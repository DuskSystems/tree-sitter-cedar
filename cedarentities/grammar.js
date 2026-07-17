/// <reference path="../dsl.d.ts" />
// @ts-check

import { commaSep, common } from '../common.js';

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

    ...common,
  },
});
