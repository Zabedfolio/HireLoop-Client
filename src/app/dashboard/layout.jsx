import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <div className="flex flex-col flex-1 overflow-hidden lg:flex-row">
                <DashboardSidebar />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;