import { Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function PaywallMock({
  appName = "My App",
  appDescription = "Buy once, use forever.",
  price = 29,
  step,
  setStep,
}: {
  appName?: string;
  appDescription?: string;
  price?: number;
  step: "choose" | "restore" | "restored";
  setStep: (s: "choose" | "restore" | "restored") => void;
}) {
  const [email, setEmail] = useState("");

  const title =
    step === "choose"
      ? `Unlock ${appName}`
      : step === "restore"
        ? "Restore your purchase"
        : "License restored";

  const description =
    step === "choose"
      ? appDescription
      : step === "restore"
        ? `Enter the email you used when you bought ${appName}`
        : `You're all set — enjoy ${appName}.`;

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl border bg-background shadow-lg overflow-hidden">
      <div className="flex flex-col items-center px-6 pt-8 pb-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="px-6 pb-8 pt-2">
        {step === "choose" && (
          <div className="flex flex-col gap-4">
            <Button className="w-full h-12 rounded-full text-sm font-semibold">
              Buy —{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(price)}{" "}
              one time
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full flex-1 text-sm"
                onClick={() => setStep("restore")}
              >
                <Mail className="size-4" />
                Already bought?
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full flex-1 text-sm"
              >
                <MessageCircle className="size-4" />
                Need help?
              </Button>
            </div>
          </div>
        )}

        {step === "restore" && (
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="alice@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              className="w-full h-12 rounded-full text-sm font-semibold"
              disabled={!email}
              onClick={() => setStep("restored")}
            >
              Restore
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm text-muted-foreground"
              onClick={() => setStep("choose")}
            >
              Back
            </Button>
          </div>
        )}

        {step === "restored" && (
          <Button
            className="w-full h-12 rounded-full text-sm font-semibold"
            onClick={() => setStep("choose")}
          >
            Done
          </Button>
        )}
      </div>
    </div>
  );
}

export function LicensePaywallChoose() {
  const [step, setStep] = useState<"choose" | "restore" | "restored">("choose");
  return (
    <PaywallMock
      appName="My App"
      appDescription="Buy once, use forever."
      price={29}
      step={step}
      setStep={setStep}
    />
  );
}

export function LicensePaywallRestore() {
  const [step, setStep] = useState<"choose" | "restore" | "restored">("restore");
  return (
    <PaywallMock
      appName="My App"
      appDescription="Buy once, use forever."
      price={29}
      step={step}
      setStep={setStep}
    />
  );
}

export function LicensePaywallRestored() {
  const [step, setStep] = useState<"choose" | "restore" | "restored">("restored");
  return (
    <PaywallMock
      appName="My App"
      appDescription="Buy once, use forever."
      price={29}
      step={step}
      setStep={setStep}
    />
  );
}
