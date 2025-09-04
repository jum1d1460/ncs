import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        defineField({
          name: 'social',
          title: 'Social',
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {list: ['facebook', 'instagram', 'linkedin', 'x', 'youtube', 'tiktok']},
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.uri({allowRelative: false, scheme: ['http', 'https']}),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'defaultMeta',
      title: 'Default Meta',
      type: 'object',
      fields: [
        defineField({name: 'titleSuffix', title: 'Title Suffix', type: 'string'}),
        defineField({name: 'ogTitle', title: 'OG Title', type: 'string'}),
        defineField({name: 'ogDescription', title: 'OG Description', type: 'text'}),
      ],
    }),
  ],
})


