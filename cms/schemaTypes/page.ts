import {defineField, defineType, defineArrayMember} from "sanity";

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
        defineField(({
            name: "blocks",
            title: "Bloques",
            type: "array",
            of: [
                { type: "blockHero"},
                { type: "blockContentSection"},
                { type: "blockImage"},
                { type: "serviceBlock"},
                { type: "serviceCarousel"},
                { type: "blockTestimonials"},
                { type: "blockLogos"},
                { type: "blockBlogPosts"},
                { type: "blockContact"}
            ]
        }) as any)
    ]
});