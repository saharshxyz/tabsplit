import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Users, User } from "lucide-react";
import { SplitSchema } from "@/lib/schemas";

interface SplitDisplayProps {
  splitResult: SplitSchema;
  onCopyUrl: () => void;
}

export const SplitDisplay = ({ splitResult, onCopyUrl }: SplitDisplayProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{splitResult.checkName} - Check Split</CardTitle>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button size="icon" onClick={onCopyUrl}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Send Bill to Friends</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Items and Summary</h3>

          <div className="flex flex-wrap gap-2">
            {splitResult.eaters.map((eater) => (
              <Badge key={eater.name} variant="secondary" className="text-sm">
                {eater.name}: ${Math.ceil(eater.total)}
              </Badge>
            ))}
          </div>
        </div>

        <Table className="mt-2">
          <TableBody>
            {splitResult.items.map((item, index) => (
              <TableRow key={index} className="border-0 leading-tight">
                <TableCell className="py-2">{item.name}</TableCell>
                <TableCell className="py-2 text-right">
                  <div className="flex items-center justify-end">
                    {item.eaters.length > 1 ? (
                      <Users className="mr-2 hidden h-4 w-4 sm:inline-block" />
                    ) : (
                      <User className="mr-2 hidden h-4 w-4 sm:inline-block" />
                    )}
                    {item.eaters.join(", ")}
                  </div>
                </TableCell>
                <TableCell className="py-2 pl-0 text-right">
                  ${item.price.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-0 font-medium leading-tight">
              <TableCell className="py-2" colSpan={2}>
                Subtotal
              </TableCell>
              <TableCell className="py-2 text-right">
                ${splitResult.subTotal.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className="border-0 text-sm leading-tight text-muted-foreground">
              <TableCell className="py-2" colSpan={2}>
                Tax ({splitResult.taxPercentage.toFixed(2)}%)
              </TableCell>
              <TableCell className="py-2 text-right">
                ${splitResult.taxAmount.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className="text-sm leading-tight text-muted-foreground">
              <TableCell className="py-2" colSpan={2}>
                Tip ({splitResult.tipPercentage.toFixed(2)}%)
              </TableCell>
              <TableCell className="py-2 text-right">
                ${splitResult.tipAmount.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className="leading-tight">
              <TableCell className="py-2 font-medium" colSpan={2}>
                Total
              </TableCell>
              <TableCell className="py-2 text-right font-bold">
                ${splitResult.total.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Separator />

        <div>
          <h3 className="mb-2 text-lg font-semibold">Individual Splits</h3>
          {splitResult.eaters.map((eater, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {eater.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{eater.name}</CardTitle>
                    <CardDescription>{eater.items.join(", ")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow className="border-0 font-medium leading-tight">
                      <TableCell className="py-2">Subtotal</TableCell>
                      <TableCell className="py-2 text-right">
                        ${eater.subtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-0 text-sm leading-tight text-muted-foreground">
                      <TableCell className="py-2">Tax</TableCell>
                      <TableCell className="py-2 text-right">
                        ${eater.taxAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="text-sm leading-tight text-muted-foreground">
                      <TableCell className="py-2">Tip</TableCell>
                      <TableCell className="py-2 text-right">
                        ${eater.tipAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="leading-tight">
                      <TableCell className="py-2 font-medium">Total</TableCell>
                      <TableCell className="py-2 text-right font-bold">
                        ${eater.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);
