import { Layout } from '@/components/Layout';
import { FactorForm } from '@/components/FactorForm';
import { FactorList } from '@/components/FactorList';

export default function FactorsPage() {
  return (
    <Layout>
      <div className='max-w-3xl mx-auto space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Risk Factors</h1>
          <p className='text-muted-foreground mt-1'>
            Define the factors you'll use to assess OSS project risk.
            <br />
            Each factor needs a consequence level from 1 to 10.
          </p>
        </div>
        <FactorForm />
        <FactorList />
      </div>
    </Layout>
  );
}
