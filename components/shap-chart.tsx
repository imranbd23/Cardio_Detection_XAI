'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureData {
  name: string
  value: string | number
  contribution: number
  impact: "negative" | "positive" | "neutral"
  normalizedContribution?: number
}

interface SHAPChartProps {
  features: FeatureData[]
}

export default function SHAPChart({ features }: SHAPChartProps) {
  // Get top 10 features for comprehensive view
  const topFeatures = features.slice(0, 10).map((f) => ({
    name: f.name.replace(' History', '').replace(' Diagnosis', ''),
    contribution: Math.abs(f.contribution),
    originalContribution: f.contribution,
    value: f.value,
    impact: f.contribution > 0 ? 'Risk' : f.contribution < 0 ? 'Protective' : 'Neutral',
  }))

  const maxContribution = Math.max(...topFeatures.map((f) => f.contribution))

  const CustomTooltip = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-900 text-white p-4 rounded-lg shadow-xl border border-slate-700">
          <p className="font-bold text-sm mb-2">{data.name}</p>
          <p className="text-sm">
            <span className="text-slate-300">Impact:</span> <span className="font-semibold">{data.originalContribution > 0 ? '+' : ''}{data.originalContribution}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {data.impact} Factor
          </p>
          <p className="text-xs text-slate-400 mt-2">Value: {data.value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-1 border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">SHAP Value Analysis</CardTitle>
        <CardDescription className="text-sm">
          SHapley Additive exPlanations - Feature impact on prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-96 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topFeatures}
              layout="vertical"
              margin={{ top: 10, right: 40, left: 140, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={135} 
                tick={{ fontSize: 12, fill: '#475569' }}
                tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15, 23, 42, 0.1)' }} />
              <Bar dataKey="contribution" name="SHAP Value" radius={[0, 8, 8, 0]} isAnimationActive={true}>
                {topFeatures.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.originalContribution > 0
                        ? '#dc2626'
                        : entry.originalContribution < 0
                          ? '#16a34a'
                          : '#9ca3af'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-100">
            <div className="w-4 h-4 bg-red-600 rounded" />
            <span className="text-slate-700">Risk Factor</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-100">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span className="text-slate-700">Protective</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-blue-900 mb-2">How to read this:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Longer bars = stronger impact on prediction</li>
            <li>• Red = increases risk score</li>
            <li>• Green = decreases risk score</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
