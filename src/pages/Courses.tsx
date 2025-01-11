import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { lt } from "@/i18n/lt";

type CourseStatus = 'upcoming' | 'active' | 'completed';

interface Course {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  thumbnail: string;
  status: CourseStatus;
}

const Courses = () => {
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all');

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .order('start_date', { ascending: true });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Course[];
    },
  });

  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.status]) {
      acc[course.status] = [];
    }
    acc[course.status].push(course);
    return acc;
  }, {} as Record<CourseStatus, Course[]>);

  const statusOrder: CourseStatus[] = ['upcoming', 'active', 'completed'];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kursai</h1>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as CourseStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtruoti pagal būseną" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Visi kursai</SelectItem>
            <SelectItem value="upcoming">Būsimi</SelectItem>
            <SelectItem value="active">Vykstantys</SelectItem>
            <SelectItem value="completed">Pasibaigę</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {statusOrder.map((status) => {
            const coursesInStatus = groupedCourses[status] || [];
            if (coursesInStatus.length === 0) return null;

            return (
              <div key={status} className="space-y-4">
                <h2 className="text-2xl font-semibold capitalize">
                  {status === 'upcoming' && 'Būsimi kursai'}
                  {status === 'active' && 'Vykstantys kursai'}
                  {status === 'completed' && 'Pasibaigę kursai'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesInStatus.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      {course.thumbnail && (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(course.start_date), 'yyyy-MM-dd')} - {format(new Date(course.end_date), 'yyyy-MM-dd')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="capitalize">{course.status}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;