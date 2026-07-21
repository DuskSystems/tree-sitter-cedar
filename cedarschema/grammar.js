/// <reference path="../dsl.d.ts" />
// @ts-check

import { commaSep, commaSep1, common, keywords, literals, types } from '../common.js';

export default grammar({
  name: 'cedarschema',

  word: $ => $.identifier,
  extras: $ => [
    /\s/,
    $.comment,
  ],
  conflicts: $ => [
    [$.context_type],
    [$.qualified_name_list],
    [$.type_list],
    [$.entity_tags],
    [$.entity_tags, $._keyword_identifier],
    [$.annotation],
    [$.namespace],
    [$.entity_declaration],
    [$.action_declaration],
    [$.common_type_declaration],
    [$.identifier_list],
    [$.action_name_list],
    [$.record_type],
    [$.attribute_declaration],
    [$.action_attributes],
  ],

  rules: {
    schema: $ => repeat(
      choice(
        $.namespace,
        $._declaration,
      ),
    ),

    _namespace_member: $ => $._declaration,

    _declaration: $ => choice(
      $.entity_declaration,
      $.action_declaration,
      $.common_type_declaration,
    ),

    entity_declaration: $ => seq(
      repeat($.annotation),
      'entity',
      optional($.identifier_list),
      choice(
        seq(
          optional($.entity_parents),
          optional(choice(seq('=', optional($._any_type_reference)), $.record_type)),
          optional($.entity_tags),
          optional(';'),
        ),
        $.enum_type,
      ),
    ),

    action_declaration: $ => seq(
      repeat($.annotation),
      'action',
      optional($.action_name_list),
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
      optional('}'),
    ),

    attribute_entry: $ => seq(
      choice($._name_identifier, $.string),
      ':',
      optional($._literal),
    ),

    common_type_declaration: $ => seq(
      repeat($.annotation),
      'type',
      optional($._name_identifier),
      optional(seq('=', optional($._any_type_reference))),
      optional(';'),
    ),

    entity_parents: $ => prec.right(seq(
      'in',
      optional($.type_list),
    )),

    entity_tags: $ => seq(
      'tags',
      optional($._any_type_reference),
    ),

    enum_type: $ => seq(
      'enum',
      '[',
      commaSep($.string),
      optional(','),
      optional(']'),
      optional(';'),
    ),

    action_parents: $ => prec.right(seq(
      'in',
      optional($.qualified_name_list),
    )),

    _applies_to_member: $ => choice(
      $.principal_types,
      $.resource_types,
      $.context_type,
    ),

    applies_to: $ => prec.right(seq(
      'appliesTo',
      '{',
      commaSep($._applies_to_member),
      optional(','),
      optional('}'),
    )),

    principal_types: $ => prec.right(seq(
      'principal',
      ':',
      optional($.type_list),
    )),

    resource_types: $ => prec.right(seq(
      'resource',
      ':',
      optional($.type_list),
    )),

    context_type: $ => seq(
      'context',
      ':',
      optional($._any_type_reference),
    ),

    type_list: $ => choice(
      seq('[', commaSep($._any_name), optional(','), optional(']')),
      $.name,
    ),

    qualified_name: $ => choice(
      prec.right(seq($.identifier, repeat(seq('::', $.identifier)), '::', optional($.string))),
      $._attribute_name,
    ),

    qualified_name_list: $ => choice(
      seq('[', commaSep(choice($.qualified_name, alias($._keyword_name, $.qualified_name))), optional(','), optional(']')),
      $.qualified_name,
    ),

    identifier_list: $ => seq(commaSep1($._name_identifier), optional(',')),
    action_name_list: $ => seq(commaSep1(choice($._name_identifier, $.string)), optional(',')),

    _attribute_name: $ => choice(
      $.identifier,
      $.string,
    ),

    _keyword_identifier: $ => prec.dynamic(1, alias(choice('namespace', 'entity', 'action', 'type', 'tags', 'enum', 'appliesTo', 'principal', 'resource', 'context', 'attributes'), $.identifier)),

    _any_type_reference: $ => choice(
      $.type_reference,
      alias($._keyword_type_reference, $.type_reference),
    ),

    _keyword_type_reference: $ => prec.dynamic(1, alias($._keyword_name, $.name)),

    ...keywords,
    ...literals,
    ...types,
    ...common,
  },
});
