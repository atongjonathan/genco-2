import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { read, utils } from 'xlsx';
import { createDataInRealtimeDB } from '../../../firebase/database';
import Card from './-components/Card';

export const Route = createFileRoute('/_authenticated/_app/upload')({
  component: RouteComponent,
});

function RouteComponent() {
  const [category, setCategory] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | undefined>();
  const [error, setError] = useState<{
    message: string;
    variant: 'danger' | 'warning' | 'success';
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // ✅ Handle file upload
  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError({
        message: 'Please select a file to upload.',
        variant: 'warning',
      });
      return;
    }

    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileType ?? '')) {
      setError({
        message: 'Invalid file format. Please upload a CSV or Excel file.',
        variant: 'danger',
      });
      return;
    }

    setError(null);
    setUploadProgress(0);
    setIsUploading(true);

    parseExcel(file, category);
  };

  // ✅ Parse Excel / CSV File with Project 1 Logic
  const parseExcel = (file: File, category: string) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (!event.target?.result) return;

      const data = new Uint8Array(event.target.result as ArrayBuffer);
      const workbook = read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let parsedData: any[] = utils.sheet_to_json(sheet, { raw: false });

      // ✅ Convert Excel-friendly dates
      parsedData = parsedData.map((row) => {
        for (const key in row) {
          if (isExcelDate(row[key])) {
            row[key] = convertExcelDate(row[key]);
          }
        }
        return row;
      });

      await uploadToFirestore(parsedData, category);
    };

    reader.readAsArrayBuffer(file);
  };

  // ✅ Check if a value looks like a date
  const isExcelDate = (value: any): boolean => {
    return (
      typeof value === 'string' &&
      (/\d{4}-\d{2}-\d{2}/.test(value) || !isNaN(Date.parse(value)))
    );
  };

  // ✅ Convert to YYYY-MM-DD format
  const convertExcelDate = (excelDate: string): string => {
    const parsedDate = new Date(Date.parse(excelDate));
    return parsedDate.toISOString().split('T')[0];
  };

  // ✅ Upload data row-by-row with progress
  const uploadToFirestore = async (data: any[], category: string) => {
    try {
      const totalItems = data.length;
      let uploaded = 0;

      for (const row of data) {
        await createDataInRealtimeDB(category, row);
        uploaded++;
        setUploadProgress(Math.round((uploaded / totalItems) * 100));
      }

      // ✅ Refresh relevant queries
      await queryClient.invalidateQueries({ queryKey: [`${category}-data`] });
      await queryClient.refetchQueries({ queryKey: [`${category}-data`] });

      setError({
        variant: 'success',
        message: '✅ Data uploaded successfully!',
      });
    } catch (error) {
      console.error(error);
      setError({
        variant: 'danger',
        message: '❌ Error uploading data. Check console for details.',
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(undefined), 1000);
    }
  };

  return (
    <div className="container p-3">
      <h6 className="mb-4">Upload Data</h6>

      {error && (
        <div className={`alert alert-${error.variant}`}>{error.message}</div>
      )}

      {isUploading && (
        <div
          style={{
            minHeight: '10vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <Card title="Upload File" outline>
        <form onSubmit={handleFileUpload}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                className="form-select"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category...</option>
                <option value="farmers">Farmers</option>
                <option value="offtakes">Offtake</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="file" className="form-label">
                File
              </label>
              <input
                id="file"
                type="file"
                className="form-control"
                ref={fileInputRef}
                accept=".csv,.xls,.xlsx"
                required
              />
            </div>
          </div>

          {uploadProgress !== undefined && (
            <div className="progress mb-3" style={{ height: '20px' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {uploadProgress}%
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading || !category}
            >
              {isUploading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload me-2" />
                  Upload
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setCategory('');
                setError(null);
                setUploadProgress(undefined);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
