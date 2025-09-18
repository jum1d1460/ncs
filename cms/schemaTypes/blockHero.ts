import {defineField, defineType} from "sanity";
import {blockPresentationFields} from './fields/blockPresentation'

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
            type: "array",
            of: [
                {
                    title: "Block",
                    type: "block",
                    styles: [
                        {title: "Normal", value: "normal"},
                        {title: "H3", value: "h3"},
                        {title: "H4", value: "h4"}
                    ],
                    lists: [
                        {title: "Bullet", value: "bullet"},
                        {title: "Number", value: "number"}
                    ],
                    marks: {
                        decorators: [
                            {title: "Strong", value: "strong"},
                            {title: "Emphasis", value: "em"},
                            {title: "Code", value: "code"}
                        ],
                        annotations: [
                            {
                                title: "URL",
                                name: "link",
                                type: "object",
                                fields: [
                                    {
                                        title: "URL",
                                        name: "href",
                                        type: "url"
                                    }
                                ]
                            }
                        ]
                    }
                }
            ],
            description: "Descripción detallada del servicio o propuesta de valor con formato enriquecido"
        }),
        defineField({
            name: "primaryButton",
            title: "Botón Principal",
            type: "object",
            description: "Botón principal del Hero (opcional)",
            fields: [
                { name: "text", title: "Texto", type: "string", validation: Rule => Rule.required() },
                { 
                    name: "linkType", 
                    title: "Tipo de Enlace", 
                    type: "string", 
                    options: { 
                        list: [
                            { title: "URL Externa", value: "external" },
                            { title: "Página del Sitio", value: "internal" }
                        ] 
                    },
                    initialValue: "external"
                },
                { 
                    name: "url", 
                    title: "URL Externa", 
                    type: "url",
                    hidden: ({parent}) => parent?.linkType !== "external"
                },
                { 
                    name: "internalPage", 
                    title: "Página del Sitio", 
                    type: "reference",
                    to: {type: "page"},
                    hidden: ({parent}) => parent?.linkType !== "internal"
                },
                { name: "variant", title: "Variante", type: "string", options: { list: ["primary", "secondary", "outline"] }, initialValue: "primary" }
            ]
        }),
        defineField({
            name: "secondaryButton",
            title: "Botón Secundario",
            type: "object",
            description: "Botón secundario del Hero (opcional)",
            fields: [
                { name: "text", title: "Texto", type: "string", validation: Rule => Rule.required() },
                { 
                    name: "linkType", 
                    title: "Tipo de Enlace", 
                    type: "string", 
                    options: { 
                        list: [
                            { title: "URL Externa", value: "external" },
                            { title: "Página del Sitio", value: "internal" }
                        ] 
                    },
                    initialValue: "external"
                },
                { 
                    name: "url", 
                    title: "URL Externa", 
                    type: "url",
                    hidden: ({parent}) => parent?.linkType !== "external"
                },
                { 
                    name: "internalPage", 
                    title: "Página del Sitio", 
                    type: "reference",
                    to: {type: "page"},
                    hidden: ({parent}) => parent?.linkType !== "internal"
                },
                { name: "variant", title: "Variante", type: "string", options: { list: ["primary", "secondary", "outline"] }, initialValue: "secondary" }
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
            name: "overlaySettings",
            title: "Configuración del Overlay",
            type: "object",
            description: "Configuración del overlay y sombras sobre la imagen de fondo",
            fields: [
                {
                    name: "overlayType",
                    title: "Tipo de Overlay",
                    type: "string",
                    options: {
                        list: [
                            { title: "Degradado Radial", value: "radial" },
                            { title: "Degradado Lineal", value: "linear" },
                            { title: "Color Sólido", value: "solid" },
                            { title: "Sin Overlay", value: "none" }
                        ]
                    },
                    initialValue: "radial"
                },
                {
                    name: "overlayColor",
                    title: "Color del Overlay",
                    type: "string",
                    description: "Color principal del overlay (formato hex, rgb, o nombre)",
                    initialValue: "#1e3a8a"
                },
                {
                    name: "overlayOpacity",
                    title: "Opacidad del Color Principal",
                    type: "number",
                    validation: Rule => Rule.min(0).max(1),
                    description: "Opacidad del color principal (0-1)",
                    initialValue: 0.8
                },
                {
                    name: "secondaryColor",
                    title: "Color Secundario",
                    type: "string",
                    description: "Color secundario para degradados (formato hex, rgb, o nombre)",
                    initialValue: "#000000"
                },
                {
                    name: "secondaryOpacity",
                    title: "Opacidad del Color Secundario",
                    type: "number",
                    validation: Rule => Rule.min(0).max(1),
                    description: "Opacidad del color secundario (0-1)",
                    initialValue: 0.6
                },
                {
                    name: "gradientDirection",
                    title: "Dirección del Degradado",
                    type: "string",
                    options: {
                        list: [
                            { title: "Arriba", value: "to top" },
                            { title: "Abajo", value: "to bottom" },
                            { title: "Izquierda", value: "to left" },
                            { title: "Derecha", value: "to right" },
                            { title: "Diagonal Superior Derecha", value: "to top right" },
                            { title: "Diagonal Superior Izquierda", value: "to top left" },
                            { title: "Diagonal Inferior Derecha", value: "to bottom right" },
                            { title: "Diagonal Inferior Izquierda", value: "to bottom left" }
                        ]
                    },
                    initialValue: "to bottom",
                    hidden: ({parent}) => parent?.overlayType !== "linear"
                },
                {
                    name: "radialPosition",
                    title: "Posición del Degradado Radial",
                    type: "string",
                    options: {
                        list: [
                            { title: "Centro", value: "center" },
                            { title: "Superior Izquierda", value: "top left" },
                            { title: "Superior Derecha", value: "top right" },
                            { title: "Inferior Izquierda", value: "bottom left" },
                            { title: "Inferior Derecha", value: "bottom right" }
                        ]
                    },
                    initialValue: "center",
                    hidden: ({parent}) => parent?.overlayType !== "radial"
                },
                {
                    name: "shadowIntensity",
                    title: "Intensidad de la Sombra",
                    type: "string",
                    options: {
                        list: [
                            { title: "Suave", value: "soft" },
                            { title: "Media", value: "medium" },
                            { title: "Fuerte", value: "strong" },
                            { title: "Sin Sombra", value: "none" }
                        ]
                    },
                    initialValue: "medium"
                }
            ]
        })
        , ...blockPresentationFields
    ]
})