import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ReactNode, useState } from 'react'
import { Plus } from 'lucide-react'

export function AppModal({
  children,
  title,
  submit,
  submitDisabled,
  submitLabel,
  triggerClassName,
  triggerVariant = "outline"
}: {
  children: ReactNode
  title: string
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
  triggerClassName?: string
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async () => {
    if (submit) {
      await submit()
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={triggerVariant} 
          className={triggerClassName || "flex items-center gap-2"}
        >
          <Plus className="h-4 w-4" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-white dark:bg-gray-800 border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter>
          {submit ? (
            <Button 
              type="submit" 
              onClick={handleSubmit} 
              disabled={submitDisabled}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitDisabled ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Loading...
                </div>
              ) : (
                submitLabel || 'Save'
              )}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}