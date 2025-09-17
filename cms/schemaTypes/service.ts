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
            name: "duration",
            title: "Duración",
            type: "object",
            fields: [
                defineField({
                    name: "mode",
                    title: "Modo",
                    type: "string",
                    options: {
                        list: [
                            { title: "Fijo", value: "fixed" },
                            { title: "Intervalo", value: "range" }
                        ],
                        layout: "radio"
                    },
                    validation: r => r.required()
                }),
                defineField({
                    name: "value",
                    title: "Minutos",
                    type: "number",
                    hidden: ({ parent }) => parent?.mode !== "fixed",
                    validation: r => r.custom((value, ctx) => {
                        if (ctx.parent?.mode === "fixed") {
                            return typeof value === "number" && value >= 0 ? true : "Requerido y ≥ 0";
                        }
                        return value === undefined || value === null ? true : "No debe establecerse en modo intervalo";
                    })
                }),
                defineField({
                    name: "min",
                    title: "Min (min)",
                    type: "number",
                    hidden: ({ parent }) => parent?.mode !== "range",
                    validation: r => r.custom((value, ctx) => {
                        if (ctx.parent?.mode === "range") {
                            return typeof value === "number" && value >= 0 ? true : "Requerido y ≥ 0";
                        }
                        return value === undefined || value === null ? true : "No debe establecerse en modo fijo";
                    })
                }),
                defineField({
                    name: "max",
                    title: "Max (min)",
                    type: "number",
                    hidden: ({ parent }) => parent?.mode !== "range",
                    validation: r => r.custom((value, ctx) => {
                        if (ctx.parent?.mode === "range") {
                            const min = ctx.parent?.min;
                            if (typeof value !== "number" || value < 0) return "Requerido y ≥ 0";
                            if (typeof min === "number" && value < min) return "Debe ser ≥ Min";
                            return true;
                        }
                        return value === undefined || value === null ? true : "No debe establecerse en modo fijo";
                    })
                })
            ]
        }),
        defineField({
            name: "price",
            title: "Precio",
            type: "object",
            fields: [
                defineField({
                    name: "mode",
                    title: "Modo",
                    type: "string",
                    options: {
                        list: [
                            { title: "Fijo", value: "fixed" },
                            { title: "Intervalo", value: "range" }
                        ],
                        layout: "radio"
                    },
                    validation: r => r.required()
                }),
                defineField({
                    name: "value",
                    title: "Importe (€)",
                    type: "number",
                    hidden: ({ parent }) => parent?.mode !== "fixed",
                    validation: r => r.custom((value, ctx) => {
                        if (ctx.parent?.mode === "fixed") {
                            return typeof value === "number" && value >= 0 ? true : "Requerido y ≥ 0";
                        }
                        return value === undefined || value === null ? true : "No debe establecerse en modo intervalo";
                    })
                }),
                defineField({
                    name: "min",
                    title: "Min (€)",
                    type: "number",
                    hidden: ({ parent }) => parent?.mode !== "range",
                    validation: r => r.custom((value, ctx) => {
                        if (ctx.parent?.mode === "range") {
                            return typeof value === "number" && value >= 0 ? true : "Requerido y ≥ 0";
                        }
                        return value === undefined || value === null ? true : "No debe establecerse en modo fijo";
                    })
                }),
                defineField({
                    name: "max",
                    title: "Max (€)",
                    type: "number",
                    hidden: ({ parent }) => parent?.mode !== "range",
                    validation: r => r.custom((value, ctx) => {
                        if (ctx.parent?.mode === "range") {
                            const min = ctx.parent?.min;
                            if (typeof value !== "number" || value < 0) return "Requerido y ≥ 0";
                            if (typeof min === "number" && value < min) return "Debe ser ≥ Min";
                            return true;
                        }
                        return value === undefined || value === null ? true : "No debe establecerse en modo fijo";
                    })
                }),
                defineField({
                    name: "currency",
                    title: "Moneda",
                    type: "string",
                    initialValue: "EUR"
                })
            ]
        }),
        defineField({
            name: "availability",
            title: "Disponibilidad",
            type: "object",
            fields: [
                defineField({
                    name: "online",
                    title: "Disponible online",
                    type: "boolean",
                    initialValue: false
                }),
                defineField({
                    name: "presencial",
                    title: "Disponible presencial",
                    type: "boolean",
                    initialValue: false
                })
            ],
            validation: r => r.custom((value) => {
                if (!value) return "Requerido";
                if (!value.online && !value.presencial) {
                    return "Debe estar disponible al menos online o presencial";
                }
                return true;
            })
        }),
        defineField({
            name: "bulletPoints",
            title: "Puntos destacados",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({
                            name: "text",
                            title: "Texto",
                            type: "string",
                            validation: r => r.required().max(100)
                        })
                    ],
                    preview: {
                        select: { text: "text" },
                        prepare({ text }) {
                            return { title: text || "Punto destacado" };
                        }
                    }
                }
            ],
            validation: r => r.max(6),
            options: {
                sortable: true
            }
        }),
        defineField({
            name: "url",
            title: "Enlace del servicio",
            type: "url",
            validation: r => r.uri({ scheme: ["http", "https"] })
        }),
        defineField({
            name: "weight",
            title: "Peso (orden)",
            type: "number",
            initialValue: 100,
            validation: r => r.min(0)
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
        select: { title: "title", priceMode: "price.mode", priceValue: "price.value", priceMin: "price.min", priceMax: "price.max" },
        prepare({ title, priceMode, priceValue, priceMin, priceMax }) {
            let subtitle = "";
            if (priceMode === "fixed" && typeof priceValue === "number") {
                subtitle = `${priceValue} €`;
            } else if (priceMode === "range" && typeof priceMin === "number" && typeof priceMax === "number") {
                subtitle = `${priceMin}–${priceMax} €`;
            } else {
                subtitle = "Sin precio";
            }
            return { title, subtitle };
        }
    }
});


