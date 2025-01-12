import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Vardas turi būti bent 2 simbolių ilgio.",
  }),
  email: z.string().email({
    message: "Įveskite teisingą el. pašto adresą.",
  }),
  subject: z.string().min(5, {
    message: "Tema turi būti bent 5 simbolių ilgio.",
  }),
  message: z.string().min(10, {
    message: "Žinutė turi būti bent 10 simbolių ilgio.",
  }),
});

export const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Insert message into database
      const { error: dbError } = await supabase
        .from("contact_messages")
        .insert(values);

      if (dbError) {
        throw dbError;
      }

      // Call the edge function to send email
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: values,
      });

      if (error) {
        throw error;
      }

      toast.success("Žinutė išsiųsta sėkmingai!");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Klaida siunčiant žinutę. Bandykite dar kartą.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vardas</FormLabel>
              <FormControl>
                <Input placeholder="Jūsų vardas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>El. paštas</FormLabel>
              <FormControl>
                <Input placeholder="jusu@pastas.lt" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tema</FormLabel>
              <FormControl>
                <Input placeholder="Žinutės tema" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Žinutė</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jūsų žinutė..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Siunčiama..." : "Siųsti"}
        </Button>
      </form>
    </Form>
  );
};