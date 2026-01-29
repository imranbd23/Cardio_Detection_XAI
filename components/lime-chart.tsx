'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureData {
  name: string
  value: string | number
  contribution: number
  impact: "negative" | "positive" | "neutral"
  normalizedContribution?: number
}

interface LIMEChartProps {
  features: FeatureData[]
}

const COLORS = ['#dc2626', '#ea580c', '#d97706', '#65a30d', '#16a34a', '#0891b2', '#2563eb', '#7c3aed']

export default function LIMEChart({ features }: LIMEChartProps) {
  // Calculate relative importance for pie chart
  const absoluteContributions = features.map((f) => ({
    name: f.name.replace(' History', '').replace(' Diagnosis', ''),
    value: Math.abs(f.contribution),
    originalValue: f.contribution,
  }))

  const totalImportance = absoluteContributions.reduce((sum, f) => sum + f.value, 0)
  const pieData = absoluteContributions
    .slice(0, 7)
    .map((f) => ({
      name: f.name,
      value: totalImportance > 0 ? Math.round((f.value / totalImportance) * 100) : 0,
      originalValue: f.originalValue,
    }))
    .filter((f) => f.value > 0)

  const CustomTooltip = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-900 text-white p-4 rounded-lg shadow-xl border border-slate-700">
          <p className="font-bold text-sm mb-2">{data.name}</p>
          <p className="text-sm">
            <span className="text-slate-300">Importance:</span> <span className="font-semibold">{data.value}%</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {data.originalValue > 0 ? 'Risk Factor' : 'Protective'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-1 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">LIME Feature Importance</CardTitle>
        <CardDescription className="text-sm">
          Local Interpretable Model-agnostic Explanations - Relative impact distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-80 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${value}%`}
                outerRadius={110}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Feature Distribution:</p>
          <div className="grid grid-cols-2 gap-2">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-xs font-semibold text-amber-900 mb-2">How LIME Works:</p>
          <ul className="text-xs text-amber-800 space-y-1">
            <li>• Larger slices = more influence on your prediction</li>
            <li>• Shows which features are most important locally</li>
            <li>• Donut chart displays relative feature contributions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
