import {defineField, defineType} from "sanity";
import {blockPresentationFields} from './fields/blockPresentation'

export default defineType({
    name: "blockBlogHero",
    title: "Hero de Blog",
    type: "object",
    description: "Hero específico para posts de blog con información del autor y categorías",
    fields: [
        defineField({
            name: "title",
            title: "Título del Post",
            type: "string",
            description: "Título principal del post",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "mainImage",
            title: "Imagen Principal",
            type: "image",
            description: "Imagen de fondo del hero",
            validation: Rule => Rule.required(),
            options: {
                hotspot: true
            }
        }),
        defineField({
            name: "publishedAt",
            title: "Fecha de Publicación",
            type: "datetime",
            description: "Fecha y hora de publicación del post"
        }),
        defineField({
            name: "author",
            title: "Autor",
            type: "reference",
            to: {type: "author"},
            description: "Autor del post"
        }),
        defineField({
            name: "categories",
            title: "Categorías",
            type: "array",
            of: [{type: "reference", to: {type: "category"}}],
            description: "Categorías del post"
        }),
        ...blockPresentationFields
    ]
})
