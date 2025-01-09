import { useNavigate } from "react-router-dom";

export const AuthLinks = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4 text-center text-sm">
      <button
        onClick={() => navigate("/auth/reset-password")}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        Pamiršote slaptažodį?
      </button>
      <div className="flex items-center justify-center space-x-1">
        <span className="text-muted-foreground">Neturite paskyros?</span>
        <button
          onClick={() => navigate("/auth/register")}
          className="text-primary hover:text-primary/90 transition-colors font-medium"
        >
          Registruotis
        </button>
      </div>
    </div>
  );
};