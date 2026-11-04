import { defineArrayMember, defineField, defineType } from 'sanity'

// ponytail: one CV per site, so this is a singleton (fixed via structure.ts); no lockdown
// against creating a second one, add sanity.config.ts action/template filtering if that happens
export const cv = defineType({
  name: 'cv',
  title: 'CV',
  type: 'document',
  groups: [
    { name: 'header', title: 'Header' },
    { name: 'summary', title: 'Summary' },
    { name: 'sites', title: 'Live Websites' },
    { name: 'experience', title: 'Experience' },
    { name: 'education', title: 'Education' },
    { name: 'certification', title: 'Certification' },
    { name: 'achievement', title: 'Achievement' },
  ],
  fields: [
    defineField({ name: 'name', type: 'string', group: 'header', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'localeString', group: 'header', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string', group: 'header', validation: (r) => r.required() }),
    defineField({ name: 'phone', type: 'string', group: 'header', validation: (r) => r.required() }),
    defineField({ name: 'email', type: 'string', group: 'header', validation: (r) => r.required() }),
    defineField({ name: 'portfolioUrl', type: 'url', group: 'header', validation: (r) => r.required() }),

    defineField({
      name: 'summary',
      title: 'Summary (plain text fallback)',
      description: 'Write {role} where the job title should go — it is replaced by the role above, or by the ?role= link the CV was opened with.',
      type: 'localeText',
      group: 'summary',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'summaryRich',
      title: 'Summary',
      description: 'Copy your existing summary into each language below, then select words and click Bold. Use {role} for the dynamic job title. Empty languages use the plain text summary above.',
      type: 'object',
      group: 'summary',
      fields: (['id', 'en'] as const).map((lang) =>
        defineField({
          name: lang,
          title: lang === 'id' ? 'Bahasa Indonesia' : 'English',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              lists: [],
              marks: {
                decorators: [{ title: 'Bold', value: 'strong' }],
                annotations: [],
              },
            }),
          ],
        }),
      ),
    }),

    defineField({
      name: 'liveWebsites',
      title: 'Live Websites',
      type: 'array',
      group: 'sites',
      of: [
        defineArrayMember({
          name: 'site',
          type: 'object',
          fields: [
            defineField({ name: 'url', type: 'url', validation: (r) => r.required() }),
            defineField({ name: 'stack', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'url', subtitle: 'stack' } },
        }),
      ],
    }),

    defineField({
      name: 'experience',
      title: 'Experience',
      type: 'array',
      group: 'experience',
      of: [
        defineArrayMember({
          name: 'job',
          type: 'object',
          fields: [
            defineField({ name: 'company', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'role', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'dateRange', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'bullets', type: 'localeBullets' }),
          ],
          preview: { select: { title: 'company', subtitle: 'role.id' } },
        }),
      ],
    }),

    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      group: 'education',
      of: [
        defineArrayMember({
          name: 'entry',
          type: 'object',
          fields: [
            defineField({ name: 'school', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'degree', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'dateRange', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'bullets', type: 'localeBullets' }),
          ],
          preview: { select: { title: 'school', subtitle: 'degree.id' } },
        }),
      ],
    }),

    defineField({
      name: 'certifications',
      title: 'Certification',
      type: 'array',
      group: 'certification',
      of: [
        defineArrayMember({
          name: 'certification',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'url' }),
            defineField({ name: 'issuer', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'credential', type: 'string' }),
            defineField({ name: 'year', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'issuer' } },
        }),
      ],
    }),

    defineField({
      name: 'achievements',
      title: 'Achievement',
      type: 'array',
      group: 'achievement',
      of: [
        defineArrayMember({
          name: 'achievement',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'url' }),
            defineField({ name: 'subtitle', type: 'localeString', validation: (r) => r.required() }),
            defineField({ name: 'year', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'title.id', subtitle: 'subtitle.id' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { name: 'name', role: 'role.id' },
    prepare: ({ name, role }) => ({ title: name || 'CV', subtitle: role }),
  },
})
