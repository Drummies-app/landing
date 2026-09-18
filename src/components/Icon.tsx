interface IconProps {
  name: keyof typeof paths;
  size?: number;
  strokeWidth?: number;
}

const paths = {
  arrow: "M7 17 17 7M9 7h8v8",
  arrowLeft: "M17 7 7 17M15 17H7V9",
  play: "M8 5.5v13l11-6.5z",
  calendar:
    "M8 3v4M16 3v4M3.5 9.5h17M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7A1.5 1.5 0 0 1 5 5.5z",
  radio:
    "M12 11.5v.01M8.5 8a5 5 0 0 0 0 8M15.5 8a5 5 0 0 1 0 8M5.6 4.8a9 9 0 0 0 0 14.4M18.4 4.8a9 9 0 0 1 0 14.4",
  globe:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3.5 12h17M12 3c2.3 2.4 3.5 5.6 3.5 9s-1.2 6.6-3.5 9c-2.3-2.4-3.5-5.6-3.5-9S9.7 5.4 12 3z",
  check: "M4.5 12.5 9.5 17.5 19.5 6.5",
  alert: "M12 8v5M12 16.5v.01M12 3.5 21 19.5H3z",
  spark: "M12 4v6M12 14v6M4 12h6M14 12h6",
  stick: "M5 19 19 5",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  drum: [
    "M4.5 8.2c0-1.8 3.4-3.2 7.5-3.2s7.5 1.4 7.5 3.2-3.4 3.2-7.5 3.2-7.5-1.4-7.5-3.2z",
    "M4.5 8.2v7.6c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2V8.2",
    "M5.2 12.2 9.4 17.9M12 11.5 8.2 18.4M12 11.5l3.8 6.9M18.8 12.2 14.6 17.9",
  ],
  guitar: [
    "M8.8 20.6a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6z",
    "M8.8 17.4a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z",
    "M11.7 12.2 18 5.9M13.9 14.4 20.2 8.1",
    "M14.1 9.8 16.3 12M16.3 7.6 18.5 9.8",
    "M18 5.9 20.2 8.1M19.1 7 21.3 4.8",
  ],
  piano: [
    "M4 6.5h16v11H4z",
    "M8.5 6.5v11M12 6.5v11M15.5 6.5v11",
    "M6.6 6.5v4.4h1.8V6.5M10.6 6.5v4.4h1.8V6.5M14.6 6.5v4.4h1.8V6.5",
  ],
  mic: [
    "M12 3.5a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-5 0V6A2.5 2.5 0 0 1 12 3.5z",
    "M6.5 10.5a5.5 5.5 0 0 0 11 0",
    "M12 16v4.5M9 20.5h6",
  ],
} as const;

const brand = {
  twitch:
    "M4.3 3 3 6.5v13h4.5V22h2.5l2.5-2.5h3.7L21 15V3zm15 11.2-2.6 2.6h-4l-2.3 2.3v-2.3H7.2V4.6h12.1zM14.7 7.6h1.6v4.7h-1.6zm-4.3 0H12v4.7h-1.6z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.1V8.9l5.2 3.1z",
  github:
    "M12 2.2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10 10 0 0 0 12 2.2z",
  x: "M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L4.9 21H1.8l7.3-8.3L1.5 3h6.4l4.4 5.8zm-1.1 16.1h1.7L7.7 4.8H5.9z",
} as const;

export function Icon({ name, size = 18, strokeWidth = 1.6 }: IconProps) {
  const shape = paths[name];
  const subpaths: readonly string[] = Array.isArray(shape)
    ? shape
    : [shape as string];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {subpaths.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={name === "play" ? "currentColor" : "none"}
        />
      ))}
    </svg>
  );
}

export function BrandIcon({
  name,
  size = 18,
}: {
  name: keyof typeof brand;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={brand[name]} fill="currentColor" />
    </svg>
  );
}

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 20 11.5 4"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M12.5 20 18 4"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
