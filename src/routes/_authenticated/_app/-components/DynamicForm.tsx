import { type DeepKeys, useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteDocument } from '../../../../firebase/data';
import { ConfirmModal } from './ConfirmModal';

type DynamicFormProps<T extends Record<string, any>> = {
  /** The data object (can have blank values but should contain keys) */
  document: T;
  exclude?: (keyof T)[];
  onSubmit?: (values: T) => Promise<void> | void;
  title?: string;
  /** Optional: handles special layouts like Offtake */
  collection: 'farmers' | 'offtakes' | 'users';
  isSubmitting?: boolean;
  isDeleting?: boolean;
  onDelete?: () => void;
};

export function DynamicForm<T extends Record<string, any>>({
  document,
  exclude = [],
  onSubmit,
  title,
  collection,
  isSubmitting = false,
  isDeleting = false,
}: DynamicFormProps<T>) {
  const form = useForm({
    defaultValues: document,
    onSubmit: async ({ value }) => {
      await onSubmit?.(value as T);
    },
  });

  // Always use document keys even if values are blank
  const fieldNames = Object.keys(document).filter(
    (k) => !exclude.includes(k as keyof T),
  ) as (keyof T)[];

  const isPrimitive = (v: unknown) =>
    typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

  const [showConfirm, setShowConfirm] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: () => deleteDocument(collection, document.docId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`${collection}-data`] });
      navigate({ to: '/farmer' });
      toast.success('Document deleted successfully!');
    },
    onError: (err) => toast.error(err.message),
  });

  const handleDelete = () => {
    // Your delete logic here
    deleteMutation.mutate();
    setShowConfirm(false);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {title && <h4 className="mb-3">{title}</h4>}

        <div className="row">
          {fieldNames.map((name) => (
            <div
              key={String(name)}
              className={name === 'goats' ? 'col-md-12 mb-3' : 'col-md-4 mb-3'}
            >
              <form.Field name={name as DeepKeys<T>}>
                {(field) => {
                  const value = field.state.value;
                  const label = String(name)
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (s) => s.toUpperCase());

                  // 🐐 Handle array of objects (e.g. goats)
                  if (
                    Array.isArray(value) &&
                    value.length > 0 &&
                    typeof value[0] === 'object'
                  ) {
                    return (
                      <div className="mb-4 border p-3 rounded">
                        <h5 className="mb-3">{label}</h5>
                        {value.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="border p-3 mb-2 rounded bg-light-subtle"
                          >
                            <div className="row">
                              {Object.keys(item).map((k) => (
                                <div className="col-md-4 mb-2" key={k}>
                                  <label className="form-label text-capitalize">
                                    {k}
                                  </label>
                                  <input
                                    title={label}
                                    className="form-control"
                                    value={String(item[k] ?? '')}
                                    onChange={(e) => {
                                      const newArr = [...value];
                                      newArr[idx] = {
                                        ...newArr[idx],
                                        [k]: e.target.value,
                                      };
                                      field.handleChange(newArr as any);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger mt-2"
                              onClick={() => {
                                const newArr = value.filter(
                                  (_: any, i: number) => i !== idx,
                                );
                                field.handleChange(newArr as any);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            const newArr = [
                              ...value,
                              Object.fromEntries(
                                Object.keys(value[0]).map((k) => [k, '']),
                              ),
                            ];
                            field.handleChange(newArr as any);
                          }}
                        >
                          + Add {label.slice(0, -1)}
                        </button>
                      </div>
                    );
                  }

                  // Handle primitive values (including blank strings)
                  if (
                    isPrimitive(value) ||
                    value === '' ||
                    value === undefined
                  ) {
                    const inputType = field.name?.includes('password')
                      ? 'password'
                      : typeof value === 'number'
                        ? 'number'
                        : typeof value === 'boolean'
                          ? 'checkbox'
                          : 'text';

                    return (
                      <>
                        <label htmlFor={String(name)} className="form-label">
                          {label}
                        </label>
                        {inputType === 'checkbox' ? (
                          <div className="form-check">
                            <input
                              id={String(name)}
                              type="checkbox"
                              className="form-check-input"
                              checked={Boolean(value)}
                              onChange={(e) =>
                                field.handleChange(e.target.checked as any)
                              }
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor={String(name)}
                            >
                              {label}
                            </label>
                          </div>
                        ) : (
                          <input
                            id={String(name)}
                            type={inputType}
                            className="form-control"
                            value={String(value ?? '')}
                            onChange={(e) =>
                              field.handleChange(
                                (inputType === 'number'
                                  ? Number(e.target.value)
                                  : e.target.value) as any,
                              )
                            }
                          />
                        )}
                      </>
                    );
                  }

                  // Nested object fallback
                  if (typeof value === 'object' && value !== null) {
                    return (
                      <div className="border p-3 rounded mb-3">
                        <h5>{label}</h5>
                        {Object.keys(value).map((subKey) => (
                          <div className="mb-2" key={subKey}>
                            <label className="form-label text-capitalize">
                              {subKey}
                            </label>
                            <input
                              title={label}
                              className="form-control"
                              value={String((value as any)[subKey] ?? '')}
                              onChange={(e) =>
                                field.handleChange({
                                  ...(value as any),
                                  [subKey]: e.target.value,
                                } as any)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return null;
                }}
              </form.Field>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          {document.docId && (
            <button
              type="button"
              className="btn btn-danger"
              disabled={isDeleting}
              onClick={() => setShowConfirm(true)}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </form>
      <ConfirmModal
        show={showConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />{' '}
    </>
  );
}
