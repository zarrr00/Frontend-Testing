import { useMembers } from '../../../hooks/useMembers';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import BorderGlow from '../../../components/ui/BorderGlow';
import { Users, UserPlus, Mail, Trash2, Eye, Pencil, Shield, ChevronDown, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Viewer', icon: Eye, desc: 'Hanya lihat' },
  { value: 'editor', label: 'Editor', icon: Pencil, desc: 'Bisa edit' },
];

function MobileRoleToggle({ value, onChange }) {
  return (
    <div className="flex rounded-xl border border-border bg-background p-0.5 gap-0.5">
      {ROLE_OPTIONS.map(role => {
        const Icon = role.icon;
        const active = value === role.value;
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              active
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20'
                : 'text-muted-foreground hover:bg-accent/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {role.label}
          </button>
        );
      })}
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
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <Icon className="w-2.5 h-2.5" />
      {role}
    </span>
  );
}

function StatusDot({ status }) {
  if (status === 'accepted') {
    return <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" title="Aktif" />;
  }
  return <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50 animate-pulse" title="Pending" />;
}


export default function MobileMembers() {
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
      description: 'Yakin ingin menghapus anggota ini?',
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

  const glowConfig = {
    backgroundColor: '#060010',
    glowColor: '40 80 80',
    glowIntensity: 3,
    colors: ['#c084fc', '#f472b6', '#38bdf8'],
  };

  return (
    <div className="p-4 space-y-4">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPersonal ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
            <Users className={`w-4 h-4 ${isPersonal ? 'text-purple-600' : 'text-blue-600'}`} />
          </div>
          <h1 className="text-xl font-bold">Anggota Tim</h1>
        </div>
      </AnimatedContent>

      {/* Invite Form */}
      <AnimatedContent direction="vertical" delay={100}>
        <BorderGlow
          edgeSensitivity={30}
          glowColor={glowConfig.glowColor}
          backgroundColor={glowConfig.backgroundColor}
          borderRadius={16}
          glowRadius={60}
          glowIntensity={glowConfig.glowIntensity}
          coneSpread={45}
          animated={false}
          colors={glowConfig.colors}
        >
          <form onSubmit={handleInvite} className="p-4 space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="mobile-invite-email"
                type="email"
                placeholder="Email anggota..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            {/* Role Toggle */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Undang sebagai</label>
              <MobileRoleToggle value={role} onChange={setRole} />
            </div>

            <button
              id="mobile-invite-btn"
              type="submit"
              disabled={inviting}
              className="w-full py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
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
        </BorderGlow>
      </AnimatedContent>

      {/* Members List */}
      {loading ? (
        <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin opacity-50" />
          <p className="text-sm">Memuat...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 text-sm">Gagal memuat</div>
      ) : members.length === 0 ? (
        <AnimatedContent direction="vertical" delay={200}>
          <BorderGlow
            edgeSensitivity={30}
            glowColor={glowConfig.glowColor}
            backgroundColor={glowConfig.backgroundColor}
            borderRadius={16}
            glowRadius={60}
            glowIntensity={glowConfig.glowIntensity}
            coneSpread={45}
            animated={false}
            colors={glowConfig.colors}
          >
            <div className="p-8 text-center text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Belum ada anggota</p>
              <p className="text-xs mt-1">Undang melalui email di atas</p>
            </div>
          </BorderGlow>
        </AnimatedContent>
      ) : (
        <div className="space-y-2.5">
          {members.map((member, i) => (
            <AnimatedContent key={member.id} direction="vertical" delay={200 + i * 60}>
              <BorderGlow
                edgeSensitivity={30}
                glowColor={glowConfig.glowColor}
                backgroundColor={glowConfig.backgroundColor}
                borderRadius={16}
                glowRadius={60}
                glowIntensity={glowConfig.glowIntensity}
                coneSpread={45}
                animated={false}
                colors={glowConfig.colors}
              >
                <div className="p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 shrink-0">
                    {(member.name || member.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm truncate">{member.name || member.email}</p>
                      <StatusDot status={member.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <RoleBadge role={member.role || 'viewer'} />
                      {member.status !== 'accepted' && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400">Pending</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                    title="Hapus"
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
  );
}
