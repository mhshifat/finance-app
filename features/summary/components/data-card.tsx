import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconType } from "react-icons";
import CountUp from 'react-countup';
import ClientOnly from "@/components/shared/client-only";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface DataCardProps {
  title: string;
  value: number;
  percentageChange: number;
  variant: "default";
  dateRange: string;
  icon: IconType;
}

export default function DataCard({
  title,
  value,
  percentageChange,
  icon: Icon,
  dateRange,
}: DataCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-5 justify-between">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{dateRange}</CardDescription>
        </CardHeader>
        
        <div className="p-8 flex items-center justify-center">
          <span className="w-12 h-12 flex items-center justify-center aspect-square bg-slate-300 rounded-md">
            <Icon className="size-4" />
          </span>
        </div>
      </div>

      <CardContent>
        <ClientOnly>
          <CountUp
            className="text-2xl font-semibold"
            preserveValue
            start={0}
            end={value}
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCurrency}
          />
        </ClientOnly>
        <p>{formatPercentage(percentageChange, { addPrefix: true })} from last period</p>
      </CardContent>
    </Card>
  )
}