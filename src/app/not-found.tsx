import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FiLink } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <FiLink size={80} className="text-indigo-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white/70 mb-8">
          הדף שחיפשת לא נמצא
        </p>
        <Link href="/">
          <Button>חזרה לדף הבית</Button>
        </Link>
      </div>
    </div>
  );
}

