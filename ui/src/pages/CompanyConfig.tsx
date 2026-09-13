import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCompany } from "../context/CompanyContext";
import { useToastActions } from "../context/ToastContext";
import { companiesApi } from "../api/companies";
import { queryKeys } from "../lib/queryKeys";
import { getCompanyAutoSync, setCompanyAutoSync } from "../lib/companyAutoSync";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { PageTabBar } from "../components/PageTabBar";
import { PageSkeleton } from "../components/PageSkeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const TABS = [{ value: "company-md", label: "COMPANY.md" }] as const;

export function CompanyConfig() {
  const { selectedCompanyId, selectedCompany } = useCompany();
  const queryClient = useQueryClient();
  const { pushToast } = useToastActions();
  const [content, setContent] = useState("");
  const [autoSync, setAutoSync] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.companies.companyMd(selectedCompanyId!),
    queryFn: () => companiesApi.getCompanyMd(selectedCompanyId!),
    enabled: !!selectedCompanyId,
  });

  useEffect(() => {
    if (data) setContent(data.content);
  }, [data]);

  useEffect(() => {
    if (selectedCompanyId) setAutoSync(getCompanyAutoSync(selectedCompanyId));
  }, [selectedCompanyId]);

  const save = useMutation({
    mutationFn: () => companiesApi.updateCompanyMd(selectedCompanyId!, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.companyMd(selectedCompanyId!) });
      pushToast({ title: "COMPANY.md saved", tone: "success" });
    },
    onError: (err) => {
      pushToast({
        title: "Could not save COMPANY.md",
        body: err instanceof Error ? err.message : "Unknown error",
        tone: "error",
      });
    },
  });

  if (!selectedCompanyId) return null;
  if (isLoading) return <PageSkeleton variant="detail" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold">{selectedCompany?.name ?? "Company"}</h1>
          <p className="text-sm text-muted-foreground">Company configuration</p>
        </div>
      </div>

      <Tabs value="company-md" className="mt-6">
        <PageTabBar items={TABS} value="company-md" align="start" />
        <TabsContent value="company-md" className="mt-4 space-y-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={autoSync}
              onCheckedChange={(checked) => {
                const next = checked === true;
                setAutoSync(next);
                setCompanyAutoSync(selectedCompanyId, next);
              }}
            />
            Auto-sync COMPANY.md into agent context
          </label>

          <MarkdownEditor value={content} onChange={setContent} placeholder="Describe the company for its agents..." />

          <div className="flex justify-end">
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
