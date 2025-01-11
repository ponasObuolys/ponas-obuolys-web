import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const DEFAULT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pageParam = null, staleTime = DEFAULT_CACHE_DURATION } = await req.json()
    const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    const CHANNEL_ID = Deno.env.get('YOUTUBE_CHANNEL_ID')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
    const maxResults = 12

    console.log('Function invoked with params:', { pageParam, staleTime })
    console.log('Environment check:', { 
      hasApiKey: !!API_KEY, 
      hasChannelId: !!CHANNEL_ID,
      hasSupabaseUrl: !!SUPABASE_URL,
      hasSupabaseKey: !!SUPABASE_ANON_KEY
    })

    if (!CHANNEL_ID || !API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Required environment variables are not set')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
    
    console.log('Checking cache for videos...')
    
    // Query cached videos with improved indexing
    const { data: cachedVideos, error: cacheError } = await supabase
      .from('cached_youtube_videos')
      .select('*')
      .order('published_at', { ascending: false })
      .range(pageParam ? pageParam * maxResults : 0, (pageParam ? pageParam + 1 : 1) * maxResults - 1)

    if (cacheError) {
      console.error('Error fetching from cache:', cacheError)
    }

    console.log('Cache status:', {
      videosFound: cachedVideos?.length || 0,
      hasError: !!cacheError
    })

    // Check if we need to refresh cache using the provided stale time
    const oldestAllowedCache = new Date(Date.now() - staleTime)
    const needsCacheRefresh = !cachedVideos?.length || 
      (cachedVideos[0]?.cached_at && new Date(cachedVideos[0].cached_at) < oldestAllowedCache)

    console.log('Cache refresh check:', {
      needsRefresh: needsCacheRefresh,
      oldestAllowed: oldestAllowedCache.toISOString(),
      oldestCached: cachedVideos?.[0]?.cached_at
    })

    if (!needsCacheRefresh && cachedVideos?.length) {
      console.log('Returning cached videos')
      return new Response(
        JSON.stringify({
          data: cachedVideos.map(video => ({
            id: video.video_id,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            publishedAt: video.published_at,
          })),
          nextPage: cachedVideos.length === maxResults ? (pageParam ? pageParam + 1 : 1) : null,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    console.log('Cache miss or expired, fetching from YouTube API...')
    const pageToken = pageParam ? `&pageToken=${pageParam}` : ''
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}${pageToken}`
    
    console.log('Fetching from YouTube API...')
    const response = await fetch(youtubeUrl, { method: 'GET' })
    const data = await response.json()
    
    if (data.error) {
      console.error('YouTube API error:', data.error)
      // If we have cached data, return it even if expired
      if (cachedVideos?.length) {
        console.log('Returning expired cache due to API error')
        return new Response(
          JSON.stringify({
            data: cachedVideos.map(video => ({
              id: video.video_id,
              title: video.title,
              description: video.description,
              thumbnail: video.thumbnail,
              publishedAt: video.published_at,
            })),
            nextPage: cachedVideos.length === maxResults ? (pageParam ? pageParam + 1 : 1) : null,
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      }
      throw new Error(data.error.message)
    }

    console.log(`Found ${data.items?.length || 0} videos from API`)

    // Update cache with new data
    const videos = data.items.map((item: any) => ({
      video_id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      published_at: item.snippet.publishedAt,
      cached_at: new Date().toISOString(),
    }))

    if (videos.length > 0) {
      console.log('Updating cache with new videos...')
      const { error: upsertError } = await supabase
        .from('cached_youtube_videos')
        .upsert(
          videos,
          { 
            onConflict: 'video_id',
            ignoreDuplicates: false 
          }
        )

      if (upsertError) {
        console.error('Error updating cache:', upsertError)
      } else {
        console.log('Cache updated successfully')
      }
    }

    return new Response(
      JSON.stringify({ 
        data: videos.map(video => ({
          id: video.video_id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          publishedAt: video.published_at,
        })),
        nextPage: data.nextPageToken || null,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in fetch-youtube-videos:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})