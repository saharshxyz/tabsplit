"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { LoadingDisplay } from "./components/LoadingDisplay";

const DynamicSplitContent = dynamic(
  () => import("./components/SplitComponent"),
  {
    ssr: false,
  },
);

export default function Split() {
  return (
    <main className="mx-auto max-w-3xl">
      <div className="m-2 flex justify-center">
        <Button className="w-full" variant={"outline"}>
          Edit Bill
          <PenSquare className="ml-2 h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
      <Suspense fallback={<LoadingDisplay />}>
        <DynamicSplitContent />
      </Suspense>
    </main>
  );
}
