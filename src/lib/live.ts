import { useEffect, useState } from "react";

export interface LiveStatus {
  checkedAt: string;
  live: boolean;
  primary: "twitch" | "youtube" | null;
  title: string | null;
  platforms: {
    twitch?: { live: boolean; url: string | null };
    youtube?: { live: boolean; videoId: string | null; url: string | null };
  };
}

export function useLiveStatus(basePath: string): LiveStatus | null {
  const [status, setStatus] = useState<LiveStatus | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const url = `${basePath.replace(/\/$/, "")}/live.json`;

    const read = async () => {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        setStatus((await response.json()) as LiveStatus);
      } catch {
        //
      }
    };

    void read();
    const id = window.setInterval(read, 60_000);
    return () => {
      controller.abort();
      window.clearInterval(id);
    };
  }, [basePath]);

  return status;
}
