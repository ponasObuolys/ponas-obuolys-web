import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/editor/RichTextEditor";
import MediaUploader from "@/components/editor/MediaUploader";
import { supabase } from "@/integrations/supabase/client";
import type { CourseFormData } from "@/types/course";

interface CourseFormProps {
  defaultValues?: CourseFormData;
  onSubmit: (data: CourseFormData, thumbnail: File | null) => Promise<void>;
  onCancel: () => void;
}

const CourseForm = ({ defaultValues, onSubmit, onCancel }: CourseFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    price: defaultValues?.price || 0,
    currency: defaultValues?.currency || "EUR",
    thumbnail: defaultValues?.thumbnail || "",
    categories: defaultValues?.categories || [],
    tags: defaultValues?.tags || [],
    start_date: defaultValues?.start_date || new Date(),
    end_date: defaultValues?.end_date || new Date(),
    status: defaultValues?.status || "upcoming"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData, newThumbnail);
      toast.success("Kursas sėkmingai išsaugotas");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Failed to save course:", error);
      toast.error("Nepavyko išsaugoti kurso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbnailUpload = (file: File) => {
    setNewThumbnail(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, thumbnail: previewUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Pavadinimas
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          disabled={isSubmitting}
          minLength={5}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Aprašymas
        </label>
        <RichTextEditor
          content={formData.description}
          onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="start_date" className="text-sm font-medium">
            Pradžios data
          </label>
          <Input
            id="start_date"
            type="datetime-local"
            value={formData.start_date.toISOString().slice(0, 16)}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              start_date: new Date(e.target.value) 
            }))}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="end_date" className="text-sm font-medium">
            Pabaigos data
          </label>
          <Input
            id="end_date"
            type="datetime-local"
            value={formData.end_date.toISOString().slice(0, 16)}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              end_date: new Date(e.target.value) 
            }))}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Kaina
          </label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="currency" className="text-sm font-medium">
            Valiuta
          </label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value as "USD" | "EUR" | "LTL" }))}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pasirinkite valiutą" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="LTL">LTL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Būsena
        </label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData(prev => ({ 
            ...prev, 
            status: value as "upcoming" | "active" | "completed" 
          }))}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pasirinkite būseną" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Būsimas</SelectItem>
            <SelectItem value="active">Vykstantis</SelectItem>
            <SelectItem value="completed">Pasibaigęs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nuotrauka
        </label>
        <MediaUploader
          onUpload={handleThumbnailUpload}
          disabled={isSubmitting}
        />
        {formData.thumbnail && (
          <img 
            src={formData.thumbnail} 
            alt="Course thumbnail preview" 
            className="mt-2 max-w-xs rounded-lg shadow-sm"
          />
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Atšaukti
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saugoma..." : "Išsaugoti"}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;