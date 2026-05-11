import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  className?: string;
  onSearchComplete?: () => void;
}

export const SearchBar = ({ className, onSearchComplete }: SearchBarProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      onSearchComplete?.();
    }
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <input
        type="text"
        placeholder={t("nav.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full h-9.5 ps-5 pe-10 text-[12px] font-poppins font-normal leading-4.5 text-black bg-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white transition-all placeholder:text-black/50"
      />
      <Search
        size={24}
        onClick={() => handleSearch()}
        className="absolute end-3 cursor-pointer text-black hover:scale-110 transition-transform"
      />
    </div>
  );
};
