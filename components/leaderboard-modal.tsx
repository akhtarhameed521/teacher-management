import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
  teachers: any[]
}

export function LeaderboardModal({ isOpen, onClose, teachers }: LeaderboardModalProps) {
  const sortedTeachers = [...teachers].sort((a, b) => b.coverCount - a.coverCount)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Teacher Leaderboard</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Cover Count</TableHead>
              <TableHead>Badge</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeachers.map((teacher, index) => (
              <TableRow key={teacher.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.coverCount}</TableCell>
                <TableCell>
                  <Badge variant={index < 3 ? "default" : "secondary"}>
                    {index === 0 ? "Gold" : index === 1 ? "Silver" : index === 2 ? "Bronze" : "Participant"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

