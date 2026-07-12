import { useEffect, useState } from "react";
import { allocationService } from "../../services/allocation.service";
import type { Asset } from "../../types/allocation";

interface Props {
  value: number | null;
  onChange: (asset: Asset) => void;
}

export default function AssetSelector({
  value,
  onChange,
}: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    try {
      setLoading(true);

      const data = await allocationService.getAssets();

      setAssets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        Loading assets...
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <label className="mb-3 block text-sm font-semibold">
        Asset
      </label>

      <select
        value={value ?? ""}
        onChange={(e) => {
          const asset = assets.find(
            (a) => a.id === Number(e.target.value)
          );

          if (asset) onChange(asset);
        }}
        className="w-full rounded-xl border p-3"
      >
        <option value="">
          Select Asset
        </option>

        {assets.map((asset) => (
          <option
            key={asset.id}
            value={asset.id}
          >
            {asset.assetTag} — {asset.name}
          </option>
        ))}
      </select>
    </div>
  );
}