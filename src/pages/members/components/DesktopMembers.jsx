import { useMembers } from '../../../hooks/useMembers';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import BorderGlow from '../../../components/ui/BorderGlow';
import { Users, UserPlus, Trash2, Mail, Shield, Eye, Pencil, ChevronDown, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Viewer', icon: Eye, description: 'Hanya bisa melihat data' },
  { value: 'editor', label: 'Editor', icon: Pencil, description: 'Bisa edit & tambah data' },
];

function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const selected = ROLE_OPTIONS.find(r => r.value === value) || ROLE_OPTIONS[0];
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handler = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.right - 224 }); // 224 = w-56
    }
    setOpen(o => !o);
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-medium hover:bg-accent/50 transition-colors min-w-[130px] justify-between"
      >
        <span className="flex items-center gap-2">
          <selected.icon className="w-4 h-4 text-muted-foreground" />
          {selected.label}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          className="fixed w-56 bg-popover border border-border rounded-xl shadow-xl z-[9999] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
          style={{ top: pos.top, left: pos.left }}
        >
          {ROLE_OPTIONS.map(role => (
            <button
              key={role.value}
              type="button"
              onClick={() => { onChange(role.value); setOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-accent/60 ${value === role.value ? 'bg-accent/40' : ''}`}
            >
              <role.icon className={`w-4 h-4 mt-0.5 ${value === role.value ? 'text-blue-500' : 'text-muted-foreground'}`} />
              <div>
                <p className={`font-medium ${value === role.value ? 'text-blue-600 dark:text-blue-400' : ''}`}>{role.label}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{role.description}</p>
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

function RoleBadge({ role }) {
  const config = {
    owner: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: Shield },
    editor: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Pencil },
    viewer: { bg: 'bg-slate-100 dark:bg-slate-800/50', text: 'text-slate-600 dark:text-slate-400', icon: Eye },
  };
  const c = config[role] || config.viewer;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === 'accepted') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="w-3 h-3" /> Aktif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}


export default function DesktopMembers() {
  const { mode } = useMode();
  const { confirmDialog } = useConfirm();
  const { members, loading, error, invite, removeMember } = useMembers();
  const isPersonal = mode === 'personal';
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    try {
      await invite(null, email.trim(), role);
      setEmail('');
      setRole('viewer');
      toast.success(`Undangan sebagai ${role} terkirim!`);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Gagal mengirim undangan');
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async (id) => {
    confirmDialog({
      title: 'Hapus Anggota',
      description: 'Yakin ingin menghapus anggota ini dari profil bisnis?',
      onConfirm: async () => {
        try {
          await removeMember(id);
          toast.success('Anggota dihapus');
        } catch (err) {
          toast.error('Gagal menghapus anggota');
        }
      }
    });
  };

  // BorderGlow config — always dark card background
  const glowConfig = {
    backgroundColor: '#060010',
    glowColor: '40 80 80',
    glowIntensity: 3,
    colors: ['#c084fc', '#f472b6', '#38bdf8'],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPersonal ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
            <Users className={`w-5 h-5 ${isPersonal ? 'text-purple-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Anggota Tim</h1>
            <p className="text-sm text-muted-foreground">Kelola akses kolaborator profil bisnis</p>
          </div>
        </div>
      </AnimatedContent>

      {/* Invite Form with BorderGlow */}
      <AnimatedContent direction="vertical" delay={100}>
        <BorderGlow
          edgeSensitivity={30}
          glowColor={glowConfig.glowColor}
          backgroundColor={glowConfig.backgroundColor}
          borderRadius={20}
          glowRadius={80}
          glowIntensity={glowConfig.glowIntensity}
          coneSpread={45}
          animated={false}
          colors={glowConfig.colors}
        >
          <div className="p-5">
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Undang Anggota Baru
            </h2>
            <form onSubmit={handleInvite} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="invite-email-input"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Role</label>
                <RoleDropdown value={role} onChange={setRole} />
              </div>
              <button
                id="invite-submit-btn"
                type="submit"
                disabled={inviting}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {inviting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Undang
                  </>
                )}
              </button>
            </form>
          </div>
        </BorderGlow>
      </AnimatedContent>

      {/* Member List */}
      <AnimatedContent direction="vertical" delay={200}>
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" /> Anggota ({members.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin opacity-50" />
              <p className="text-sm">Memuat anggota...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">Gagal memuat data</div>
          ) : members.length === 0 ? (
            <BorderGlow
              edgeSensitivity={30}
              glowColor={glowConfig.glowColor}
              backgroundColor={glowConfig.backgroundColor}
              borderRadius={20}
              glowRadius={80}
              glowIntensity={glowConfig.glowIntensity}
              coneSpread={45}
              animated={false}
              colors={glowConfig.colors}
            >
              <div className="p-12 text-center text-muted-foreground">
                <Users className="w-14 h-14 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Belum ada anggota tim</p>
                <p className="text-sm mt-1">Undang rekan kerjamu untuk mulai berkolaborasi</p>
              </div>
            </BorderGlow>
          ) : (
            <div className="space-y-3">
              {members.map((member, i) => (
                <AnimatedContent key={member.id} direction="vertical" delay={250 + i * 60}>
                  <BorderGlow
                    edgeSensitivity={30}
                    glowColor={glowConfig.glowColor}
                    backgroundColor={glowConfig.backgroundColor}
                    borderRadius={20}
                    glowRadius={80}
                    glowIntensity={glowConfig.glowIntensity}
                    coneSpread={45}
                    animated={false}
                    colors={glowConfig.colors}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                          {(member.name || member.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{member.name || member.email}</p>
                          {member.name && <p className="text-xs text-muted-foreground">{member.email}</p>}
                          <div className="flex items-center gap-2 mt-1">
                            <RoleBadge role={member.role || 'viewer'} />
                            <StatusBadge status={member.status} />
                          </div>
                        </div>
                      </div>
                      <button
                        id={`delete-member-${member.id}`}
                        onClick={() => handleDelete(member.id)}
                        className="p-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-all hover:scale-105"
                        title="Hapus anggota"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </BorderGlow>
                </AnimatedContent>
              ))}
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}
