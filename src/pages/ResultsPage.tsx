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
import { RiskFont } from '@/components/ui/RiskFont';

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
  const totalConsequence = project.scores.length * 10;
  const normalisedScore=100 * project.overall_score/totalConsequence;
  const contributions = project.scores.map((score) => {
    const consequence = score.factor?.consequence || 0;

    const contribution = (score.probability * consequence) / 100;
    return {
      ...score,
      contribution,
      consequence,
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
              <RiskBadge score={normalisedScore} />
            </div>
            <div className='mt-6'>
              <Progress value={normalisedScore} className='h-3' />
              <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                <span>0 - Low Risk</span>
                <span>{totalConsequence} - High Risk</span>
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
                  <TableHead className='text-center'>Consequence</TableHead>
                  <TableHead className='text-center'>Probability</TableHead>
                  <TableHead className='text-right'>Contribution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>
                      {item.factor?.name || 'Unknown Factor'}
                    </TableCell>
                    <TableCell className='text-center text-muted-foreground'>
                    <RiskBadge score={item.consequence*10} showLabel={false}/>
                    </TableCell>
                    <TableCell className='text-center'>
                      <RiskFont score={item.probability} />
                    </TableCell>
                    <TableCell className='text-right font-medium text-muted-foreground'>
                      {item.contribution}
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
