import {defineField, defineType} from "sanity";
import {blockPresentationFields} from './fields/blockPresentation'

export default defineType({
    name: "serviceBlock",
    title: "Bloque: Servicio",
    type: "object",
    fields: [
        defineField({
            name: "service",
            title: "Servicio",
            type: "reference",
            to: [{ type: "service" }],
            validation: r => r.required()
        }),
        defineField({
            name: "variant",
            title: "Variante",
            type: "string",
            options: {
                list: [
                    { title: "Card", value: "card" },
                    { title: "Detallado", value: "detailed" }
                ]
            },
            initialValue: "card"
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
        select: { title: "service.title", variant: "variant" },
        prepare({ title, variant }) {
            return { title: title ?? "Servicio", subtitle: `Variante: ${variant ?? "card"}` };
        }
    }
});


