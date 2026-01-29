interface FormData {
  ageCategory: string
  mentalHealthDays: number
  physicalHealthDays: number
  generalHealth: string
  hadAngina: boolean
  hadStroke: boolean
  hadDiabetes: boolean
  hadCOPD: boolean
  hadArthritis: boolean
  difficultyWalking: boolean
  chestScan: boolean
  pneumoVaxEver: boolean
  removedTeethAll: boolean
  removedTeethNone: boolean
}

interface FeatureImportance {
  name: string
  value: string | number
  contribution: number
  impact: "negative" | "positive" | "neutral"
}

function calculateHeartDiseaseRisk(data: FormData) {
  let riskScore = 0
  const riskFactors: string[] = []
  const featureImportances: FeatureImportance[] = []

  // Age scoring (18-24 = 0, 80+ = 30)
  const ageRanges: Record<string, number> = {
    "18-24": 2,
    "25-29": 3,
    "30-34": 4,
    "35-39": 5,
    "40-44": 8,
    "45-49": 10,
    "50-54": 15,
    "55-59": 18,
    "60-64": 20,
    "65-69": 23,
    "70-74": 26,
    "75-79": 28,
    "80+": 30,
  }
  const ageContribution = ageRanges[data.ageCategory] || 0
  riskScore += ageContribution
  featureImportances.push({
    name: "Age",
    value: data.ageCategory,
    contribution: ageContribution,
    impact: ageContribution > 0 ? "positive" : "neutral",
  })
  if (ageRanges[data.ageCategory] && ageRanges[data.ageCategory] >= 15) {
    riskFactors.push("Age (55+) is a significant cardiovascular risk factor")
  }

  // General Health Status
  const healthScores: Record<string, number> = {
    Excellent: 0,
    "Very Good": 2,
    Good: 4,
    Fair: 8,
    Poor: 15,
  }
  const healthContribution = healthScores[data.generalHealth] || 0
  riskScore += healthContribution
  featureImportances.push({
    name: "General Health",
    value: data.generalHealth,
    contribution: healthContribution,
    impact: healthContribution > 0 ? "positive" : "neutral",
  })
  if (data.generalHealth === "Fair" || data.generalHealth === "Poor") {
    riskFactors.push(`General health status reported as ${data.generalHealth}`)
  }

  // Mental Health Days (stress indicator)
  let mentalContribution = 0
  if (data.mentalHealthDays > 15) {
    mentalContribution = 5
    riskScore += 5
    riskFactors.push(`High mental health burden (${data.mentalHealthDays} days/month)`)
  } else if (data.mentalHealthDays > 5) {
    mentalContribution = 2
    riskScore += 2
  }
  featureImportances.push({
    name: "Mental Health Days",
    value: data.mentalHealthDays,
    contribution: mentalContribution,
    impact: mentalContribution > 0 ? "positive" : "neutral",
  })

  // Physical Health Days
  let physicalContribution = 0
  if (data.physicalHealthDays > 15) {
    physicalContribution = 7
    riskScore += 7
    riskFactors.push(`Significant physical health issues (${data.physicalHealthDays} days/month)`)
  } else if (data.physicalHealthDays > 5) {
    physicalContribution = 3
    riskScore += 3
  }
  featureImportances.push({
    name: "Physical Health Days",
    value: data.physicalHealthDays,
    contribution: physicalContribution,
    impact: physicalContribution > 0 ? "positive" : "neutral",
  })

  // Medical History - Major Risk Factors
  let anginaContribution = 0
  if (data.hadAngina) {
    anginaContribution = 20
    riskScore += 20
    riskFactors.push("History of angina (chest pain)")
  }
  featureImportances.push({
    name: "Angina History",
    value: data.hadAngina ? "Yes" : "No",
    contribution: anginaContribution,
    impact: anginaContribution > 0 ? "positive" : "negative",
  })

  let strokeContribution = 0
  if (data.hadStroke) {
    strokeContribution = 18
    riskScore += 18
    riskFactors.push("Previous stroke history")
  }
  featureImportances.push({
    name: "Stroke History",
    value: data.hadStroke ? "Yes" : "No",
    contribution: strokeContribution,
    impact: strokeContribution > 0 ? "positive" : "negative",
  })

  let diabetesContribution = 0
  if (data.hadDiabetes) {
    diabetesContribution = 12
    riskScore += 12
    riskFactors.push("Diabetes diagnosis (major risk factor)")
  }
  featureImportances.push({
    name: "Diabetes Diagnosis",
    value: data.hadDiabetes ? "Yes" : "No",
    contribution: diabetesContribution,
    impact: diabetesContribution > 0 ? "positive" : "negative",
  })

  let copdContribution = 0
  if (data.hadCOPD) {
    copdContribution = 8
    riskScore += 8
    riskFactors.push("Chronic Obstructive Pulmonary Disease (COPD)")
  }
  featureImportances.push({
    name: "COPD",
    value: data.hadCOPD ? "Yes" : "No",
    contribution: copdContribution,
    impact: copdContribution > 0 ? "positive" : "negative",
  })

  let arthritisContribution = 0
  if (data.hadArthritis) {
    arthritisContribution = 3
    riskScore += 3
  }
  featureImportances.push({
    name: "Arthritis",
    value: data.hadArthritis ? "Yes" : "No",
    contribution: arthritisContribution,
    impact: arthritisContribution > 0 ? "positive" : "negative",
  })

  let walkingContribution = 0
  if (data.difficultyWalking) {
    walkingContribution = 6
    riskScore += 6
    riskFactors.push("Difficulty with physical activity")
  }
  featureImportances.push({
    name: "Walking Difficulty",
    value: data.difficultyWalking ? "Yes" : "No",
    contribution: walkingContribution,
    impact: walkingContribution > 0 ? "positive" : "negative",
  })

  // Preventive measures
  let chestScanContribution = 0
  if (!data.chestScan) {
    chestScanContribution = 2
    riskScore += 2
  }
  featureImportances.push({
    name: "Chest Scan",
    value: data.chestScan ? "Yes" : "No",
    contribution: chestScanContribution,
    impact: chestScanContribution > 0 ? "positive" : "negative",
  })

  let vaxContribution = 0
  if (data.pneumoVaxEver) {
    vaxContribution = -2
    riskScore -= 2
  }
  featureImportances.push({
    name: "Pneumonia Vaccination",
    value: data.pneumoVaxEver ? "Yes" : "No",
    contribution: vaxContribution,
    impact: vaxContribution < 0 ? "negative" : "neutral",
  })

  // Dental health (correlation with cardiovascular health)
  let dentalContribution = 0
  if (data.removedTeethAll) {
    dentalContribution = 4
    riskScore += 4
    riskFactors.push("Dental health concerns")
  }
  featureImportances.push({
    name: "Dental Health",
    value: data.removedTeethAll ? "Teeth Removed" : "Teeth Present",
    contribution: dentalContribution,
    impact: dentalContribution > 0 ? "positive" : "neutral",
  })

  // Normalize score to 0-100
  riskScore = Math.max(0, Math.min(100, riskScore))

  // Determine risk category
  let risk: "Low" | "Moderate" | "High"
  if (riskScore < 25) {
    risk = "Low"
  } else if (riskScore < 55) {
    risk = "Moderate"
  } else {
    risk = "High"
  }

  // Add general recommendations based on score
  if (riskFactors.length === 0) {
    if (risk === "Low") {
      riskFactors.push("Maintain regular exercise and healthy diet")
    } else {
      riskFactors.push("Consider consulting with a healthcare provider")
    }
  }

  // Sort features by contribution magnitude
  const sortedFeatures = featureImportances.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))

  return {
    risk,
    score: Math.round(riskScore),
    factors: riskFactors.slice(0, 5),
    features: sortedFeatures,
  }
}

export async function POST(request: Request) {
  try {
    const formData = (await request.json()) as FormData

    const result = calculateHeartDiseaseRisk(formData)

    return Response.json(result)
  } catch (error) {
    console.error("Prediction error:", error)
    return Response.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}
