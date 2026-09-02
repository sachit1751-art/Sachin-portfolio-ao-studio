export type PaperState =
  | 'crumpled'
  | 'opening'
  | 'unfolding'
  | 'settling'
  | 'opened';

export type PaperTheme = 'cotton' | 'kraft' | 'blueprint' | 'slate';

export interface Project {
  id: string;
  title: string;
  category: string;
  filterCategories: string[];
  year: string;
  description: string;
  longDescription?: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: { 
    name: string;
    iconName?: string;
  }[];
}

