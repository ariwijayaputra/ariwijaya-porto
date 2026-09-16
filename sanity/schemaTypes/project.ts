import { defineField, defineType } from 'sanity'

// ponytail: the site only speaks id/en, so the description is a plain {id, en} object;
// sanity-plugin-internationalized-array if more languages ever land
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'image',
      title: 'Screenshot',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'object',
      fields: [
        defineField({
          name: 'id',
          title: 'Bahasa Indonesia',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'url',
      title: 'URL',
      description: 'Live site, optional',
      type: 'url',
    }),
    defineField({
      name: 'order',
      description: 'Position in the work slider, lowest first',
      type: 'number',
      validation: (rule) => rule.required().integer(),
    }),
  ],
  orderings: [
    { title: 'Slider order', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', year: 'year', media: 'image' },
    prepare: ({ title, year, media }) => ({ title, subtitle: year ? String(year) : undefined, media }),
  },
})
