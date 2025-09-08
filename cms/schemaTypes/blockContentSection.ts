import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'blockContentSection',
  title: 'Sección de contenido',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageAlt',
      title: 'Texto alternativo de la imagen',
      type: 'string',
      hidden: ({parent}) => !parent?.image,
      validation: (Rule) => (Rule as any).custom((value: unknown, context: any) => {
        const hasImage = Boolean(context?.parent?.image)
        if (!hasImage) return true
        return (value && String(value).trim().length > 0) || 'Requerido cuando hay imagen'
      })
    }),
    defineField({
      name: 'imagePosition',
      title: 'Posición de la imagen',
      type: 'string',
      options: {
        list: [
          {title: 'Izquierda', value: 'left'},
          {title: 'Derecha', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'right',
      hidden: ({parent}) => !parent?.image,
    }),
    defineField({
      name: 'imageWidth',
      title: 'Ancho de la imagen',
      type: 'string',
      options: {
        list: [
          {title: '50%', value: '50'},
          {title: '33%', value: '33'},
          {title: '25%', value: '25'},
        ],
        layout: 'radio',
      },
      initialValue: '50',
      hidden: ({parent}) => !parent?.image,
    }),
    defineField({
      name: 'columnsCount',
      title: 'Columnas de texto',
      type: 'number',
      options: {list: [1, 2, 3]},
      initialValue: 1,
    }),
    defineField({
      name: 'content',
      title: 'Contenido',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {title: 'title', hasImage: 'image', cols: 'columnsCount'},
    prepare({title, hasImage, cols}) {
      return {
        title: title || 'Sección de contenido',
        subtitle: `${hasImage ? 'Con imagen · ' : ''}${cols || 1} columna(s)`
      }
    }
  }
})



