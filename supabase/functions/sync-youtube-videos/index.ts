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
    const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    const CHANNEL_ID = Deno.env.get('YOUTUBE_CHANNEL_ID')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

    if (!API_KEY || !CHANNEL_ID || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Required environment variables are not set')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Get the latest video's publish date from our database
    const { data: latestVideo } = await supabase
      .from('youtube_videos')
      .select('published_at')
      .order('published_at', { ascending: false })
      .limit(1)
      .single()

    const publishedAfter = latestVideo?.published_at || '2020-01-01T00:00:00Z'
    console.log('Fetching videos published after:', publishedAfter)

    // Fetch new videos from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&order=date&type=video&publishedAfter=${publishedAfter}&key=${API_KEY}`,
      { method: 'GET' }
    )

    const data = await response.json()
    
    if (data.error) {
      console.error('YouTube API error:', data.error)
      throw new Error(data.error.message)
    }

    if (!data.items?.length) {
      console.log('No new videos found')
      return new Response(
        JSON.stringify({ message: 'No new videos found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${data.items.length} new videos`)

    // Prepare videos for insertion
    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      published_at: item.snippet.publishedAt,
    }))

    // Insert new videos
    const { error: upsertError } = await supabase
      .from('youtube_videos')
      .upsert(videos, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (upsertError) {
      console.error('Error upserting videos:', upsertError)
      throw upsertError
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully synced ${videos.length} videos`,
        videos 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in sync-youtube-videos:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})