import { useMemo } from 'react';
import { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface SelectProps {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string, value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

export default function Select({
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  placeholder,
}: SelectProps) {
  const formattedValue = useMemo(() => {
    return options.find(op => op.value == value)
  }, [options, value])
  const onSelect = (option: SingleValue<{ label: string, value: string }>) => {
    onChange?.(option?.value);
  }

  return (
    <CreatableSelect
      placeholder={placeholder}
      className='text-sm h-10'
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          }
        })
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  )
}