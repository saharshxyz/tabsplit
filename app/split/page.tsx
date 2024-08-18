"use client";

import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { LoadingDisplay } from "./components/LoadingDisplay";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { SplitDisplay } from "./components/SplitDisplay";
import { useSplitCalculation } from "./hooks/useSplitCalculation";
import { useCopyToClipboard } from "./hooks/useCopyToClipboard";

export default function Split() {
  const { splitResult, error } = useSplitCalculation();
  const copyUrlToClipboard = useCopyToClipboard();

  return (
    <main className="mx-auto max-w-3xl">
      <div className="m-2 flex justify-center">
        <Button className="w-full" variant={"outline"}>
          Edit Bill
          <PenSquare className="ml-2 h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
      {error ? (
        <ErrorDisplay error={error} />
      ) : splitResult ? (
        <SplitDisplay
          splitResult={splitResult}
          onCopyUrl={copyUrlToClipboard}
        />
      ) : (
        <LoadingDisplay />
      )}
    </main>
  );
}
