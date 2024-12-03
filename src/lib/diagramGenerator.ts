import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    htmlLabels: true,
    curve: 'basis'
  }
});

export async function generateFlowchart(definition: string): Promise<string> {
  try {
    const { svg } = await mermaid.render('diagram', definition);
    return svg;
  } catch (error) {
    console.error('Failed to generate diagram:', error);
    throw new Error('שגיאה ביצירת התרשים');
  }
}

export async function generateSequenceDiagram(definition: string): Promise<string> {
  try {
    const { svg } = await mermaid.render('sequence', definition);
    return svg;
  } catch (error) {
    console.error('Failed to generate sequence diagram:', error);
    throw new Error('שגיאה ביצירת תרשים הרצף');
  }
}

export async function generateClassDiagram(definition: string): Promise<string> {
  try {
    const { svg } = await mermaid.render('class', definition);
    return svg;
  } catch (error) {
    console.error('Failed to generate class diagram:', error);
    throw new Error('שגיאה ביצירת תרשים המחלקות');
  }
}