import {defineField, defineType} from "sanity";
import {blockPresentationFields} from './fields/blockPresentation'

export default defineType({
    name: "serviceCarousel",
    title: "Bloque: Carrusel de servicios",
    type: "object",
    fields: [
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
        select: { items: "items" },
        prepare({ items }) {
            const count = Array.isArray(items) ? items.length : 0;
            return { title: "Carrusel de servicios", subtitle: `${count} elementos` };
        }
    }
});


