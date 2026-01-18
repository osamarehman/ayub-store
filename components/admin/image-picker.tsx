"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Card, Input } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/optimized-image";
import {
  Upload,
  X,
  Search,
  Check,
  Loader2,
  ImageIcon,
  FolderOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils/cn";

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
}

interface ImagePickerProps {
  value: string;
  onChange: (path: string) => void;
  onAssetSelect?: (asset: Asset) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function ImagePicker({
  value,
  onChange,
  onAssetSelect,
  label,
  placeholder = "Select or upload an image",
  className,
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch assets when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/assets");
      const data = await response.json();
      if (data.success) {
        setAssets(data.assets);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.path) {
        toast.success("Image uploaded successfully");
        onChange(data.path);
        if (data.asset && onAssetSelect) {
          onAssetSelect(data.asset);
        }
        setIsOpen(false);
        // Refresh assets list
        fetchAssets();
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSelect = (asset: Asset) => {
    onChange(asset.path);
    if (onAssetSelect) {
      onAssetSelect(asset);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}

      {/* Current Selection / Trigger */}
      <div
        className={cn(
          "border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
          !value && "border-dashed"
        )}
        onClick={() => setIsOpen(true)}
      >
        {value ? (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <OptimizedImage
                src={value}
                alt="Selected"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {value.split("/").pop()}
              </p>
              <p className="text-xs text-muted-foreground">
                Click to change
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
            <ImageIcon className="h-8 w-8 mb-2" />
            <p className="text-sm">{placeholder}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            ref={modalRef}
            className="bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col m-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Select Image</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleUpload}
                className="hidden"
              />
              <Button
                type="button"
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
                    Upload New
                  </>
                )}
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium mb-2">No images found</p>
                  <p className="text-sm mb-4">
                    {searchTerm
                      ? "Try a different search term"
                      : "Upload your first image to get started"}
                  </p>
                  {!searchTerm && (
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id || asset.path}
                      className={cn(
                        "group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer border-2 transition-all hover:border-primary",
                        value === asset.path
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent"
                      )}
                      onClick={() => handleSelect(asset)}
                    >
                      <OptimizedImage
                        src={asset.path}
                        alt={asset.altText || asset.name}
                        fill
                        className="object-cover"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                        <div className="w-full p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-medium truncate">
                            {asset.name}
                          </p>
                          {asset.size > 0 && (
                            <p className="text-white/70 text-xs">
                              {formatFileSize(asset.size)}
                              {asset.width && asset.height && (
                                <span> • {asset.width}x{asset.height}</span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Selected Check */}
                      {value === asset.path && (
                        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Multi-image picker for additional product images
 */
interface MultiImagePickerProps {
  values: string[];
  onChange: (paths: string[]) => void;
  label?: string;
  maxImages?: number;
  className?: string;
}

export function MultiImagePicker({
  values,
  onChange,
  label,
  maxImages = 10,
  className,
}: MultiImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaths, setSelectedPaths] = useState<string[]>(values);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedPaths(values);
  }, [values]);

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/assets");
      const data = await response.json();
      if (data.success) {
        setAssets(data.assets);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedPaths: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (response.ok && data.path) {
          uploadedPaths.push(data.path);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    if (uploadedPaths.length > 0) {
      toast.success(`${uploadedPaths.length} image(s) uploaded`);
      const newPaths = [...selectedPaths, ...uploadedPaths].slice(0, maxImages);
      setSelectedPaths(newPaths);
      fetchAssets();
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleSelect = (path: string) => {
    setSelectedPaths((prev) => {
      if (prev.includes(path)) {
        return prev.filter((p) => p !== path);
      }
      if (prev.length >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return prev;
      }
      return [...prev, path];
    });
  };

  const handleConfirm = () => {
    onChange(selectedPaths);
    setIsOpen(false);
  };

  const removeImage = (path: string) => {
    const newPaths = values.filter((p) => p !== path);
    onChange(newPaths);
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}

      {/* Current Selection */}
      <div className="space-y-3">
        {values.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {values.map((path, index) => (
              <div
                key={path}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
              >
                <OptimizedImage
                  src={path}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(path)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full border-dashed"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {values.length === 0
            ? "Select Images"
            : `Add More (${values.length}/${maxImages})`}
        </Button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            ref={modalRef}
            className="bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col m-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Select Images</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedPaths.length} of {maxImages} selected
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
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
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id || asset.path}
                      className={cn(
                        "group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer border-2 transition-all hover:border-primary",
                        selectedPaths.includes(asset.path)
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent"
                      )}
                      onClick={() => toggleSelect(asset.path)}
                    >
                      <OptimizedImage
                        src={asset.path}
                        alt={asset.altText || asset.name}
                        fill
                        className="object-cover"
                      />

                      {/* Selection indicator */}
                      <div
                        className={cn(
                          "absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          selectedPaths.includes(asset.path)
                            ? "bg-primary border-primary text-white"
                            : "bg-white/80 border-gray-300"
                        )}
                      >
                        {selectedPaths.includes(asset.path) && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>

                      {/* Info overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-medium truncate">
                          {asset.name}
                        </p>
                        {asset.size > 0 && (
                          <p className="text-white/70 text-xs">
                            {formatFileSize(asset.size)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleConfirm}>
                Confirm Selection ({selectedPaths.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
