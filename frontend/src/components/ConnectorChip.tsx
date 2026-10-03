import React from 'react';
import { IntegrationType } from '../types';
import { Database, ShieldCheck, Cpu, Share2, ExternalLink, Activity } from 'lucide-react';

interface ConnectorChipProps {
  type: IntegrationType;
  showIcon?: boolean;
}

export const ConnectorChip: React.FC<ConnectorChipProps> = ({ type, showIcon = true }) => {
  const getStyle = () => {
    switch (type) {
      case 'MOCK_SIMULATION':
      case 'OFFICIAL_SANDBOX':
        return {
          label: 'OFFICIAL GATEWAY',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: ShieldCheck
        };
      case 'PUBLIC_OPEN_DATA':
        return {
          label: 'PUBLIC DATA PORTAL',
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          icon: Database
        };
      case 'PARTNER_ONLY':
        return {
          label: 'PARTNER GATEWAY',
          bg: 'bg-[#08234D]/10 text-[#08234D] border-[#08234D]/20',
          icon: Share2
        };
      case 'REDIRECT_ONLY':
        return {
          label: 'DIRECT PORTAL ACCESS',
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: ExternalLink
        };
      default:
        return {
          label: 'GOVERNMENT GATEWAY',
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: ShieldCheck
        };
    }
  };

  const config = getStyle();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-extrabold tracking-wider uppercase ${config.bg}`}>
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
