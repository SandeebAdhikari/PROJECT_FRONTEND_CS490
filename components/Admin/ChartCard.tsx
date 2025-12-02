interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div
      className="
        bg-card p-6 rounded-xl shadow-sm border border-border
        transition-all duration-300 ease-out
        hover:shadow-lg
      "
    >
      <h3 className="text-primary text-xl mb-4 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
