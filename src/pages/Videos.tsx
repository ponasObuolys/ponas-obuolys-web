import { VideoGrid } from "@/components/VideoGrid";

const Videos = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Naujausi video</h1>
      <VideoGrid />
    </div>
  );
};

export default Videos;