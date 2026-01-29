import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"

interface FeatureImportance {
  name: string
  value: string | number
  contribution: number
  impact: "negative" | "positive" | "neutral"
}

interface PredictionProps {
  prediction: {
    risk: string
    score: number
    factors: string[]
    features: FeatureImportance[]
  }
}

export default function PredictionResult({ prediction }: PredictionProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-50 border-green-200"
      case "Moderate":
        return "bg-yellow-50 border-yellow-200"
      case "High":
        return "bg-red-50 border-red-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low":
        return <CheckCircle2 className="w-8 h-8 text-green-600" />
      case "Moderate":
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />
      case "High":
        return <AlertCircle className="w-8 h-8 text-red-600" />
      default:
        return null
    }
  }

  const getRiskMessage = (risk: string) => {
    switch (risk) {
      case "Low":
        return "Your current risk profile appears favorable. Continue healthy lifestyle practices."
      case "Moderate":
        return "Consider consulting with a healthcare provider about preventive measures."
      case "High":
        return "We recommend scheduling an appointment with a cardiologist for further evaluation."
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <Card className={`${getRiskColor(prediction.risk)} border-2`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            {getRiskIcon(prediction.risk)}
            <div>
              <CardTitle className="text-2xl">Risk Level: {prediction.risk}</CardTitle>
              <CardDescription>Your assessment results</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Risk Score</span>
                <span className="text-2xl font-bold">{(prediction.score * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    prediction.risk === "Low"
                      ? "bg-green-600"
                      : prediction.risk === "Moderate"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                  }`}
                  style={{ width: `${prediction.score * 100}%` }}
                />
              </div>
            </div>

            <Alert className="bg-white/80">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{getRiskMessage(prediction.risk)}</AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {prediction.factors.map((factor, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-primary font-bold">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Feature Importance (SHAP/LIME)</CardTitle>
          <CardDescription>How each factor contributes to your risk score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prediction.features.map((feature, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{feature.name}</span>
                    {feature.contribution > 0 && (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    )}
                    {feature.contribution < 0 && (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-600">
                    {feature.value}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 transition-all ${
                        feature.contribution > 0
                          ? "bg-red-500"
                          : feature.contribution < 0
                            ? "bg-green-500"
                            : "bg-gray-300"
                      }`}
                      style={{
                        width: `${Math.min(100, Math.abs(feature.contribution) * 5)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-12 text-right">
                    {feature.contribution > 0 ? "+" : ""}
                    {feature.contribution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
