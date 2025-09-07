import {defineType} from 'sanity'

export default defineType({
  name: 'quoteBlock',
  title: 'Quote',
  type: 'object',
  fields: [
    {
      name: 'quote',
      title: 'Cita',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(3),
    },
    {
      name: 'meta',
      title: 'Meta (autor, fecha, etc.)',
      type: 'string',
    },
    {
      name: 'align',
      title: 'Alineación',
      type: 'string',
      options: {
        list: [
          {title: 'Izquierda', value: 'left'},
          {title: 'Centrada', value: 'center'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    },
  ],
  preview: {
    select: {title: 'quote', subtitle: 'meta'},
    prepare({title, subtitle}) {
      const firstLine = (title || '').split('\n')[0]
      return {
        title: firstLine || 'Quote',
        subtitle: subtitle || '',
      }
    },
  },
})


