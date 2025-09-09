import {defineType} from 'sanity'
import {blockPresentationFields} from './fields/blockPresentation'

export default defineType({
  name: 'blockImage',
  title: 'Imagen de corte',
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
      name: 'variant',
      title: 'Variante',
      type: 'string',
      options: {
        list: [
          {title: 'Contenida', value: 'contained'},
          {title: 'A sangre (full-bleed)', value: 'fullBleed'},
        ],
        layout: 'radio',
      },
      initialValue: 'contained',
    },
    {
      name: 'aspectRatio',
      title: 'Relación de aspecto',
      type: 'string',
      options: {
        list: [
          {title: 'Auto', value: 'auto'},
          {title: '16:9', value: '16:9'},
          {title: '4:3', value: '4:3'},
          {title: '1:1', value: '1:1'},
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    },
    {
      name: 'marginTop',
      title: 'Margen superior',
      type: 'string',
      options: {
        list: [
          {title: 'Sin margen', value: 'none'},
          {title: 'Pequeño', value: 'sm'},
          {title: 'Medio', value: 'md'},
          {title: 'Grande', value: 'lg'},
        ],
      },
      initialValue: 'md',
    },
    {
      name: 'marginBottom',
      title: 'Margen inferior',
      type: 'string',
      options: {
        list: [
          {title: 'Sin margen', value: 'none'},
          {title: 'Pequeño', value: 'sm'},
          {title: 'Medio', value: 'md'},
          {title: 'Grande', value: 'lg'},
        ],
      },
      initialValue: 'md',
    },
    {
      name: 'overlayOpacity',
      title: 'Opacidad de overlay',
      type: 'number',
      description: '0–100 para un velo opcional',
      validation: (Rule) => Rule.min(0).max(100),
    }
  ,
  ...blockPresentationFields
  ],
  preview: {
    select: {title: 'alt', subtitle: 'variant', media: 'image'},
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Imagen de corte',
        subtitle: subtitle ? `Variante: ${subtitle}` : 'Variante: contained',
        media,
      }
    },
  },
})


