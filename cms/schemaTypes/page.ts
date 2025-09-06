import {defineField, defineType} from "sanity";

export default defineType({
    name: "page",
    title: "Página",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Título",
            type: "string",
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
            }
        }),
        defineField({
            name: "blocks",
            title: "Bloques",
            type: "array",
            of: [
                { type: "blockHero"},
                { type: "blockText"},
                { type: "serviceBlock"},
                { type: "serviceCarousel"},
                { type: "blockTestimonials"},
                { type: "blockLogos"}
            ]
        })
    ]
});