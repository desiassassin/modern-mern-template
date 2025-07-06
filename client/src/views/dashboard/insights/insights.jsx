import { useQuery } from "@tanstack/react-query";
import { CustomMoneyCard, CustomStatsCard } from "@/components/dashboard/insights/customCard";
import CountUp from "react-countup";
import { Button, Card, CardBody, CardHeader, Divider, Skeleton } from "@heroui/react";
import { RotateCw } from "lucide-react";

export default function Insights() {
     const { data: stats, ...statsQuery } = useQuery({
          queryKey: ["insights-stats"],
          queryFn: async function () {
               return new Promise((resolve, reject) => {
                    setTimeout(() => {
                         if (Math.random() > 0.25)
                              resolve({
                                   most_important: Math.round(Math.random() * 1000000),
                                   stat_1: Math.round(Math.random() * 100),
                                   stat_2: Math.round(Math.random() * 1000),
                                   stat_3: Math.round(Math.random() * 10000),
                                   stat_4: Math.round(Math.random() * 10000),
                                   stat_5: Math.round(Math.random() * 1000),
                                   stat_6: Math.round(Math.random() * 100)
                              });
                         else reject();
                    }, 2000);
               });
          }
     });

     return (
          <div className="flex flex-col gap-3 p-3 pt-1">
               {statsQuery.isLoading &&
                    [1, 2, 3].map((item) => (
                         <div key={item} className="w-full h-12 rounded-lg">
                              <Skeleton className="w-full h-full rounded-lg" />
                         </div>
                    ))}
               {/* error occured */}
               {!statsQuery.isLoading && statsQuery.isError && (
                    <Card className="m-5 self-center">
                         <CardHeader className="justify-center">
                              <h1 className="text-2xl">Oops! Some Error Occured</h1>
                         </CardHeader>
                         <Divider />
                         <CardBody className="flex flex-col items-center gap-3 text-center sm:p-unit-10">
                              <p>Some error occured while fetching data.</p>
                              <Button
                                   radius="sm"
                                   size="sm"
                                   color="primary"
                                   aria-label="Like"
                                   onPress={statsQuery.refetch}
                                   startContent={<RotateCw size={20} />}
                              >
                                   Retry
                              </Button>
                         </CardBody>
                    </Card>
               )}
               {!statsQuery.isLoading && statsQuery.isSuccess && (
                    <>
                         <div>
                              <p className="text-xl md:text-2xl font-bold">Most important stat</p>
                              <p className="text-4xl md:text-6xl font-bold text-success">
                                   <CountUp end={stats.most_important} prefix="₹" duration={3} useIndianSeparators />
                              </p>
                         </div>
                         <div className="flex gap-5 flex-wrap mt-2 md:mt-5">
                              <div className="flex gap-5 overflow-x-auto pb-3">
                                   <CustomMoneyCard title={"Stat 1"} value={stats.stat_1} />
                                   <CustomMoneyCard title={"Stat 2"} value={stats.stat_2} />
                              </div>
                              <div className="flex gap-5 overflow-x-auto pb-3">
                                   <CustomStatsCard title={"Stat 1"} value={stats.stat_3} />
                                   <CustomStatsCard title={"Stat 2"} value={stats.stat_4} />
                                   <CustomStatsCard title={"Stat 3"} value={stats.stat_5} />
                                   <CustomStatsCard title={"Stat 4"} value={stats.stat_6} />
                              </div>
                         </div>
                    </>
               )}
          </div>
     );
}
