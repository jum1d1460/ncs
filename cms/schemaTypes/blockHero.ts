import {defineField, defineType} from "sanity";

export default defineType({
    name: "blockHero",
    title: "Hero",
    type: "object",
    fields: [
        defineField({
            name: "mainTitle",
            title: "Título Principal",
            type: "string",
            description: "Título grande y llamativo del Hero"
        }),
        defineField({
            name: "subtitle",
            title: "Subtítulo",
            type: "string",
            description: "Subtítulo que aparece debajo del título principal"
        }),
        defineField({
            name: "description",
            title: "Descripción",
            type: "text",
            description: "Descripción detallada del servicio o propuesta de valor"
        }),
        defineField({
            name: "primaryButton",
            title: "Botón Principal",
            type: "object",
            fields: [
                { name: "text", title: "Texto", type: "string" },
                { name: "url", title: "URL", type: "url" },
                { name: "variant", title: "Variante", type: "string", options: { list: ["primary", "secondary", "outline"] } }
            ]
        }),
        defineField({
            name: "secondaryButton",
            title: "Botón Secundario",
            type: "object",
            fields: [
                { name: "text", title: "Texto", type: "string" },
                { name: "url", title: "URL", type: "url" },
                { name: "variant", title: "Variante", type: "string", options: { list: ["primary", "secondary", "outline"] } }
            ]
        }),
        defineField({
            name: "backgroundImage",
            title: "Imagen de Fondo",
            type: "image",
            description: "Imagen de fondo que se extiende a toda la pantalla"
        }),
        defineField({
            name: "silhouetteImage",
            title: "Imagen de Silueta",
            type: "image",
            description: "Imagen de silueta que se posiciona en la rejilla central"
        }),
        defineField({
            name: "silhouettePosition",
            title: "Posición de la Silueta",
            type: "string",
            options: {
                list: [
                    { title: "Derecha", value: "right" },
                    { title: "Izquierda", value: "left" },
                    { title: "Centro", value: "center" }
                ]
            },
            description: "Posición de la imagen de silueta respecto a la rejilla central"
        }),
        defineField({
            name: "overlayColor",
            title: "Color de Superposición",
            type: "string",
            description: "Color de superposición sobre la imagen de fondo (formato hex, rgb, o nombre)"
        }),
        defineField({
            name: "overlayOpacity",
            title: "Opacidad de Superposición",
            type: "number",
            validation: Rule => Rule.min(0).max(1),
            description: "Opacidad de la superposición (0-1)"
        })
    ]
})