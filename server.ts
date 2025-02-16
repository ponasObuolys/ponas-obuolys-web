import express from 'express';
import cors from 'cors';
import { generateRSSFeed } from './src/utils/rssGenerator';

const app = express();
const port = process.env.PORT || 3001;

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 