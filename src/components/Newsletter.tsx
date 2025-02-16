import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const newsletterSchema = z.object({
  email: z.string().email("Neteisingas el. pašto formatas"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: data.email }]);

      if (error) {
        console.error("Newsletter subscription error:", error);
        if (error.code === "23505") {
          toast.error("Šis el. paštas jau užregistruotas!");
        } else if (error.code === "42501") {
          toast.error("Neturite teisių atlikti šį veiksmą.");
        } else {
          toast.error("Įvyko klaida. Bandykite dar kartą vėliau.");
        }
        return;
      }

      toast.success("Sėkmingai užsiprenumeravote naujienlaiškį!");
      form.reset();
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Įvyko klaida. Bandykite dar kartą vėliau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-card border shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Naujienlaiškis</h3>
        <p className="text-muted-foreground mt-2">
          Gaukite naujausius straipsnius tiesiai į el. paštą
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="jusu@pastas.lt"
                    type="email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Siunčiama..." : "Prenumeruoti"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 