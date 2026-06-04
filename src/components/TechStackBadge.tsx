type TechStackBadgeProps = {
  label: string;
};

export function TechStackBadge({ label }: TechStackBadgeProps) {
  return (
    <span className="inline-flex h-7 items-center rounded border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700">
      {label}
    </span>
  );
}
