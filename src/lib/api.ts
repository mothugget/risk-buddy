import type {
  Factor,
  Project,
  ProjectWithScores,
  CreateFactorInput,
  UpdateFactorInput,
  CreateProjectInput,
} from "@/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// Factors API
export const factorsApi = {
  getAll: () => fetchApi<Factor[]>("/factors"),
  
  create: (data: CreateFactorInput) =>
    fetchApi<Factor>("/factors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: UpdateFactorInput) =>
    fetchApi<Factor>(`/factors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchApi<void>(`/factors/${id}`, {
      method: "DELETE",
    }),
};

// Projects API
export const projectsApi = {
  getAll: () => fetchApi<ProjectWithScores[]>("/projects"),
  
  getById: (id: string) => fetchApi<ProjectWithScores>(`/projects/${id}`),
  
  create: (data: CreateProjectInput) =>
    fetchApi<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchApi<void>(`/projects/${id}`, {
      method: "DELETE",
    }),
};
