/* eslint-disable @next/next/no-img-element */
import { Modal } from 'antd';
import React from 'react';

interface Props {
  open: boolean;
  hideModal: () => void;
  onConfirm: () => void;
  confirmationMessage: string;
  paragraph?: string;
  confirmationPlaceholder?: string;
}

const ConfirmationModal: React.FC<Props> = ({
  open,
  hideModal,
  onConfirm,
  confirmationMessage,
  paragraph,
  confirmationPlaceholder,
}) => (
  <Modal
    onCancel={hideModal}
    width={320}
    visible={open}
    centered
    footer={false}
  >
    <div className="text-center">
      <div className="relative bg-gray-50 rounded-3xl mx-auto w-32 h-32 mb-5">
        <img
          className="rounded-3xl"
          src="/assets/reject-car-image.svg"
          alt=".."
        />
      </div>
      <h6 className="mb-2 text-base font-bold text-neutral-100">
        {confirmationMessage}
      </h6>
      <p>{paragraph}</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={hideModal}
          type="button"
          className="btn-outline-primary w-full"
        >
          <span className="text-base font-bold">Annuleren</span>
        </button>
        <button
          onClick={onConfirm}
          type="button"
          className="btn-primary w-full whitespace-nowrap"
        >
          <span className="text-base font-bold">
            {confirmationPlaceholder ?? 'Afwijzen'}
          </span>
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmationModal;
