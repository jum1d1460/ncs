import {defineType, defineField} from 'sanity'
import {blockPresentationFields} from './fields/blockPresentation'

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
      name: 'headingLevel',
      title: 'Nivel de encabezado',
      type: 'string',
      options: {
        list: [
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
          {title: 'H3', value: 'h3'},
          {title: 'H4', value: 'h4'},
          {title: 'H5', value: 'h5'},
        ],
        layout: 'radio',
      },
      initialValue: 'h2',
      hidden: ({parent}) => !parent?.title,
      validation: (Rule) => (Rule as any).custom((value: unknown, context: any) => {
        const hasTitle = Boolean(context?.parent?.title)
        if (!hasTitle) return true
        const allowed = ['h1','h2','h3','h4','h5']
        return allowed.includes(String(value)) || 'Selecciona un nivel de encabezado válido'
      })
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
    ...blockPresentationFields
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



