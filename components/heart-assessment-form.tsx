"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  ageCategory: string
  mentalHealthDays: number
  physicalHealthDays: number
  generalHealth: string
  heightInMeters: number
  hadAngina: boolean
  hadStroke: boolean
  hadDiabetes: boolean
  hadCOPD: boolean
  hadArthritis: boolean
  difficultyWalking: boolean
  chestScan: boolean
  pneumoVaxEver: boolean
  removedTeethNone: boolean
  removedTeethAll: boolean
}

export default function HeartAssessmentForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: FormData) => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<FormData>({
    ageCategory: "45-49",
    mentalHealthDays: 0,
    physicalHealthDays: 0,
    generalHealth: "Good",
    heightInMeters: 1.75,
    hadAngina: false,
    hadStroke: false,
    hadDiabetes: false,
    hadCOPD: false,
    hadArthritis: false,
    difficultyWalking: false,
    chestScan: false,
    pneumoVaxEver: false,
    removedTeethNone: true,
    removedTeethAll: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateCheckbox = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const updateNumeric = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value === "" ? 0 : Number.parseFloat(value) }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demographics */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Demographics</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm">
              Age Category
            </Label>
            <Select value={formData.ageCategory} onValueChange={(value) => updateCheckbox("ageCategory", value)}>
              <SelectTrigger id="age">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-24">18-24</SelectItem>
                <SelectItem value="25-29">25-29</SelectItem>
                <SelectItem value="30-34">30-34</SelectItem>
                <SelectItem value="35-39">35-39</SelectItem>
                <SelectItem value="40-44">40-44</SelectItem>
                <SelectItem value="45-49">45-49</SelectItem>
                <SelectItem value="50-54">50-54</SelectItem>
                <SelectItem value="55-59">55-59</SelectItem>
                <SelectItem value="60-64">60-64</SelectItem>
                <SelectItem value="65-69">65-69</SelectItem>
                <SelectItem value="70-74">70-74</SelectItem>
                <SelectItem value="75-79">75-79</SelectItem>
                <SelectItem value="80+">80+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm">
              Height (meters)
            </Label>
            <Input
              id="height"
              type="number"
              min="1"
              max="2.5"
              step="0.01"
              value={formData.heightInMeters}
              onChange={(e) => updateNumeric("heightInMeters", e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Health Metrics</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mental" className="text-sm">
              Mental Health Days (past 30 days)
            </Label>
            <Input
              id="mental"
              type="number"
              min="0"
              max="30"
              value={formData.mentalHealthDays}
              onChange={(e) => updateNumeric("mentalHealthDays", e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="physical" className="text-sm">
              Physical Health Days (past 30 days)
            </Label>
            <Input
              id="physical"
              type="number"
              min="0"
              max="30"
              value={formData.physicalHealthDays}
              onChange={(e) => updateNumeric("physicalHealthDays", e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="health" className="text-sm">
            General Health Status
          </Label>
          <Select value={formData.generalHealth} onValueChange={(value) => updateCheckbox("generalHealth", value)}>
            <SelectTrigger id="health">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Very Good">Very Good</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Medical History */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Medical History</h3>

        <div className="grid gap-3">
          {[
            { key: "hadAngina", label: "Have you had angina?" },
            { key: "hadStroke", label: "Have you had a stroke?" },
            { key: "hadDiabetes", label: "Have you had diabetes?" },
            { key: "hadCOPD", label: "Have you had COPD?" },
            { key: "hadArthritis", label: "Have you had arthritis?" },
            { key: "difficultyWalking", label: "Do you have difficulty walking?" },
            { key: "chestScan", label: "Have you had a chest scan?" },
            { key: "pneumoVaxEver", label: "Have you had pneumonia vaccination?" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted/50 transition"
            >
              <input
                type="checkbox"
                checked={formData[key as keyof FormData] as boolean}
                onChange={(e) => updateCheckbox(key as keyof FormData, e.target.checked)}
                className="w-4 h-4 rounded border-primary"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Teeth Status */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Teeth Status</h3>

        <div className="grid gap-3">
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted/50 transition">
            <input
              type="radio"
              name="teeth"
              checked={formData.removedTeethNone && !formData.removedTeethAll}
              onChange={() => {
                updateCheckbox("removedTeethNone", true)
                updateCheckbox("removedTeethAll", false)
              }}
              className="w-4 h-4"
            />
            <span className="text-sm">No teeth removed</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted/50 transition">
            <input
              type="radio"
              name="teeth"
              checked={formData.removedTeethAll && !formData.removedTeethNone}
              onChange={() => {
                updateCheckbox("removedTeethNone", false)
                updateCheckbox("removedTeethAll", true)
              }}
              className="w-4 h-4"
            />
            <span className="text-sm">All teeth removed</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted/50 transition">
            <input
              type="radio"
              name="teeth"
              checked={!formData.removedTeethAll && !formData.removedTeethNone}
              onChange={() => {
                updateCheckbox("removedTeethNone", false)
                updateCheckbox("removedTeethAll", false)
              }}
              className="w-4 h-4"
            />
            <span className="text-sm">Some teeth removed</span>
          </label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white h-10 font-semibold"
      >
        {isLoading ? "Analyzing..." : "Get Risk Assessment"}
      </Button>
    </form>
  )
}
