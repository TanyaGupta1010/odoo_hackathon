type RingProps = {
  value: number;
  color: string;
  label: string;
};

const Ring = ({ value, color, label }: RingProps) => {
  const r = 32;
  const circumference = 2 * Math.PI * r;
  const dash = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#2B4258" strokeWidth="5" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
          {value}%
        </span>
      </div>
      <p className="mt-3 text-[10px] font-semibold tracking-[0.15em] text-white/60">
        {label}
      </p>
    </div>
  );
};

export default Ring;
