import { defineField, defineType } from "sanity";
import {blockPresentationFields} from './fields/blockPresentation'

export default defineType({
    name: "blockContact",
    title: "Bloque: Contacto",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Título",
            type: "string",
            validation: (Rule) => Rule.required().min(3)
        }),
        defineField({
            name: "subtitle",
            title: "Subtítulo",
            type: "text",
            rows: 2
        }),
        defineField({
            name: "form",
            title: "Formulario",
            type: "object",
            fields: [
                defineField({ name: "subjectPlaceholder", title: "Placeholder del asunto", type: "string" }),
                defineField({ name: "topicOptions", title: "Opciones de tipo de consulta", type: "array", of: [{ type: "string" }] }),
                defineField({ name: "submitLabel", title: "Etiqueta del botón", type: "string", initialValue: "Enviar mensaje" }),
                defineField({ name: "disclaimer", title: "Nota / Aviso bajo formulario", type: "text", rows: 3 })
            ]
        }),
        defineField({
            name: "contact",
            title: "Información de contacto",
            type: "object",
            fields: [
                defineField({ name: "phone", title: "Teléfono", type: "string" }),
                defineField({ name: "email", title: "Email", type: "string" }),
                defineField({ name: "address", title: "Dirección", type: "string" }),
                defineField({ name: "schedule", title: "Horario", type: "string" })
            ]
        }),
        defineField({
            name: "map",
            title: "Mapa",
            type: "object",
            fields: [
                defineField({ name: "embedUrl", title: "URL de iframe del mapa (https)", type: "url", validation: (Rule) => Rule.uri({ scheme: ["https"] }) }),
                defineField({ name: "title", title: "Título accesible del mapa", type: "string" })
            ]
        }),
        defineField({
            name: "theme",
            title: "Tema",
            type: "string",
            options: { list: [
                { title: "Claro", value: "light" },
                { title: "Oscuro", value: "dark" },
                { title: "Marca", value: "brand" }
            ] },
            initialValue: "light"
        })
        , ...blockPresentationFields
    ],
    preview: {
        select: { title: "title", subtitle: "subtitle" },
        prepare(selection) {
            const { title, subtitle } = selection as { title?: string; subtitle?: string };
            return { title: title || "Bloque de contacto", subtitle };
        }
    }
});


