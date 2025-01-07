import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const maxResults = 12 // Increased from 6 to 12 for better UX
    
    console.log('Fetching videos for channel:', CHANNEL_ID, 'pageToken:', pageParam)
    
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

    return new Response(
      JSON.stringify({ 
        data: videos,
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