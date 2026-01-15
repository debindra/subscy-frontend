'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  itemName?: string;
  confirmText?: string;
  title?: string;
  confirmLabel?: string;
}

const DEFAULT_CONFIRM_TEXT = 'delete';

const normalizeText = (value: string) => value.trim().toLowerCase();

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  confirmText = DEFAULT_CONFIRM_TEXT,
  title = 'Delete subscription',
  confirmLabel = 'Delete subscription',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedConfirmText = useMemo(
    () => normalizeText(confirmText),
    [confirmText]
  );

  const isMatch = normalizeText(inputValue) === normalizedConfirmText;
  const confirmTextDisplay = confirmText.toUpperCase();

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!isMatch) {
      setError(`Type ${confirmTextDisplay} to confirm.`);
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const success = await onConfirm();
      if (success) {
        onClose();
      }
    } catch (err) {
      setError('Delete failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          This action cannot be undone. It will permanently delete{' '}
          <span className="font-semibold">
            {itemName ? `"${itemName}"` : 'this subscription'}
          </span>
          .
        </div>

        <Input
          label={`Type ${confirmTextDisplay} to confirm`}
          placeholder={confirmTextDisplay}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          error={error}
          autoFocus
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            disabled={!isMatch || isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

