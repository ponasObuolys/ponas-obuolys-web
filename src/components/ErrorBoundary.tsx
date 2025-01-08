import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>
              Kažkas nepavyko. Bandykite dar kartą vėliau.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}