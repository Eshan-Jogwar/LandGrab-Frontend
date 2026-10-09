import React, { useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';
import type { GameEventMessage } from '../../state/events';
import {
  Coins,
  Receipt,
  Home,
  CheckCircle2,
  AlertTriangle,
  DoorOpen,
  X,
  Sparkles,
  HelpCircle,
  Gift,
} from 'lucide-react';

export const EventNotificationBox: React.FC = () => {
  const recentEvents = useGameStore((s) => s.recentEvents);
  const dismissEvent = useGameStore((s) => s.dismissEvent);

  if (recentEvents.length === 0) return null;

  return (
    <div className="absolute top-20 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-80 pointer-events-none select-none">
      {recentEvents.slice(0, 4).map((evt) => (
        <EventToast key={evt.id} event={evt} onDismiss={() => dismissEvent(evt.id)} />
      ))}
    </div>
  );
};

const EventToast: React.FC<{
  event: GameEventMessage;
  onDismiss: () => void;
}> = ({ event, onDismiss }) => {
  useEffect(() => {
    // Auto-dismiss notification after 6 seconds
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const styleConfig = getEventStyle(event.type);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-xl animate-in slide-in-from-right-8 duration-300 transition-all ${styleConfig.bg} ${styleConfig.border}`}
    >
      <div className={`p-2 rounded-xl flex-shrink-0 ${styleConfig.iconBg} ${styleConfig.iconColor}`}>
        {styleConfig.icon}
      </div>

      <div className="flex-grow min-w-0 pr-1">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-black uppercase tracking-wider ${styleConfig.titleColor}`}>
            {event.title}
          </span>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white transition p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-slate-200 mt-0.5 font-medium leading-snug">
          {event.description}
        </p>
      </div>
    </div>
  );
};

function getEventStyle(type: string) {
  switch (type) {
    case 'tax':
      return {
        bg: 'bg-rose-950/90',
        border: 'border-rose-500/50',
        iconBg: 'bg-rose-500/20',
        iconColor: 'text-rose-400',
        titleColor: 'text-rose-300',
        icon: <Receipt className="w-4 h-4" />,
      };
    case 'rent':
      return {
        bg: 'bg-amber-950/90',
        border: 'border-amber-500/50',
        iconBg: 'bg-amber-500/20',
        iconColor: 'text-amber-400',
        titleColor: 'text-amber-300',
        icon: <Coins className="w-4 h-4" />,
      };
    case 'buy':
      return {
        bg: 'bg-emerald-950/90',
        border: 'border-emerald-500/50',
        iconBg: 'bg-emerald-500/20',
        iconColor: 'text-emerald-400',
        titleColor: 'text-emerald-300',
        icon: <Home className="w-4 h-4" />,
      };
    case 'pass_go':
      return {
        bg: 'bg-teal-950/90',
        border: 'border-teal-500/50',
        iconBg: 'bg-teal-500/20',
        iconColor: 'text-teal-400',
        titleColor: 'text-teal-300',
        icon: <Sparkles className="w-4 h-4" />,
      };
    case 'jail':
      return {
        bg: 'bg-red-950/90',
        border: 'border-red-600/60',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400',
        titleColor: 'text-red-300',
        icon: <AlertTriangle className="w-4 h-4" />,
      };
    case 'bail':
      return {
        bg: 'bg-blue-950/90',
        border: 'border-blue-500/50',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-400',
        titleColor: 'text-blue-300',
        icon: <DoorOpen className="w-4 h-4" />,
      };
    case 'chance':
      return {
        bg: 'bg-purple-950/90',
        border: 'border-purple-500/50',
        iconBg: 'bg-purple-500/20',
        iconColor: 'text-purple-400',
        titleColor: 'text-purple-300',
        icon: <HelpCircle className="w-4 h-4" />,
      };
    case 'chest':
      return {
        bg: 'bg-sky-950/90',
        border: 'border-sky-500/50',
        iconBg: 'bg-sky-500/20',
        iconColor: 'text-sky-400',
        titleColor: 'text-sky-300',
        icon: <Gift className="w-4 h-4" />,
      };
    default:
      return {
        bg: 'bg-slate-900/90',
        border: 'border-slate-700/80',
        iconBg: 'bg-slate-800',
        iconColor: 'text-slate-300',
        titleColor: 'text-slate-200',
        icon: <CheckCircle2 className="w-4 h-4" />,
      };
  }
}
