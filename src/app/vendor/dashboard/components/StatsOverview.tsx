import { Users, CheckCircle, UserX, UserPlus, Star } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    waiting: number;
    completed: number;
    noShow: number;
    total: number;
    avgRating?: number;
    numReviews?: number;
  };
  onAddWalkIn: () => void;
}

export default function StatsOverview({ stats, onAddWalkIn }: StatsOverviewProps) {
  const cards = [
    {
      label: 'Average Rating',
      value: stats.avgRating?.toFixed(1) || '0.0',
      icon: Star,
      subtitle: `${stats.numReviews || 0} reviews`,
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-500'
    },
    {
      label: 'Waiting List',
      value: stats.waiting,
      icon: Users,
      bg: 'bg-violet-500/10',
      text: 'text-violet-500'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500'
    },
    {
      label: 'No Shows',
      value: stats.noShow,
      icon: UserX,
      bg: 'bg-rose-500/10',
      text: 'text-rose-500'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <button 
        onClick={onAddWalkIn}
        className="glass-panel p-6 flex items-center justify-between border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all group shrink-0"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500 rounded-xl text-white shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
            <UserPlus size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">Add Walk-in</h3>
            <p className="text-xs text-foreground-muted uppercase tracking-wider font-bold">New manual booking</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
          <UserPlus size={18} className="text-foreground-muted" />
        </div>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 flex-grow overflow-auto lg:max-h-[400px] pr-2 custom-scrollbar">
        {cards.map((card) => (
          <div key={card.label} className="glass-panel p-5 flex items-center space-x-4 shrink-0">
            <div className={`p-4 ${card.bg} rounded-2xl ${card.text}`}>
              <card.icon size={24} className={card.label === 'Average Rating' ? 'fill-current' : ''} />
            </div>
            <div>
              <p className="text-xs text-foreground-muted font-medium uppercase tracking-tight">{card.label}</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold">{card.value}</h3>
                {card.subtitle && (
                  <span className="text-xs text-foreground-muted font-medium">{card.subtitle}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
