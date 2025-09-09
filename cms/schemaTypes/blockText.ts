import {defineField, defineType} from "sanity";
import {blockPresentationFields} from './fields/blockPresentation'

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
        , ...blockPresentationFields
    ]
})