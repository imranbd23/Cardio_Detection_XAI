"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import HeartAssessmentForm from "@/components/heart-assessment-form"
import PredictionResult from "@/components/prediction-result"
import Header from "@/components/header"
import { AlertCircle, Heart } from "lucide-react"

export default function Home() {
  const [prediction, setPrediction] = useState<{
    risk: string
    score: number
    factors: string[]
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: Record<string, any>) => {
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Prediction failed")

      const result = await response.json()
      setPrediction(result)
    } catch (err) {
      setError("Unable to generate prediction. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle>Health Assessment</CardTitle>
                    <CardDescription>
                      Provide your medical information for a personalized risk assessment
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <HeartAssessmentForm onSubmit={handleSubmit} isLoading={loading} />
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {prediction && <PredictionResult prediction={prediction} />}

            {!prediction && !loading && (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    Complete the assessment form and submit to receive your personalized heart disease risk evaluation.
                  </p>
                </CardContent>
              </Card>
            )}

            {loading && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 text-center">
                  <div className="space-y-2">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">Analyzing your health data...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <Alert className="mt-8 bg-blue-50 border-blue-200 text-blue-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This assessment is for educational purposes only and should not be considered medical advice. Always consult
            with a qualified healthcare professional for medical diagnosis and treatment.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  )
}
