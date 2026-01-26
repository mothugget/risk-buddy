import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProject } from '@/hooks/useProjects';
import { RiskBadge, getRiskLevel } from '@/components/RiskBadge';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, error } = useProject(id || '');

  if (isLoading) {
    return (
      <Layout>
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <Card className='max-w-3xl mx-auto'>
          <CardContent className='py-8 text-center'>
            <AlertCircle className='h-8 w-8 mx-auto mb-2 text-destructive' />
            <p className='text-destructive'>Failed to load project details.</p>
            <Button className='mt-4' asChild>
              <Link to='/history'>Back to History</Link>
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  // Calculate factor contributions
  const totalWeight = project.scores.reduce(
    (sum, s) => sum + (s.factor?.weight || 0),
    0
  );
  const contributions = project.scores.map((score) => {
    const weight = score.factor?.weight || 0;
    const normalizedWeight = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
    const contribution = (score.score * normalizedWeight) / 100;
    return {
      ...score,
      normalizedWeight,
      contribution,
    };
  });

  const { color } = getRiskLevel(project.overall_score);

  return (
    <Layout>
      <div className='max-w-3xl mx-auto space-y-6'>
        <Button variant='ghost' asChild className='-ml-2'>
          <Link to='/history'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to History
          </Link>
        </Button>

        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>{project.name}</h1>
            <p className='text-muted-foreground mt-1'>
              Assessed on {format(new Date(project.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        <Card className={`border-2 ${color.replace('bg-', 'border-')}`}>
          <CardContent className='py-8'>
            <div className='text-center'>
              <p className='text-sm text-muted-foreground mb-2'>
                Overall Risk Score
              </p>
              <p className='text-6xl font-bold mb-4'>
                {Math.round(project.overall_score)}
              </p>
              <RiskBadge score={project.overall_score} />
            </div>
            <div className='mt-6'>
              <Progress value={project.overall_score} className='h-3' />
              <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                <span>0 - Low Risk</span>
                <span>100 - High Risk</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factor</TableHead>
                  <TableHead className='text-center'>Score</TableHead>
                  <TableHead className='text-center'>Weight</TableHead>
                  <TableHead className='text-right'>Contribution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>
                      {item.factor?.name || 'Unknown Factor'}
                    </TableCell>
                    <TableCell className='text-center'>
                      <RiskBadge score={item.score} showLabel={false} />
                    </TableCell>
                    <TableCell className='text-center text-muted-foreground'>
                      {item.normalizedWeight.toFixed(1)}%
                    </TableCell>
                    <TableCell className='text-right font-medium'>
                      <RiskBadge
                        score={item.contribution.toFixed(1)}
                        showLabel={false}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
