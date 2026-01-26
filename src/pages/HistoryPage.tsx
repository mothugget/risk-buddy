import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjects, useDeleteProject } from "@/hooks/useProjects";
import { RiskBadge } from "@/components/RiskBadge";
import { Loader2, Trash2, Eye, AlertCircle, Plus } from "lucide-react";
import { format } from "date-fns";

export default function HistoryPage() {
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Card className="max-w-3xl mx-auto">
          <CardContent className="py-8 text-center text-destructive">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            Failed to load projects. Make sure the backend is running.
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Project History</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your previous risk assessments.
            </p>
          </div>
          <Button asChild>
            <Link to="/assess">
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {!projects?.length ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No projects assessed yet.</p>
                <Button className="mt-4" asChild>
                  <Link to="/assess">Create Your First Assessment</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-lg">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Assessed {format(new Date(project.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{Math.round(project.overall_score)}</p>
                      <RiskBadge score={project.overall_score} />
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" asChild>
                        <Link to={`/results/${project.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteProject.mutate(project.id)}
                        disabled={deleteProject.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
