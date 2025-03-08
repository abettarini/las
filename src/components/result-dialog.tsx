import React from 'react';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { CardContent } from './ui/card';
import { ChartConfig, ChartContainer } from './ui/chart';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from './ui/dialog';

interface ResultsDialogProps {
  finalResults: { score: number; totalQuestions: number; totalIncorrect: number };
  successThreshold: number;
  onClose: () => void;
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({ finalResults, successThreshold, onClose }) => {
  const isSuccess = finalResults.score >= successThreshold;
  const backgroundColor = isSuccess ? 'bg-green-500' : 'bg-red-500';

  const chartData = [
    { name: 'Correct', value: finalResults.totalQuestions - finalResults.totalIncorrect, fill: '#4CAF50' },
    { name: 'Incorrect', value: finalResults.totalIncorrect, fill: '#F44336' },
  ];

  const chartConfig: ChartConfig = {
    Correct: { label: 'Correct', color: '#4CAF50' },
    Incorrect: { label: 'Incorrect', color: '#F44336' },
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <button className="hidden">Open Results</button>
      </DialogTrigger>
      <DialogContent className={`p-6 ${backgroundColor}`}>
        <CardContent className="flex-1 pb-0 text-center">
          <h1 className="mb-4 text-4xl font-semibold">{isSuccess ? 'Congratulazioni!' : 'Mi dispiace.'}</h1>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <RadialBarChart data={chartData} startAngle={90} endAngle={-270} innerRadius={80} outerRadius={110}>
              <PolarGrid gridType="circle" radialLines={false} stroke="none" />
              <RadialBar dataKey="value" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                            {finalResults.score.toFixed(2)}%
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            Score
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <DialogFooter className="flex-col gap-2 text-lg">
          <p>{`Hai risposto correttamente a ${finalResults.totalQuestions - finalResults.totalIncorrect} domande su un totale di ${finalResults.totalQuestions}.`}</p>
          <button onClick={onClose} className="mt-4 bg-blue-500 text-white p-2 rounded">
            Chiudi
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;
