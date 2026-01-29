import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateFactor } from "@/hooks/useFactors";
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from "lucide-react";

export function FactorForm() {
  const [name, setName] = useState("");
  const [consequence, setConsequence] = useState("");
  const createFactor = useCreateFactor();


const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !consequence) return;

    createFactor.mutate(
      { name: name.trim(), consequence: parseFloat(consequence) },
      {
        onSuccess: () => {
          setName("");
          setConsequence("");
          queryClient.invalidateQueries({queryKey:['factors']});
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Add New Factor</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 sm:flex-row sm:items-end'
        >
          <div className='flex-1 space-y-2'>
            <Label htmlFor='name'>Factor Name</Label>
            <Input
              id='name'
              placeholder='e.g., Maintenance Activity'
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className='w-full sm:w-32 space-y-2'>
            <Label htmlFor='consequence'>Consequence</Label>
            <Input
              id='consequence'
              type='number'
              placeholder='e.g., 3'
              value={consequence}
              onChange={(e) => setConsequence(e.target.value)}
              min='1'
              max='10'
              step={1}
            />
          </div>
          <Button
            type='submit'
            disabled={createFactor.isPending || !name.trim() || !consequence}
          >
            <Plus className='h-4 w-4 mr-1' />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
