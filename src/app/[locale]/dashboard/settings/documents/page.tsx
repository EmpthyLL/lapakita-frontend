import { FileText } from "lucide-react";
import DocumentList from "./documentList";

export default function DocumentPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="absolute top-0 right-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-brand opacity-10 blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              Verification Documents
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your KTP and legal verification credentials securely.
            </p>
          </div>
        </div>
      </div>

      <DocumentList />
    </div>
  );
}
