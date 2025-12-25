"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/Button";
import { FiDownload } from "react-icons/fi";

interface QRCodeGeneratorProps {
  url: string;
  slug: string;
}

export function QRCodeGenerator({ url, slug }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = `linkis-${slug}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <div
        ref={qrRef}
        className="bg-white p-4 rounded-2xl shadow-lg"
      >
        <QRCodeCanvas
          value={url}
          size={200}
          level="H"
          includeMargin
          bgColor="#ffffff"
          fgColor="#1a1a2e"
        />
      </div>
      <p className="text-sm text-zinc-600 text-center">
        סרוק את הקוד כדי לגשת לדף שלך
      </p>
      <p className="text-xs text-zinc-500 break-all text-center">{url}</p>
      <Button variant="secondary" onClick={downloadQRCode}>
        <FiDownload className="ml-2" />
        הורד QR Code
      </Button>
    </div>
  );
}

