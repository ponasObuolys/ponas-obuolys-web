import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service is not configured");
    }

    const { name, email, subject, message }: ContactFormData = await req.json();

    console.log("Starting email send process with data:", { 
      name, 
      email, 
      subject,
      messageLength: message?.length 
    });

    const emailBody = {
      from: "Ponas Obuolys <info@ponasobuolys.lt>",
      to: ["a.butvilauskas@gmail.com"],
      subject: `Nauja žinutė nuo ${name}: ${subject}`,
      html: `
        <h2>Nauja kontaktinė forma</h2>
        <p><strong>Vardas:</strong> ${name}</p>
        <p><strong>El. paštas:</strong> ${email}</p>
        <p><strong>Tema:</strong> ${subject}</p>
        <p><strong>Žinutė:</strong></p>
        <p>${message}</p>
      `,
    };

    console.log("Attempting to send email via Resend API");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailBody),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error response:", errorData);
      console.error("Response status:", res.status);
      throw new Error(`Failed to send email via Resend: ${errorData}`);
    }

    const responseData = await res.json();
    console.log("Email sent successfully. Resend response:", responseData);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Detailed error in send-contact-email function:", {
      error: error.message,
      stack: error.stack,
    });

    return new Response(
      JSON.stringify({ 
        error: "Klaida siunčiant el. laišką",
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);