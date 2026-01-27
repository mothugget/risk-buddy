export interface Factor {
  id: string;
  name: string;
  consequence: number;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
  overall_score: number;
}

export interface Score {
  id: string;
  project_id: string;
  factor_id: string;
  score: number;
  created_at: string;
}

export interface ProjectWithScores extends Project {
  scores: (Score & { factor: Factor })[];
  overall_score: number;
}

export interface CreateFactorInput {
  name: string;
  consequence: number;
}

export interface UpdateFactorInput {
  name?: string;
  consequence?: number;
}

export interface CreateProjectInput {
  name: string;
  overall_score: number;
  scores: { factor_id: string; score: number }[];
}
