import {defineField, defineType} from "sanity";

export default defineType({
    name: "blockHero",
    title: "Hero",
    type: "object",
    fields: [
        defineField({
            name: "heading", title: "Encabezado", type: "string"
        }),
        defineField({
            name: "subheading",
            title: "Subencabezado",
            type: "string"
        }),
        defineField({
            name: "image",
            title: "Imagen",
            type: "image",
        })
    ]
})