import React from 'react';
import { ApplicationStatusHistory } from '../types';
import { StatusBadge } from './StatusBadge';
import { Clock, CheckCircle, Server, MessageSquare } from 'lucide-react';

interface TimelineProps {
  statuses: ApplicationStatusHistory[];
  integrationType?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ statuses, integrationType }) => {
  if (!statuses || statuses.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 text-sm">
        No timeline events logged yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-[#E6ECF4] space-y-6 my-4">
      {statuses.map((st, idx) => {
        const isLatest = idx === statuses.length - 1;
        return (
          <div key={st.status_id || idx} className="relative group">
            {/* Timeline Dot Icon */}
            <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm ring-4 ring-white ${
              isLatest ? 'bg-[#0B2A5B] text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {isLatest ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            </div>

            {/* Event Card */}
            <div className={`p-4 rounded-xl border bg-white shadow-sm transition-all ${
              isLatest ? 'border-[#0B2A5B]/30 ring-1 ring-[#0B2A5B]/10' : 'border-[#E6ECF4]'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <StatusBadge status={st.canonical_status} />
                <span className="text-xs text-[#64748B] font-medium">
                  {new Date(st.created_at).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-[#0F1F3D] font-semibold">
                  <Server className="w-4 h-4 text-slate-400" />
                  <span>Provider Raw Status: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-[#0B2A5B]">{st.provider_status}</code></span>
                </div>
                
                <p className="text-[#475569] text-sm flex items-start gap-2 pt-1">
                  <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{st.message}</span>
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] border-t border-slate-100 mt-2">
                  <span>Source: <strong>{st.source}</strong></span>
                  {integrationType && <span className="font-semibold text-slate-500">[{integrationType}]</span>}
                </div>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
