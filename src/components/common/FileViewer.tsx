"use client";

import { Spinner } from "@/components/common/Spinner";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";
import PDFViewer from "./PDFViewer";

type FileViewerProps = {
  src: string | File | null;
  label?: string;
  title?: string;
  documentType?: string;
  subtitle?: string;
  type?: "display" | "icon";
  children?: React.ReactNode;
};

const FileViewer: React.FC<FileViewerProps> = ({
  src,
  label = "",
  title,
  documentType,
  subtitle,
  type = "display",
  children,
}) => {
  const [extension, setExtension] = useState<"pdf" | "image" | "unknown">(
    "unknown",
  );
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [prevSrc, setPrevSrc] = useState<File | string | null>(src);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setBlobUrl(null);
    setExtension("unknown");
    setError(false);
    setIsLoading(false);
  }

  const finalSrc =
    src instanceof File ? blobUrl : typeof src === "string" ? src : null;

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchFileType = async () => {
      setIsLoading(true);
      try {
        if (src instanceof File) {
          try {
            const localLink = URL.createObjectURL(src);
            objectUrl = localLink;
            setBlobUrl(localLink);

            if (src.type.includes("pdf")) {
              setExtension("pdf");
            } else if (src.type.includes("image")) {
              setExtension("image");
            } else {
              setExtension("unknown");
            }
            return;
          } catch {
            setExtension("unknown");
            setError(true);
            return;
          } finally {
            setIsLoading(false);
          }
        }

        if (typeof src === "string") {
          const response = await axios.get(src, {
            responseType: "blob",
          });
          const contentType = response.headers["content-type"];

          if (typeof contentType === "string" && contentType.includes("pdf")) {
            setExtension("pdf");
          } else if (
            typeof contentType === "string" &&
            contentType.includes("image")
          ) {
            setExtension("image");
          } else if (
            typeof contentType === "string" &&
            contentType.includes("octet-stream")
          ) {
            setExtension("image");
          } else {
            setExtension("unknown");
          }
        }
      } catch {
        setExtension("unknown");
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileType();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (!src) {
    return (
      <div className={label ? "flex flex-col space-y-1" : undefined}>
        {label && (
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2">
            {label}
          </p>
        )}
        <p className="text-xs text-muted-foreground italic">Not available</p>
      </div>
    );
  }

  if (extension === "pdf" && finalSrc) {
    return (
      <div className={label ? "flex flex-col space-y-2" : undefined}>
        {label && (
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        )}
        <PDFViewer
          src={finalSrc}
          title={title || label}
          documentType={documentType}
          subtitle={subtitle}
          type={type}
        >
          {children}
        </PDFViewer>
      </div>
    );
  }

  if (extension === "image" && finalSrc) {
    return (
      <div className={label ? "flex flex-col space-y-2" : undefined}>
        {label && (
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        )}
        <ImageViewer
          src={finalSrc}
          alt={title || label}
          documentType={documentType}
          subtitle={subtitle}
          type={type}
          onLoad={() => setIsLoading(false)}
        >
          {children}
        </ImageViewer>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground py-2">
        <Spinner className="h-4 w-4" />
        <span>{label ? `${label} : ` : ""}Loading...</span>
      </div>
    );
  }

  if (error || extension === "unknown") {
    return (
      <div className={label ? "flex flex-col space-y-1" : undefined}>
        {label && (
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-2">
            {label}
          </p>
        )}
        <div className="flex items-center gap-2 text-destructive text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Failed to load file{label ? ` (${label})` : ""}.</span>
        </div>
      </div>
    );
  }
};

export default FileViewer;
