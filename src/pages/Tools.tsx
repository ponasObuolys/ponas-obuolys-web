import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star } from "lucide-react";

type Category = {
  id: string;
  name: string;
  count: number;
};

type AITool = {
  id: string;
  name: string;
  description: string;
  pricing_model: "free" | "freemium" | "paid";
  is_recommended: boolean;
  special_offer: string | null;
  affiliate_link: string | null;
  thumbnail: string;
};

const Tools = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const currentPage = parseInt(searchParams.get("page") || "1");
  const selectedCategory = searchParams.get("category");
  const ITEMS_PER_PAGE = 12;

  // Fetch categories with counts
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          ai_tools (count)
        `);
      
      if (error) throw error;
      
      return data.map(cat => ({
        id: cat.id,
        name: cat.name,
        count: cat.ai_tools.length
      }));
    }
  });

  // Fetch AI tools with pagination and filtering
  const { data: toolsData, isLoading: toolsLoading } = useQuery({
    queryKey: ["tools", currentPage, selectedCategory, search],
    queryFn: async () => {
      let query = supabase
        .from("ai_tools")
        .select("*", { count: "exact" });

      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }

      if (search) {
        query = query.textSearch("search_vector", search);
      }

      const { data, error, count } = await query
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return {
        tools: data as AITool[],
        total: count || 0
      };
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  }, [search]);

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get("category") === categoryId) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  return (
    <>
      <Helmet>
        <title>AI Įrankiai | Dirbtinio intelekto įrankių katalogas</title>
        <meta name="description" content="Atraskite naudingiausius dirbtinio intelekto įrankius. Išsamus katalogas su rekomendacijomis ir specialiais pasiūlymais." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-4">
            <div className="sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Kategorijos</h2>
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {categories?.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Ieškoti įrankių..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {toolsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-[300px]" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {toolsData?.tools.map(tool => (
                    <Card key={tool.id} className="flex flex-col">
                      <CardHeader className="relative">
                        {tool.is_recommended && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-4 w-4" />
                              Rekomenduojama
                            </Badge>
                          </div>
                        )}
                        <img
                          src={tool.thumbnail}
                          alt={tool.name}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {tool.description}
                        </p>
                        {tool.special_offer && (
                          <Badge variant="destructive" className="mt-2">
                            {tool.special_offer}
                          </Badge>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <Badge>
                          {tool.pricing_model === "free"
                            ? "Nemokama"
                            : tool.pricing_model === "freemium"
                            ? "Freemium"
                            : "Mokama"}
                        </Badge>
                        {tool.affiliate_link && (
                          <a
                            href={tool.affiliate_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Išbandyti →
                          </a>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {toolsData && toolsData.total > ITEMS_PER_PAGE && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from(
                      { length: Math.ceil(toolsData.total / ITEMS_PER_PAGE) },
                      (_, i) => i + 1
                    ).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Tools;