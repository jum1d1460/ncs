import {defineField} from 'sanity'

export const blockPresentationFields = [
  defineField({
    name: 'backgroundColor',
    title: 'Color de fondo',
    type: 'string',
    options: {
      list: [
        {title: 'Transparente', value: 'none'},
        {title: 'Color 1', value: 'color1'},
        {title: 'Color 2', value: 'color2'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'none',
  }),
  defineField({
    name: 'backgroundLayout',
    title: 'Fondo: disposición',
    type: 'string',
    options: {
      list: [
        {title: 'En rejilla', value: 'grid'},
        {title: 'Ancho completo', value: 'full'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'grid',
  }),
  defineField({
    name: 'contentLayout',
    title: 'Contenido: disposición',
    type: 'string',
    options: {
      list: [
        {title: 'En rejilla', value: 'grid'},
        {title: 'Ancho completo', value: 'full'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'grid',
  }),
]


