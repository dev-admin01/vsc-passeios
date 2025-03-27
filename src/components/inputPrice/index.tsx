import CurrencyInput from "react-currency-input-field";

interface CurrencyInputFieldProps {
  value: number;
  onNumericValueChange: (value: number) => void;
  placeholder?: string;
}

export default function CurrencyInputField({
  value,
  onNumericValueChange,
  placeholder = "R$ 0,00",
}: CurrencyInputFieldProps) {
  return (
    <CurrencyInput
      // Converte o número para string com 2 casas decimais para exibição
      value={value.toFixed(2)}
      // O react-currency-input-field chama onValueChange com (value: string | undefined)
      onValueChange={(val) => {
        // Converte para número ou 0 se for undefined
        const numericValue = val
          ? Number(val.replace(/[^0-9,]/g, "").replace(",", "."))
          : 0;
        onNumericValueChange(numericValue);
      }}
      prefix="R$ "
      decimalsLimit={2}
      decimalSeparator=","
      groupSeparator="."
      placeholder={placeholder}
      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
      required
    />
  );
}
