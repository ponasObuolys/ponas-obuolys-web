import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb, Share2 } from "lucide-react";

const Apie = () => {
 const vertybės = [
   {
     icon: <Brain className="h-8 w-8 text-blue-500" />,
     title: "Atvirumas",
     description: "Dalinuosi savo žiniomis ir patirtimi, kad kiti galėtų mokytis ir augti"
   },
   {
     icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
     title: "Inovatyvumas", 
     description: "Nuolat eksperimentuoju su naujomis technologijomis ir ieškau geriausių sprendimų"
   },
   {
     icon: <Share2 className="h-8 w-8 text-green-500" />,
     title: "Paprastumas",
     description: "Sudėtingas technologijas paaiškinu paprastai ir suprantamai"
   }
 ];

 return (
   <div className="container mx-auto px-4 py-12">
     <div className="max-w-4xl mx-auto space-y-12">
       <Card className="bg-white/80 backdrop-blur-sm shadow-lg dark:bg-gray-900/80">
         <CardHeader>
           <CardTitle className="text-3xl font-bold tracking-wide">Apie mane</CardTitle>
         </CardHeader>
         <CardContent className="space-y-8">
           <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
             Sveiki atvykę į ponas Obuolys svetainę! Esu programuotojas, AI entuziastas ir technologijų švietėjas, nuolat ieškantis naujų būdų, kaip dirbtinis intelektas gali pagerinti mūsų kasdienybę.
           </p>

           <div>
             <h3 className="text-xl font-semibold mb-4 tracking-wide">Mano misija</h3>
             <p className="text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
               Mano tikslas yra supažindinti Lietuvos žmones su dirbtinio intelekto galimybėmis ir iššūkiais, dalintis praktinėmis žiniomis ir padėti kitiems efektyviai išnaudoti šias technologijas savo darbe bei gyvenime.
             </p>
           </div>

           <div>
             <h3 className="text-xl font-semibold mb-6 tracking-wide">Mano vertybės</h3>
             <div className="grid gap-8 md:grid-cols-3">
               {vertybės.map((vertybė, index) => (
                 <div 
                   key={index} 
                   className="flex flex-col items-center text-center p-6 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-lg transition-all duration-300 hover:scale-105"
                 >
                   <div className="mb-4">{vertybė.icon}</div>
                   <h4 className="text-lg font-semibold mb-2 tracking-wide">{vertybė.title}</h4>
                   <p className="text-gray-600 dark:text-gray-400 tracking-wide">{vertybė.description}</p>
                 </div>
               ))}
             </div>
           </div>
         </CardContent>
       </Card>
     </div>
   </div>
 );
};

export default Apie;