import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Users, User, Shield, Send, Image, Video, 
  FileText, Music, Mic, Square, Trash2, Plus, Copy, Check, 
  LogOut, Lock, Settings, Menu, X, Radio, Bot, Download
} from 'lucide-react';

const THEMES = {
  emerald: { primary: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-600', hover: 'hover:bg-emerald-700', bubble: 'bg-emerald-600 text-white' },
  blue: { primary: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-600', hover: 'hover:bg-blue-700', bubble: 'bg-blue-600 text-white' },
  purple: { primary: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-600', hover: 'hover:bg-purple-700', bubble: 'bg-purple-600 text-white' },
  rose: { primary: 'bg-rose-600', text: 'text-rose-400', border: 'border-rose-600', hover: 'hover:bg-rose-700', bubble: 'bg-rose-600 text-white' },
  slate: { primary: 'bg-slate-700', text: 'text-slate-400', border: 'border-slate-700', hover: 'hover:bg-slate-800', bubble: 'bg-slate-700 text-white' },
};

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('emerald');
  const [user, setUser] = useState(null);
  
  // Auth Form Inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');

  // Feature Toggles Controlled By Owner
  const [features, setFeatures] = useState({ allowMedia: true, allowVoice: true, globalMute: false });
  const [activeChatId, setActiveChatId] = useState('gemini-35-pro');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('chats'); 
  
  // Modals & Token management
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [joinInputLink, setJoinInputLink] = useState('');

  // Chat/Input states
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const messagesEndRef = useRef(null);

  // User database mock pool
  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'John Doe', email: 'john@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { id: 'u2', name: 'Sarah Connor', email: 'sarah@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  ]);

  // Active Chats Panel items
  const [chats, setChats] = useState([
    { id: 'gemini-35-pro', name: 'Gemini 3.5 Pro', type: 'ai', avatar: 'bot', link: '' },
    { id: 'u1', name: 'John Doe', type: 'private', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { id: 'u2', name: 'Sarah Connor', type: 'private', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: 'g1', name: '𝛥𝛯𝛶 Public Launch', type: 'group', avatar: 'group', link: 'ALEX-PIKU-G1' }
  ]);

  // Universal Message Matrix Pool
  const [messages, setMessages] = useState([
    { id: 'm1', chatId: 'gemini-35-pro', senderId: 'gemini', senderName: 'Gemini 3.5 Pro', text: 'Hello! I am Gemini 3.5 Pro. Send me text, photos, music files, or voice clips, and I will analyze them!', type: 'text', timestamp: '9:15 PM' },
    { id: 'm2', chatId: 'g1', senderId: 'u1', senderName: 'John Doe', text: 'Welcome to the 𝛥𝐿𝛯𝛸-𝛲𝛪𝛫𝑈 hub!', type: 'text', timestamp: '9:16 PM' }
  ]);

  const theme = THEMES[currentTheme];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Highly Secure Masked Auth Execution Logic
  const handleAuth = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail || !authPassword) {
      setAuthError('All credentials must be populated.');
      return;
    }

    // Standardized Security Check against Hidden Credentials
    if (authEmail.trim() === 'pikubalur@gmail.com') {
      if (authPassword === 'Alexpiku@#2006') {
        setUser({ id: 'owner', name: '𝛥𝐿𝛯𝛸-𝛲𝛪𝛫𝑈 Owner', email: authEmail, isAdmin: true, avatar: 'shield' });
        clearAuth();
        return;
      } else {
        setAuthError('Invalid credentials matching administrative identity vector.');
        return;
      }
    }

    // General User Login
    if (isRegistering) {
      if (!authName) {
        setAuthError('Please provide a user nickname.');
        return;
      }
      const newUser = { id: 'u_' + Date.now(), name: authName, email: authEmail, isAdmin: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' };
      setUsersList(prev => [...prev, newUser]);
      setUser(newUser);
    } else {
      const existing = usersList.find(u => u.email === authEmail);
      if (existing) {
        setUser({ ...existing, isAdmin: false });
      } else {
        setUser({ id: 'u_' + Date.now(), name: authEmail.split('@')[0], email: authEmail, isAdmin: false, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' });
      }
    }
    clearAuth();
  };

  const clearAuth = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
  };

  // Dispatch Messages Framework
  const handleSendMessage = (textPayload = '', mediaObj = null) => {
    if (!textPayload.trim() && !mediaObj) return;
    if (features.globalMute && !user.isAdmin) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: 'msg_' + Date.now(),
      chatId: activeChatId,
      senderId: user.id,
      senderName: user.name,
      text: textPayload,
      type: mediaObj ? mediaObj.type : 'text',
      mediaUrl: mediaObj ? mediaObj.url : null,
      fileName: mediaObj ? mediaObj.name : null,
      timestamp
    };

    setMessages(prev => [...prev, newMsg]);
    setMessageText('');

    // Trigger Gemini 3.5 Pro Response Matrix
    if (activeChatId === 'gemini-35-pro') {
      triggerGeminiModel(textPayload, mediaObj);
    }
  };

  // Upgraded AI Simulation: Gemini 3.5 Pro Multimodal Parsing Engine
  const triggerGeminiModel = (userText, mediaObj) => {
    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let aiResponse = `🤖 **Gemini 3.5 Pro Processing Frame**: System verification functional. `;

      if (mediaObj) {
        switch (mediaObj.type) {
          case 'image':
            aiResponse = `📸 **Gemini 3.5 Pro Multi-Modal Vision Processing**: Image token identified. Analyzing binary structural pixels inside [${mediaObj.name}]. Image looks sharp with rich visual layout configurations.`;
            break;
          case 'video':
            aiResponse = `🎬 **Gemini 3.5 Pro Frame-by-Frame Parser**: Video assets tracked successfully. Scanned frames inside [${mediaObj.name}]. Audio and visual parameters are stable.`;
            break;
          case 'music':
            aiResponse = `🎵 **Gemini 3.5 Pro Audio Waveform Evaluator**: Media track metadata parsed for [${mediaObj.name}]. Frequency distribution profile successfully logged.`;
            break;
          case 'voice':
            aiResponse = `🎙️ **Gemini 3.5 Pro Speech-to-Text Module**: Voice sample analyzed. Audio telemetry processing suggests safe structural alignment metrics.`;
            break;
          case 'document':
            aiResponse = `📄 **Gemini 3.5 Pro Data Schema Extractor**: Document [${mediaObj.name}] successfully verified and protected. File verification code matches platform values.`;
            break;
        }
      } else {
        const query = userText.toLowerCase();
        if (query.includes('hi') || query.includes('hello')) aiResponse = "Welcome user! I am Gemini 3.5 Pro. Upload a video, drop a text prompt, send a document, or record a voice note and let's process it!";
        else if (query.includes('owner')) aiResponse = "This customized chat hub workspace is fully owned by pikubalur@gmail.com under strict configuration tokens.";
        else aiResponse = `Gemini 3.5 Pro has successfully parsed your communication vector stream input: "${userText}". Engine state remains nominal and ultra-fast.`;
      }

      setMessages(prev => [...prev, {
        id: 'gemini_' + Date.now(),
        chatId: 'gemini-35-pro',
        senderId: 'gemini',
        senderName: 'Gemini 3.5 Pro',
        text: aiResponse,
        type: 'text',
        timestamp
      }]);
    }, 1100);
  };

  // Multi-format Media Handling Framework
  const handleMediaUpload = (e, fileType) => {
    if (!features.allowMedia && !user.isAdmin) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleSendMessage(file.name, {
        type: fileType,
        url: reader.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // Real HTML5 Microphone Recorder Integration
  const initiateVoiceRecord = async () => {
    if (!features.allowVoice && !user.isAdmin) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      let chunks = [];

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        handleSendMessage('Audio Transmission Note', { type: 'voice', url, name: `Voice-${Date.now()}.webm` });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone configuration allocation failed. Please confirm interface permissions.");
    }
  };

  const terminateVoiceRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Group Workspace Construction Flow
  const triggerCreateGroupNode = () => {
    if (!newGroupName.trim()) return;
    const gId = 'g_' + Date.now();
    const token = `ALEX-PIKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const configuredGroupChannel = {
      id: gId,
      name: newGroupName.trim(),
      type: 'group',
      avatar: 'group',
      link: token
    };

    setChats(prev => [...prev, configuredGroupChannel]);
    setNewGroupName('');
    setShowCreateGroup(false);
    setActiveChatId(gId);

    // Append standard operational logging update
    setMessages(prev => [...prev, {
      id: 'sys_' + Date.now(),
      chatId: gId,
      senderId: 'system',
      senderName: 'System Log',
      text: `${user.name} created the group network channel. Share invite token: ${token}`,
      type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const processGroupLinkJoin = () => {
    if (!joinInputLink.trim()) return;
    const targetLink = joinInputLink.trim();
    const targetGroup = chats.find(c => c.link === targetLink);

    if (targetGroup) {
      setActiveChatId(targetGroup.id);
      setJoinInputLink('');
    } else {
      alert("Invalid Invite link token signature configuration matrix.");
    }
  };

  // Moderation Logic Pipelines
  const removeSpecificMessage = (id) => setMessages(prev => prev.filter(m => m.id !== id));
  const wipeCurrentChatArray = (cId) => setMessages(prev => prev.filter(m => m.chatId !== cId));
  const runLinkCopy = (txt, id) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const selectedChatContext = chats.find(c => c.id === activeChatId);
  const activeTimelineMessages = messages.filter(m => m.chatId === activeChatId);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500">
              𝛥𝐿𝛯𝛸-𝛲𝛪𝛫𝑈
            </h1>
            <p className="text-slate-400 text-xs mt-1">Multi-Channel Protected Communication Hub</p>
          </div>

          {authError && <div className="bg-rose-950/60 text-rose-400 text-xs p-3 rounded-xl border border-rose-800">{authError}</div>}

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Display Alias</label>
                <input type="text" value={authName} onChange={e => setAuthName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="Username" />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Network Identity Email</label>
              <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="name@domain.com" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Security Access Key</label>
              <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="••••••••" required />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm py-3 rounded-xl shadow-lg transition-transform active:scale-98">
              {isRegistering ? 'Register Channel' : 'Establish Node Session'}
            </button>
          </form>
          <div className="text-center"><button onClick={() => setIsRegistering(!isRegistering)} className="text-xs text-teal-400 hover:underline">{isRegistering ? 'Have a terminal account? Sign In' : 'Need structural credentials? Register here'}</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 flex overflow-hidden">
      
      {/* Structural Responsive Sidebar component */}
      <div className={`${sidebarOpen ? 'w-full md:w-85' : 'w-0 md:w-0'} max-w-md bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-200 z-30 overflow-hidden`}>
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ${theme.primary}`}>
              {user.isAdmin ? <Shield className="w-4 h-4" /> : user.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate max-w-[120px]">
              <h4 className="text-xs font-bold truncate text-slate-200">{user.name}</h4>
              <span className="text-[9px] text-slate-500 block font-mono">{user.isAdmin ? 'Site Admin' : 'Active Peer'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {user.isAdmin && (
              <button onClick={() => setCurrentView(currentView === 'admin' ? 'chats' : 'admin')} className={`p-2 rounded-lg text-slate-400 hover:text-white ${currentView === 'admin' ? theme.primary + ' !text-white' : 'hover:bg-slate-800'}`}>
                <Settings className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setUser(null)} className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/20"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>

        {currentView === 'admin' && user.isAdmin ? (
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest block uppercase mb-2">Global System Skins</span>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(THEMES).map(tk => (
                  <button key={tk} onClick={() => setCurrentTheme(tk)} className={`p-2 rounded-lg border text-xs capitalize font-bold flex items-center gap-2 ${currentTheme === tk ? 'border-white bg-slate-800 text-white' : 'border-slate-800 text-slate-400'}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${THEMES[tk].primary}`} /> {tk}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest block uppercase">Functional Overrides</span>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer"><span>Allow Media Uploads</span><input type="checkbox" checked={features.allowMedia} onChange={e => setFeatures({...features, allowMedia: e.target.checked})} className="accent-emerald-500" /></label>
                <label className="flex items-center justify-between cursor-pointer border-t border-slate-900 pt-2"><span>Allow Recording Nodes</span><input type="checkbox" checked={features.allowVoice} onChange={e => setFeatures({...features, allowVoice: e.target.checked})} className="accent-emerald-500" /></label>
                <label className="flex items-center justify-between cursor-pointer border-t border-slate-900 pt-2 text-rose-400"><span>Global Client Mute</span><input type="checkbox" checked={features.globalMute} onChange={e => setFeatures({...features, globalMute: e.target.checked})} className="accent-rose-500" /></label>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex gap-2">
              <input type="text" placeholder="Paste Token Link Code..." value={joinInputLink} onChange={e => setJoinInputLink(e.target.value)} className="flex-1 text-xs bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none" />
              <button onClick={processGroupLinkJoin} className={`text-xs px-3 py-1.5 text-white font-bold rounded-lg ${theme.primary} ${theme.hover}`}>Join</button>
            </div>
            <div className="p-3 flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Active Target Paths</span>
              <button onClick={() => setShowCreateGroup(true)} className={`px-2 py-1 rounded flex items-center gap-1 text-[10px] text-white ${theme.primary}`}><Plus className="w-3 h-3" /> Create Group</button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chats.map(c => (
                <div key={c.id} onClick={() => { setActiveChatId(c.id); if(window.innerWidth < 768) setSidebarOpen(false); }} className={`p-3 rounded-xl flex items-center justify-between cursor-pointer ${activeChatId === c.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-300
