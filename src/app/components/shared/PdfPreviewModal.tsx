'use client';

import { X } from 'lucide-react';
import React from 'react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
}

export default function PdfPreviewModal({ isOpen, onClose, fileUrl }: PdfPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">PDF Preview</h2>
          <iframe
            src={fileUrl}
            className="w-full h-[500px] border"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}