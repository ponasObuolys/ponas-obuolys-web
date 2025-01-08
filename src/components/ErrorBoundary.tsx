import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Alert variant="destructive" className="max-w-md mb-4">
              <AlertDescription>
                Kažkas nepavyko. Bandykite dar kartą vėliau.
              </AlertDescription>
            </Alert>
            <Button onClick={() => window.location.href = '/'}>
              Grįžti į pradžią
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}