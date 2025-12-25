"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LinkCard } from "@/components/dashboard/LinkCard";
import { LinkForm } from "@/components/dashboard/LinkForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  couponCode: string | null;
  discountDescription: string | null;
  isActive: boolean;
  clicks: number;
  order: number;
  startsAt: string | null;
  endsAt: string | null;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      
      // בדיקה שהתגובה היא מערך
      if (Array.isArray(data)) {
        setLinks(data);
      } else {
        // אם יש שגיאה או שהתגובה לא תקינה
        setLinks([]);
        if (data.error) {
          toast.error(data.error);
        }
      }
    } catch (error) {
      toast.error("שגיאה בטעינת הלינקים");
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((link) => link.id === active.id);
    const newIndex = links.findIndex((link) => link.id === over.id);

    const newLinks = arrayMove(links, oldIndex, newIndex);
    setLinks(newLinks);

    // Save new order to server
    try {
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newLinks.map((l) => l.id) }),
      });
    } catch (error) {
      toast.error("שגיאה בשמירת הסדר");
      fetchLinks(); // Refresh to get correct order
    }
  };

  const handleSubmit = async (linkData: any) => {
    setIsSubmitting(true);

    try {
      if (linkData.id) {
        // Update existing link
        const res = await fetch(`/api/links/${linkData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(linkData),
        });

        if (!res.ok) throw new Error("שגיאה בעדכון הלינק");

        toast.success("הלינק עודכן בהצלחה");
      } else {
        // Create new link
        const res = await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(linkData),
        });

        if (!res.ok) throw new Error("שגיאה ביצירת הלינק");

        toast.success("הלינק נוצר בהצלחה");
      }

      setIsModalOpen(false);
      setEditingLink(null);
      fetchLinks();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("האם למחוק את הלינק?")) return;

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("שגיאה במחיקת הלינק");

      toast.success("הלינק נמחק");
      fetchLinks();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (!res.ok) throw new Error("שגיאה בעדכון הלינק");

      setLinks(links.map((l) => (l.id === id ? { ...l, isActive } : l)));
      toast.success(isActive ? "הלינק מוצג" : "הלינק מוסתר");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openEditModal = (link: Link) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">הלינקים שלי</h1>
          <p className="text-zinc-500 text-sm mt-1">
            גרור כדי לשנות סדר • לחץ על עין להציג/להסתיר
          </p>
        </div>
        <Button onClick={openNewModal}>
          <FiPlus className="ml-2" />
          הוסף לינק
        </Button>
      </div>

      {/* Links List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-zinc-200 rounded-xl bg-white/50">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100 shadow-sm">
            <FiPlus size={24} className="text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            אין לך לינקים עדיין
          </h3>
          <p className="text-zinc-500 text-sm mb-8 max-w-xs mx-auto">
            הוסף את הלינק הראשון שלך כדי להתחיל לבנות את העמוד שלך ולשתף אותו עם העולם
          </p>
          <Button onClick={openNewModal} size="lg">
            <FiPlus className="ml-2" />
            הוסף לינק ראשון
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {links.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingLink ? "עריכת לינק" : "לינק חדש"}
      >
        <LinkForm
          link={editingLink}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}

