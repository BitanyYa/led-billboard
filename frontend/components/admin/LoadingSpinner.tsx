export default function LoadingSpinner({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-[#0057D9]/20 border-t-[#0057D9] animate-spin" />
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}
