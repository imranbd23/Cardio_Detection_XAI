'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureData {
  name: string
  contribution: number
  normalizedContribution: number
}

interface SHAPChartProps {
  features: FeatureData[]
}

export default function SHAPChart({ features }: SHAPChartProps) {
  // Get top 8 features for chart clarity
  const topFeatures = features.slice(0, 8).map((f) => ({
    name: f.name,
    contribution: f.normalizedContribution,
    impact: f.contribution > 0 ? 'Risk Increasing' : f.contribution < 0 ? 'Protective' : 'Neutral',
  }))

  const CustomTooltip = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-sm">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">
            Impact: {payload[0].value > 0 ? '+' : ''}{payload[0].value}%
          </p>
          <p className="text-xs text-gray-500">{payload[0].payload.impact}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">SHAP Values</span>
        </CardTitle>
        <CardDescription>Feature contribution to model prediction (SHAP - SHapley Additive exPlanations)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topFeatures}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={190} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="contribution" name="Contribution Score" radius={[0, 8, 8, 0]}>
                {topFeatures.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.contribution > 0
                        ? '#ef4444'
                        : entry.contribution < 0
                          ? '#22c55e'
                          : '#9ca3af'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2 font-semibold">Interpretation:</p>
          <ul className="space-y-1 ml-4">
            <li>• <span className="text-red-500">Red bars</span>: Increase heart disease risk</li>
            <li>• <span className="text-green-500">Green bars</span>: Decrease/protective factors</li>
            <li>• SHAP values show each feature's contribution to the final prediction</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
