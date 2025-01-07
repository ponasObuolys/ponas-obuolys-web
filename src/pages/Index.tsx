import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import { FeaturedVideos } from "@/components/FeaturedVideos";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Naujausi video</h2>
        <FeaturedVideos />
      </div>
    </div>
  );
};

export default Index;