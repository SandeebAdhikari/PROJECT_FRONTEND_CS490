export default function ChartCard({ title, children }: any) {
    return (
      <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
        <h3 className="text-primary text-xl mb-4">{title}</h3>
        {children}
      </div>
    );
  }
  