// Función para convertir contenido de Sanity (Portable Text) a HTML
export function portableTextToHtml(blocks: any): string {
  // Verificar que blocks existe y es un array
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return '';
  
  return blocks.map(block => {
    if (block._type === 'block' && block.children) {
      const text = block.children.map((child: any) => {
        let content = child.text;
        
        // Aplicar decoradores (strong, em, code) primero
        if (child.marks) {
          child.marks.forEach((mark: string) => {
            switch (mark) {
              case 'strong':
                content = `<strong>${content}</strong>`;
                break;
              case 'em':
                content = `<em>${content}</em>`;
                break;
              case 'code':
                content = `<code>${content}</code>`;
                break;
            }
          });
        }
        
        // Aplicar enlaces después de los decoradores
        if (child.marks && block.markDefs) {
          child.marks.forEach((mark: string) => {
            const markDef = block.markDefs.find((def: any) => def._key === mark);
            if (markDef && markDef._type === 'link' && markDef.href) {
              content = `<a href="${markDef.href}" class="text-blue-300 hover:text-blue-200 underline" target="_blank" rel="noopener noreferrer">${content}</a>`;
            }
          });
        }
        
        return content;
      }).join('');
      
      // Aplicar estilos de párrafo
      switch (block.style) {
        case 'h3':
          return `<h3 class="text-xl font-semibold mb-2">${text}</h3>`;
        case 'h4':
          return `<h4 class="text-lg font-medium mb-2">${text}</h4>`;
        case 'normal':
        default:
          return `<p class="mb-3">${text}</p>`;
      }
    }
    return '';
  }).join('');
}
