import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useCSVReader } from 'react-papaparse';

export interface ImportTransactionsResults {
  data: string[][];
  errors: [];
  meta: [];
}

interface ImportTransactionsBtnProps {
  onUpload: (results: ImportTransactionsResults) => void;
}

export default function ImportTransactionsBtn({ onUpload }: ImportTransactionsBtnProps) {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: { getRootProps: () => {} }) => (
        <Button size="sm" {...getRootProps()} variant="default" className="flex items-center gap-2">
          <Upload className="size-4" />
    
          Import
        </Button>
      )}
    </CSVReader>
  )
}