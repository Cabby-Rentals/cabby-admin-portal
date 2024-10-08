import React from 'react';
import Link from 'next/link';
import { Button, Space, Table, TableColumnsType, message } from 'antd';
import {
  useUpdateVehicleStatus,
  useVehiclesByStatus,
} from '@/api/vehicles/hooks';
import { Vehicle, VehicleStatus } from '@/api/vehicles/types';
import {
  deleteVehicle,
  saveVehicleRejection,
  updateVehicleStatus,
} from '@/api/vehicles/vehicles';
import ActionButtons from '@/components/ActionButtons/ActionButtons';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import DefaultModal from '@/components/modals/DefautlModal';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { dayjsExtended } from '@/utils/date';
import {
  VehicleConfirmModal,
  VehicleDeleteModal,
  VehicleRecoverModal,
} from './Modals';

export type VehicleStatusType = keyof typeof VehicleStatus;

const useColumns = ({
  status,
}: {
  status?: VehicleStatusType;
}): TableColumnsType<Vehicle> => {
  const { mutateAsync: updateStatus } = useUpdateVehicleStatus();
  const handleApprove = async (vehicleId: string) => {
    await updateStatus({ id: vehicleId, status: VehicleStatus.ACTIVE });
    // await refresh();
  };

  const handleReject = async (vehicleId: string) => {
    await updateStatus({ id: vehicleId, status: VehicleStatus.REJECTED });
    // await refresh();
  };

  const onSubmitRejectReason = async (id: string, reason: string) => {
    await saveVehicleRejection(id, reason);
    // await refresh();
  };
  return [
    // {
    //   title: 'Company',
    //   dataIndex: 'companyName',
    //   key: 'companyName',
    // },
    { title: 'Merk & model', dataIndex: 'model', key: 'model' },
    { title: 'Type', dataIndex: 'licensePlate', key: 'licensePlate' },
    {
      title: 'Min',
      dataIndex: 'manufactureYear',
      key: 'manufactureYear',
      render(value, record, index) {
        const timeframes = record.timeframes;
        const day = dayjsExtended(new Date()).day() - 1;
        const column = day >= 0 ? day : 6;
        const min = Math.min(...timeframes?.[column])?.toFixed(2);

        return <div>€ {min}</div>;
      },
    },
    {
      title: 'Max',
      dataIndex: 'engineType',
      key: 'engineType',
      render(value, record, index) {
        const timeframes = record.timeframes;
        const day = dayjsExtended(new Date()).day() - 1;
        const column = day >= 0 ? day : 6;
        const max = Math.max(...timeframes?.[column])?.toFixed(2);

        return <div>€ {max}</div>;
      },
    },
    {
      title: 'Reden',
      dataIndex: 'seatingCapacity',
      key: 'seatingCapacity',
    },
    // {
    //   title: 'Battery Capacity',
    //   dataIndex: 'batteryCapacity',
    //   key: 'batteryCapacity',
    // },
    // { title: 'Price Per Day', dataIndex: 'pricePerDay', key: 'pricePerDay' },
    // { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Details',
      render: (value: any, record: any) => (
        <Link href={`/dashboard/vehicles/${record.id}`}>Details</Link>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Vehicle) => {
        const id = record.id;
        return (
          <div className="flex items-center gap-2">
            {status === 'PENDING' ? (
              <>
                <VehicleConfirmModal id={id} />
                <VehicleDeleteModal id={id} />
              </>
            ) : (
              <>
                <VehicleRecoverModal id={id} />
                <VehicleDeleteModal id={id} />
              </>
            )}
          </div>
        );
      },
    },
  ];
};

export const VehiclesTab = ({
  status,
  label,
}: {
  status: VehicleStatusType;
  label: string;
}) => {
  const router = useRouter();
  const {
    data: vehicles,
    isLoading,
    // refresh,
  } = useVehiclesByStatus(status);

  const onCreateNewVehicle = () => {
    router.push('/dashboard/vehicles/create-vehicle');
  };

  const isPending = status === 'PENDING';
  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 first-letter:capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            {isPending ? `Auto's ${label}` : `${label} auto('s)`}
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            {isPending
              ? `Totaal ${vehicles?.length} auto's ${label}`
              : `Totaal ${vehicles?.length} ${label} auto('s)`}
          </h6>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined rev={undefined} />}
          onClick={onCreateNewVehicle}
          className="flex items-center"
        >
          Auto toevoegen
        </Button>
      </div>
      <Table
        // scroll={{ x: 'max-content' }}
        // className="w-full"
        // tableLayout="fixed"
        columns={useColumns({ status })}
        dataSource={vehicles}
        loading={isLoading}
      />
    </div>
  );
};
