"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { IconPicker } from "@/components/dashboard/IconPicker";

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (icon: string) => void;
  currentIcon?: string;
}

export function IconPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentIcon,
}: IconPickerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="בחר אייקון">
      <IconPicker
        onChange={(icon) => {
          onSelect(icon);
          onClose();
        }}
        value={currentIcon || null}
      />
    </Modal>
  );
}

