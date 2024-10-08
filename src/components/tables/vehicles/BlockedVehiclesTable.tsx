import React from 'react';
import { Table } from 'antd';
import { vehiclesColumns } from '@/views/vehicles/Vehicles';
import { useVehiclesByStatus } from '@/api/vehicles/hooks';
import { VehicleStatus } from '@/api/vehicles/types';

export const BlockedVehiclesTable = () => {
  const { data: vehicles, isLoading } = useVehiclesByStatus(
    VehicleStatus.BLOCKED,
  );

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Blocked Vehicles
          </h4>
          <h6 className="font-medium text-base text-neutral-50">
            Total {vehicles?.length} blocked vehicles
          </h6>
        </div>
      </div>
      <Table
        columns={vehiclesColumns()}
        dataSource={vehicles}
        loading={isLoading}
      />
    </div>
  );
};
