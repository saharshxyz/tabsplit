"use client";

import { ErrorDisplay } from "./ErrorDisplay";
import { SplitDisplay } from "./SplitDisplay";
import { useSplitCalculation } from "../hooks/useSplitCalculation";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";

export default function SplitContent() {
  const { splitResult, error } = useSplitCalculation();
  const copyUrlToClipboard = useCopyToClipboard();

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!splitResult) {
    return null;
  }

  return (
    <SplitDisplay splitResult={splitResult} onCopyUrl={copyUrlToClipboard} />
  );
}
