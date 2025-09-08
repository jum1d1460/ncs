import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'columns',
  title: 'Texto en columnas',
  type: 'object',
  fields: [
    defineField({
      name: 'columnsCount',
      title: 'Número de columnas',
      type: 'number',
      options: {list: [2, 3]},
      validation: (Rule) => Rule.required().min(2).max(3),
    }),
    defineField({
      name: 'columns',
      title: 'Columnas',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'column',
          title: 'Columna',
          type: 'object',
          fields: [
            defineField({
              name: 'content',
              title: 'Contenido',
              type: 'blockContent',
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.custom((rows, context) => {
          const count = (context.parent as any)?.columnsCount
          if (!Array.isArray(rows)) return 'Debe definir las columnas'
          if (count !== rows.length) return `Debe tener exactamente ${count} columnas`
          return true
        }),
    }),
  ],
  preview: {
    select: {count: 'columnsCount'},
    prepare({count}) {
      return {title: `Texto en ${count || 2} columnas`}
    },
  },
})


