import { FeedbackButton, FeedbackForm } from "@offbyone/registry/feedback/feedback-form";

export function FeedbackFormDefault() {
  return (
    <div className="w-full max-w-sm">
      <FeedbackForm appId="demo" />
    </div>
  );
}

export function FeedbackFormSuccess() {
  return (
    <div className="w-full max-w-sm">
      <FeedbackForm appId="demo" />
    </div>
  );
}

export function FeedbackButtonDemo() {
  return (
    <div className="flex items-center justify-center py-8">
      <FeedbackButton appId="demo" />
    </div>
  );
}
