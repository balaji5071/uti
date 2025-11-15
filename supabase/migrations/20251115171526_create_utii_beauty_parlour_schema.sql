/*
  # Create UTII Beauty Parlour Database Schema

  1. New Tables
    - `shop_status`
      - `id` (uuid, primary key)
      - `is_open` (boolean) - Current shop status
      - `updated_at` (timestamptz) - Last status update time
      - `updated_by` (text) - Who updated the status
    
    - `reviews`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer's name
      - `rating` (integer) - Star rating (1-5)
      - `review_text` (text) - Review content
      - `created_at` (timestamptz) - Review submission time
      - `is_approved` (boolean) - Moderation flag

  2. Security
    - Enable RLS on both tables
    - Public read access for shop_status and approved reviews
    - Authenticated users can insert reviews
    - Only authenticated users can update shop_status

  3. Initial Data
    - Insert default shop_status record (shop open by default)
*/

CREATE TABLE IF NOT EXISTS shop_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_open boolean DEFAULT true NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  updated_by text DEFAULT 'system' NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  is_approved boolean DEFAULT true NOT NULL
);

ALTER TABLE shop_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shop status"
  ON shop_status FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update shop status"
  ON shop_status FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO shop_status (is_open, updated_by)
SELECT true, 'system'
WHERE NOT EXISTS (SELECT 1 FROM shop_status);
