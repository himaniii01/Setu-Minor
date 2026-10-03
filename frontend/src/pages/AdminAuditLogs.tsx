import React, { useState, useEffect } from 'react';
import { Shield, Search, FileText, Code, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { AuditLogItem } from '../types';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [traceIdFilter, setTraceIdFilter] = useState<string>('');

  useEffect(() => {
    fetchLogs();
  }, [traceIdFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (traceIdFilter) params.trace_id = traceIdFilter;
      const res = await api.get('/admin/audit-logs', { params });
      setLogs(res.data.auditLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6ECF4] pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B2A5B] tracking-tight">Append-Only Audit Logs</h1>
          <p className="text-slate-500 text-sm mt-1">Trace ID-indexed immutable security and gateway transaction trail</p>
        </div>

        {/* Filter Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={traceIdFilter}
            onChange={(e) => setTraceIdFilter(e.target.value)}
            placeholder="Filter by Trace ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E6ECF4] text-xs font-mono text-[#0F1F3D] bg-white focus:ring-2 focus:ring-[#0B2A5B]"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E6ECF4] rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#E6ECF4] pb-4">
          <span className="text-xs font-bold text-slate-500">Showing {logs.length} Log Entries</span>
          <button onClick={fetchLogs} className="text-xs font-bold text-[#0B2A5B] flex items-center gap-1 hover:underline">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload Logs</span>
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading audit log stream...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No audit log records match filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6ECF4] text-xs font-bold text-slate-400 uppercase">
                  <th className="py-3 px-3">Trace ID</th>
                  <th className="py-3 px-3">Actor</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Resource</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Redacted Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-[#0F1F3D]">
                {logs.map((log) => (
                  <tr key={log.audit_id} className="hover:bg-slate-50/60 font-mono">
                    <td className="py-3.5 px-3 font-bold text-[#0B2A5B]">{log.trace_id}</td>
                    <td className="py-3.5 px-3 text-slate-700">{log.actor}</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-800">{log.action}</td>
                    <td className="py-3.5 px-3 text-slate-600">{log.resource}</td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-[11px] text-slate-500 max-w-xs truncate">
                      {log.redacted_metadata}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
