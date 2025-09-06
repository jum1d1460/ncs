import {defineField, defineType} from "sanity";

export default defineType({
    name: "blockTestimonials",
    title: "Bloque: Testimonios",
    type: "object",
    fields: [
        defineField({
            name: "items",
            title: "Testimonios",
            type: "array",
            of: [{
                type: "object",
                name: "testimonialItem",
                title: "Testimonio",
                fields: [
                    defineField({
                        name: "image",
                        title: "Imagen",
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
                        validation: r => r.required()
                    }),
                    defineField({
                        name: "quote",
                        title: "Cita",
                        type: "text",
                        rows: 3,
                        validation: r => r.required().max(280)
                    }),
                    defineField({
                        name: "fullName",
                        title: "Nombre y apellidos",
                        type: "string",
                        validation: r => r.required()
                    })
                ]
            }],
            validation: r => r.required().min(1)
        })
    ],
    preview: {
        select: { items: "items" },
        prepare({ items }) {
            const count = Array.isArray(items) ? items.length : 0;
            const first = count > 0 ? items[0] : null;
            const title = first?.fullName ? `Testimonio de ${first.fullName}` : "Testimonios";
            return { title, subtitle: `${count} elemento(s)` };
        }
    }
});


