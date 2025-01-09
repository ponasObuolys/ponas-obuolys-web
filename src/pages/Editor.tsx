import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Editor = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Post" : "New Post"}
        </h1>
        <div className="text-muted-foreground">
          Editor functionality coming soon...
        </div>
      </div>
    </div>
  );
};

export default Editor;
