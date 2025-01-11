import { Hero } from "@/components/Hero";
import { LatestNews } from "@/components/LatestNews";
import { LatestVideos } from "@/components/LatestVideos";
import { LatestTools } from "@/components/LatestTools";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 space-y-12">
        <LatestNews />
        <LatestVideos />
        <LatestTools />
      </div>
    </div>
  );
}