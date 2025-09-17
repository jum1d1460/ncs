import {defineField, defineType} from "sanity";
import {blockPresentationFields} from './fields/blockPresentation'

export default defineType({
    name: "serviceCarousel",
    title: "Bloque: Carrusel de servicios",
    type: "object",
    fields: [
        defineField({
            name: "subtitle",
            title: "Subtítulo",
            type: "string",
            validation: r => r.max(150),
            description: "Subtítulo opcional que aparecerá sobre el título principal"
        }),
        defineField({
            name: "title",
            title: "Título del carrusel",
            type: "string",
            validation: r => r.required().max(100),
            description: "Título que aparecerá sobre el carrusel de servicios"
        }),
        defineField({
            name: "lead",
            title: "Entradilla",
            type: "text",
            validation: r => r.max(300),
            rows: 3,
            description: "Texto de introducción que aparecerá bajo el título"
        }),
        defineField({
            name: "items",
            title: "Servicios",
            type: "array",
            of: [{ type: "reference", to: [{ type: "service" }] }],
            validation: r => r.required().min(1)
        }),
        defineField({
            name: "autoplay",
            title: "Autoplay",
            type: "boolean",
            initialValue: false
        }),
        defineField({
            name: "intervalMs",
            title: "Intervalo (ms)",
            type: "number",
            hidden: ({ parent }) => !parent?.autoplay,
            validation: r => r.custom((v, ctx) => ctx.parent?.autoplay ? (v && v > 0 ? true : "Requerido y > 0") : true),
            initialValue: 5000
        }),
        defineField({
            name: "showPrice",
            title: "Mostrar precio",
            type: "boolean",
            initialValue: true
        })
        , ...blockPresentationFields
    ],
    preview: {
        select: { title: "title", items: "items" },
        prepare({ title, items }) {
            const count = Array.isArray(items) ? items.length : 0;
            const displayTitle = title || "Carrusel de servicios";
            return { title: displayTitle, subtitle: `${count} elementos` };
        }
    }
});


