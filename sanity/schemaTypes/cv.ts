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
    defineField({ name: 'role', type: 'string', group: 'header', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string', group: 'header', validation: (r) => r.required() }),
    defineField({ name: 'phone', type: 'string', group: 'header', validation: (r) => r.required() }),
    defineField({ name: 'email', type: 'string', group: 'header', validation: (r) => r.required() }),
    defineField({ name: 'portfolioUrl', type: 'url', group: 'header', validation: (r) => r.required() }),

    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 5, group: 'summary', validation: (r) => r.required() }),

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
            defineField({ name: 'role', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'dateRange', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'bullets', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
          ],
          preview: { select: { title: 'company', subtitle: 'role' } },
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
            defineField({ name: 'degree', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'dateRange', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'bullets', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
          ],
          preview: { select: { title: 'school', subtitle: 'degree' } },
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
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'url' }),
            defineField({ name: 'subtitle', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'year', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'subtitle' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { name: 'name', role: 'role' },
    prepare: ({ name, role }) => ({ title: name || 'CV', subtitle: role }),
  },
})
