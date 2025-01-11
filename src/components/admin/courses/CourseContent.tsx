import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { CourseContent } from "@/types/course";

const CourseContentManager = () => {
  const { courseId } = useParams();
  const [uploading, setUploading] = useState(false);

  const { data: content, isLoading } = useQuery({
    queryKey: ["course-content", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_content")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      if (error) throw error;
      return data as CourseContent[];
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${courseId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("course-content")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from("course_content")
        .insert({
          course_id: courseId,
          title: file.name,
          file_path: filePath,
          content_type: file.type,
          size: file.size,
          order_index: (content?.length || 0) + 1,
        });

      if (insertError) throw insertError;
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      await supabase.storage.from("course-content").remove([filePath]);
      await supabase.from("course_content").delete().eq("id", id);
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Kurso turinys</h2>
        <Button disabled={uploading}>
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Įkeliama..." : "Įkelti turinį"}
          <Input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="video/*,application/pdf"
          />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pavadinimas</TableHead>
            <TableHead>Tipas</TableHead>
            <TableHead>Dydis</TableHead>
            <TableHead className="text-right">Veiksmai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.content_type}</TableCell>
              <TableCell>{Math.round(item.size / 1024 / 1024)} MB</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id, item.file_path)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseContentManager;