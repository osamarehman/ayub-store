import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { AssetManager } from "@/components/admin/asset-manager";

export const metadata: Metadata = {
  title: "Asset Manager | Admin",
  description: "Manage product images and assets",
};

export default async function AssetsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Asset Manager</h1>
        <p className="text-muted-foreground">
          Upload, view, and manage product images
        </p>
      </div>

      <AssetManager />
    </div>
  );
}
