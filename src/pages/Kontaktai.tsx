import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Kontaktai = () => {
  console.log("Kontaktai component rendered");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Susisiekite su mumis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Turite klausimų? Susisiekite su mumis žemiau nurodytais kontaktais.
          </p>
          <div className="space-y-2">
            <p>
              <strong>El. paštas:</strong> info@ponasobuolys.lt
            </p>
            <p>
              <strong>Telefonas:</strong> +370 600 00000
            </p>
            <p>
              <strong>Adresas:</strong> Vilnius, Lietuva
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Kontaktai;