import { Hero } from "@/components/Hero";
import { LatestNews } from "@/components/LatestNews";
import { LatestTools } from "@/components/LatestTools";
import { LatestVideos } from "@/components/LatestVideos";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <div className="container mx-auto px-4 py-16 space-y-16">
        <LatestNews />
        <LatestVideos />
        <LatestTools />
      </div>
    </div>
  );
}