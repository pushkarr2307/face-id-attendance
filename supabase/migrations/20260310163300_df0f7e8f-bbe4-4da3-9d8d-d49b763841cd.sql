
-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  roll_no TEXT NOT NULL UNIQUE,
  face_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Verified',
  verification TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Public read policy for students (needed for face scan to compare)
CREATE POLICY "Anyone can read students" ON public.students
  FOR SELECT USING (true);

-- Public insert on attendance (scan page marks attendance)
CREATE POLICY "Anyone can insert attendance" ON public.attendance_records
  FOR INSERT WITH CHECK (true);

-- Public read attendance (admin reads, but we'll filter in app)
CREATE POLICY "Anyone can read attendance" ON public.attendance_records
  FOR SELECT USING (true);

-- Public delete attendance
CREATE POLICY "Anyone can delete attendance" ON public.attendance_records
  FOR DELETE USING (true);

-- Public CRUD on students (admin manages via app)
CREATE POLICY "Anyone can insert students" ON public.students
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update students" ON public.students
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete students" ON public.students
  FOR DELETE USING (true);

-- Create storage bucket for face images
INSERT INTO storage.buckets (id, name, public) VALUES ('face-images', 'face-images', true);

-- Storage policies for face-images bucket
CREATE POLICY "Anyone can upload face images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'face-images');

CREATE POLICY "Anyone can read face images" ON storage.objects
  FOR SELECT USING (bucket_id = 'face-images');

CREATE POLICY "Anyone can delete face images" ON storage.objects
  FOR DELETE USING (bucket_id = 'face-images');

-- Enable realtime for attendance
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;
