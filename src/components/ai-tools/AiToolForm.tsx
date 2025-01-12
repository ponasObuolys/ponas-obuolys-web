import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MediaUploader from "@/components/editor/MediaUploader";
import { slugify } from "@/utils/slugify";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type AiTool = Database["public"]["Tables"]["ai_tools"]["Insert"];

const formSchema = z.object({
  name: z.string().min(2, "Pavadinimas turi būti bent 2 simbolių ilgio"),
  description: z.string().min(10, "Aprašymas turi būti bent 10 simbolių ilgio"),
  pricing_model: z.enum(["free", "freemium", "paid"]),
  category_id: z.string().min(1, "Privaloma pasirinkti kategoriją"),
  thumbnail: z.string().min(1, "Privaloma įkelti nuotrauką"),
  affiliate_link: z.string().optional(),
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pavadinimas</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aprašymas</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategorija</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite kategoriją" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricing_model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kainodara</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite kainodarą" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="free">Nemokama</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                  <SelectItem value="paid">Mokama</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nuotrauka</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <MediaUploader
                    onUpload={handleImageUpload}
                    disabled={isSubmitting}
                  />
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliate_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nuoroda</FormLabel>
              <FormControl>
                <Input {...field} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_recommended"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>ponas Obuolys rekomenduoja</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="special_offer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialus pasiūlymas</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saugoma..." : isEditing ? "Atnaujinti" : "Pridėti įrankį"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Ištrinti
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}