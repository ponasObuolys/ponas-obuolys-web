import { supabase } from "@/integrations/supabase/client";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

export const fetchYouTubeVideos = async (maxResults = 6): Promise<YouTubeVideo[]> => {
  console.log('Fetching YouTube videos...');
  try {
    const { data: { data }, error } = await supabase.functions.invoke('fetch-youtube-videos', {
      body: { maxResults }
    });
    
    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};