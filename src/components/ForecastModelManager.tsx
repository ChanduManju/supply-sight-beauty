
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BarChart, RefreshCw, Settings, Play, Pause } from "lucide-react";

// Mock models
const mockModels = [
  { 
    id: "1", 
    name: "General Inventory ARIMA", 
    type: "ARIMA",
    dataset: "Inventory 2024 Q1",
    accuracy: 87,
    lastTrained: "2024-05-10",
    status: "Active" 
  },
  { 
    id: "2", 
    name: "Seasonal Products LSTM", 
    type: "LSTM",
    dataset: "Sales History 2023",
    accuracy: 92,
    lastTrained: "2024-05-05",
    status: "Active" 
  },
  { 
    id: "3", 
    name: "Fast-moving Items XGBoost", 
    type: "XGBoost",
    dataset: "Product Catalog",
    accuracy: 85,
    lastTrained: "2024-04-20",
    status: "Inactive" 
  },
];

export function ForecastModelManager() {
  const [models, setModels] = useState(mockModels);
  const [modelName, setModelName] = useState("");
  const [selectedType, setSelectedType] = useState("ARIMA");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [accuracy, setAccuracy] = useState([75]);
  const [isAutoRetrain, setIsAutoRetrain] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  
  const { toast } = useToast();
  
  const handleCreateModel = () => {
    if (!modelName.trim()) {
      toast({
        title: "Model name required",
        description: "Please provide a name for this model.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDataset) {
      toast({
        title: "Dataset required",
        description: "Please select a dataset to train the model.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTraining(true);
    
    // Simulate model training process
    toast({
      title: "Model training started",
      description: `${modelName} is now being trained...`,
    });
    
    setTimeout(() => {
      const newModel = {
        id: (models.length + 1).toString(),
        name: modelName,
        type: selectedType,
        dataset: selectedDataset,
        accuracy: Math.floor(Math.random() * 15) + 80,
        lastTrained: new Date().toISOString().split('T')[0],
        status: "Active"
      };
      
      setModels([newModel, ...models]);
      setIsTraining(false);
      setModelName("");
      setSelectedDataset("");
      
      toast({
        title: "Model training complete",
        description: `${modelName} has been trained with ${newModel.accuracy}% accuracy.`,
      });
    }, 5000);
  };

  const toggleModelStatus = (id: string) => {
    setModels(models.map(model => {
      if (model.id === id) {
        const newStatus = model.status === "Active" ? "Inactive" : "Active";
        toast({
          title: `Model ${newStatus.toLowerCase()}`,
          description: `${model.name} is now ${newStatus.toLowerCase()}.`,
        });
        return { ...model, status: newStatus };
      }
      return model;
    }));
  };

  const retrainModel = (id: string) => {
    const modelToRetrain = models.find(model => model.id === id);
    if (modelToRetrain) {
      toast({
        title: "Retraining model",
        description: `${modelToRetrain.name} is being retrained with latest data.`,
      });
      
      // Update UI to show retraining
      setModels(models.map(model => {
        if (model.id === id) {
          return { ...model, status: "Training" };
        }
        return model;
      }));
      
      // Simulate retraining process
      setTimeout(() => {
        setModels(models.map(model => {
          if (model.id === id) {
            const newAccuracy = Math.min(99, model.accuracy + Math.floor(Math.random() * 5));
            return { 
              ...model, 
              accuracy: newAccuracy, 
              lastTrained: new Date().toISOString().split('T')[0],
              status: "Active"
            };
          }
          return model;
        }));
        
        toast({
          title: "Model retraining complete",
          description: `${modelToRetrain.name} has been updated with improved accuracy.`,
        });
      }, 3000);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Forecasting Model</CardTitle>
          <CardDescription>
            Train a new model on your inventory data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model-name">Model Name</Label>
                <Input
                  id="model-name"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="Enter name for this model"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model-type">Model Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger id="model-type">
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARIMA">ARIMA</SelectItem>
                    <SelectItem value="LSTM">LSTM (Deep Learning)</SelectItem>
                    <SelectItem value="XGBoost">XGBoost</SelectItem>
                    <SelectItem value="Prophet">Prophet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataset">Dataset</Label>
              <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                <SelectTrigger id="dataset">
                  <SelectValue placeholder="Select dataset for training" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inventory 2024 Q1">Inventory 2024 Q1</SelectItem>
                  <SelectItem value="Sales History 2023">Sales History 2023</SelectItem>
                  <SelectItem value="Product Catalog">Product Catalog</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="accuracy-target">Minimum Accuracy Target</Label>
                  <span className="text-sm text-muted-foreground">{accuracy}%</span>
                </div>
                <Slider
                  id="accuracy-target"
                  min={50}
                  max={99}
                  step={1}
                  value={accuracy}
                  onValueChange={setAccuracy}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-retrain">Auto-retrain</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically retrain when new data arrives
                  </p>
                </div>
                <Switch
                  id="auto-retrain"
                  checked={isAutoRetrain}
                  onCheckedChange={setIsAutoRetrain}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleCreateModel} 
              disabled={isTraining || !modelName.trim() || !selectedDataset}
              className="w-full mt-2"
            >
              {isTraining ? (
                <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Training Model...</>
              ) : (
                <><Play className="mr-2 h-4 w-4" /> Train New Model</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Forecast Models</CardTitle>
          <CardDescription>
            Manage your trained forecasting models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dataset</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Last Trained</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    {model.name}
                  </TableCell>
                  <TableCell>{model.type}</TableCell>
                  <TableCell>{model.dataset}</TableCell>
                  <TableCell>{model.accuracy}%</TableCell>
                  <TableCell>{model.lastTrained}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      model.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      model.status === 'Training' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {model.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retrainModel(model.id)}
                        disabled={model.status === 'Training'}
                      >
                        <RefreshCw className={`h-4 w-4 ${model.status === 'Training' ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleModelStatus(model.id)}
                        disabled={model.status === 'Training'}
                      >
                        {model.status === 'Active' ? 
                          <Pause className="h-4 w-4 text-amber-500" /> : 
                          <Play className="h-4 w-4 text-green-500" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {models.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No models available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
