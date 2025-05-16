
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface FoggingDialogProps {
  sensorId: string | null;
  sensorName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sensorId: string, date: string, notes: string) => void;
}

const FoggingDialog = ({
  sensorId,
  sensorName,
  isOpen,
  onClose,
  onSubmit,
}: FoggingDialogProps) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sensorId) return;
    
    if (!date) {
      toast({
        title: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(sensorId, date, notes);
      setNotes("");
      
      toast({
        title: "Fogging activity logged successfully",
        description: `Recorded fogging for ${sensorName} on ${new Date(date).toLocaleDateString()}`,
      });
    } catch (error) {
      toast({
        title: "Error logging fogging activity",
        description: "An error occurred while logging the fogging activity.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Log Fogging Activity</DialogTitle>
            <DialogDescription>
              Record when this area was treated for mosquito control.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sensor">Sensor</Label>
              <Input id="sensor" value={sensorName} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date of Fogging</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional information..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FoggingDialog;
