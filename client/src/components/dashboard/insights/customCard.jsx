import { formatCurrency } from "@/utils/utils";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import CountUp from "react-countup";

/**
 *
 * @param {{title: string, value: number}} param0
 * @returns
 */
export function CustomMoneyCard({ title, value }) {
     return (
          <Card className="dark:bg-grey flex-1 min-w-fit px-2 border dark:border-0 shadow-md">
               <CardHeader className="uppercase block">
                    <p className="text-center text-nowrap text-xs md:text-sm">{title}</p>
               </CardHeader>
               {/* <Divider /> */}
               <CardBody className="overflow-x-hidden">
                    {/* count up may cause the container to expand and contract based on which digits are showing unless using a monospace font */}
                    <p className="text-4xl md:text-5xl text-center text-success font-bold absolute">
                         <CountUp end={value} prefix="₹" duration={3} useIndianSeparators />
                    </p>
                    {/* this p tag keeps the correct spacing */}
                    <p className="text-4xl md:text-5xl text-center text-success font-bold opacity-0">{formatCurrency(value)}</p>
               </CardBody>
          </Card>
     );
}

/**
 *
 * @param {{title: string, value: number}} param0
 * @returns
 */
export function CustomStatsCard({ title, value }) {
     return (
          <Card className="dark:bg-grey flex-1 min-w-fit px-2 border dark:border-0 shadow-md">
               <CardHeader className="uppercase block">
                    <p className="text-center text-nowrap text-xs md:text-sm">{title}</p>
               </CardHeader>
               {/* <Divider /> */}
               <CardBody>
                    <p className="text-4xl md:text-5xl text-center text-primary font-bold">
                         <CountUp end={value} duration={3} />
                    </p>
               </CardBody>
          </Card>
     );
}
