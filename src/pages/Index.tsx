import { Hero } from "@/components/Hero";
import { LatestNews } from "@/components/LatestNews";
import { LatestTools } from "@/components/LatestTools";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 space-y-12">
        <LatestNews />
        <LatestTools />
      </div>
    </div>
  );
}