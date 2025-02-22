export default function Loading() {
  return (
    <div className="bg-background text-foreground fixed inset-0 flex w-full flex-col-reverse items-center justify-center gap-2">
      <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      <p className="mt-4 text-lg font-semibold">Loading...</p>
    </div>
  );
}
