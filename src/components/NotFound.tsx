import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Alert className="max-w-md">
        <AlertTitle>Puslapis nerastas</AlertTitle>
        <AlertDescription className="mt-2">
          Atsiprašome, bet ieškomas puslapis neegzistuoja arba buvo ištrintas.
        </AlertDescription>
        <Button asChild className="mt-4">
          <Link to="/">Grįžti į pradžią</Link>
        </Button>
      </Alert>
    </div>
  );
};