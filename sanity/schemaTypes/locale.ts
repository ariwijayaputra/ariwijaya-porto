import { defineArrayMember, defineField, defineType } from 'sanity'

// ponytail: the site only speaks id/en, so a locale value is a plain {id, en} object;
// sanity-plugin-internationalized-array if more languages ever land
const both = (type: 'string' | 'text', rows?: number) => [
  defineField({ name: 'id', title: 'Bahasa Indonesia', type, rows, validation: (r) => r.required() }),
  defineField({ name: 'en', title: 'English', type, rows, validation: (r) => r.required() }),
]

export const localeString = defineType({
  name: 'localeString',
  title: 'Text (ID / EN)',
  type: 'object',
  options: { columns: 2 },
  fields: both('string'),
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Paragraph (ID / EN)',
  type: 'object',
  fields: both('text', 5),
})

export const localeBullets = defineType({
  name: 'localeBullets',
  title: 'Bullets (ID / EN)',
  type: 'object',
  fields: (['id', 'en'] as const).map((lang) =>
    defineField({
      name: lang,
      title: lang === 'id' ? 'Bahasa Indonesia' : 'English',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ),
})
