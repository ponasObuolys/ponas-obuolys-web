interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  author?: string;
}

interface RSSFeedConfig {
  title: string;
  description: string;
  link: string;
  language?: string;
  items: RSSItem[];
}

export const generateRSSFeed = (config: RSSFeedConfig): string => {
  const { title, description, link, language = 'lt', items } = config;

  const rssItems = items
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      ${item.author ? `<author>${item.author}</author>` : ''}
      <guid>${item.link}</guid>
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[${description}]]></description>
    <link>${link}</link>
    <language>${language}</language>
    <atom:link href="${link}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;
}; 