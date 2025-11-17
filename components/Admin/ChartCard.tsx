export default function ChartCard({ title, children }: any) {
    return (
      <div className="bg-[#1d2333] p-6 rounded-xl shadow-lg">
        <h3 className="text-xl mb-4 text-indigo-400">{title}</h3>
        {children}
      </div>
    );
  }
  