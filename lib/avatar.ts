const initialsFrom = (value: string) => {
  const v = value.trim();
  if (!v) return "?";
  const parts = v.split(/[\s._-]+/).filter(Boolean);
  const a = parts[0]?.[0] ?? v[0];
  const b = parts[1]?.[0] ?? v[1] ?? "";
  return `${a}${b}`.toUpperCase();
};

export const buildInitialsAvatarDataUrl = (name: string, opts?: { bg?: string; fg?: string }) => {
  const bg = opts?.bg ?? "#111111";
  const fg = opts?.fg ?? "#ffffff";
  const initials = initialsFrom(name);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="64" fill="${bg}"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
        font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        font-size="48" font-weight="700" fill="${fg}">${initials}</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};


