"use client";

import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, Area, Tooltip, BarChart, Bar, LineChart, Line, PieChart, Legend, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar } from 'recharts'
import { FaPiggyBank } from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import useGetSummary from "../api/use-get-summary";
import DataCard from "./data-card";
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DataGrid() {
  const params = useSearchParams();
  const { data } = useGetSummary();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const dateRangeLabel = formatDateRange({ from, to });
  return (
    <div>
      <Badge>{dateRangeLabel}</Badge>

      <div className='grid grid-cols-[1fr_400px] gap-10 mt-5'>
        <div className='grid grid-cols-2 gap-10'>
          <DataCard
            title="Remaining"
            value={data?.remainingAmount || 0}
            percentageChange={data?.remainingChange || 0}
            icon={FaPiggyBank}
            variant="default"
            dateRange={dateRangeLabel}
          />
          <DataCard
            title="Income"
            value={data?.incomeAmount || 0}
            percentageChange={data?.incomeChange || 0}
            icon={FaArrowTrendUp}
            variant="default"
            dateRange={dateRangeLabel}
          />
        </div>
        <DataCard
          title="Expense"
          value={data?.expensesAmount || 0}
          percentageChange={data?.expensesChange || 0}
          icon={FaArrowTrendDown}
          variant="default"
          dateRange={dateRangeLabel}
        />
      </div>

      <div className='mt-5 grid grid-cols-[1fr_400px] gap-10'>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data?.days || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="2%" stopColor='#3d82f6' stopOpacity={0.8} />
                    <stop offset="98%" stopColor='#3d82f6' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="2%" stopColor='#f43f5e' stopOpacity={0.8} />
                    <stop offset="98%" stopColor='#f43f5e' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  axisLine={false}
                  tickLine={false}
                  dataKey="date"
                  tickFormatter={(value) => format(value, "dd MMM")}
                  style={{ fontSize: "12px" }}
                  tickMargin={16}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="income"
                  strokeWidth={2}
                  stroke='#3d82f6'
                  fill='url(#income)'
                  className='drop-shadow-sm'
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="expenses"
                  strokeWidth={2}
                  stroke='#f43f5e'
                  fill='url(#expenses)'
                  className='drop-shadow-sm'
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Legend
                  layout='horizontal'
                  verticalAlign='bottom'
                  align='right'
                  iconType='circle'
                  content={({ payload }) => <Badge>{payload?.[0]?.value}</Badge>}
                />
                <Tooltip content={<div className='bg-white flex items-center justify-center shadow-md z-50'>Test Data</div>} />
                <Pie
                  data={data?.categories || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={60}
                  paddingAngle={2}
                  fill='#8884d8'
                  dataKey="value"
                  labelLine={false}
                >
                  {(data?.categories || []).map((_, idx) => <Cell key={idx} fill='#8884d8' />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className='mt-5 grid grid-cols-[1fr_400px] gap-10'>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data?.days || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="2%" stopColor='#3d82f6' stopOpacity={0.8} />
                    <stop offset="98%" stopColor='#3d82f6' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="2%" stopColor='#f43f5e' stopOpacity={0.8} />
                    <stop offset="98%" stopColor='#f43f5e' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  axisLine={false}
                  tickLine={false}
                  dataKey="date"
                  tickFormatter={(value) => format(value, "dd MMM")}
                  style={{ fontSize: "12px" }}
                  tickMargin={16}
                />
                <Bar
                  type="monotone"
                  dataKey="income"
                  stackId="income"
                  strokeWidth={2}
                  stroke='#3d82f6'
                  fill='url(#income)'
                  className='drop-shadow-sm'
                />
                <Tooltip />
                <Bar
                  type="monotone"
                  dataKey="expenses"
                  stackId="expenses"
                  strokeWidth={2}
                  stroke='#f43f5e'
                  fill='url(#expenses)'
                  className='drop-shadow-sm'
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="60%"
                data={data?.categories || []}
              >
                <Tooltip content={<div className='bg-white flex items-center justify-center shadow-md z-50'>Test Data</div>} />
                <PolarGrid />
                <PolarAngleAxis style={{ fontSize: "12px" }} dataKey="name" />
                <PolarRadiusAxis style={{ fontSize: "12px" }} />
                <Radar
                  dataKey="value"
                  stroke='#3b82f6'
                  fill='#3b82f6'
                  strokeOpacity={0.66}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className='mt-5 grid grid-cols-[1fr_400px] gap-10'>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data?.days || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="2%" stopColor='#3d82f6' stopOpacity={0.8} />
                    <stop offset="98%" stopColor='#3d82f6' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="2%" stopColor='#f43f5e' stopOpacity={0.8} />
                    <stop offset="98%" stopColor='#f43f5e' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  axisLine={false}
                  tickLine={false}
                  dataKey="date"
                  tickFormatter={(value) => format(value, "dd MMM")}
                  style={{ fontSize: "12px" }}
                  tickMargin={16}
                />
                <Line
                  dot={false}
                  type="linear"
                  dataKey="income"
                  strokeWidth={2}
                  stroke='#3d82f6'
                  // stroke='url(#income)'
                  className='drop-shadow-sm'
                />
                <Tooltip />
                <Line
                  dot={false}
                  type="linear"
                  dataKey="expenses"
                  strokeWidth={2}
                  stroke='#f43f5e'
                  // stroke='url(#expenses)'
                  className='drop-shadow-sm'
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadialBarChart
                cx="50%"
                cy="30%"
                barSize={10}
                innerRadius="90%"
                outerRadius="40%"
                data={(data?.categories || []).map(item => ({
                  ...item,
                  fill: "#8884d8"
                }))}
              >
                <RadialBar
                  label={{
                    position: "insideStart",
                    fill: "#fff",
                    fontSize: "12px"
                  }}
                  background
                  dataKey="value"
                />
                <Legend
                  layout='horizontal'
                  verticalAlign='bottom'
                  align='right'
                  iconType='circle'
                  content={({ payload }) => <Badge>{payload?.[0]?.value}</Badge>}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}