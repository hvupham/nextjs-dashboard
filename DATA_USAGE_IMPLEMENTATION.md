# Data Usage Implementation Summary

## Overview
Added comprehensive data usage tracking to SIM card products, allowing monitoring of monthly data consumption across current and previous months.

## Changes Made

### 1. **Type Definitions** (`app/lib/definitions.ts`)
- Added `current_month_usage?: string` to `Product` type
- Added `previous_month_usage?: string` to `Product` type
- Added `current_month_usage?: string` to `ProductsTable` type
- Added `previous_month_usage?: string` to `ProductsTable` type
- Added `current_month_usage?: string` to `ProductForm` type
- Added `previous_month_usage?: string` to `ProductForm` type

### 2. **Server Actions** (`app/lib/actions/products.ts`)
- Updated `ProductFormSchema` with:
  - `current_month_usage: z.string().optional()`
  - `previous_month_usage: z.string().optional()`
- Updated `ProductState` error type to include:
  - `current_month_usage?: string[]`
  - `previous_month_usage?: string[]`
- Updated `createProduct` function:
  - Added form validation for both fields
  - Added INSERT statement columns: `current_month_usage, previous_month_usage`
  - Added VALUES with fallback: `${current_month_usage || null}, ${previous_month_usage || null}`
- Updated `updateProduct` function:
  - Added form validation for both fields
  - Added UPDATE statement SET clauses for both fields

### 3. **Data Queries** (`app/lib/data/products.ts`)
- Updated `fetchProducts()`:
  - SELECT query includes: `current_month_usage, previous_month_usage`
  - Fallback query sets both fields to `null::text` if database columns don't exist yet
- Updated `fetchProductById()`:
  - SELECT query includes: `current_month_usage, previous_month_usage`
  - Fallback query sets both fields to `null::text` if database columns don't exist yet

### 4. **Create Form** (`app/ui/products/create-form-sim.tsx`)
- Added "Current Month Usage (GB)" input field:
  - ID: `current_month_usage`
  - Type: text
  - Placeholder: "Ví dụ: 18.30"
  - Error handling with aria-describedby
  - Displays errors from state.errors?.current_month_usage
- Added "Previous Month Usage (GB)" input field:
  - ID: `previous_month_usage`
  - Type: text
  - Placeholder: "Ví dụ: 16.40"
  - Error handling with aria-describedby
  - Displays errors from state.errors?.previous_month_usage
- Both fields placed after SIM Status section in the SIM Card Information section

### 5. **Edit Form** (`app/ui/products/edit-form-sim.tsx`)
- Added same data usage fields as create form
- Both fields have `defaultValue` populated from product object:
  - `defaultValue={product.current_month_usage || ''}`
  - `defaultValue={product.previous_month_usage || ''}`
- Maintains consistency with create form structure

### 6. **Product Table** (`app/ui/products/table.tsx`)
- Added "Current Month Usage" column:
  - Displays data with [G] suffix: `${product.current_month_usage}[G]`
  - Shows '-' if no value
  - Font size: sm, Color: text-gray-700
- Added "Previous Month Usage" column:
  - Same formatting as current month: `${product.previous_month_usage}[G]`
  - Shows '-' if no value
  - Font size: sm, Color: text-gray-700
- Column position in table: After capacity, before shipping_date
- Proper alignment with other columns

### 7. **Database Migration** (`migrations/add-sim-columns.ts`)
- Added ALTER TABLE statement for:
  - `current_month_usage` VARCHAR(50)
  - `previous_month_usage` VARCHAR(50)
- Uses `IF NOT EXISTS` to prevent errors if columns already exist

## Table Column Order
```
# | MSN/IMSI | Carrier | ICCID/Serial | Capacity | Current Month Usage | Previous Month Usage | 出荷日 | 開通日 | Actions
```

## Data Format
- **Input**: Decimal format (e.g., "18.30", "16.40")
- **Display**: With [G] suffix (e.g., "18.30[G]", "16.40[G]")
- **Storage**: VARCHAR(50) in database

## Usage
1. When creating a new SIM product, fill in:
   - Current Month Usage: Data used in current month (GB)
   - Previous Month Usage: Data used in previous month (GB)

2. The product list table will display both values with [G] suffix

3. Product detail page shows all information

4. Edit form allows updating usage values at any time

## Build Status
✅ Build successful - no TypeScript errors
✅ All type definitions properly extended
✅ All forms include new input fields
✅ Database queries include fallback logic
✅ Table displays usage data with proper formatting

## Next Steps
1. Run database migration: `npx ts-node migrations/add-sim-columns.ts`
2. Create test SIM products with usage data
3. Verify data displays correctly in table and detail page
4. Test edit functionality to update usage values
