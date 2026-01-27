import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useFactors } from "@/hooks/useFactors";
import { useCreateProject } from "@/hooks/useProjects";
import { Loader2, AlertCircle, Save } from "lucide-react";
import { RiskBadge, getRiskLevel } from "@/components/RiskBadge";

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { data: factors, isLoading, error } = useFactors();
  const createProject = useCreateProject();
  const [projectName, setProjectName] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});

  const updateScore = (factorId: string, value: number) => {
    setScores((prev) => ({ ...prev, [factorId]: value }));
  };

  // Calculate overall Consequence X score
  const calculateOverallScore = () => {
    if (!factors || factors.length === 0) return 0;
    let consequenceSum = 0;
    factors.forEach((factor) => {
      const score = scores[factor.id] ?? 0;
      consequenceSum += score * factor.consequence/100;
    });
    return consequenceSum;
  };

const totalConsequence = factors?factors.length * 10:0;

  const overallScore = calculateOverallScore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !factors?.length) return;

    const scoreData = factors.map((factor) => ({
      factor_id: factor.id,
      probability: scores[factor.id] ?? 50,
    }));
    console.log(overallScore)
    createProject.mutate(
      { name: projectName.trim(), scores: scoreData, overall_score:overallScore},
      {
        onSuccess: () => {
          navigate("/history");
        },
      }
    );
  };

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
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8 text-center text-destructive">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            Failed to load factors. Make sure the backend is running.
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (!factors?.length) {
    return (
      <Layout>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">
              No risk factors defined yet. Please add factors first.
            </p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Go to Factors
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='max-w-2xl mx-auto space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>New Assessment</h1>
          <p className='text-muted-foreground mt-1'>
            Score each factor from 0 (lowest risk) to 100 (highest risk).
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <Label htmlFor='projectName'>Project Name</Label>
                <Input
                  id='projectName'
                  placeholder='e.g., lodash, react, express'
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  maxLength={100}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Factor Scores</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {factors.map((factor) => {
                const score = scores[factor.id] ?? 0;
                const { color } = getRiskLevel(score);
                return (
                  <div key={factor.id} className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-base'>{factor.name}</Label>
                      <span className='text-lg font-semibold'>{score}</span>
                    </div>
                    <Slider
                      value={[score]}
                      onValueChange={([value]) => updateScore(factor.id, value)}
                      max={100}
                      step={1}
                      className='w-full'
                    />
                    <div className='flex justify-between text-xs text-muted-foreground'>
                      <span>Low Risk</span>
                      <span>High Risk</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className='bg-muted/50'>
            <CardContent className='py-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    Overall Risk Score
                  </p>
                  <p>
                    <span className='text-4xl font-bold'>
                      {Math.round(overallScore)}
                    </span>
                    <span className='ml-2 text-xs text-muted-foreground/70'>
                      Max score: {totalConsequence}
                    </span>
                  </p>
                </div>
                <RiskBadge score={overallScore} />
              </div>
            </CardContent>
          </Card>

          <Button
            type='submit'
            className='w-full'
            size='lg'
            disabled={!projectName.trim() || createProject.isPending}
          >
            {createProject.isPending ? (
              <Loader2 className='h-4 w-4 animate-spin mr-2' />
            ) : (
              <Save className='h-4 w-4 mr-2' />
            )}
            Save Assessment
          </Button>
        </form>
      </div>
    </Layout>
  );
}
