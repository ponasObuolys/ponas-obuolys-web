import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface YouTubeStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

const fetchYouTubeStats = async (): Promise<YouTubeStats> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-youtube-stats');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching YouTube stats:', error);
    throw error;
  }
};

export const useYoutubeStats = () => {
  return useQuery({
    queryKey: ['youtubeStats'],
    queryFn: fetchYouTubeStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};