import type { ArtistStyle, ArtStyle } from '../types/styles';

export const artistStyles: ArtistStyle[] = [
  { id: 'vangogh', label: 'וינסנט ואן גוך', prompt: 'in the style of Van Gogh, post-impressionist, bold brushstrokes, vibrant colors, swirling patterns' },
  { id: 'picasso', label: 'פבלו פיקאסו', prompt: 'in the style of Picasso, cubist, geometric shapes, abstract forms, multiple perspectives' },
  { id: 'dali', label: 'סלבדור דאלי', prompt: 'in the style of Salvador Dali, surrealist, dreamlike quality, melting objects, symbolic elements' },
  { id: 'monet', label: 'קלוד מונה', prompt: 'in the style of Claude Monet, impressionist, soft light, atmospheric effects, natural scenes' },
  { id: 'davinci', label: "לאונרדו דה וינצ'י", prompt: 'in the style of Leonardo da Vinci, Renaissance, sfumato technique, realistic details' },
  { id: 'rembrandt', label: 'רמברנדט', prompt: 'in the style of Rembrandt, Dutch Golden Age, dramatic lighting, rich shadows, emotional depth' },
  { id: 'kahlo', label: 'פרידה קאלו', prompt: 'in the style of Frida Kahlo, Mexican folk art, bold colors, symbolic elements, self-portrait style' },
  { id: 'klimt', label: 'גוסטב קלימט', prompt: 'in the style of Gustav Klimt, Art Nouveau, decorative patterns, gold leaf effect, ornate details' },
  { id: 'warhol', label: 'אנדי וורהול', prompt: 'in the style of Andy Warhol, pop art, bold colors, repetitive patterns, screen print effect' },
  { id: 'munch', label: 'אדוארד מונק', prompt: 'in the style of Edvard Munch, expressionist, emotional intensity, flowing lines, psychological depth' },
  // New Artist Styles
  { id: 'michelangelo', label: 'מיכלאנג׳לו', prompt: 'in the style of Michelangelo, High Renaissance, sculptural forms, dramatic poses, divine subjects' },
  { id: 'vermeer', label: 'יוהנס ורמיר', prompt: 'in the style of Vermeer, Dutch Golden Age, intimate scenes, soft light, detailed realism' },
  { id: 'matisse', label: 'אנרי מאטיס', prompt: 'in the style of Matisse, Fauvism, bold colors, decorative patterns, simplified forms' },
  { id: 'kandinsky', label: 'וסילי קנדינסקי', prompt: 'in the style of Kandinsky, abstract expressionism, geometric shapes, musical rhythm, vibrant colors' },
  { id: 'chagall', label: 'מארק שאגאל', prompt: 'in the style of Chagall, modernist, dreamlike scenes, floating figures, vibrant colors' },
  { id: 'hokusai', label: 'קצושיקה הוקוסאי', prompt: 'in the style of Hokusai, Japanese woodblock, wave patterns, detailed landscapes, traditional techniques' },
  { id: 'rothko', label: 'מארק רות׳קו', prompt: 'in the style of Rothko, color field painting, large blocks of color, emotional depth, minimalist' },
  { id: 'bosch', label: 'הירונימוס בוש', prompt: 'in the style of Hieronymus Bosch, medieval fantasy, detailed scenes, symbolic creatures, surreal elements' },
  { id: 'cezanne', label: 'פול סזאן', prompt: 'in the style of Cezanne, post-impressionist, geometric forms, multiple perspectives, natural scenes' },
  { id: 'mondrian', label: 'פיט מונדריאן', prompt: 'in the style of Mondrian, De Stijl, geometric abstraction, primary colors, black lines' }
];

export const artStyles: ArtStyle[] = [
  { id: 'impressionism', label: 'אימפרסיוניזם', prompt: 'impressionist style, loose brushwork, light effects, outdoor scenes' },
  { id: 'cubism', label: 'קוביזם', prompt: 'cubist style, geometric shapes, multiple viewpoints, fragmented forms' },
  { id: 'surrealism', label: 'סוריאליזם', prompt: 'surrealist style, dreamlike imagery, symbolic objects, unconscious elements' },
  { id: 'minimalism', label: 'מינימליזם', prompt: 'minimalist style, simple forms, limited colors, clean lines' },
  { id: 'abstract', label: 'אבסטרקט', prompt: 'abstract art style, non-representational, pure form and color' },
  { id: 'popart', label: 'פופ ארט', prompt: 'pop art style, bold colors, popular culture, commercial imagery' },
  { id: 'baroque', label: 'בארוק', prompt: 'baroque style, dramatic lighting, rich details, emotional intensity' },
  { id: 'renaissance', label: 'רנסאנס', prompt: 'Renaissance style, classical harmony, perspective, naturalism' },
  { id: 'artnouveau', label: 'אר נובו', prompt: 'Art Nouveau style, organic forms, decorative patterns, flowing lines' },
  { id: 'expressionism', label: 'אקספרסיוניזם', prompt: 'expressionist style, emotional intensity, distorted forms, bold colors' },
  // New Art Styles
  { id: 'pointillism', label: 'פוינטיליזם', prompt: 'pointillist style, dots of pure color, optical mixing, detailed patterns' },
  { id: 'artdeco', label: 'אר דקו', prompt: 'Art Deco style, geometric patterns, luxury, streamlined forms, bold colors' },
  { id: 'bauhaus', label: 'באוהאוס', prompt: 'Bauhaus style, functional design, geometric forms, primary colors' },
  { id: 'futurism', label: 'פוטוריזם', prompt: 'futurist style, movement, speed, modern technology, dynamic forms' },
  { id: 'symbolism', label: 'סימבוליזם', prompt: 'symbolist style, mystical themes, dream imagery, emotional depth' },
  { id: 'ukiyoe', label: 'אוקיו-אה', prompt: 'Ukiyo-e style, Japanese woodblock prints, flat colors, detailed patterns' },
  { id: 'constructivism', label: 'קונסטרוקטיביזם', prompt: 'constructivist style, geometric shapes, propaganda art, bold typography' },
  { id: 'rococo', label: 'רוקוקו', prompt: 'Rococo style, ornate decoration, pastel colors, light and playful themes' },
  { id: 'gothic', label: 'גותי', prompt: 'Gothic style, medieval architecture, religious themes, dramatic lighting' },
  { id: 'neoclassicism', label: 'ניאו-קלאסיציזם', prompt: 'neoclassical style, ancient Greek and Roman influence, idealized forms' }
];

export type StyleOption = {
  value: string;
  label: string;
  category: 'artist' | 'art';
  prompt: string;
};

export function getAllStyles(): StyleOption[] {
  return [
    ...artistStyles.map(style => ({
      value: style.id,
      label: style.label,
      category: 'artist' as const,
      prompt: style.prompt
    })),
    ...artStyles.map(style => ({
      value: style.id,
      label: style.label,
      category: 'art' as const,
      prompt: style.prompt
    }))
  ];
}

export function getStyleById(id: string): StyleOption | undefined {
  return getAllStyles().find(style => style.value === id);
}