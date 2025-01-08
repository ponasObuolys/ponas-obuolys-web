import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { MediaUploader } from "@/components/editor/MediaUploader";

interface PostFormFieldsProps {
  title: string;
  content: string;
  excerpt: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onFeaturedImageChange: (value: string) => void;
}

export const PostFormFields = ({
  title,
  content,
  excerpt,
  status,
  metaTitle,
  metaDescription,
  featuredImage,
  isSubmitting,
  onTitleChange,
  onContentChange,
  onExcerptChange,
  onStatusChange,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onFeaturedImageChange,
}: PostFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Pavadinimas
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Turinys
        </label>
        <RichTextEditor content={content} onChange={onContentChange} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Pagrindinė nuotrauka
        </label>
        <MediaUploader
          value={featuredImage}
          onChange={onFeaturedImageChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="text-sm font-medium">
          Santrauka
        </label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Statusas
        </label>
        <Select value={status} onValueChange={onStatusChange} disabled={isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="Pasirinkite statusą" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Juodraštis</SelectItem>
            <SelectItem value="published">Paskelbtas</SelectItem>
            <SelectItem value="scheduled">Suplanuotas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="metaTitle" className="text-sm font-medium">
          Meta pavadinimas
        </label>
        <Input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="metaDescription" className="text-sm font-medium">
          Meta aprašymas
        </label>
        <Textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
};