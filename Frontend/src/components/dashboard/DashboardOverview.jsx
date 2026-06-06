import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, CheckCircle2, Mic, FileText, Sparkles, User, ArrowUp } from 'lucide-react';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_meetings: 0, total_hours: 0, total_summaries: 0, total_transcripts: 0 });
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentRes, weeklyRes] = await Promise.all([
          fetch('https://standnote.onrender.com/api/v1/meetings/stats'),
          fetch('https://standnote.onrender.com/api/v1/meetings/recent?limit=5'),
          fetch('https://standnote.onrender.com/api/v1/meetings/weekly-activity')
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (recentRes.ok) setRecentMeetings(await recentRes.json());
        if (weeklyRes.ok) setWeeklyActivity(await weeklyRes.json());
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const username = "Shubham"; // Can be pulled from context/auth later
  const currentDate = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  // Filter weekly activity to only show Mon-Fri to match the screenshot
  const displayActivity = weeklyActivity.slice(0, 5);
  const maxActivity = Math.max(...displayActivity.map(d => d.count), 1); // Avoid division by zero

  if (isLoading) {
    return <div className="p-8 text-slate-500 animate-pulse">Loading your dashboard...</div>;
  }

  const glassCardClasses = "bg-white/60 backdrop-blur-2xl border border-white/60 shadow-xl shadow-purple-900/5 rounded-xl";

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">StandNote.<span className="text-purple-600">AI</span></h1>
          <p className="text-xs tracking-widest text-slate-500 font-semibold uppercase mt-1">Meeting Intelligence</p>
        </div>
        <div className="text-slate-500 text-sm font-medium">{currentDate}</div>
      </div>

      {/* Welcome Banner */}
      <div className={`${glassCardClasses} p-6 flex items-center gap-6`}>
        <Activity className="w-8 h-8 text-purple-600" />
        <div>
          <h2 className="text-xl font-bold text-slate-900">{getGreeting()}, {username}</h2>
          <p className="text-sm text-slate-500 mt-1">Your smart meeting assistant is ready. Start a live session or review past meetings.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${glassCardClasses} p-8`}>
          <p className="text-slate-500 text-base font-medium mb-3">Total meetings</p>
          <p className="text-5xl font-bold text-slate-900 mb-2">{stats.total_meetings}</p>
          <p className="text-xs text-purple-600 flex items-center gap-1"><ArrowUp className="w-3 h-3"/> 4 this week</p>
        </div>
        <div className={`${glassCardClasses} p-8`}>
          <p className="text-slate-500 text-base font-medium mb-3">Hours recorded</p>
          <p className="text-5xl font-bold text-slate-900 mb-2">{stats.total_hours}</p>
          <p className="text-xs text-slate-400">across all sessions</p>
        </div>
        <div className={`${glassCardClasses} p-8`}>
          <p className="text-slate-500 text-base font-medium mb-3">Summaries</p>
          <p className="text-5xl font-bold text-slate-900 mb-2">{stats.total_summaries}</p>
          <p className="text-xs text-purple-600 flex items-center gap-1"><ArrowUp className="w-3 h-3"/> 3 new</p>
        </div>
        <div className={`${glassCardClasses} p-8`}>
          <p className="text-slate-500 text-base font-medium mb-3">Transcripts</p>
          <p className="text-5xl font-bold text-slate-900 mb-2">{stats.total_transcripts}</p>
          <p className="text-xs text-slate-400">all time</p>
        </div>
      </div>

      {/* Middle Row (Recent & Activity) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Meetings */}
        <div className={`${glassCardClasses} p-5 flex flex-col`}>
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Clock className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Recent meetings</h3>
          </div>
          <div className="flex-1 flex flex-col gap-0">
            {recentMeetings.length === 0 ? (
              <p className="text-sm text-slate-500 mt-2">No recent meetings found.</p>
            ) : (
              recentMeetings.map((m, idx) => {
                const isToday = new Date(m.created_at).toDateString() === new Date().toDateString();
                return (
                  <div key={m.id} className={`flex items-center justify-between py-3 ${idx !== recentMeetings.length -1 ? 'border-b border-slate-200/50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-purple-600' : 'bg-slate-300'}`}></div>
                      <div>
                        <p className="text-slate-900 font-bold text-sm">{m.title}</p>
                        <p className="text-xs text-slate-500">{isToday ? 'Today' : new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, {new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200">
                      Done
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className={`${glassCardClasses} p-5`}>
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <Activity className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Activity</h3>
          </div>
          <div className="flex flex-col gap-4">
            {displayActivity.map(item => (
              <div key={item.day} className="flex items-center gap-4">
                <div className="w-8 text-sm text-slate-500 font-medium">{item.day}</div>
                <div className="flex-1 bg-slate-200/50 rounded-full h-4 overflow-hidden relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(item.count / maxActivity) * 100}%` }}
                  ></div>
                </div>
                <div className="w-4 text-right text-sm text-slate-700 font-bold">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <button onClick={() => navigate('/livemeeting')} className={`${glassCardClasses} p-4 flex items-center gap-4 hover:bg-white/80 transition-colors text-left group`}>
          <div className="bg-purple-100 rounded-lg p-2 group-hover:scale-105 transition-transform">
            <Mic className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm">Live meeting</p>
            <p className="text-xs text-slate-500">Record & transcribe</p>
          </div>
        </button>

        <button onClick={() => navigate('/transcribe')} className={`${glassCardClasses} p-4 flex items-center gap-4 hover:bg-white/80 transition-colors text-left group`}>
          <div className="bg-blue-100 rounded-lg p-2 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm">Transcribe</p>
            <p className="text-xs text-slate-500">Upload audio file</p>
          </div>
        </button>

        <button onClick={() => navigate('/summary')} className={`${glassCardClasses} p-4 flex items-center gap-4 hover:bg-white/80 transition-colors text-left group`}>
          <div className="bg-yellow-100 rounded-lg p-2 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm">Summarize</p>
            <p className="text-xs text-slate-500">AI meeting notes</p>
          </div>
        </button>

        <button onClick={() => navigate('/profile')} className={`${glassCardClasses} p-4 flex items-center gap-4 hover:bg-white/80 transition-colors text-left group`}>
          <div className="bg-indigo-100 rounded-lg p-2 group-hover:scale-105 transition-transform">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm">Profile</p>
            <p className="text-xs text-slate-500">Manage account</p>
          </div>
        </button>
      </div>

    </div>
  );
};

export default DashboardOverview;
