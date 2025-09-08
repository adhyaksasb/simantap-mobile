export type Transaction = {
  id: number;
  item_id: number;
  item_name: string;
  brand_id: number;
  item_type_id: number;
  item_unit_id: number;
  transaction_type: string;
  amount: string;
  notes: string | null;
  invoice_path: string | null;
  created_at: string;
};
