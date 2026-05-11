interface SectionLabelProps {
  text: string;
}

export const SectionLabel = ({ text }: SectionLabelProps) => {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="w-5 h-10 bg-primary rounded-[4px] shrink-0" />
      <span className="text-primary font-semibold text-[16px] font-poppins">
        {text}
      </span>
    </div>
  );
};
