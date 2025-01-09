import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Course, CourseFilters } from "@/types/course";

const CourseList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CourseFilters>({
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 0,
    page: 1,
    status: undefined
  });

  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ["courses", filters],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select(`
          *,
          profiles:author_id(username),
          course_categories!inner(
            categories(*)
          )
        `);

      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      if (filters.category) {
        query = query.eq("course_categories.category_id", filters.category);
      }

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.minPrice > 0) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters.maxPrice > 0) {
        query = query.lte("price", filters.maxPrice);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Course[];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Kursas sėkmingai ištrintas");
      refetch();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Nepavyko ištrinti kurso");
    }
  };

  const handleStatusChange = async (id: string, newStatus: Course['status']) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success("Kurso būsena atnaujinta");
      refetch();
    } catch (error) {
      console.error("Error updating course status:", error);
      toast.error("Nepavyko atnaujinti kurso būsenos");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kursai</h1>
        <Button 
          onClick={() => {
            console.log("Navigating to new course form");
            navigate("/admin/kursai/naujas");
          }}
          className="shadow-sm bg-primary hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Pridėti naują kursą
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Ieškoti pagal pavadinimą..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as Course['status'] | undefined }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtruoti pagal būseną" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Visos būsenos</SelectItem>
            <SelectItem value="upcoming">Būsimi</SelectItem>
            <SelectItem value="active">Vykstantys</SelectItem>
            <SelectItem value="completed">Pasibaigę</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pavadinimas</TableHead>
              <TableHead>Kaina</TableHead>
              <TableHead>Autorius</TableHead>
              <TableHead>Būsena</TableHead>
              <TableHead>Datos</TableHead>
              <TableHead className="text-right">Veiksmai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>
                  {course.price} {course.currency}
                </TableCell>
                <TableCell>{course.profiles?.username}</TableCell>
                <TableCell>
                  <Select
                    value={course.status}
                    onValueChange={(value) => handleStatusChange(course.id, value as Course['status'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Būsimas</SelectItem>
                      <SelectItem value="active">Vykstantis</SelectItem>
                      <SelectItem value="completed">Pasibaigęs</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(course.start_date).toLocaleDateString("lt-LT")} - 
                  {new Date(course.end_date).toLocaleDateString("lt-LT")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseList;