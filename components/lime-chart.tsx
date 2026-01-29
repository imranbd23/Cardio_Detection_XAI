'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
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

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#0ea5e9', '#3b82f6']

export default function LIMEChart({ features }: LIMEChartProps) {
  // Calculate relative importance for pie chart
  const absoluteContributions = features.map((f) => ({
    name: f.name,
    value: Math.abs(f.contribution),
    originalValue: f.contribution,
  }))

  const totalImportance = absoluteContributions.reduce((sum, f) => sum + f.value, 0)
  const pieData = absoluteContributions
    .slice(0, 8)
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
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-sm text-gray-600">Importance: {data.value}%</p>
          <p className="text-xs text-gray-500">
            {data.originalValue > 0 ? 'Risk Factor' : 'Protective'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">LIME Importance</span>
        </CardTitle>
        <CardDescription>Local Interpretable Model-agnostic Explanations - Relative feature importance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2 font-semibold">Interpretation:</p>
          <ul className="space-y-1 ml-4">
            <li>• Shows relative importance of each feature in the prediction</li>
            <li>• Larger slices = more influential features</li>
            <li>• LIME provides a local linear approximation of the model decision</li>
            <li>• Helps identify which factors matter most for your specific case</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
