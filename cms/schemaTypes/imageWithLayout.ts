import {defineType} from 'sanity'
import {blockPresentationFields} from './fields/blockPresentation'

export default defineType({
  name: 'imageWithLayout',
  title: 'Imagen con layout',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Texto alternativo',
      type: 'string',
      validation: (Rule) => Rule.required().min(3),
    },
    {
      name: 'layout',
      title: 'Alineación',
      type: 'string',
      options: {
        list: [
          {title: 'Izquierda', value: 'left'},
          {title: 'Derecha', value: 'right'},
          {title: 'Centro', value: 'center'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    },
    {
      name: 'width',
      title: 'Ancho',
      type: 'string',
      options: {
        list: [
          {title: '50% (media)', value: 'half'},
          {title: '100% (completa)', value: 'full'},
        ],
        layout: 'radio',
      },
      initialValue: 'half',
    },
    {
      name: 'caption',
      title: 'Pie de foto',
      type: 'string',
    },
    {
      name: 'marginY',
      title: 'Márgenes verticales',
      type: 'string',
      options: {
        list: [
          {title: 'Sin margen', value: 'none'},
          {title: 'Pequeño', value: 'sm'},
          {title: 'Medio', value: 'md'},
          {title: 'Grande', value: 'lg'},
        ],
        layout: 'radio',
      },
      initialValue: 'md',
    }
  ,
  ...blockPresentationFields
  ],
  preview: {
    select: {title: 'caption', subtitle: 'layout', media: 'image'},
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Imagen con layout',
        subtitle: subtitle ? `Alineación: ${subtitle}` : 'Alineación: left',
        media,
      }
    },
  },
})


