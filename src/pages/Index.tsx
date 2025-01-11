import { Hero } from "@/components/Hero";
import { LatestNews } from "@/components/LatestNews";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-12 space-y-12">
        <LatestNews />
      </div>
    </div>
  );
}