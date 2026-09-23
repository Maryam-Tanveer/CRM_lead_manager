import React from 'react';
import { Users, Sparkles, PhoneCall, CheckCircle2, TrendingUp } from 'lucide-react';

export const AnalyticsCards = ({ analytics, loading }) => {
  const total = analytics?.total ?? 0;
  const statusCounts = analytics?.statusCounts ?? { new: 0, contacted: 0, converted: 0 };
  const conversionRate = analytics?.conversionRate ?? 0;

  const cards = [
    {
      title: 'Total Pipeline',
      value: total,
      label: 'All registered leads',
      icon: Users,
      color: 'text-primary-500',
      bgColor: 'bg-primary-500/10 border-primary-500/20'
    },
    {
      title: 'New Leads',
      value: statusCounts.new || 0,
      label: 'Awaiting outreach',
      icon: Sparkles,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'In Progress',
      value: statusCounts.contacted || 0,
      label: 'Currently contacted',
      icon: PhoneCall,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Converted',
      value: statusCounts.converted || 0,
      label: 'Won opportunities',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      label: 'Won / Total leads',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10 border-orange-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-surface-card border border-borderTheme transition-all hover:border-primary-500/30 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-content-muted">{card.title}</span>
              <div className={`p-2 rounded-xl border ${card.bgColor} ${card.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-content-main">
                {loading ? '...' : card.value}
              </span>
              <span className="text-[11px] text-content-subtle mt-0.5">{card.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
