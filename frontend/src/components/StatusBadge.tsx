import React from 'react';
import { CanonicalStatus } from '../types';
import { Clock, CheckCircle2, AlertTriangle, XCircle, RefreshCw, MinusCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: CanonicalStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'SUBMITTED':
        return {
          label: 'SUBMITTED',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Clock
        };
      case 'UNDER_REVIEW':
        return {
          label: 'UNDER REVIEW',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock
        };
      case 'ACTION_REQUIRED':
        return {
          label: 'ACTION REQUIRED',
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          icon: AlertTriangle
        };
      case 'APPROVED':
      case 'COMPLETED':
        return {
          label: status === 'APPROVED' ? 'APPROVED' : 'ISSUED / COMPLETED',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2
        };
      case 'REJECTED':
        return {
          label: 'REJECTED',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: XCircle
        };
      case 'FAILED_SYNC':
        return {
          label: 'PENDING SYNC',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: RefreshCw
        };
      case 'CANCELLED':
        return {
          label: 'CANCELLED',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: MinusCircle
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock
        };
    }
  };

  const config = getStyle();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${config.bg}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'FAILED_SYNC' ? 'animate-spin' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
};
