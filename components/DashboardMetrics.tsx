import { MetricCard } from "@/types";


interface DashboardMetricsProps {
    metrics: any;
}
const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
    // const formatData = [
    //     {
    //         title: 'Authority Score',
    //         value: metrics?.authorityScore || 0,
    //         change: metrics?.authorityScore || 0
    //     },
    //     {
    //         title: 'Organic Traffic',
    //         value: metrics?.organicTraffic || 0,
    //         change: metrics?.organicTraffic || 0
    //     },
    //     {
    //         title: 'Organic Keywords',
    //         value: metrics?.organicKeywords || 0,
    //         change: metrics?.organicKeywords || 0
    //     },
    //     {
    //         title: 'Paid Keywords',
    //         value: metrics?.paidKeywords || 0,
    //         change: metrics?.paidKeywords || 0
    //     },
    //     {
    //         title: 'Backlinks',
    //         value: metrics?.backlinks || 0,
    //         change: metrics?.backlinks || 0
    //     }
    // ]

    const formatData = [
        {
            title: 'Authority Score',
            value: 0,
            change: 0
        },
        {
            title: 'Organic Traffic',
            value: 0,
            change: 0
        },
        {
            title: 'Organic Keywords',
            value: 0,
            change: 0
        },
        {
            title: 'Paid Keywords',
            value: 0,
            change: 0
        },
        {
            title: 'Backlinks',
            value: 0,
            change: 0
        }
    ]

    console.log('Formatted Metrics Data:', formatData);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {formatData?.map((metric, index) => {
                // const isNegative = metric.change.includes('-');

                return (
                    <div key={index} className="bg-white/5 rounded-lg p-4">
                        <p className="text-white text-sm md:text-lg mb-2">{metric.title}</p>
                        <div className="flex items-center justify-between space-x-2">
                            <span className="text-xl md:text-2xl font-bold text-[#00FFFF]">
                                {metric.value}
                            </span>
                            <span
                            // className={`text-sm p-1 px-2 rounded ${isNegative
                            //     ? 'text-red-500 bg-red-600/25'
                            //     : 'text-green-400 bg-green-600/25'
                            //     }`}
                            >
                                {metric.change}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DashboardMetrics;