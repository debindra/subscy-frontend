import React from 'react';
import { Modal } from '../ui/Modal';
import { BudgetSettingsForm } from '@/components/settings/BudgetSettingsForm';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const BudgetSettingsModal: React.FC<BudgetSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Budget Settings" size="md">
      <BudgetSettingsForm
        onSaved={() => {
          onSave();
          onClose();
        }}
      />
    </Modal>
  );
};


