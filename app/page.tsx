import { Card, CardContent } from "@/components/ui/card";
import { SplittingForm } from "./components/Form";

export default function Home() {
  return (
    <main className="mx-auto">
      <Card>
        <CardContent>
          <SplittingForm />
        </CardContent>
      </Card>
    </main>
  );
}
