'use client';

import { useRef, useState } from "react";
import { X, Loader2, ImagePlus } from "lucide-react";

type CommunityCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lang: "RU" | "EN";
  onCreate: (input: {
    name: string;
    slug: string;
    description?: string;
    category?: string;
    privacy: "public" | "private";
    bannerFile?: File;
  }) => Promise<void>;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

const CATEGORIES = [
  { id: "politics", labelEn: "Politics", labelRu: "Политика" },
  { id: "crypto", labelEn: "Crypto", labelRu: "Крипто" },
  { id: "sports", labelEn: "Sports", labelRu: "Спорт" },
  { id: "entertainment", labelEn: "Entertainment", labelRu: "Развлечения" },
  { id: "science", labelEn: "Science", labelRu: "Наука" },
  { id: "business", labelEn: "Business", labelRu: "Бизнес" },
  { id: "technology", labelEn: "Technology", labelRu: "Технологии" },
  { id: "world", labelEn: "World", labelRu: "Мир" },
];

export default function CommunityCreateModal({
  isOpen,
  onClose,
  lang,
  onCreate,
}: CommunityCreateModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(lang === "RU" ? "Макс. 5MB" : "Max 5MB");
      return;
    }
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // If banner file selected, we pass a placeholder — the caller should upload after creation
      // For now, pass undefined and let the caller handle post-create banner upload
      await onCreate({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        privacy,
        bannerFile: bannerFile ?? undefined,
      });
      // Reset form
      setName("");
      setSlug("");
      setDescription("");
      setCategory("");
      setPrivacy("public");
      setSlugManual(false);
      setBannerPreview(null);
      setBannerFile(null);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create community";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      data-swipe-ignore="true"
    >
      <div className="w-full max-w-lg bg-black border border-zinc-900 rounded-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-900">
          <h2 className="text-sm font-semibold text-white">
            {lang === "RU" ? "Создать сообщество" : "Create Community"}
          </h2>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/60 flex items-center justify-center text-zinc-300"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Banner */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              {lang === "RU" ? "Баннер" : "Banner"}
            </label>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleBannerSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="w-full h-28 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/30 hover:bg-zinc-950/60 transition flex items-center justify-center overflow-hidden"
            >
              {bannerPreview ? (
                <img src={bannerPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-zinc-500">
                  <ImagePlus size={24} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {lang === "RU" ? "Загрузить баннер" : "Upload banner"}
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              {lang === "RU" ? "Название" : "Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={lang === "RU" ? "Крипто трейдеры" : "Crypto Traders"}
              maxLength={100}
              className="w-full h-11 rounded-full bg-zinc-950 border border-zinc-900 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              {lang === "RU" ? "Ссылка" : "URL Slug"}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 shrink-0">/community/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="crypto-traders"
                maxLength={50}
                className="flex-1 h-11 rounded-full bg-zinc-950 border border-zinc-900 px-4 text-sm text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              {lang === "RU" ? "Описание" : "Description"}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === "RU" ? "О чём это сообщество..." : "What is this community about..."}
              maxLength={2000}
              rows={3}
              className="w-full rounded-2xl bg-zinc-950 border border-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              {lang === "RU" ? "Категория" : "Category"}
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const selected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(selected ? "" : c.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition ${
                      selected
                        ? "border-[rgba(245,68,166,1)] bg-[rgba(245,68,166,0.12)] text-white"
                        : "border-zinc-900 bg-black text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {lang === "RU" ? c.labelRu : c.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy */}
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              {lang === "RU" ? "Видимость" : "Visibility"}
            </label>
            <div className="flex gap-2">
              {(["public", "private"] as const).map((p) => {
                const selected = privacy === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrivacy(p)}
                    className={`flex-1 py-2.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition ${
                      selected
                        ? "border-[rgba(245,68,166,1)] bg-[rgba(245,68,166,0.12)] text-white"
                        : "border-zinc-900 bg-black text-zinc-400 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {p === "public"
                      ? lang === "RU" ? "Публичное" : "Public"
                      : lang === "RU" ? "Приватное" : "Private"}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-400 px-1">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-900">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !slug.trim()}
            className="w-full h-11 rounded-full bg-[rgba(245,68,166,1)] text-white text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {lang === "RU" ? "Создать" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
