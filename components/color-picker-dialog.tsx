"use client"

import { useState } from "react"
import { Check } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ColorPickerDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (color: string) => void
  selectedColor?: string
}

const COLORS = [
  { name: "Purple", value: "purple" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Yellow", value: "yellow" },
  { name: "Red", value: "red" },
  { name: "Pink", value: "pink" },
  { name: "Orange", value: "orange" },
  { name: "Cyan", value: "cyan" },
]

const ColorPickerDialog = ({ isOpen, onClose, onSelect, selectedColor }: ColorPickerDialogProps) => {
  const [tempColor, setTempColor] = useState(selectedColor)

  const handleSelect = () => {
    if (tempColor) {
      onSelect(tempColor)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Color</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {COLORS.map((color) => (
            <button
              key={color.value}
              className={`
                w-full aspect-square rounded-lg relative
                ${`bg-${color.value}-100 hover:bg-${color.value}-200 border-2`}
                ${tempColor === color.value ? `border-${color.value}-500` : "border-transparent"}
              `}
              onClick={() => setTempColor(color.value)}
            >
              {tempColor === color.value && (
                <Check
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-${color.value}-700`}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect}>Select Color</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ColorPickerDialog

