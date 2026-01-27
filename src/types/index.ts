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
  scores?: Score[];
  overall_score?: number;
}

export interface Score {
  id: string;
  project_id: string;
  factor_id: string;
  score: number;
  factor?: Factor;
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

export interface FactorApi {
  id: string;
  name: string;
 consequence: string | number;
  created_at: string;
}


export interface ProjectApi {
  id: string;
  name: string;
  created_at: string;
  scores?: ScoreApi[];
  overall_score?: string | number;
}
export interface ScoreApi {
  id: string;
  project_id: string;
  factor_id: string;
  score: string | number;
  factor?: FactorApi;
}