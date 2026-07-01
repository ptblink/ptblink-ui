/**
 * Inline error banner for kiosk forms — red hairline, tinted background, small
 * body text. Server-safe (no client state).
 */
export default function ErrorBox({ message }: { message: string }) {
  return (
    <div className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-body-sm font-light text-red-300">
      {message}
    </div>
  );
}
