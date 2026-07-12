import { useEffect, useState } from "react";
import { bookingService } from "../../services/booking.service";

interface Resource {
  id: number;
  name: string;
}

interface Props {
  value: number | null;
  onChange: (resource: Resource) => void;
}

export default function ResourceSelector({
  value,
  onChange,
}: Props) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    try {
      setLoading(true);

      const res = await bookingService.getResources();

      setResources(res.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        Loading Resources...
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <label className="mb-2 block text-sm font-semibold">
        Resource
      </label>

      <select
        value={value ?? ""}
        onChange={(e) => {
          const resource = resources.find(
            (r) => r.id === Number(e.target.value)
          );

          if (resource) {
            onChange(resource);
          }
        }}
        className="w-full rounded-lg border p-3"
      >
        <option value="">
          Select Resource
        </option>

        {resources.map((resource) => (
          <option
            key={resource.id}
            value={resource.id}
          >
            {resource.name}
          </option>
        ))}
      </select>
    </div>
  );
}