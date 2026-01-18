"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Loader2,
  ImageIcon,
  Search,
  Grid,
  List,
  RefreshCw,
  Download,
  Save,
  Edit2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils/cn";
import { getProductImage } from "@/lib/utils/imgproxy";

interface Asset {
  id: string;
  filename: string;
  path: string;
  url: string;
  name: string;
  altText?: string;
  size: number;
  width?: number;
  height?: number;
  mimeType?: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
  usedIn?: string;
  source?: string;
}

export function AssetManager() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", altText: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/assets");
      const data = await response.json();

      if (data.success) {
        setAssets(data.assets);
      } else {
        toast.error(data.error || "Failed to load assets");
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    if (selectedAsset) {
      setEditForm({
        name: selectedAsset.name || "",
        altText: selectedAsset.altText || "",
      });
    }
  }, [selectedAsset]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          successCount++;
        } else {
          const data = await response.json();
          console.error("Upload failed:", data.error);
          errorCount++;
        }
      } catch (error) {
        console.error("Upload error:", error);
        errorCount++;
      }
    }

    setUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} image(s) uploaded successfully`);
      fetchAssets();
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} image(s) failed to upload`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (asset: Asset) => {
    if (!confirm(`Are you sure you want to delete "${asset.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(asset.id);
    try {
      const response = await fetch(
        `/api/admin/assets?id=${encodeURIComponent(asset.id)}&filename=${encodeURIComponent(asset.filename)}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Asset deleted successfully");
        setAssets(assets.filter((a) => a.id !== asset.id));
        if (selectedAsset?.id === asset.id) {
          setSelectedAsset(null);
        }
      } else {
        toast.error(data.error || "Failed to delete asset");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("Failed to delete asset");
    } finally {
      setDeleting(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedAsset) return;

    // For assets not in database (product- or local- prefixed), we need to create them
    const isNewAsset = selectedAsset.id.startsWith("product-") || selectedAsset.id.startsWith("local-");

    setSaving(true);
    try {
      const response = await fetch("/api/admin/assets", {
        method: isNewAsset ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: isNewAsset ? undefined : selectedAsset.id,
          path: selectedAsset.path,
          filename: selectedAsset.filename,
          url: selectedAsset.url,
          name: editForm.name,
          altText: editForm.altText,
          size: selectedAsset.size,
          width: selectedAsset.width,
          height: selectedAsset.height,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Asset updated successfully");
        // Update local state
        setAssets(assets.map((a) =>
          a.id === selectedAsset.id
            ? { ...a, ...data.asset, id: data.asset.id }
            : a
        ));
        setSelectedAsset({ ...selectedAsset, ...data.asset, id: data.asset.id });
        setEditing(false);
      } else {
        toast.error(data.error || "Failed to update asset");
      }
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error("Failed to update asset");
    } finally {
      setSaving(false);
    }
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    toast.success("Path copied to clipboard");
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const formatFileSize = (bytes: number, source?: string): string => {
    if (!bytes || bytes === 0) {
      return source === "product" ? "Remote" : "Unknown";
    }
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getDisplayUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    return getProductImage(path);
  };

  const filteredAssets = assets.filter((asset) =>
    asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = assets.reduce((acc, a) => acc + (a.size || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center gap-3 flex-1 w-full lg:w-auto">
            <div className="relative flex-1 lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchAssets} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-2"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Images</p>
          <p className="text-2xl font-bold">{assets.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Size</p>
          <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Filtered</p>
          <p className="text-2xl font-bold">{filteredAssets.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Storage</p>
          <p className="text-2xl font-bold">Local/Server</p>
        </Card>
      </div>

      {/* Asset Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "No images match your search"
                : "Upload your first image to get started"}
            </p>
            {!searchTerm && (
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              className={cn(
                "group relative overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary",
                selectedAsset?.id === asset.id && "ring-2 ring-primary"
              )}
              onClick={() => { setSelectedAsset(asset); setEditing(false); }}
            >
              <div className="aspect-square relative bg-muted">
                <img
                  src={getDisplayUrl(asset.path)}
                  alt={asset.altText || asset.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.svg";
                  }}
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate" title={asset.name}>
                  {asset.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(asset.size, asset.source)}
                  {asset.width && asset.height && (
                    <span> • {asset.width}×{asset.height}</span>
                  )}
                </p>
              </div>

              {/* Hover Actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyPath(asset.path);
                  }}
                >
                  {copiedPath === asset.path ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(asset);
                  }}
                  disabled={deleting === asset.id}
                >
                  {deleting === asset.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={cn(
                  "flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                  selectedAsset?.id === asset.id && "bg-muted"
                )}
                onClick={() => { setSelectedAsset(asset); setEditing(false); }}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={getDisplayUrl(asset.path)}
                    alt={asset.altText || asset.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.svg";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(asset.size, asset.source)}
                    {asset.width && asset.height && (
                      <span> • {asset.width}×{asset.height}</span>
                    )}
                    <span> • {new Date(asset.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyPath(asset.path);
                    }}
                  >
                    {copiedPath === asset.path ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(asset);
                    }}
                    disabled={deleting === asset.id}
                  >
                    {deleting === asset.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Selected Asset Details */}
      {selectedAsset && (
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64 flex-shrink-0">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={getDisplayUrl(selectedAsset.path)}
                  alt={selectedAsset.altText || selectedAsset.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.svg";
                  }}
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Asset Details</h3>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit} disabled={saving}>
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="space-y-4">
                  <Input
                    label="Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Image name"
                  />
                  <Input
                    label="Alt Text"
                    value={editForm.altText}
                    onChange={(e) => setEditForm({ ...editForm, altText: e.target.value })}
                    placeholder="Description for accessibility"
                  />
                  <p className="text-xs text-muted-foreground">
                    Alt text helps with accessibility and SEO. Describe what the image shows.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedAsset.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Alt Text</p>
                    <p className="font-medium">{selectedAsset.altText || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Filename</p>
                    <p className="font-medium">{selectedAsset.filename}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{formatFileSize(selectedAsset.size, selectedAsset.source)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dimensions</p>
                    <p className="font-medium">
                      {selectedAsset.width && selectedAsset.height
                        ? `${selectedAsset.width} × ${selectedAsset.height}px`
                        : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(selectedAsset.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedAsset.usedIn && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Used In</p>
                      <p className="font-medium">{selectedAsset.usedIn}</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="text-muted-foreground text-sm mb-2">Path (for product images)</p>
                <div className="flex items-center gap-2">
                  <Input value={selectedAsset.path} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPath(selectedAsset.path)}
                  >
                    {copiedPath === selectedAsset.path ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(getDisplayUrl(selectedAsset.path), "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(selectedAsset)}
                  disabled={deleting === selectedAsset.id}
                >
                  {deleting === selectedAsset.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
