import { type DeepKeys, useForm } from '@tanstack/react-form';

type DynamicFormProps<T extends Record<string, any>> = {
  document: T;
  exclude?: (keyof T)[];
  onSubmit?: (values: T) => Promise<void> | void;
  title?: string;
  /** Optional: handle special nested structures like Offtake */
  variant?: 'default' | 'offtake';
};

export function DynamicForm<T extends Record<string, any>>({
  document,
  exclude = [],
  onSubmit,
  title,
  variant = 'default',
}: DynamicFormProps<T>) {
  const form = useForm({
    defaultValues: document,
    onSubmit: async ({ value }) => {
      await onSubmit?.(value as T);
    },
  });

  const fieldNames = Object.keys(document).filter(
    (k) => !exclude.includes(k as keyof T),
  ) as (keyof T)[];

  const isPrimitive = (v: unknown) =>
    typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {title && <h4 className="mb-3">{title}</h4>}

      <div className="row">
        {fieldNames.map((name) => (
          // 🔥 Use dynamic column width: goats -> full width, others -> col-md-4
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

                // Handle simple primitive fields (text, number, checkbox)
                if (isPrimitive(value)) {
                  const inputType =
                    typeof value === 'number'
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

                // Nested object fallback (rare for Offtake)
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
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
