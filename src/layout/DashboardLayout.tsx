import React, { useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import Sidebar from './Sidebar';
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from 'antd/es/breadcrumb/Breadcrumb';

interface Props {
  children: React.ReactNode;
  breadcrumbItems?:
    | Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]
    | undefined;
  headerTitle?: string;
}

const DashboardLayout = ({ children, breadcrumbItems, headerTitle }: Props) => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
      <Head>
        <title>Admin - Cabby</title>
        <meta property="og:title" content="Admin - Cabby" key="title" />
        <link rel="logo" sizes="57x57" href="/logo.png" />
      </Head>
      <main className="min-h-screen flex">
        <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
        <div className="lg:flex flex-col col-span-1 flex-1 min-w-0">
          <Header
            breadcrumbItems={breadcrumbItems}
            onMenu={() => setShowSidebar(!showSidebar)}
            headerTitle={headerTitle}
          />
          <div className="bg-[#FCFCFD] h-full">{children}</div>
        </div>
      </main>
    </>
  );
};

export default DashboardLayout;
