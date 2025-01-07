import Navigation from "@/components/Navigation";
import { VideoGrid } from "@/components/VideoGrid";

const Videos = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Videos</h1>
        <VideoGrid />
      </div>
    </div>
  );
};

export default Videos;