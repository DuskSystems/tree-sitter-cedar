/// <reference path="../dsl.d.ts" />
// @ts-check

import { commaSep, commaSep1, common, literals, types } from '../common.js';

export default grammar({
  name: 'cedarschema',

  word: $ => $.identifier,
  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    schema: $ => repeat(
      choice(
        $.namespace,
        $._declaration,
      ),
    ),

    namespace: $ => seq(
      repeat($.annotation),
      'namespace',
      $.name,
      '{',
      repeat(choice($.namespace, $._declaration)),
      '}',
    ),

    _declaration: $ => choice(
      $.entity_declaration,
      $.action_declaration,
      $.common_type_declaration,
    ),

    entity_declaration: $ => seq(
      repeat($.annotation),
      'entity',
      $.identifier_list,
      choice(
        seq(
          optional($.entity_parents),
          optional(seq(optional('='), $.type_reference)),
          optional($.entity_tags),
          optional(';'),
        ),
        $.enum_type,
      ),
    ),

    action_declaration: $ => seq(
      repeat($.annotation),
      'action',
      $.action_name_list,
      optional($.action_parents),
      optional($.applies_to),
      optional($.action_attributes),
      optional(';'),
    ),

    action_attributes: $ => seq(
      'attributes',
      '{',
      commaSep($.attribute_entry),
      optional(','),
      '}',
    ),

    attribute_entry: $ => seq(
      choice($.identifier, $.string),
      ':',
      optional($._literal),
    ),

    common_type_declaration: $ => seq(
      repeat($.annotation),
      'type',
      $.identifier,
      optional(seq('=', optional($.type_reference))),
      optional(';'),
    ),

    entity_parents: $ => seq(
      'in',
      $.type_list,
    ),

    entity_tags: $ => seq(
      'tags',
      $.type_reference,
    ),

    enum_type: $ => seq(
      'enum',
      '[',
      commaSep($.string),
      optional(','),
      ']',
      optional(';'),
    ),

    action_parents: $ => seq(
      'in',
      $.qualified_name_list,
    ),

    _applies_to_member: $ => choice(
      $.principal_types,
      $.resource_types,
      $.context_type,
    ),

    applies_to: $ => seq(
      'appliesTo',
      '{',
      commaSep($._applies_to_member),
      optional(','),
      '}',
    ),

    principal_types: $ => seq(
      'principal',
      ':',
      $.type_list,
    ),

    resource_types: $ => seq(
      'resource',
      ':',
      $.type_list,
    ),

    context_type: $ => seq(
      'context',
      ':',
      $.type_reference,
    ),

    type_list: $ => choice(
      seq('[', commaSep($.name), optional(','), ']'),
      $.name,
    ),

    qualified_name: $ => choice(
      seq($.identifier, repeat(seq('::', $.identifier)), '::', $.string),
      $._attribute_name,
    ),

    qualified_name_list: $ => choice(
      seq('[', commaSep($.qualified_name), optional(','), ']'),
      $.qualified_name,
    ),

    identifier_list: $ => prec.right(seq(commaSep1($.identifier), optional(','))),
    action_name_list: $ => prec.right(seq(commaSep1($._attribute_name), optional(','))),

    _attribute_name: $ => choice(
      $.identifier,
      $.string,
    ),

    ...literals,
    ...types,
    ...common,
  },
});
