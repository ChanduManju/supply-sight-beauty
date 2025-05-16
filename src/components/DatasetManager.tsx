
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, File, Trash2 } from "lucide-react";

// Mock dataset entries
const mockDatasets = [
  { id: "1", name: "Inventory 2024 Q1", size: "4.2 MB", records: 1287, lastUpdated: "2024-05-01", status: "Active" },
  { id: "2", name: "Sales History 2023", size: "8.7 MB", records: 3456, lastUpdated: "2024-04-12", status: "Active" },
  { id: "3", name: "Product Catalog", size: "2.1 MB", records: 432, lastUpdated: "2024-04-28", status: "Processing" },
];

export function DatasetManager() {
  const [datasets, setDatasets] = useState(mockDatasets);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [datasetName, setDatasetName] = useState("");
  
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!datasetName) {
        setDatasetName(selectedFile.name.split('.')[0]);
      }
    }
  };
  
  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    if (!datasetName.trim()) {
      toast({
        title: "Dataset name required",
        description: "Please provide a name for this dataset.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newDataset = {
        id: (datasets.length + 1).toString(),
        name: datasetName,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        records: Math.floor(Math.random() * 1000) + 500,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: "Processing"
      };
      
      setDatasets([newDataset, ...datasets]);
      setIsUploading(false);
      setFile(null);
      setDatasetName("");
      
      toast({
        title: "Dataset uploaded successfully",
        description: `${datasetName} has been uploaded and is being processed.`,
      });
      
      // Simulate processing completion after delay
      setTimeout(() => {
        setDatasets(prev => 
          prev.map(ds => 
            ds.id === newDataset.id ? { ...ds, status: "Active" } : ds
          )
        );
        
        toast({
          title: "Dataset processing complete",
          description: `${datasetName} is now ready for use.`,
        });
      }, 5000);
    }, 2000);
  };

  const deleteDataset = (id: string) => {
    const datasetToDelete = datasets.find(ds => ds.id === id);
    if (datasetToDelete) {
      setDatasets(datasets.filter(ds => ds.id !== id));
      toast({
        title: "Dataset deleted",
        description: `${datasetToDelete.name} has been removed.`,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Dataset</CardTitle>
          <CardDescription>
            Upload your inventory data in CSV, Excel, or JSON format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataset-name">Dataset Name</Label>
              <Input
                id="dataset-name"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="Enter a descriptive name for this dataset"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {file ? file.name : "Drag and drop or click to upload"}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    CSV, XLSX, or JSON up to 50MB
                  </p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.json"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading || !datasetName.trim()}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Upload Dataset"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Existing Datasets</CardTitle>
          <CardDescription>
            Manage your uploaded datasets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <File className="h-4 w-4" />
                    {dataset.name}
                  </TableCell>
                  <TableCell>{dataset.size}</TableCell>
                  <TableCell>{dataset.records}</TableCell>
                  <TableCell>{dataset.lastUpdated}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      dataset.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {dataset.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDataset(dataset.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {datasets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No datasets available
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
