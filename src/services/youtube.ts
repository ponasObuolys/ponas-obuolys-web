import { supabase } from "@/integrations/supabase/client";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

export interface YouTubeResponse {
  data: YouTubeVideo[];
  nextPage: string | null;
}

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const fetchYouTubeVideos = async (pageParam: string | null = null): Promise<YouTubeResponse> => {
  console.log('Fetching YouTube videos...', { pageParam });
  
  try {
    const { data: response, error } = await supabase.functions.invoke('fetch-youtube-videos', {
      body: { 
        pageParam,
        staleTime: STALE_TIME
      }
    });
    
    if (error) {
      console.error('Error fetching videos:', error);
      return { data: [], nextPage: null };
    }

    return response;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { data: [], nextPage: null };
  }
};