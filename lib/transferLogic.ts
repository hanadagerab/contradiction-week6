export type ContradictionResult = {
  decision: "continue" | "interrupt";
  thresholdCrossed: boolean;
  handoffTriggered: boolean;
};

export type TransferVariant =
  | "stronger-social-pressure"
  | "clearer-retest";

export function selectTransferVariant(
  result: ContradictionResult
): TransferVariant {
  const completeEarlyInterruption =
    result.decision === "interrupt" &&
    !result.thresholdCrossed &&
    result.handoffTriggered;

  return completeEarlyInterruption
    ? "stronger-social-pressure"
    : "clearer-retest";
}
