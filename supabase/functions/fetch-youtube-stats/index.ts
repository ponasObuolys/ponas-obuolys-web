import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const API_KEY = Deno.env.get('YOUTUBE_API_KEY')
    const CHANNEL_ID = Deno.env.get('YOUTUBE_CHANNEL_ID')

    if (!API_KEY || !CHANNEL_ID) {
      throw new Error('Required environment variables are not set')
    }

    console.log('Fetching YouTube stats for channel:', CHANNEL_ID)

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`,
      { method: 'GET' }
    )

    const data = await response.json()
    
    if (data.error) {
      console.error('YouTube API error:', data.error)
      throw new Error(data.error.message)
    }

    console.log('Successfully fetched YouTube stats')

    const stats = data.items[0]?.statistics || {
      subscriberCount: "0",
      viewCount: "0",
      videoCount: "0"
    }

    return new Response(
      JSON.stringify(stats),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in fetch-youtube-stats:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})