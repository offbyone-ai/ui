import { MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FeedbackType = "bug" | "feature" | "other";
type Status = "idle" | "loading" | "success" | "error";

interface PayConfig {
  /** Unique identifier for your app — used to filter feedback in the dashboard */
  appId: string;
  /** Base URL of your pay service. Defaults to PAY_URL */
  payUrl: string;
}

interface FeedbackFormProps extends PayConfig {
  /** Called after a successful submission */
  onSuccess?: () => void;
}

function readStoredEmail(appId: string): string | undefined {
  try {
    const raw = localStorage.getItem(`paid:${appId}`);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed?.type === "email" && typeof parsed.value === "string") {
      return parsed.value;
    }
  } catch {}
  return undefined;
}

interface FeedbackButtonProps extends PayConfig {
  /** Renders as icon-only button by default. Pass a label to show text instead. */
  label?: string;
  /** Dialog title. Defaults to "{appId} feedback" */
  title?: string;
  /** Dialog description shown below the title. */
  description?: string;
}

export function FeedbackButton({
  appId,
  payUrl,
  label,
  title,
  description,
}: FeedbackButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {label ? (
          <Button variant="ghost">{label}</Button>
        ) : (
          <Button variant="ghost" size="icon" aria-label="Send feedback">
            <MessageCircleQuestion />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {title ?? (appId ? `${appId} feedback` : "Send feedback")}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <FeedbackForm
          appId={appId}
          payUrl={payUrl}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function FeedbackForm({ appId, payUrl, onSuccess }: FeedbackFormProps) {
  const [type, setType] = useState<FeedbackType>("other");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [shareContact, setShareContact] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`${payUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_id: appId,
          type,
          message,
          email: readStoredEmail(appId),
          phone: shareContact && phone ? phone : undefined,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setMessage("");
      setPhone("");
      setShareContact(false);
      setType("other");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-lg font-semibold">Thanks for the feedback!</p>
        <p className="text-sm text-muted-foreground">
          We read everything and will follow up if we have questions.
        </p>
        <Button
          type="button"
          variant="link"
          onClick={() => setStatus("idle")}
          className="text-muted-foreground"
        >
          Send more feedback
        </Button>
      </div>
    );
  }

  const placeholders: Record<FeedbackType, string> = {
    bug: "What happened? What did you expect?",
    feature: "What would you like to see?",
    other: "Anything on your mind? Yes I'm currently single…",
  };

  const keepMePostedHints: Record<FeedbackType, string> = {
    bug: "I'll try to text you when the fix ships.",
    feature: "I'll try to text you when the feature ships.",
    other: "I'll try to text if I have questions.",
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Type</span>
        <div className="flex gap-2">
          {(["bug", "feature", "other"] as FeedbackType[]).map((t) => (
            <Button
              key={t}
              type="button"
              variant={type === t ? "default" : "outline"}
              onClick={() => setType(t)}
              className="flex-1 rounded-full"
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="feedback-message">
          Message <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="feedback-message"
          required
          rows={4}
          maxLength={2000}
          placeholder={placeholders[type]}
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMessage(e.target.value)
          }
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          checked={shareContact}
          onCheckedChange={(checked: boolean | "indeterminate") =>
            setShareContact(checked === true)
          }
          className="mt-0.5"
        />
        <div
          className="flex flex-col gap-0.5 cursor-pointer"
          onClick={() => setShareContact((v) => !v)}
          onKeyDown={(e) => e.key === " " && setShareContact((v) => !v)}
        >
          <span className="text-sm font-medium leading-none">
            Keep me posted
          </span>
          <span className="block text-xs text-muted-foreground max-w-[16rem] leading-snug">
            {keepMePostedHints[type]}
          </span>
        </div>
      </div>

      {shareContact && (
        <div>
          <Input
            type="tel"
            placeholder="+1 937 867 5309"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
          />
        </div>
      )}

      {status === "error" && (
        <p className="text-sm text-destructive">
          Something went wrong — please try again.
        </p>
      )}

      <Button type="submit" disabled={status === "loading" || !message.trim()}>
        {status === "loading" ? "Sending…" : "Send feedback"}
      </Button>
    </form>
  );
}
