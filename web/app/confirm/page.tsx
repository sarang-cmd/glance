import { Intro, metadataFor } from "@/components/shared";
import { TokenAction } from "@/components/token-action";
export const metadata = {
  ...metadataFor("/confirm"),
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <div className="container">
      <Intro path="/confirm" label="Release list" />
      <TokenAction token={token || ""} kind="confirm" />
    </div>
  );
}
