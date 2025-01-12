import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify } from "@/utils/slugify";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { AiToolFormFields } from "./AiToolFormFields";
import { AiToolImageUpload } from "./AiToolImageUpload";
import { AiToolFormActions } from "./AiToolFormActions";

type AiTool = Database["public"]["Tables"]["ai_tools"]["Insert"];

const urlSchema = z.string().url().or(z.string().length(0));

const formSchema = z.object({
  name: z.string().min(2, "Pavadinimas turi būti bent 2 simbolių ilgio"),
  description: z.string().min(10, "Aprašymas turi būti bent 10 simbolių ilgio"),
  pricing_model: z.enum(["free", "freemium", "paid"]),
  category_id: z.string().min(1, "Privaloma pasirinkti kategoriją"),
  thumbnail: z.string().min(1, "Privaloma įkelti nuotrauką"),
  affiliate_link: urlSchema,
  is_recommended: z.boolean().default(false),
  special_offer: z.string().optional(),
});

interface AiToolFormProps {
  onSuccess: () => void;
  initialData?: AiTool;
}

export function AiToolForm({ onSuccess, initialData }: AiToolFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      pricing_model: initialData?.pricing_model || "paid",
      category_id: initialData?.category_id || "",
      thumbnail: initialData?.thumbnail || "",
      affiliate_link: initialData?.affiliate_link || "",
      is_recommended: initialData?.is_recommended || false,
      special_offer: initialData?.special_offer || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      if (values.affiliate_link && !values.affiliate_link.startsWith('http')) {
        values.affiliate_link = `https://${values.affiliate_link}`;
      }
      
      const toolData: AiTool = {
        name: values.name,
        description: values.description,
        pricing_model: values.pricing_model,
        category_id: values.category_id,
        thumbnail: values.thumbnail,
        affiliate_link: values.affiliate_link || null,
        is_recommended: values.is_recommended,
        special_offer: values.special_offer || null,
        slug: slugify(values.name),
      };

      if (isEditing && initialData) {
        const { error } = await supabase
          .from("ai_tools")
          .update(toolData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Įrankis sėkmingai atnaujintas");
      } else {
        const { error } = await supabase.from("ai_tools").insert(toolData);
        if (error) throw error;
        toast.success("Įrankis sėkmingai pridėtas");
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting tool:", error);
      toast.error(isEditing ? "Nepavyko atnaujinti įrankio" : "Nepavyko pridėti įrankio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData || !confirm("Ar tikrai norite ištrinti šį įrankį?")) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("ai_tools")
        .delete()
        .eq("id", initialData.id);

      if (error) throw error;

      toast.success("Įrankis sėkmingai ištrintas");
      onSuccess();
    } catch (error) {
      console.error("Error deleting tool:", error);
      toast.error("Nepavyko ištrinti įrankio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("blog-media")
        .getPublicUrl(filePath);

      form.setValue("thumbnail", data.publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Nepavyko įkelti nuotraukos");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AiToolFormFields form={form} categories={categories} />
        <AiToolImageUpload 
          form={form} 
          onImageUpload={handleImageUpload}
          isSubmitting={isSubmitting}
        />
        <AiToolFormActions 
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          onDelete={handleDelete}
        />
      </form>
    </Form>
  );
}