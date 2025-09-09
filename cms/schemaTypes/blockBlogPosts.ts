import {defineField, defineType} from "sanity"
import {blockPresentationFields} from './fields/blockPresentation'

export default defineType({
    name: "blockBlogPosts",
    title: "Bloque: Artículos del blog",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Título (opcional)",
            type: "string"
        }),
        defineField({
            name: "limit",
            title: "Número de elementos",
            type: "number",
            initialValue: 6,
            validation: r => r.min(1).max(24)
        }),
        defineField({
            name: "category",
            title: "Categoría",
            type: "reference",
            to: [{ type: "category" }]
        }),
        defineField({
            name: "displayMode",
            title: "Modo de display",
            type: "string",
            options: {
                list: [
                    { title: "Rejilla", value: "grid" },
                    { title: "Carrusel", value: "carousel" }
                ]
            },
            initialValue: "grid"
        }),
        defineField({
            name: "featuredPosts",
            title: "Artículos destacados",
            type: "array",
            of: [{ type: "reference", to: [{ type: "post" }] }]
        })
        , ...blockPresentationFields
    ],
    preview: {
        select: { title: "title", mode: "displayMode", limit: "limit" },
        prepare({ title, mode, limit }) {
            const t = title || "Artículos del blog";
            const m = mode === "carousel" ? "carrusel" : "rejilla";
            const l = typeof limit === "number" ? limit : 6;
            return { title: t, subtitle: `${m} · ${l} elemento(s)` };
        }
    }
});
