import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Neteisingas el. pašto formatas"),
  password: z
    .string()
    .min(6, "Slaptažodis turi būti bent 6 simbolių ilgio")
    .max(100, "Slaptažodis negali būti ilgesnis nei 100 simbolių"),
});

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  submitText?: string;
}

export const AuthForm = ({ 
  onSubmit, 
  isLoading = false,
  submitText = "Prisijungti"
}: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    onSubmit(values.email, values.password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>El. paštas</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jusu@pastas.lt"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slaptažodis</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Palaukite..." : submitText}
        </Button>
      </form>
    </Form>
  );
};