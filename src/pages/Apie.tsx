import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Apie = () => {
  console.log("Apie component rendered");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Apie mus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Sveiki atvykę į ponas Obuolys svetainę! Mes esame...
          </p>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mūsų misija</h3>
            <p className="text-gray-600">
              Mūsų tikslas yra...
            </p>
            <h3 className="text-lg font-semibold">Mūsų vertybės</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Kokybė</li>
              <li>Inovacijos</li>
              <li>Bendruomeniškumas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Apie;