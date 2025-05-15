
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Database } from "lucide-react";

export function DataUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dataSource, setDataSource] = useState<string>("csv");
  
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      
      toast({
        title: "Data uploaded successfully",
        description: `${file.name} has been processed for forecasting.`,
      });
    }, 2000);
  };

  const handleConnectSource = () => {
    toast({
      title: "Connection Initiated",
      description: `Setting up connection to ${dataSource.toUpperCase()} data source.`,
    });
  };
  
  return (
    <Card className="col-span-5">
      <CardHeader>
        <CardTitle>Update Inventory Data</CardTitle>
        <CardDescription>
          Upload new inventory data or connect to a data source
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="data-source">Data Source</Label>
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV Upload</SelectItem>
                <SelectItem value="erp">ERP System</SelectItem>
                <SelectItem value="api">External API</SelectItem>
                <SelectItem value="database">Database</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {dataSource === "csv" ? (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Data File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {file ? file.name : "Drag and drop or click to upload"}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    CSV, XLSX, or JSON up to 10MB
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
          ) : (
            <div className="space-y-2">
              <Label htmlFor="connection-string">Connection Details</Label>
              <Input
                id="connection-string"
                placeholder={
                  dataSource === "erp" ? "ERP Instance URL" : 
                  dataSource === "api" ? "API Endpoint" :
                  "Connection String"
                }
              />
              {dataSource === "database" && (
                <div className="mt-2">
                  <Input
                    id="credentials"
                    placeholder="Username/Password or Access Key"
                    type="password"
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {dataSource === "csv" ? (
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload and Process Data"}
          </Button>
        ) : (
          <Button 
            onClick={handleConnectSource}
            className="w-full"
          >
            <Database className="h-4 w-4 mr-2" />
            Connect to {dataSource.toUpperCase()}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
