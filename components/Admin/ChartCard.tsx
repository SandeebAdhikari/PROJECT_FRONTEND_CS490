export default function ChartCard({ title, children }: any) {
  return (
    <div
      className="
        bg-secondary p-6 rounded-xl shadow-soft border border-border
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20
        cursor-pointer
      "
    >
      <h3 className="text-primary text-xl mb-4">{title}</h3>
      {children}
    </div>
  );
}
