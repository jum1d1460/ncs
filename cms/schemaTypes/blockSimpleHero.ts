import {defineField, defineType} from "sanity";
import {blockPresentationFields} from './fields/blockPresentation'

export default defineType({
    name: "blockSimpleHero",
    title: "Hero Simplificado",
    type: "object",
    description: "Hero simplificado para páginas que no sean la Home",
    fields: [
        defineField({
            name: "title",
            title: "Título",
            type: "string",
            description: "Título principal del Hero",
            validation: Rule => Rule.required()
        }),
        defineField({
            name: "subtitle",
            title: "Subtítulo",
            type: "string",
            description: "Subtítulo que aparece sobre el título (opcional)"
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
            description: "Descripción que aparece bajo el título con formato enriquecido (opcional)"
        }),
        defineField({
            name: "cta",
            title: "Botón de Acción",
            type: "object",
            description: "Botón de llamada a la acción (opcional)",
            fields: [
                { 
                    name: "text", 
                    title: "Texto del Botón", 
                    type: "string",
                    validation: Rule => Rule.required()
                },
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
                { 
                    name: "variant", 
                    title: "Variante", 
                    type: "string", 
                    options: { 
                        list: [
                            { title: "Primario", value: "primary" }, 
                            { title: "Secundario", value: "secondary" }, 
                            { title: "Outline", value: "outline" }
                        ] 
                    },
                    initialValue: "primary"
                }
            ]
        }),
        defineField({
            name: "backgroundImage",
            title: "Imagen de Fondo",
            type: "image",
            description: "Imagen de fondo que se extiende a toda la pantalla",
            validation: Rule => Rule.required(),
            options: {
                hotspot: true
            }
        }),
        ...blockPresentationFields
    ]
})
