"use client";

import { useRouter } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Propiedad</h1>
      <PropertyForm onSave={() => router.push("/admin/properties")} />
    </div>
  );
}
