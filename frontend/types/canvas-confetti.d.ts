declare module "canvas-confetti" {
  type Options = {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    ticks?: number;
    scalar?: number;
  };

  export default function confetti(options?: Options): void;
}
