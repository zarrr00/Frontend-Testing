import { createContext, useContext, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState({ 
    title: '', 
    description: '', 
    confirmText: 'Ya', 
    isDestructive: true,
    icon: null,
    onConfirm: () => {} 
  });

  const confirmDialog = ({ title, description, confirmText = 'Ya, Hapus', isDestructive = true, icon = null, onConfirm }) => {
    setConfig({ title, description, confirmText, isDestructive, icon, onConfirm });
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    if (config.onConfirm) {
      await config.onConfirm();
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirmDialog }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.isDestructive ? 'bg-rose-500/10' : 'bg-blue-500/10'}`}>
                 {config.icon ? config.icon : <AlertTriangle className={`w-4 h-4 ${config.isDestructive ? 'text-rose-500' : 'text-blue-500'}`} />}
               </div>
               {config.title || "Konfirmasi"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {config.description || "Apakah Anda yakin ingin melanjutkan tindakan ini?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm} 
              className={config.isDestructive ? "!bg-rose-600 !text-white hover:!bg-rose-700 focus:!ring-rose-500" : "!bg-blue-600 !text-white hover:!bg-blue-700"}
            >
              {config.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
};
