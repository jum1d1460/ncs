import {defineField, defineType} from "sanity";

export default defineType({
    name: "blockLogos",
    title: "Bloque: Logotipos",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Título del bloque",
            type: "string",
            validation: r => r.required().max(120)
        }),
        defineField({
            name: "logos",
            title: "Logotipos",
            type: "array",
            of: [{
                type: "image",
                options: { hotspot: true },
                fields: [
                    defineField({
                        name: "alt",
                        title: "Texto alternativo",
                        type: "string",
                        validation: r => r.required()
                    })
                ],
            }],
            validation: r => r.required().min(1)
        })
    ],
    preview: {
        select: { title: "title", logos: "logos" },
        prepare({ title, logos }) {
            const count = Array.isArray(logos) ? logos.length : 0;
            return { title: title || "Logotipos", subtitle: `${count} elemento(s)` };
        }
    }
});


