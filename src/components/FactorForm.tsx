import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateFactor } from "@/hooks/useFactors";
import { Plus } from "lucide-react";

export function FactorForm() {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const createFactor = useCreateFactor();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !weight) return;

    createFactor.mutate(
      { name: name.trim(), weight: parseFloat(weight) },
      {
        onSuccess: () => {
          setName("");
          setWeight("");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add New Factor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="name">Factor Name</Label>
            <Input
              id="name"
              placeholder="e.g., Maintenance Activity"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="w-full sm:w-32 space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g., 25"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="1"
              max="100"
            />
          </div>
          <Button type="submit" disabled={createFactor.isPending || !name.trim() || !weight}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
