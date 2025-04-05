import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PDFFormData } from "@/types/pdf-generator";

interface NotesSectionProps {
  formData: PDFFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function NotesSection({ formData, handleInputChange }: NotesSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea 
        id="notes" 
        name="notes"
        value={formData.notes}
        onChange={handleInputChange}
        placeholder="Enter any additional notes" 
        rows={4} 
      />
    </div>
  );
} 