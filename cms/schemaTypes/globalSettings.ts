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
      description: 'Menú principal de navegación con soporte para dos niveles.',
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
            description: 'Ejemplos: https://example.com o /contacto. Si también se selecciona "Página", se usará esta URL.',
            validation: (Rule) => Rule.custom((value, context) => {
              const v = (value || '').trim()
              const hasPage = Boolean((context as any)?.parent?.page)
              const hasChildren = Boolean((context as any)?.parent?.children?.length)
              if (!v && !hasPage && !hasChildren) return 'Debes indicar una URL, seleccionar una página o agregar subelementos'
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
            description: 'Opcional. Se usará su slug como enlace cuando no haya URL.',
          }),
          defineField({
            name: 'children',
            title: 'Subelementos',
            type: 'array',
            description: 'Elementos del menú de segundo nivel.',
            of: [{
              type: 'object',
              name: 'navSubItem',
              title: 'Sub Nav Item',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
                defineField({
                  name: 'url',
                  title: 'URL (absoluta o relativa)',
                  type: 'string',
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
                  description: 'Opcional. Se usará su slug como enlace cuando no haya URL.',
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
                  initialValue: '_self',
                }),
              ]
            }]
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
            initialValue: '_self',
            description: 'Para enlaces externos (http/https) se recomienda "Nueva pestaña" (_blank).',
            validation: (Rule) => Rule.custom((value, context) => {
              const url = String(((context as any)?.parent?.url || '')).trim()
              if (!url) return true
              const isAbsolute = /^https?:\/\//.test(url)
              if (isAbsolute && value !== '_blank') {
                return 'Para enlaces externos (http/https), el target debe ser "Nueva pestaña" (_blank).'
              }
              return true
            }),
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
      name: 'footerTitle',
      title: 'Footer Title',
      type: 'string',
      description: 'Título principal que aparece en el footer (ej: "Psicóloga Nelly Castro Sánchez")',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'seoFooterText',
      title: 'SEO Footer Text',
      type: 'text',
      rows: 4,
      description: 'Texto descriptivo que aparece debajo del título en el footer'
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


