import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AiToolsGrid } from "@/components/ai-tools/AiToolsGrid";
import { AiToolsFilters } from "@/components/ai-tools/AiToolsFilters";
import { useAiTools } from "@/hooks/useAiTools";
import { AiToolForm } from "@/components/ai-tools/AiToolForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useUserRole } from "@/hooks/useUserRole";
import type { AiToolsFilters as AiToolsFiltersType } from "@/types/ai-tools";
import type { AiTool } from "@/types/ai-tools";

export default function Irankiai() {
  const [filters, setFilters] = useState<AiToolsFiltersType>({
    search: "",
    pricing: "all",
    categoryId: null,
    category: "all"
  });
  
  const { data: tools, isLoading } = useAiTools(filters);
  const session = useSession();
  const { role } = useUserRole();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<AiTool | null>(null);

  const handleEditTool = (tool: AiTool) => {
    setSelectedTool(tool);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTool(null);
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dirbtinio intelekto įrankiai</h1>
        {session && role === "admin" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Pridėti įrankį
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <AiToolForm 
                onSuccess={handleCloseDialog} 
                initialData={selectedTool || undefined}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <AiToolsFilters
        filters={filters}
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[300px] bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <AiToolsGrid 
          tools={tools || []} 
          onEdit={session && role === "admin" ? handleEditTool : undefined}
        />
      )}
    </div>
  );
}