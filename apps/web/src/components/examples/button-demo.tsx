import { Button } from "@/components/ui/button";

export function ButtonDemo() {
  return <Button>Button</Button>;
}

export function ButtonSecondary() {
  return <Button variant="secondary">Secondary</Button>;
}

export function ButtonDestructive() {
  return <Button variant="destructive">Destructive</Button>;
}

export function ButtonOutline() {
  return <Button variant="outline">Outline</Button>;
}

export function ButtonGhost() {
  return <Button variant="ghost">Ghost</Button>;
}

export function ButtonLink() {
  return <Button variant="link">Link</Button>;
}

export function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}

export function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="lg">Large</Button>
      <Button size="default">Default</Button>
      <Button size="sm">Small</Button>
      <Button size="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}

export function ButtonWithIcon() {
  return (
    <Button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
      Download
    </Button>
  );
}

export function ButtonLoading() {
  return (
    <Button disabled>
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Please wait
    </Button>
  );
}
