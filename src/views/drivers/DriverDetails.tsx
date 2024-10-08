import React from 'react';
import { useRouter } from 'next/router';
import { Card, Input, Image } from 'antd';
import Link from 'next/link';
import DriverCard from '../../components/cards/DriverCard';
import styles from '@/styles/Driver.module.css';
import { useDriverById } from '@/api/drivers/hooks';
import PdfIcon from '@/components/icons/PdfIcon';
import UserVerificationCard from './UserVerificationCard';

const InputItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="text-neutral-100 text-sm font-medium capitalize mb-2 block">
      {label}
    </label>
    <Input
      placeholder={label}
      disabled
      className="font-medium capitalize disabled:bg-[#DBDBDB] disabled:text-neutral-75 placeholder:text-neutral-75"
      value={value || 'Not Available'}
    />
  </div>
);

export default function DriverDetails() {
  const router = useRouter();
  const driverId = router.query.driverId as string;
  const { data: driver, loading, refetch } = useDriverById(driverId);

  if (loading || !driver) return <div>Loading...</div>;

  const renderDocument = (
    title: string,
    documentLink: string,
    isImage = false,
  ) => (
    <li>
      <Card>
        <h2 className="mb-4 font-medium text-xl text-primary-base">{title}</h2>
        {isImage ? (
          <Image className="rounded-xl" src={documentLink} alt={title} />
        ) : (
          <div
            className={styles.pdfBox}
            onClick={() => window.open(documentLink, '_blank', 'noopener')}
          >
            <PdfIcon />
            <h6 className={styles.pdfIconLabel}>{title} Document</h6>
          </div>
        )}
      </Card>
    </li>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/dashboard/drivers" className="btn-primary mb-8">
          Back
        </Link>
      </div>
      <h4 className="mb-6 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
        {driver.fullName} ({driver.status})
      </h4>
      <div className="mb-8">
        <DriverCard refetch={refetch} driver={driver} isDetailPage={true} />
      </div>
      <div className="mb-8">
        <Card title="Personal Info" className="space-y-4">
          <InputItem label="Email" value={driver.user.email} />
          <InputItem label="Phone Number" value={driver.phoneNumber} />
          <InputItem
            label="Date of Birth"
            value={driver?.dateOfBirth?.split('T')[0] ?? 'N/A'}
          />
          <InputItem label="Address" value={driver.fullAddress} />
        </Card>
      </div>
      <div className="mb-8">
        {driver.userVerification && (
          <UserVerificationCard verificationData={driver.userVerification} />
        )}
      </div>

      <h4 className="mb-6 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
        Documents
      </h4>

      <Card>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {driver?.driverLicense?.driverLicenseFront &&
            renderDocument(
              "Driver's License (Front)",
              driver.driverLicense?.driverLicenseFront,
              true,
            )}
          {driver?.driverLicense?.driverLicenseBack &&
            renderDocument(
              "Driver's License (Back)",
              driver.driverLicense?.driverLicenseBack,
              true,
            )}
          {driver?.permitDetails?.taxiPermitPicture &&
            renderDocument(
              'Taxi Permit',
              driver.permitDetails?.taxiPermitPicture,
              true,
            )}
          {driver?.permitDetails?.kiwaDocument &&
            renderDocument(
              'Kiwa Taxi Vergunning',
              driver.permitDetails?.kiwaDocument,
            )}
          {driver?.permitDetails?.kvkDocument &&
            renderDocument('KVK Document', driver.permitDetails?.kvkDocument)}
        </ul>
      </Card>
    </div>
  );
}
