import {defineField, defineType} from "sanity";

export default defineType({
    name: "service",
    title: "Servicio",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Título",
            type: "string",
            validation: r => r.required()
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title", maxLength: 96 }
        }),
        defineField({
            name: "durationMinutes",
            title: "Duración (minutos)",
            type: "number",
            validation: r => r.required().integer().positive()
        }),
        defineField({
            name: "priceType",
            title: "Tipo de precio",
            type: "string",
            options: {
                list: [
                    { title: "Fijo", value: "fixed" },
                    { title: "A consultar", value: "consult" }
                ]
            },
            validation: r => r.required()
        }),
        defineField({
            name: "price",
            title: "Precio (€)",
            type: "number",
            hidden: ({ parent }) => parent?.priceType !== "fixed",
            validation: r => r.custom((value, ctx) => {
                if (ctx.parent?.priceType === "fixed") {
                    return value && value > 0 ? true : "Requerido y > 0";
                }
                return value ? "No debe establecerse cuando el precio es 'A consultar'" : true;
            })
        }),
        defineField({
            name: "shortDescription",
            title: "Descripción corta",
            type: "text",
            rows: 3,
            validation: r => r.required().max(200)
        }),
        defineField({
            name: "longDescription",
            title: "Descripción larga",
            type: "array",
            of: [{ type: "block" }],
            validation: r => r.required().min(1)
        }),
        defineField({
            name: "cardImage",
            title: "Imagen (card)",
            type: "image",
            options: { hotspot: true },
            fields: [
                defineField({
                    name: "alt",
                    title: "Alt",
                    type: "string",
                    validation: r => r.required()
                })
            ],
            validation: r => r.required()
        }),
        defineField({
            name: "blockImage",
            title: "Imagen (bloque)",
            type: "image",
            options: { hotspot: true },
            fields: [
                defineField({
                    name: "alt",
                    title: "Alt",
                    type: "string",
                    validation: r => r.required()
                })
            ],
            validation: r => r.required()
        })
    ],
    preview: {
        select: { title: "title", priceType: "priceType", price: "price" },
        prepare({ title, priceType, price }) {
            const subtitle = priceType === "fixed" ? `${price} €` : "A consultar";
            return { title, subtitle };
        }
    }
});


