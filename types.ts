
export interface ConversionHistoryItem {
  id: string;
  fromValue: number;
  fromUnit: 'in' | 'mm';
  toValue: number;
  toUnit: 'in' | 'mm';
  timestamp: number;
}

export interface SmartParseResult {
  value: number;
  unit: string;
  explanation: string;
}
