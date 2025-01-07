import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pageParam = null } = await req.json()
    const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    const CHANNEL_ID = Deno.env.get('YOUTUBE_CHANNEL_ID')
    const maxResults = 12

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)
    
    console.log('Checking cache for videos...')
    
    // Query cached videos
    const { data: cachedVideos, error: cacheError } = await supabase
      .from('cached_youtube_videos')
      .select('*')
      .order('published_at', { ascending: false })
      .range(pageParam ? pageParam * maxResults : 0, (pageParam ? pageParam + 1 : 1) * maxResults - 1)

    if (cacheError) {
      console.error('Error fetching cached videos:', cacheError)
    }

    // If we have cached videos and they're less than 6 hours old, return them
    if (cachedVideos && cachedVideos.length > 0) {
      const mostRecentCache = new Date(cachedVideos[0].cached_at)
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)

      if (mostRecentCache > sixHoursAgo) {
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
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // If cache is empty or old, fetch from YouTube API
    console.log('Fetching fresh videos from YouTube API')
    if (!CHANNEL_ID) {
      throw new Error('YOUTUBE_CHANNEL_ID environment variable is not set')
    }

    const pageToken = pageParam ? `&pageToken=${pageParam}` : ''
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}${pageToken}`,
      { method: 'GET' }
    )

    const data = await response.json()
    
    if (data.error) {
      console.error('YouTube API error:', data.error)
      // If API fails but we have cached data, return it even if it's old
      if (cachedVideos && cachedVideos.length > 0) {
        console.log('Returning stale cached videos due to API error')
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
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      throw new Error(data.error.message)
    }

    console.log(`Found ${data.items?.length || 0} videos`)

    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
    }))

    // Update cache with new videos
    console.log('Updating cache with new videos')
    const { error: upsertError } = await supabase
      .from('cached_youtube_videos')
      .upsert(
        videos.map(video => ({
          video_id: video.id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          published_at: video.publishedAt,
          cached_at: new Date().toISOString(),
        })),
        { onConflict: 'video_id' }
      )

    if (upsertError) {
      console.error('Error updating cache:', upsertError)
    }

    return new Response(
      JSON.stringify({ 
        data: videos,
        nextPage: data.nextPageToken || null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in fetch-youtube-videos:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})