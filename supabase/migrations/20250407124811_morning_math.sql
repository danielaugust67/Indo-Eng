/*
  # Create questions table for language quiz

  1. New Tables
    - `questions`
      - `id` (uuid, primary key)
      - `indonesian` (text, the Indonesian phrase)
      - `english` (text, the English translation)
      - `category` (text, the question category)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `questions` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indonesian text NOT NULL,
  english text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to questions
CREATE POLICY "Questions are publicly viewable"
  ON questions
  FOR SELECT
  TO public
  USING (true);

-- Insert sample questions
INSERT INTO questions (indonesian, english, category) VALUES
  ('Selamat pagi', 'Good morning', 'greetings'),
  ('Selamat malam', 'Good night', 'greetings'),
  ('Apa kabar?', 'How are you?', 'greetings'),
  ('Sampai jumpa', 'Goodbye', 'greetings'),
  
  ('Saya sedang makan', 'I am eating', 'daily activities'),
  ('Saya sedang belajar', 'I am studying', 'daily activities'),
  ('Saya pergi ke sekolah', 'I go to school', 'daily activities'),
  ('Dia sedang tidur', 'He/She is sleeping', 'daily activities'),
  
  ('Nasi goreng enak', 'Fried rice is delicious', 'food'),
  ('Saya suka mie goreng', 'I like fried noodles', 'food'),
  ('Ini pedas sekali', 'This is very spicy', 'food'),
  ('Saya mau minum kopi', 'I want to drink coffee', 'food'),
  
  ('Saya punya dua kucing', 'I have two cats', 'numbers'),
  ('Ada tiga buku di meja', 'There are three books on the table', 'numbers'),
  ('Lima orang di sini', 'Five people are here', 'numbers'),
  ('Sepuluh tahun yang lalu', 'Ten years ago', 'numbers');