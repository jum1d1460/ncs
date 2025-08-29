import {defineField, defineType} from "sanity";

export default defineType({
    name: "blockText",
    title: "Texto",
    type: "object",
    fields: [
        defineField({
            name: "content",
            title: "Contenido",
            type: "text",
        })
    ]
})