import { AuthError } from "@supabase/supabase-js";

export const getErrorMessage = (error: AuthError) => {
  switch (error.message) {
    case "Invalid login credentials":
      return "Neteisingi prisijungimo duomenys. Patikrinkite el. paštą ir slaptažodį.";
    case "Email not confirmed":
      return "Prašome patvirtinti savo el. pašto adresą prieš prisijungiant.";
    case "Invalid Refresh Token: Refresh Token Not Found":
      return "Jūsų sesija baigėsi. Prašome prisijungti iš naujo.";
    default:
      return error.message;
  }
};