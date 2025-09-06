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
      name: 'brand',
      title: 'Brand',
      type: 'object',
      fields: [
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Alt', type: 'string', validation: (Rule) => Rule.required()})]
        })
      ]
    }),
    defineField({
      name: 'navMain',
      title: 'Main Navigation',
      type: 'array',
      of: [{
        type: 'object',
        name: 'navItem',
        title: 'Nav Item',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
          defineField({
            name: 'url',
            title: 'URL (absoluta o relativa)',
            type: 'string',
            description: 'Ejemplos: https://example.com o /contacto',
            validation: (Rule) => Rule.custom((value, context) => {
              const v = (value || '').trim()
              const hasPage = Boolean((context as any)?.parent?.page)
              if (!v && !hasPage) return 'Debes indicar una URL o seleccionar una página'
              if (!v) return true
              const isAbsolute = /^https?:\/\//.test(v)
              const isRelative = v.startsWith('/')
              return (isAbsolute || isRelative) || 'La URL debe ser absoluta (http/https) o comenzar por /'
            })
          }),
          defineField({
            name: 'page',
            title: 'Página',
            type: 'reference',
            to: [{type: 'page'}],
            description: 'Opcional. Si se selecciona, se usará su slug como enlace cuando no haya URL',
          }),
          defineField({
            name: 'target',
            title: 'Target',
            type: 'string',
            options: {
              list: [
                {title: 'Misma pestaña', value: '_self'},
                {title: 'Nueva pestaña', value: '_blank'}
              ],
              layout: 'radio'
            },
            initialValue: '_self'
          }),
        ]
      }]
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      fields: [
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({name: 'whatsapp', title: 'WhatsApp', type: 'string'}),
        defineField({name: 'email', title: 'Email', type: 'string'}),
      ]
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'url',
      validation: (Rule) => Rule.uri({allowRelative: false, scheme: ['http', 'https']})
    }),
    defineField({
      name: 'seoFooterText',
      title: 'SEO Footer Text',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'array',
      of: [{
        type: 'object',
        name: 'legalItem',
        title: 'Legal Item',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
          defineField({name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required()}),
        ]
      }]
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


