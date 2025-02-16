import express from 'express';
import cors from 'cors';
import { generateRSSFeed } from './src/utils/rssGenerator';
import { generateSitemap } from './src/utils/sitemapGenerator';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Sample data - replace with your actual data source
const samplePosts = [
  {
    title: "Pirmas įrašas",
    description: "Aprašymas pirmo įrašo",
    link: "https://your-domain.com/posts/1",
    pubDate: new Date(),
    author: "Autorius"
  }
];

app.get('/rss.xml', (req, res) => {
  const feed = generateRSSFeed({
    title: "Ponas Obuolys",
    description: "Jūsų svetainės aprašymas",
    link: "https://your-domain.com",
    items: samplePosts
  });

  res.header('Content-Type', 'application/xml');
  res.send(feed);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://ponas-obuolys.lt';
    const sitemap = await generateSitemap(baseUrl);
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 