export function generateImageAlt(project: { title?: string; project?: string; materials?: string[]; techniques?: string[] }, imageIndex: number = 0): string {
  const materials = project.materials?.slice(0, 2).join(' et ') || 'bois';
  const techniques = project.techniques?.slice(0, 1)[0] || 'artisanal';
  
  const baseAlt = `Trophée ${project.title || project.project} en ${materials}`;
  
  if (imageIndex === 0) {
    return `${baseAlt} - Trophé sur mesure par Adrian Bauduin, ébéniste à Lille`;
  }
  
  return `${baseAlt} - Vue ${imageIndex + 1} - Technique ${techniques}`;
}

export function generateImageTitle(project: { title?: string; project?: string }): string {
  return `Trophée personnalisé ${project.title || project.project} - Création unique en bois sur mesure`;
}