-- Enable the required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the cron job to run every hour
SELECT cron.schedule(
  'sync-youtube-videos-hourly',
  '0 * * * *',  -- Run at minute 0 of every hour
  $$
  SELECT net.http_post(
    url:='https://ivwmiwagadrjnvudagio.supabase.co/functions/v1/sync-youtube-videos',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) AS request_id;
  $$
);