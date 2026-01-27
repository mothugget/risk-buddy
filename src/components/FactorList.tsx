import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useFactors, useUpdateFactor, useDeleteFactor } from "@/hooks/useFactors";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import type { Factor } from "@/types";

function FactorRow({ factor, totalConsequence }: { factor: Factor; totalConsequence: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(factor.name);
  const [editConsequence, setEditConsequence] = useState(factor.consequence.toString());
  const updateFactor = useUpdateFactor();
  const deleteFactor = useDeleteFactor();

  const normalizedConsequence = totalConsequence > 0 ? (factor.consequence / totalConsequence) * 100 : 0;

  const handleSave = () => {
    updateFactor.mutate(
      { id: factor.id, data: { name: editName.trim(), consequence: parseFloat(editConsequence) } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleCancel = () => {
    setEditName(factor.name);
    setEditConsequence(factor.consequence.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="flex-1"
          maxLength={100}
        />
        <Input
          type="number"
          value={editConsequence}
          onChange={(e) => setEditConsequence(e.target.value)}
          className="w-20"
          min="1"
          max="100"
        />
        <Button size="icon" variant="ghost" onClick={handleSave} disabled={updateFactor.isPending}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg">
      <div className="flex-1">
        <p className="font-medium">{factor.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={normalizedConsequence} className="h-2 flex-1" />
          <span className="text-sm text-muted-foreground w-16">
            {normalizedConsequence.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Consequence: {factor.consequence}
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => deleteFactor.mutate(factor.id)}
          disabled={deleteFactor.isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function FactorList() {
  const { data: factors, isLoading, error } = useFactors();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-destructive">
          Failed to load factors. Make sure the backend is running.
        </CardContent>
      </Card>
    );
  }

  const totalConsequence = factors?.reduce((sum, f) => sum + f.consequence, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Risk Factors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {factors?.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No factors defined yet. Add your first factor above.
          </p>
        ) : (
          factors?.map((factor) => (
            <FactorRow key={factor.id} factor={factor} totalConsequence={totalConsequence} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
