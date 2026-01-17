
import React, { useState } from 'react';
import { 
  Layout, 
  Code2, 
  Mail, 
  Clock, 
  Copy, 
  Check, 
  Zap, 
  Database,
  ExternalLink,
  Info,
  ChevronRight
} from 'lucide-react';
import { TASK_1_SCRIPT, TASK_2_SCRIPT } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'task1' | 'task2'>('task1');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Zap className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Weekday <span className="text-slate-500 font-medium text-lg">Automation Workbench</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded uppercase tracking-wider">Production Ready</span>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold">FO</div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('task1')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'task1' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Database className="w-5 h-5" />
                <span className="font-semibold text-sm">Data Splitting</span>
              </button>
              <button
                onClick={() => setActiveTab('task2')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'task2' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="font-semibold text-sm">MailerSend & TAT</span>
              </button>
            </nav>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <Info className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Infrastructure</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center justify-between text-xs text-slate-500">
                  <span>Runtime</span>
                  <span className="font-mono bg-slate-100 px-1 rounded">Airtable JS</span>
                </li>
                <li className="flex items-center justify-between text-xs text-slate-500">
                  <span>Provider</span>
                  <span className="font-mono bg-slate-100 px-1 rounded">MailerSend</span>
                </li>
                <li className="flex items-center justify-between text-xs text-slate-500">
                  <span>Precision</span>
                  <span className="font-mono bg-slate-100 px-1 rounded">2 Decimals</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {activeTab === 'task1' ? 'Task 1: Intelligent Data Splitting' : 'Task 2: MailerSend Automation & TAT'}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {activeTab === 'task1' 
                      ? 'Normalization script to transform raw CSV imports into individual round records.' 
                      : 'Triggered automation to dispatch invitations and calculate turnaround time.'}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(activeTab === 'task1' ? TASK_1_SCRIPT : TASK_2_SCRIPT, activeTab)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  {copied === activeTab ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === activeTab ? 'Copied' : 'Copy Script'}
                </button>
              </div>

              <div className="p-0 bg-slate-900">
                <pre className="p-6 text-sm font-mono text-blue-100 overflow-x-auto leading-relaxed">
                  <code>{activeTab === 'task1' ? TASK_1_SCRIPT : TASK_2_SCRIPT}</code>
                </pre>
              </div>
            </section>

            {/* Implementation Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Layout className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Business Logic</h3>
                </div>
                <ul className="space-y-3">
                  {activeTab === 'task1' ? (
                    <>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                        Regex-based delimiter parsing (| or ,) with whitespace trimming.
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                        Multi-step deduplication ensures no duplicate rounds per email.
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                        Dynamic link mapping based on normalized round keywords.
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                        Atomic updates to 'Mail Sent Time' prevent race conditions.
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                        High-precision TAT calculation (ms to hours) for KPI tracking.
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                        Retry-safe logic verifies record state before API dispatch.
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-white p-6 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Code2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900">Setup Instructions</h3>
                </div>
                <ol className="space-y-3 list-decimal list-inside text-sm text-slate-600">
                  {activeTab === 'task1' ? (
                    <>
                      <li>Add the 'Scripting' extension to your Airtable base.</li>
                      <li>Create a button field named 'Process Imports'.</li>
                      <li>Map the button to run this script.</li>
                      <li>Ensure your table has the exact field names provided.</li>
                    </>
                  ) : (
                    <>
                      <li>Create a new Automation: 'When record matches conditions'.</li>
                      <li>Condition: 'Round Name' is NOT EMPTY AND 'Mail Sent Time' is EMPTY.</li>
                      <li>Add 'Run script' action and paste this code.</li>
                      <li>Input Variables: Configure all record fields as inputs.</li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock className="w-4 h-4" />
            Last Updated: March 2024
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1">
              API Documentation <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1">
              Support <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
