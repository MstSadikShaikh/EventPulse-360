import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { QRScannerDesk } from './QRScannerDesk';
import { AttendeeManager } from './AttendeeManager';
import { BroadcastDesk } from './BroadcastDesk';
import { LiveAnalyticsView } from './LiveAnalyticsView';
import { 
  Camera, 
  Users, 
  Radio, 
  TrendingUp, 
  Settings, 
  ShieldCheck, 
  Layers, 
  Award,
  Plus,
  Trash2
} from 'lucide-react';
import { RubricCriterion } from '../../types';

export const OrganizerDashboard: React.FC = () => {
  const { event, updateRubrics, addToast } = useEvent();
  const [activeTab, setActiveTab] = useState<'scanner' | 'attendees' | 'broadcast' | 'analytics' | 'rubric'>('scanner');

  // Rubrics local editing
  const [rubricsList, setRubricsList] = useState<RubricCriterion[]>(event?.rubrics || []);

  const handleSaveRubrics = async () => {
    await updateRubrics(rubricsList);
  };

  const handleUpdateCriterion = (idx: number, field: keyof RubricCriterion, val: string | number) => {
    setRubricsList(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Mission Control</span>
              <span className="text-xs text-slate-500">• Real-Time Organizer Desk</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">Event Command Center</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Active Event Mode
          </span>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex border-b border-slate-800/80 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Camera className="w-4 h-4 text-indigo-400" />
          QR Check-in Scanner
        </button>

        <button
          onClick={() => setActiveTab('attendees')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'attendees'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          Attendee Management
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'broadcast'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Radio className="w-4 h-4 text-rose-400" />
          Broadcast & Alerts
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Live Analytics & Reports
        </button>

        <button
          onClick={() => setActiveTab('rubric')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'rubric'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          Rubrics & Weights
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'scanner' && <QRScannerDesk />}
      {activeTab === 'attendees' && <AttendeeManager />}
      {activeTab === 'broadcast' && <BroadcastDesk />}
      {activeTab === 'analytics' && <LiveAnalyticsView />}

      {activeTab === 'rubric' && (
        <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Judging Rubric Matrix Configuration
              </h3>
              <p className="text-xs text-slate-400">Define criteria and score weights for judge evaluations</p>
            </div>
            <button
              onClick={handleSaveRubrics}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              Save Rubric Changes
            </button>
          </div>

          <div className="space-y-3">
            {rubricsList.map((crit, idx) => (
              <div key={crit.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 font-semibold mb-1">Criteria Name</label>
                    <input
                      type="text"
                      value={crit.label}
                      onChange={(e) => handleUpdateCriterion(idx, 'label', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Weight Percentage (%)</label>
                    <input
                      type="number"
                      value={crit.weight}
                      onChange={(e) => handleUpdateCriterion(idx, 'weight', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Description / Guidance for Judges</label>
                  <input
                    type="text"
                    value={crit.desc}
                    onChange={(e) => handleUpdateCriterion(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
